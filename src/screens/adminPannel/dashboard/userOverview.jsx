import React, { useMemo } from "react";
import { Grid } from "@mui/material";
import ChartCard from "../../../components/chartCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const tooltipStyle = {
  borderRadius: "8px",
  border: "none",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const normalizeUserOverview = (raw) => {
  if (!Array.isArray(raw) || raw.length === 0) return [];
  return raw.map((row) => ({
    name: row.month ?? row.name ?? "",
    active: Number(row.active ?? 0),
    inactive: Number(row.inactive ?? 0),
  }));
};

const UserOverview = ({ data }) => {
  const chartData = useMemo(() => normalizeUserOverview(data), [data]);

  return (
    <Grid size={{ xs: 12, md: 6 }} sx={{ minWidth: 0, display: "flex" }}>
      <ChartCard title="Users Overview">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#666" }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#666" }} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="active" fill="#5E1321" radius={[8, 8, 0, 0]} barSize={20} name="Active" />
            <Bar dataKey="inactive" fill="#FF1572" radius={[8, 8, 0, 0]} barSize={20} name="Inactive" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </Grid>
  );
};

export default UserOverview;
