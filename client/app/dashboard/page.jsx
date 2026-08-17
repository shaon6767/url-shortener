"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "../../lib/api";

export default function DashboardPage() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUrls = async () => {
      const { data } = await api.get("/urls/mine");
      setUrls(data);
      setLoading(false);
    };
    fetchUrls();
  }, []);

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Your Links</h1>
      <div className="space-y-2">
        {urls.length === 0 && (
          <p className="text-gray-500 text-sm">
            No links yet — shorten one from the home page.
          </p>
        )}
        {urls.map((url) => (
          <Link
            key={url._id}
            href={`/dashboard/${url._id}`}
            className="flex justify-between px-4 py-3 bg-white border border-gray-200 rounded-md hover:border-gray-400"
          >
            <span className="text-sm truncate">{url.originalUrl}</span>
            <span className="text-sm text-gray-500">
              {url.clickCount} clicks
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
