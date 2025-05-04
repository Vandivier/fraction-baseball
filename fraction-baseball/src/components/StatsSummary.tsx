"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { fetchBaseballData, type BaseballPlayer } from "~/lib/api";

type StatLeaders = {
  batting: BaseballPlayer;
  rbi: BaseballPlayer;
  hits: BaseballPlayer;
  steals: BaseballPlayer;
};

export default function StatsSummary() {
  const [players, setPlayers] = useState<BaseballPlayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [leaders, setLeaders] = useState<StatLeaders | null>(null);

  useEffect(() => {
    async function loadPlayers() {
      try {
        setLoading(true);
        const data = await fetchBaseballData();
        setPlayers(data);

        if (data.length > 0) {
          // Sort players by different stats
          const byBatting = [...data].sort((a, b) => b.AVG - a.AVG);
          const byRbi = [...data].sort(
            (a, b) => b["run batted in"] - a["run batted in"],
          );
          const byHits = [...data].sort((a, b) => b.Hits - a.Hits);
          const bySteals = [...data].sort(
            (a, b) => b["stolen base"] - a["stolen base"],
          );

          // Type assertion is safe here because we checked data.length > 0
          setLeaders({
            batting: byBatting[0]!,
            rbi: byRbi[0]!,
            hits: byHits[0]!,
            steals: bySteals[0]!,
          });
        }
      } catch (err) {
        setError("Failed to load statistics");
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
        <h2 className="mb-4 text-xl font-bold">League Leaders</h2>
        <div className="flex h-40 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-gray-700"></div>
        </div>
      </div>
    );
  }

  if (error ?? (players.length === 0 || !leaders)) {
    return (
      <div className="w-full rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-xl font-bold">League Leaders</h2>
        <div className="rounded-md border border-red-300 bg-red-100 p-4 text-red-800">
          {error ?? "No player data available"}
        </div>
      </div>
    );
  }

  // At this point, we know leaders exists and has all required properties
  return (
    <div className="w-full rounded-lg bg-white p-6 shadow-md">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">League Leaders</h2>
        <Link href="/players" className="text-sm text-blue-600 hover:underline">
          View All Stats →
        </Link>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Batting Average Leader */}
        <div className="rounded-md bg-blue-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700">
            Batting Leader
          </h3>
          <div className="mt-2">
            <Link
              href={`/players/${encodeURIComponent(leaders.batting["Player name"])}`}
              className="font-bold text-blue-600 hover:underline"
            >
              {leaders.batting["Player name"]}
            </Link>
            <p className="mt-1 text-2xl font-bold">
              {leaders.batting.AVG.toFixed(3)}
            </p>
          </div>
        </div>

        {/* RBI Leader */}
        <div className="rounded-md bg-green-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700">RBI Leader</h3>
          <div className="mt-2">
            <Link
              href={`/players/${encodeURIComponent(leaders.rbi["Player name"])}`}
              className="font-bold text-blue-600 hover:underline"
            >
              {leaders.rbi["Player name"]}
            </Link>
            <p className="mt-1 text-2xl font-bold">
              {leaders.rbi["run batted in"]}
            </p>
          </div>
        </div>

        {/* Hits Leader */}
        <div className="rounded-md bg-purple-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700">Hits Leader</h3>
          <div className="mt-2">
            <Link
              href={`/players/${encodeURIComponent(leaders.hits["Player name"])}`}
              className="font-bold text-blue-600 hover:underline"
            >
              {leaders.hits["Player name"]}
            </Link>
            <p className="mt-1 text-2xl font-bold">{leaders.hits.Hits}</p>
          </div>
        </div>

        {/* Stolen Base Leader */}
        <div className="rounded-md bg-yellow-50 p-4">
          <h3 className="text-sm font-semibold text-gray-700">Steals Leader</h3>
          <div className="mt-2">
            <Link
              href={`/players/${encodeURIComponent(leaders.steals["Player name"])}`}
              className="font-bold text-blue-600 hover:underline"
            >
              {leaders.steals["Player name"]}
            </Link>
            <p className="mt-1 text-2xl font-bold">
              {leaders.steals["stolen base"]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
