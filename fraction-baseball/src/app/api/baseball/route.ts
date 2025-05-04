import { NextResponse } from "next/server";
import type { BaseballPlayer } from "~/lib/api";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.hirefraction.com/api/test/baseball",
      {
        // Adding cache control for improved performance
        next: {
          revalidate: 3600, // Cache for 1 hour
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch baseball data" },
        { status: response.status },
      );
    }

    const data = (await response.json()) as BaseballPlayer[];
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching baseball data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
