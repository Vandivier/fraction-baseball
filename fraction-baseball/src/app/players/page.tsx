"use client";

import { useState, useEffect } from "react";
import { fetchBaseballData, type BaseballPlayer } from "~/lib/api";
import Link from "next/link";

export default function PlayersPage() {
  const [players, setPlayers] = useState<BaseballPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"Hits" | "home run">("home run");

  useEffect(() => {
    async function loadPlayers() {
      try {
        setLoading(true);
        const data = await fetchBaseballData();
        setPlayers(data);
      } catch (err) {
        setError("Failed to load player data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void loadPlayers();
  }, []);

  // Sort players based on selected criteria
  const sortedPlayers = [...players].sort((a, b) => b[sortBy] - a[sortBy]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Baseball Players</h1>

      {/* Sorting controls */}
      <div className="mb-6 flex items-center">
        <span className="mr-3">Sort by:</span>
        <div className="flex space-x-2">
          <button
            onClick={() => setSortBy("home run")}
            className={`rounded-md px-4 py-2 ${
              sortBy === "home run"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Home Runs
          </button>
          <button
            onClick={() => setSortBy("Hits")}
            className={`rounded-md px-4 py-2 ${
              sortBy === "Hits"
                ? "bg-gray-700 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            Hits
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="my-4 rounded-md border border-red-300 bg-red-100 p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gray-700"></div>
        </div>
      )}

      {/* Players list */}
      {!loading && players.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Player
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Games
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Hits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Home Runs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  AVG
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {sortedPlayers.map((player) => (
                <tr key={player["Player name"]} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/players/${encodeURIComponent(player["Player name"])}`}
                      className="text-blue-600 hover:underline"
                    >
                      {player["Player name"]}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {player.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {player.Games}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{player.Hits}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {player["home run"]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {player.AVG.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      href={`/players/edit/${encodeURIComponent(player["Player name"])}`}
                      className="rounded bg-gray-700 px-3 py-1 text-white hover:bg-gray-800"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No players found */}
      {!loading && players.length === 0 && !error && (
        <div className="my-12 text-center text-lg text-gray-500">
          No players found.
        </div>
      )}
    </div>
  );
}
