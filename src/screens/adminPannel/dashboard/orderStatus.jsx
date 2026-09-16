import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import ChartCard from "../../../components/chartCard";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from "recharts";

const tooltipStyle = {
  borderRadius: "8px",
  border: "none",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const STATUS_DEFS = [
  { key: "completed", name: "Completed", color: "#5E1321" },
  { key: "inProcess", name: "In Process", color: "#FF1572" },
  { key: "pending", name: "Pending", color: "#FF6B9D" },
  { key: "cancelled", name: "Cancelled", color: "#e0e0e0" },
];

const normalizeOrderStatus = (raw) => {
  const d = raw && typeof raw === "object" ? raw : {};
  return STATUS_DEFS.map(({ key, name, color }) => ({
    name,
    value: Number(d[key] ?? 0),
    color,
  }));
};

/** Outside label + leader line; text always shows real `payload.value` (so zeros show "0"). */
const renderOrderStatusLabel = (props) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, payload } = props;
  if (cx == null || payload == null) return null;

  const RADIAN = Math.PI / 180;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const rMid = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x0 = cx + rMid * cos;
  const y0 = cy + rMid * sin;
  const x1 = cx + (outerRadius + 10) * cos;
  const y1 = cy + (outerRadius + 10) * sin;
  const x2 = x1 + (cos >= 0 ? 1 : -1) * 20;
  const textAnchor = cos >= 0 ? "start" : "end";
  const count = payload.value;

  return (
    <g>
      <path
        d={`M${x0},${y0}L${x1},${y1}L${x2},${y1}`}
        stroke="#999"
        fill="none"
        strokeWidth={1}
      />
      <text
        x={x2 + (cos >= 0 ? 6 : -6)}
        y={y1}
        dy={4}
        textAnchor={textAnchor}
        fill="#333"
        fontSize={14}
        fontWeight={600}
      >
        {count}
      </text>
    </g>
  );
};

const OrderStatus = ({ data }) => {
  const pieData = useMemo(() => {
    const base = normalizeOrderStatus(data);
    const total = base.reduce((sum, row) => sum + row.value, 0);
    const isAllZero = total === 0;
    return base.map((row) => ({
      ...row,
      // Equal dummy angles when all zero so Recharts still draws the donut
      pieValue: isAllZero ? 1 : row.value,
    }));
  }, [data]);

  return (
    <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0, display: "flex" }}>
      <ChartCard title="Order Status">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="pieValue"
              nameKey="name"
              label={renderOrderStatusLabel}
              labelLine={false}
              stroke="#fff"
              strokeWidth={1}
              isAnimationActive={false}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={tooltipStyle}
              formatter={(_pieValue, _name, item) => {
                const row = item?.payload ?? item;
                const count = row?.value ?? 0;
                const label = row?.name ?? "";
                return [`${count} orders`, label];
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
    </Grid>
  );
};

export default OrderStatus;
