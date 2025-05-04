import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import type { BaseballPlayer } from "~/lib/api";

// Initialize the Gemini API client
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL_NAME = "gemini-2.0-flash"; // Using the latest Gemini 2.0 Flash model

// Define generation configuration
const generationConfig = {
  temperature: 0.7,
  topK: 1,
  topP: 1,
  maxOutputTokens: 200,
};

// Define safety settings
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

export async function POST(request: NextRequest) {
  try {
    const player = (await request.json()) as BaseballPlayer;

    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.warn("No Gemini API key found. Using fallback description.");
      return NextResponse.json({
        description: generateFallbackDescription(player),
      });
    }

    // Initialize the Gemini client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      generationConfig,
      safetySettings,
    });

    // Construct the prompt
    const prompt = `
      Generate a concise baseball player description for ${player["Player name"]} who plays ${player.position}. 
      Include analysis of their key stats: Games: ${player.Games}, At-bats: ${player["At-bat"]}, 
      Hits: ${player.Hits}, Home runs: ${player["home run"]}, RBIs: ${player["run batted in"]}, 
      AVG: ${player.AVG.toFixed(3)}, OBP: ${player["On-base Percentage"].toFixed(3)}, SLG: ${player["Slugging Percentage"].toFixed(3)}.
      Make it sound like professional baseball commentary in 3-4 sentences.
    `;

    // Make the API call
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // Process the response
    if (result.response) {
      const description = result.response.text();
      return NextResponse.json({ description });
    } else {
      console.error("Gemini API returned no response");
      return NextResponse.json({
        description: generateFallbackDescription(player),
      });
    }
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
