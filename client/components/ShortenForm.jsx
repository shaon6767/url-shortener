"use client";

import { useState } from "react";
import api from "../lib/api";

export default function ShortenForm() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    try {
      const { data } = await api.post("/urls", { originalUrl });
      const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";
      setShortUrl(`${base}/${data.shortCode}`);
    } catch (err) {
      setError(err.response?.data?.message || "Could not shorten this URL");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="url"
          placeholder="https://example.com/very-long-link"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          required
        />
        <button
          type="submit"
          className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800"
        >
          Shorten
        </button>
      </form>

      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}

      {shortUrl && (
        <div className="mt-4 p-3 bg-white border border-gray-200 rounded-md text-sm">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {shortUrl}
          </a>
        </div>
      )}
    </div>
  );
}
