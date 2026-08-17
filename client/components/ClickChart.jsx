"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

export default function ClickChart({ clicksByDay }) {
  const data = clicksByDay.map((d) => ({ date: d._id, clicks: d.count }));

  if (data.length === 0) {
    return <p className="text-gray-500 text-sm">No clicks yet.</p>;
  }

  return (
    <div className="h-64 bg-white border border-gray-200 rounded-md p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={12} />
          <YAxis allowDecimals={false} fontSize={12} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#111827"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
