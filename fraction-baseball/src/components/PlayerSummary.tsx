"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchBaseballData, type BaseballPlayer } from "~/lib/api";

export default function PlayerSummary() {
  const [players, setPlayers] = useState<BaseballPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPlayers() {
      try {
        setLoading(true);
        const data = await fetchBaseballData();
        // Get top 5 players by home runs
        const topPlayers = [...data]
          .sort((a, b) => b["home run"] - a["home run"])
          .slice(0, 5);
        setPlayers(topPlayers);
      } catch (err) {
        setError("Failed to load player data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void loadPlayers();
  }, []);

  if (loading) {
    return (
      <div className="w-full rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Top Players</h2>
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-700"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">Top Players</h2>
        <div className="rounded-md border border-red-300 bg-red-100 p-4 text-red-800">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Top Home Run Hitters</h2>
        <Link href="/players" className="text-sm text-blue-600 hover:underline">
          View All Players →
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Player
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Position
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                HR
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                AVG
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {players.map((player) => (
              <tr key={player["Player name"]} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap">
                  <Link
                    href={`/players/${encodeURIComponent(player["Player name"])}`}
                    className="text-blue-600 hover:underline"
                  >
                    {player["Player name"]}
                  </Link>
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {player.position}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {player["home run"]}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  {player.AVG.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
