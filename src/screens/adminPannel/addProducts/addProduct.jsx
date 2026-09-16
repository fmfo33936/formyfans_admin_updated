import {
    Box,
    Checkbox,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    IconButton,
    ListItemText,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import CustomInput from "../../../components/customInput";
import CustomButton from "../../../components/customButton";
import { useProducts } from "../../../hook/products";
import { uploadMediaService } from "../../../utils/helper";
import { getFullS3Url } from "../../../utils/s3Helper";

const PRODUCT_SIZES = ["S", "M", "L", "XL"];

const PRODUCT_COLOURS = [
    { label: "Light Blue", hex: "7ec8e3" },
    { label: "Off White", hex: "f4f4f0" },
    { label: "Light Pink", hex: "f4b8d0" },
    { label: "Dark Green", hex: "2d5a3d" },
];

const emptyForm = () => ({
    name: "",
    description: "",
    productDetails: "",
    totalPrice: "",
    quantity: "",
    images: [],
});

const emptyVariantDraft = () => ({
    size: [],
    colour: [],
    quantity: "",
    totalPrice: "",
});

const normalizeColourLabel = (value) => {
    if (!value) return "";
    const raw = String(value).replace("#", "").toLowerCase();
    const byHex = PRODUCT_COLOURS.find((c) => c.hex === raw);
    if (byHex) return byHex.label;
    const byLabel = PRODUCT_COLOURS.find(
        (c) => c.label.toLowerCase() === String(value).toLowerCase(),
    );
    return byLabel?.label ?? value;
};

const mapVariantsFromProduct = (product) => {
    const list = product?.variants ?? product?.variantCombinations ?? [];
    if (!Array.isArray(list) || !list.length) return [];
    return list.map((v, index) => ({
        id: v._id ?? v.id ?? `variant-${index}-${v.size ?? ""}-${v.colour ?? ""}`,
        size: v.size || null,
        colour: v.colour ? normalizeColourLabel(v.colour) : null,
        quantity: Number(v.quantity) || 0,
        totalPrice: Number(v.totalPrice) || 0,
    }));
};

export const mapProductToForm = (product) => {
    const variants = mapVariantsFromProduct(product);
    const pricingType =
        product?.pricingType === "variant" || variants.length > 0
            ? "variant"
            : "normal";

    return {
        form: {
            name: product?.name ?? "",
            description: product?.description ?? "",
            productDetails: product?.productDetails ?? "",
            totalPrice:
                product?.totalPrice != null && product?.totalPrice !== ""
                    ? String(product.totalPrice)
                    : "",
            quantity:
                product?.quantity != null && product?.quantity !== ""
                    ? String(product.quantity)
                    : "",
            images: Array.isArray(product?.images) ? product.images : [],
        },
        pricingType,
        variantRows: variants,
    };
};

const emptyErrors = () => ({
    name: "",
    totalPrice: "",
    quantity: "",
    images: "",
    variants: "",
});

const inputSx = {
    "& .MuiOutlinedInput-root": {
        borderRadius: "10px",
        border: "1px solid #D9D9D9",
        backgroundColor: "#FFFFFF",
        "&:hover": { borderColor: "#BDBDBD" },
        "&.Mui-focused": { borderColor: "#FF1572" },
        "&.Mui-error": { borderColor: "error.main" },
    },
    "& .MuiInputBase-input": {
        padding: "11px 14px",
        fontSize: "14px",
    },
    "& .MuiFormHelperText-root.Mui-error": {
        marginLeft: 0,
        color: "error.main",
    },
};

const PinkLabel = ({ children }) => (
    <Typography fontSize={14} fontWeight={600} color="#FF1572" mt={1.5} mb={0.5}>
        {children}
    </Typography>
);

const FieldLabel = ({ children }) => (
    <Typography fontSize={14} fontWeight={600} color="text.primary" mt={1.5} mb={0.5}>
        {children}
    </Typography>
);

const variantKey = (size, colour) => `${size ?? ""}__${colour ?? ""}`;

const AddProduct = ({ open, onClose, editProduct = null, onSuccess }) => {
    const { createProduct, updateProduct, createLoading, updateLoading } = useProducts();
    const [form, setForm] = useState(emptyForm);
    const [errors, setErrors] = useState(emptyErrors);
    const [pricingType, setPricingType] = useState("normal");
    const [variantRows, setVariantRows] = useState([]);
    const [variantDraft, setVariantDraft] = useState(emptyVariantDraft);
    const [variantDraftError, setVariantDraftError] = useState("");
    const [imageUploading, setImageUploading] = useState(false);
    const fileInputRef = useRef(null);

    const productId = editProduct?._id ?? editProduct?.id ?? null;
    const isEditMode = Boolean(productId);
    const isVariantPricing = pricingType === "variant";

    useEffect(() => {
        if (!open) return;
        if (editProduct) {
            const mapped = mapProductToForm(editProduct);
            setForm(mapped.form);
            setPricingType(mapped.pricingType);
            setVariantRows(mapped.variantRows);
        } else {
            setForm(emptyForm());
            setPricingType("normal");
            setVariantRows([]);
        }
        setVariantDraft(emptyVariantDraft());
        setErrors(emptyErrors());
        setVariantDraftError("");
    }, [open, editProduct]);

    const handleClose = () => {
        setForm(emptyForm());
        setPricingType("normal");
        setVariantRows([]);
        setVariantDraft(emptyVariantDraft());
        setErrors(emptyErrors());
        setVariantDraftError("");
        setImageUploading(false);
        onClose();
    };

    const handleFieldChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleVariantDraftMulti = (field, event) => {
        const { value } = event.target;
        setVariantDraft((prev) => ({
            ...prev,
            [field]: typeof value === "string" ? value.split(",") : value,
        }));
        setVariantDraftError("");
    };

    const handleVariantDraftField = (event) => {
        const { name, value } = event.target;
        setVariantDraft((prev) => ({ ...prev, [name]: value }));
        setVariantDraftError("");
    };

    const getColourHex = (label) =>
        PRODUCT_COLOURS.find((c) => c.label === label)?.hex ?? "cccccc";

    const handleAddVariantToTable = () => {
        const sizes = variantDraft.size.length ? variantDraft.size : [null];
        const colours = variantDraft.colour.length ? variantDraft.colour : [null];

        if (sizes[0] === null && colours[0] === null) {
            setVariantDraftError("Select at least one size or colour");
            return;
        }

        const qty = Number.parseInt(String(variantDraft.quantity), 10);
        const price = Number.parseFloat(
            String(variantDraft.totalPrice).replace(/[^0-9.]/g, ""),
        );

        if (!variantDraft.quantity.trim() || Number.isNaN(qty) || qty < 0) {
            setVariantDraftError("Enter a valid quantity");
            return;
        }
        if (!variantDraft.totalPrice.trim() || Number.isNaN(price) || price <= 0) {
            setVariantDraftError("Enter a valid price");
            return;
        }

        const existingKeys = new Set(
            variantRows.map((r) => variantKey(r.size, r.colour)),
        );
        const toAdd = [];

        sizes.forEach((size) => {
            colours.forEach((colour) => {
                const key = variantKey(size, colour);
                if (existingKeys.has(key)) return;
                existingKeys.add(key);
                toAdd.push({
                    id: `${key}-${Date.now()}-${Math.random()}`,
                    size,
                    colour,
                    quantity: qty,
                    totalPrice: price,
                });
            });
        });

        if (!toAdd.length) {
            setVariantDraftError("These combinations already exist in the table");
            return;
        }

        setVariantRows((prev) => [...prev, ...toAdd]);
        setVariantDraft((prev) => ({ ...prev, quantity: "", totalPrice: "" }));
        setVariantDraftError("");
        setErrors((prev) => ({ ...prev, variants: "" }));
        toast.success(
            toAdd.length > 1
                ? `${toAdd.length} variants added to table`
                : "Variant added to table",
        );
    };

    const handleRemoveVariantRow = (id) => {
        setVariantRows((prev) => prev.filter((r) => r.id !== id));
    };

    const handleImageUpload = async (event) => {
        const files = Array.from(event.target.files || []);
        event.target.value = "";
        if (!files.length) return;

        const invalid = files.find((f) => !f.type.startsWith("image/"));
        if (invalid) {
            toast.error("Please upload image files only");
            return;
        }

        setImageUploading(true);
        try {
            const uploadedResults = await Promise.all(
                files.map((file) => uploadMediaService(file)),
            );
            const fileNames = uploadedResults.map((r) => r.fileName);
            setForm((prev) => ({
                ...prev,
                images: [...prev.images, ...fileNames],
            }));
            setErrors((prev) => ({ ...prev, images: "" }));
            toast.success(
                fileNames.length > 1
                    ? "Images uploaded successfully"
                    : "Image uploaded successfully",
            );
        } catch {
            toast.error("Image upload failed. Please try again.");
        } finally {
            setImageUploading(false);
        }
    };

    const handleRemoveImage = (index) => {
        setForm((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const validate = () => {
        const next = emptyErrors();
        if (!form.name.trim()) next.name = "Product name is required";

        if (isVariantPricing) {
            if (!variantRows.length) {
                next.variants = "Add at least one variant combination to the table";
            }
        } else {
            const price = Number.parseFloat(
                String(form.totalPrice).replace(/[^0-9.]/g, ""),
            );
            if (!form.totalPrice.trim() || Number.isNaN(price) || price <= 0) {
                next.totalPrice = "Enter a valid price";
            }
            if (form.quantity.trim()) {
                const qty = Number.parseInt(String(form.quantity), 10);
                if (Number.isNaN(qty) || qty < 0) {
                    next.quantity = "Enter a valid quantity";
                }
            }
        }

        if (!form.images.length) next.images = "Upload at least one image";

        setErrors(next);
        return !Object.values(next).some(Boolean);
    };

    const buildPayload = useCallback(() => {
        const base = {
            name: form.name.trim(),
            description: form.description.trim(),
            productDetails: form.productDetails.trim(),
            images: form.images,
            pricingType,
        };

        if (isVariantPricing) {
            const variants = variantRows.map((row) => ({
                ...(row.size ? { size: row.size } : {}),
                ...(row.colour ? { colour: row.colour } : {}),
                quantity: row.quantity,
                totalPrice: row.totalPrice,
            }));

            const uniqueSizes = [
                ...new Set(variantRows.map((r) => r.size).filter(Boolean)),
            ];
            const uniqueColours = [
                ...new Set(variantRows.map((r) => r.colour).filter(Boolean)),
            ];
            const totalQuantity = variantRows.reduce((sum, r) => sum + r.quantity, 0);
            const minPrice = Math.min(...variantRows.map((r) => r.totalPrice));

            return {
                ...base,
                variants,
                size: uniqueSizes,
                colour: uniqueColours,
                quantity: totalQuantity,
                totalPrice: minPrice,
            };
        }

        const totalPrice = Number.parseFloat(
            String(form.totalPrice).replace(/[^0-9.]/g, ""),
        );
        const quantity = form.quantity.trim()
            ? Number.parseInt(String(form.quantity), 10)
            : 0;

        return {
            ...base,
            totalPrice,
            quantity,
            size: [],
            colour: [],
            variants: [],
        };
    }, [form, isVariantPricing, pricingType, variantRows]);

    const handleSubmit = async () => {
        if (!validate()) return;

        const payload = buildPayload();
        const response = isEditMode
            ? await updateProduct(productId, payload)
            : await createProduct(payload);
        if (response?.success) {
            onSuccess?.();
            handleClose();
        }
    };

    const isBusy = createLoading || updateLoading || imageUploading;

    const renderSizeSelect = (value, onChange, label) => (
        <>
            <PinkLabel>{label}</PinkLabel>
            <CustomInput
                select
                value={value}
                onChange={onChange}
                disabled={isBusy}
                fullWidth
                backgroundColor="#fff"
                borderRadius="10px"
                sx={inputSx}
                SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                        selected.length
                            ? `${selected.length} size(s) selected`
                            : "Choose size(s)",
                }}
            >
                {PRODUCT_SIZES.map((size) => (
                    <MenuItem key={size} value={size}>
                        <Checkbox
                            checked={value.includes(size)}
                            sx={{
                                color: "#FF1572",
                                "&.Mui-checked": { color: "#FF1572" },
                            }}
                        />
                        <ListItemText primary={size} />
                    </MenuItem>
                ))}
            </CustomInput>
        </>
    );

    const renderColourSelect = (value, onChange, label) => (
        <>
            <PinkLabel>{label}</PinkLabel>
            <CustomInput
                select
                value={value}
                onChange={onChange}
                disabled={isBusy}
                fullWidth
                backgroundColor="#fff"
                borderRadius="10px"
                sx={inputSx}
                SelectProps={{
                    multiple: true,
                    renderValue: (selected) =>
                        selected.length
                            ? `${selected.length} colour(s) selected`
                            : "Choose colour(s)",
                }}
            >
                {PRODUCT_COLOURS.map((color) => (
                    <MenuItem key={color.label} value={color.label}>
                        <Checkbox
                            checked={value.includes(color.label)}
                            sx={{
                                color: "#FF1572",
                                "&.Mui-checked": { color: "#FF1572" },
                            }}
                        />
                        <Box
                            sx={{
                                width: 20,
                                height: 20,
                                borderRadius: "6px",
                                bgcolor: `#${color.hex}`,
                                border: "1px solid rgba(0,0,0,0.15)",
                                mr: 1,
                            }}
                        />
                        <ListItemText primary={color.label} />
                    </MenuItem>
                ))}
            </CustomInput>
        </>
    );

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
            <DialogTitle sx={{ fontWeight: 700 }}>
                {isEditMode ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogContent sx={{ pt: "8px !important" }}>
                <FieldLabel>Product Name *</FieldLabel>
                <CustomInput
                    name="name"
                    value={form.name}
                    onChange={handleFieldChange}
                    placeholder="e.g. T Shirt"
                    fullWidth
                    backgroundColor="#fff"
                    borderRadius="10px"
                    error={Boolean(errors.name)}
                    helperText={errors.name}
                    sx={inputSx}
                />

                <FieldLabel>Description</FieldLabel>
                <CustomInput
                    name="description"
                    value={form.description}
                    onChange={handleFieldChange}
                    placeholder="Short description"
                    fullWidth
                    multiline
                    minRows={2}
                    backgroundColor="#fff"
                    borderRadius="10px"
                    sx={inputSx}
                />

                <FieldLabel>Product Details</FieldLabel>
                <CustomInput
                    name="productDetails"
                    value={form.productDetails}
                    onChange={handleFieldChange}
                    placeholder="What is included in this product"
                    fullWidth
                    multiline
                    minRows={3}
                    backgroundColor="#fff"
                    borderRadius="10px"
                    sx={inputSx}
                />

                <Typography fontSize={16} fontWeight={700} color="#333" mt={2.5} mb={1}>
                    Pricing
                </Typography>
                <Stack direction="row" spacing={3} mb={1}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={pricingType === "normal"}
                                onChange={() => setPricingType("normal")}
                                sx={{
                                    color: "#FF1572",
                                    "&.Mui-checked": { color: "#FF1572" },
                                }}
                            />
                        }
                        label="Normal"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={pricingType === "variant"}
                                onChange={() => setPricingType("variant")}
                                sx={{
                                    color: "#FF1572",
                                    "&.Mui-checked": { color: "#FF1572" },
                                }}
                            />
                        }
                        label="Variant"
                    />
                </Stack>

                {!isVariantPricing ? (
                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <Box flex={1}>
                            <FieldLabel>Total Price *</FieldLabel>
                            <CustomInput
                                name="totalPrice"
                                type="number"
                                value={form.totalPrice}
                                onChange={handleFieldChange}
                                placeholder="49.99"
                                fullWidth
                                backgroundColor="#fff"
                                borderRadius="10px"
                                error={Boolean(errors.totalPrice)}
                                helperText={errors.totalPrice}
                                sx={inputSx}
                                inputProps={{ min: 0, step: "0.01" }}
                            />
                        </Box>
                        <Box flex={1}>
                            <FieldLabel>Quantity</FieldLabel>
                            <CustomInput
                                name="quantity"
                                type="number"
                                value={form.quantity}
                                onChange={handleFieldChange}
                                placeholder="50"
                                fullWidth
                                backgroundColor="#fff"
                                borderRadius="10px"
                                error={Boolean(errors.quantity)}
                                helperText={errors.quantity}
                                sx={inputSx}
                                inputProps={{ min: 0, step: 1 }}
                            />
                        </Box>
                    </Stack>
                ) : (
                    <Box
                        sx={{
                            border: "1px solid #E8E8E8",
                            borderRadius: "12px",
                            p: 2,
                            bgcolor: "#FAFAFA",
                        }}
                    >
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                            <Box flex={1}>
                                {renderSizeSelect(
                                    variantDraft.size,
                                    (e) => handleVariantDraftMulti("size", e),
                                    "Select Size",
                                )}
                            </Box>
                            <Box flex={1}>
                                {renderColourSelect(
                                    variantDraft.colour,
                                    (e) => handleVariantDraftMulti("colour", e),
                                    "Select Colour",
                                )}
                            </Box>
                        </Stack>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                            alignItems={{ sm: "flex-end" }}
                            mt={1}
                        >
                            <Box flex={1}>
                                <PinkLabel>Quantity</PinkLabel>
                                <CustomInput
                                    name="quantity"
                                    type="number"
                                    value={variantDraft.quantity}
                                    onChange={handleVariantDraftField}
                                    placeholder="10"
                                    fullWidth
                                    backgroundColor="#fff"
                                    borderRadius="10px"
                                    sx={inputSx}
                                    inputProps={{ min: 0, step: 1 }}
                                />
                            </Box>
                            <Box flex={1}>
                                <PinkLabel>Total Price</PinkLabel>
                                <CustomInput
                                    name="totalPrice"
                                    type="number"
                                    value={variantDraft.totalPrice}
                                    onChange={handleVariantDraftField}
                                    placeholder="59.00"
                                    fullWidth
                                    backgroundColor="#fff"
                                    borderRadius="10px"
                                    sx={inputSx}
                                    inputProps={{ min: 0, step: "0.01" }}
                                />
                            </Box>
                            <Box sx={{ pb: { xs: 0, sm: 0.5 } }}>
                                <CustomButton
                                    btnLabel="Add to table"
                                    handlePressBtn={handleAddVariantToTable}
                                    btnBgColor="#FF1572"
                                    btnHoverColor="#e01265"
                                    borderRadius="10px"
                                    btnPadding="10px 20px"
                                    disabled={isBusy}
                                />
                            </Box>
                        </Stack>

                        {variantDraftError ? (
                            <Typography fontSize={12} color="error.main" mt={1}>
                                {variantDraftError}
                            </Typography>
                        ) : (
                            <Typography fontSize={12} color="text.secondary" mt={1}>
                                Select size and/or colour, enter quantity & price, then add.
                                Example: S + Green & Red = 2 rows with same qty/price.
                            </Typography>
                        )}

                        {errors.variants ? (
                            <Typography fontSize={12} color="error.main" mt={1}>
                                {errors.variants}
                            </Typography>
                        ) : null}

                        <Typography
                            fontSize={15}
                            fontWeight={700}
                            color="#5E1321"
                            mt={2.5}
                            mb={1}
                        >
                            Variant combinations
                        </Typography>
                        <TableContainer
                            sx={{
                                borderRadius: "10px",
                                border: "1px solid #E0E0E0",
                                overflow: "hidden",
                            }}
                        >
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: "#5E1321" }}>
                                        {["Size", "Colour", "Quantity", "Total Price", "Action"].map(
                                            (head) => (
                                                <TableCell
                                                    key={head}
                                                    sx={{
                                                        color: "#fff",
                                                        fontWeight: 700,
                                                        borderBottom: "none",
                                                    }}
                                                    align={head === "Action" ? "center" : "left"}
                                                >
                                                    {head}
                                                </TableCell>
                                            ),
                                        )}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {variantRows.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                align="center"
                                                sx={{ py: 3, color: "text.secondary" }}
                                            >
                                                No data found
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        variantRows.map((row) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell>{row.size ?? "—"}</TableCell>
                                                <TableCell>
                                                    {row.colour ? (
                                                        <Box
                                                            display="flex"
                                                            alignItems="center"
                                                            gap={1}
                                                        >
                                                            <Box
                                                                sx={{
                                                                    width: 16,
                                                                    height: 16,
                                                                    borderRadius: "4px",
                                                                    bgcolor: `#${getColourHex(row.colour)}`,
                                                                    border: "1px solid rgba(0,0,0,0.15)",
                                                                }}
                                                            />
                                                            {row.colour}
                                                        </Box>
                                                    ) : (
                                                        "—"
                                                    )}
                                                </TableCell>
                                                <TableCell>{row.quantity}</TableCell>
                                                <TableCell>${row.totalPrice}</TableCell>
                                                <TableCell align="center">
                                                    <IconButton
                                                        size="small"
                                                        aria-label="Remove variant"
                                                        onClick={() =>
                                                            handleRemoveVariantRow(row.id)
                                                        }
                                                        sx={{ color: "#FF1572" }}
                                                    >
                                                        <DeleteOutlineIcon fontSize="small" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                )}

                <FieldLabel>Upload Images *</FieldLabel>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageUpload}
                />
                <Box
                    onClick={() => !isBusy && fileInputRef.current?.click()}
                    sx={{
                        border: "2px dashed #D9D9D9",
                        borderRadius: "12px",
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        cursor: isBusy ? "not-allowed" : "pointer",
                        bgcolor: "#FAFAFA",
                        opacity: isBusy ? 0.7 : 1,
                        "&:hover": isBusy
                            ? {}
                            : {
                                  borderColor: "#FF1572",
                                  bgcolor: "rgba(255, 21, 114, 0.04)",
                              },
                    }}
                >
                    {imageUploading ? (
                        <CircularProgress size={32} sx={{ color: "#FF1572" }} />
                    ) : (
                        <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "#FF1572" }} />
                    )}
                    <Typography fontSize={14} fontWeight={600} color="#5E1321">
                        {imageUploading
                            ? "Uploading..."
                            : "Click to upload images"}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                        PNG, JPG — multiple images allowed
                    </Typography>
                </Box>

                {errors.images ? (
                    <Typography fontSize={12} color="error.main" mt={1}>
                        {errors.images}
                    </Typography>
                ) : null}

                {form.images.length > 0 ? (
                    <>
                        <Typography fontSize={13} fontWeight={600} color="#5E1321" mt={2} mb={1}>
                            Uploaded images ({form.images.length})
                        </Typography>
                        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                            {form.images.map((fileName, index) => (
                                <Box
                                    key={`${fileName}-${index}`}
                                    sx={{
                                        position: "relative",
                                        width: 88,
                                        height: 88,
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        border: "1px solid #E0E0E0",
                                    }}
                                >
                                    <Box
                                        component="img"
                                        src={getFullS3Url(fileName)}
                                        alt={`Product ${index + 1}`}
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                    <IconButton
                                        size="small"
                                        aria-label="Remove image"
                                        onClick={() => handleRemoveImage(index)}
                                        disabled={isBusy}
                                        sx={{
                                            position: "absolute",
                                            top: 2,
                                            right: 2,
                                            bgcolor: "rgba(255,255,255,0.9)",
                                            "&:hover": { bgcolor: "#fff" },
                                            p: 0.25,
                                        }}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Stack>
                    </>
                ) : (
                    <Typography fontSize={12} color="text.secondary" mt={1}>
                        No images uploaded yet
                    </Typography>
                )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <CustomButton
                    variant="text"
                    handlePressBtn={handleClose}
                    btnLabel="Cancel"
                    disabled={isBusy}
                />
                <CustomButton
                    handlePressBtn={handleSubmit}
                    btnLabel={isEditMode ? "Update Product" : "Create Product"}
                    btnBgColor="#FF1572"
                    btnHoverColor="#e01265"
                    loading={createLoading || updateLoading}
                    disabled={isBusy}
                />
            </DialogActions>
        </Dialog>
    );
};

export default AddProduct;
