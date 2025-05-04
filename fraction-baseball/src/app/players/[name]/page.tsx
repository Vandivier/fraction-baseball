"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  fetchBaseballData,
  generatePlayerDescription,
  type BaseballPlayer,
} from "~/lib/api";

interface PlayerDetailProps {
  params: Promise<{
    name: string;
  }>;
}

export default function PlayerDetail({ params }: PlayerDetailProps) {
  const [player, setPlayer] = useState<BaseballPlayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Unwrap the params promise using React.use()
  const resolvedParams = use(params);
  const playerName = decodeURIComponent(resolvedParams.name);

  useEffect(() => {
    async function loadPlayerData() {
      try {
        setLoading(true);
        const players = await fetchBaseballData();
        const foundPlayer = players.find(
          (p) => p["Player name"] === playerName,
        );

        if (!foundPlayer) {
          setError(`Player "${playerName}" not found.`);
          return;
        }

        setPlayer(foundPlayer);

        // Generate the player description using Gemini
        const playerDescription = await generatePlayerDescription(foundPlayer);
        setDescription(playerDescription);
      } catch (err) {
        setError("Failed to load player data. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    void loadPlayerData();
  }, [playerName]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-gray-700"></div>
      </div>
    );
  }

  if (error ?? !player) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6 rounded-md border border-red-300 bg-red-100 p-4 text-red-800">
          {error ?? "Player not found."}
        </div>
        <Link href="/players" className="text-blue-600 hover:underline">
          ← Back to all players
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/players"
        className="mb-6 inline-block text-blue-600 hover:underline"
      >
        ← Back to all players
      </Link>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <h1 className="text-2xl font-bold">{player["Player name"]}</h1>
          <p className="text-gray-600">{player.position}</p>
        </div>

        {/* AI-generated description */}
        <div className="border-b border-gray-200 bg-blue-50 p-6">
          <h2 className="mb-2 text-lg font-semibold text-gray-700">
            Player Profile
          </h2>
          <p className="text-gray-700 italic">
            {description ?? "Loading player description..."}
          </p>
        </div>

        {/* Player stats */}
        <div className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">
            Career Statistics
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Games Played
              </h3>
              <p className="text-2xl font-bold">{player.Games}</p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">At Bats</h3>
              <p className="text-2xl font-bold">{player["At-bat"]}</p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">Hits</h3>
              <p className="text-2xl font-bold">{player.Hits}</p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">Doubles</h3>
              <p className="text-2xl font-bold">{player["Double (2B)"]}</p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">Home Runs</h3>
              <p className="text-2xl font-bold">{player["home run"]}</p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">RBIs</h3>
              <p className="text-2xl font-bold">{player["run batted in"]}</p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">Walks</h3>
              <p className="text-2xl font-bold">{player["a walk"]}</p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Stolen Bases
              </h3>
              <p className="text-2xl font-bold">{player["stolen base"]}</p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">
                Batting Average
              </h3>
              <p className="text-2xl font-bold">{player.AVG.toFixed(3)}</p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">On-Base %</h3>
              <p className="text-2xl font-bold">
                {player["On-base Percentage"].toFixed(3)}
              </p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">Slugging %</h3>
              <p className="text-2xl font-bold">
                {player["Slugging Percentage"].toFixed(3)}
              </p>
            </div>

            <div className="rounded-md bg-gray-100 p-4">
              <h3 className="text-sm font-medium text-gray-500">OPS</h3>
              <p className="text-2xl font-bold">
                {player["On-base Plus Slugging"].toFixed(3)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-6 py-4">
          <Link
            href={`/players/edit/${encodeURIComponent(player["Player name"])}`}
            className="rounded bg-gray-700 px-4 py-2 text-white hover:bg-gray-800"
          >
            Edit Player
          </Link>
        </div>
      </div>
    </div>
  );
}
