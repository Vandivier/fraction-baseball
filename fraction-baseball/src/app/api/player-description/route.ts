import { NextRequest, NextResponse } from "next/server";
import type { BaseballPlayer } from "~/lib/api";

// Interface for Gemini API response
interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export async function POST(request: NextRequest) {
  try {
    const player = (await request.json()) as BaseballPlayer;

    // Access environment variables on the server side
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.warn("No Gemini API key found. Using fallback description.");
      return NextResponse.json({
        description: generateFallbackDescription(player),
      });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate a concise baseball player description for ${player["Player name"]} who plays ${player.position}. 
                  Include analysis of their key stats: Games: ${player.Games}, At-bats: ${player["At-bat"]}, 
                  Hits: ${player.Hits}, Home runs: ${player["home run"]}, RBIs: ${player["run batted in"]}, 
                  AVG: ${player.AVG}, OBP: ${player["On-base Percentage"]}, SLG: ${player["Slugging Percentage"]}.
                  Make it sound like professional baseball commentary in 3-4 sentences.`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      },
    );

    if (!response.ok) {
      console.error("Gemini API error:", await response.text());
      return NextResponse.json({
        description: generateFallbackDescription(player),
      });
    }

    const result = (await response.json()) as GeminiResponse;
    const description =
      result.candidates[0]?.content.parts[0]?.text ??
      generateFallbackDescription(player);

    return NextResponse.json({ description });
  } catch (error) {
    console.error("Error generating player description:", error);
    return NextResponse.json(
      { error: "Failed to generate player description" },
      { status: 500 },
    );
  }
}

// Fallback description generator if Gemini API is unavailable
function generateFallbackDescription(player: BaseballPlayer): string {
  const achievements = [];

  if (player["home run"] > 500) achievements.push("home run powerhouse");
  if (player.Hits > 3000) achievements.push("hitting legend");
  if (player.AVG > 0.3) achievements.push("consistent high-average batter");
  if (player["On-base Percentage"] > 0.4) achievements.push("on-base machine");
  if (player["Slugging Percentage"] > 0.55)
    achievements.push("slugging specialist");

  const achievementText =
    achievements.length > 0
      ? `Known as a ${achievements.join(" and ")}.`
      : `A solid contributor at the ${player.position} position.`;

  return `${player["Player name"]} played ${player.Games} games as a ${player.position}, 
  collecting ${player.Hits} hits and ${player["home run"]} home runs with a .${Math.round(player.AVG * 1000)} batting average. 
  ${achievementText} Career stats include ${player["run batted in"]} RBIs and 
  an OPS of ${player["On-base Plus Slugging"].toFixed(3)}.`;
}
