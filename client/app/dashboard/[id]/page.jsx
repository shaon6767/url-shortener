"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ClickChart from "../../../components/ClickChart";
import api from "../../../lib/api";

export default function AnalyticsPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const { data } = await api.get(`/urls/${id}/analytics`);
      setData(data);
    };
    fetchAnalytics();
  }, [id]);

  if (!data) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Analytics</h1>
      <p className="text-sm text-gray-600">Total clicks: {data.totalClicks}</p>
      <ClickChart clicksByDay={data.clicksByDay} />
      <div>
        <h2 className="text-sm font-medium text-gray-700 mb-2">By device</h2>
        <div className="space-y-1">
          {data.clicksByDevice.map((d) => (
            <div key={d._id} className="flex justify-between text-sm">
              <span>{d._id}</span>
              <span>{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
