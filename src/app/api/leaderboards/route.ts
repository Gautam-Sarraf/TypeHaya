import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface LeaderboardPB {
  userId: string;
  user: {
    id: string;
    username: string;
    avatar: string | null;
  };
  wpm: number;
  rawWpm: number;
  accuracy: number;
  updatedAt: Date;
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode") || "time";
    const subMode = searchParams.get("subMode") || "60";
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "25", 10));

    // Fetch personal bests joined with User
    const pbs = await prisma.personalBest.findMany({
      where: {
        mode,
        subMode,
      },
      orderBy: {
        wpm: "desc",
      },
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    const leaderboard = (pbs as unknown as LeaderboardPB[]).map((pb: LeaderboardPB, index: number) => ({
      rank: index + 1,
      userId: pb.userId,
      username: pb.user.username,
      avatar: pb.user.avatar,
      wpm: pb.wpm,
      rawWpm: pb.rawWpm,
      accuracy: pb.accuracy,
      date: pb.updatedAt,
    }));

    return NextResponse.json({
      leaderboard,
      mode,
      subMode,
    });
  } catch (error) {
    console.error("Leaderboards error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard." },
      { status: 500 }
    );
  }
}
