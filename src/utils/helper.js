import axios from "axios";
import { getPresignedUrlApi } from "../api/modules/s3Upload";
import { getFullS3Url } from "./s3Helper";

export const uploadMediaService = async (file, folder = "media") => {
    try {
        const res = await getPresignedUrlApi(file.name, file.type, folder);

        const isSuccess = res?.status >= 200 && res?.status < 300;
        if (!isSuccess) {
            const message = res?.data?.message || "Failed to get presigned URL";
            throw new Error(message);
        }

        const { presignedUrl, fileName } = res?.data?.data ?? res?.data;

        await axios.put(presignedUrl, file, {
            headers: { "Content-Type": file.type },
        });

        return {
            secure_url: getFullS3Url(fileName),
            public_id: fileName,
            fileName: fileName,
            bytes: file.size,
        };
    } catch (err) {
        const message = err?.response?.data?.message || err.message || "File uploading failed.";
        console.error("S3 upload error:", err);
        throw new Error(message);
    }
};
