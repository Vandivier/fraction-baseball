/**
 * API client for fetching baseball data and generating player descriptions with Gemini
 */

export interface BaseballPlayer {
  "Player name": string;
  position: string;
  Games: number;
  "At-bat": number;
  Runs: number;
  Hits: number;
  "Double (2B)": number;
  "third baseman": number;
  "home run": number;
  "run batted in": number;
  "a walk": number;
  Strikeouts: number;
  "stolen base": number;
  "Caught stealing": number;
  AVG: number;
  "On-base Percentage": number;
  "Slugging Percentage": number;
  "On-base Plus Slugging": number;
}

// Interface for our player description API response
interface PlayerDescriptionResponse {
  description: string;
  error?: string;
}

// Fetch baseball player data from the API
export async function fetchBaseballData(): Promise<BaseballPlayer[]> {
  try {
    // Use our local API proxy to avoid CORS issues
    const response = await fetch("/api/baseball");

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = (await response.json()) as BaseballPlayer[];
    return data;
  } catch (error) {
    console.error("Error fetching baseball data:", error);
    throw error;
  }
}

// Generate a player description using our server-side API
export async function generatePlayerDescription(
  player: BaseballPlayer,
): Promise<string> {
  try {
    // Use our local API proxy to handle Gemini API calls server-side
    const response = await fetch("/api/player-description", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = (await response.json()) as PlayerDescriptionResponse;
    return data.description;
  } catch (error) {
    console.error("Error generating player description:", error);
    return generateFallbackDescription(player);
  }
}

// Fallback description generator if API is unavailable
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
