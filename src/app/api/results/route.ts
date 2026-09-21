import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    const body = await req.json();

    const {
      wpm,
      rawWpm,
      accuracy,
      consistency,
      mode,
      subMode,
      language = "english",
      punctuation = false,
      numbers = false,
      duration,
      charStats,
      wpmTimeline,
      keyStats,
    } = body;

    // Even if guest, we can record or guest can save to localStorage
    const userId = session?.userId || null;

    let isPersonalBest = false;
    let previousPb: number | null = null;

    if (userId) {
      // Check existing personal best for this mode & subMode
      const existingPb = await prisma.personalBest.findUnique({
        where: {
          userId_mode_subMode: {
            userId,
            mode,
            subMode,
          },
        },
      });

      if (existingPb) {
        previousPb = existingPb.wpm;
        if (wpm > existingPb.wpm) {
          isPersonalBest = true;
        }
      } else {
        isPersonalBest = true;
      }
    }

    // Save test result
    const result = await prisma.testResult.create({
      data: {
        userId,
        wpm: Number(wpm),
        rawWpm: Number(rawWpm),
        accuracy: Number(accuracy),
        consistency: Number(consistency),
        mode,
        subMode: String(subMode),
        language,
        punctuation: Boolean(punctuation),
        numbers: Boolean(numbers),
        duration: Number(duration),
        charStats: charStats || {},
        wpmTimeline: wpmTimeline || [],
        keyStats: keyStats || {},
      },
    });

    if (userId && isPersonalBest) {
      await prisma.personalBest.upsert({
        where: {
          userId_mode_subMode: {
            userId,
            mode,
            subMode: String(subMode),
          },
        },
        create: {
          userId,
          mode,
          subMode: String(subMode),
          wpm: Number(wpm),
          rawWpm: Number(rawWpm),
          accuracy: Number(accuracy),
          testResultId: result.id,
        },
        update: {
          wpm: Number(wpm),
          rawWpm: Number(rawWpm),
          accuracy: Number(accuracy),
          testResultId: result.id,
        },
      });
    }

    return NextResponse.json({
      success: true,
      resultId: result.id,
      isPersonalBest,
      previousPb,
    });
  } catch (error: unknown) {
    console.error("Save result error:", error);
    return NextResponse.json(
      { error: "Failed to save test result." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ results: [], total: 0 });
    }

    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("mode");
    const limit = Math.min(100, parseInt(searchParams.get("limit") || "30", 10));
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const skip = (page - 1) * limit;

    const whereClause: { userId: string; mode?: string } = {
      userId: session.userId,
    };
    if (mode && mode !== "all") {
      whereClause.mode = mode;
    }

    const [results, total] = await Promise.all([
      prisma.testResult.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip,
      }),
      prisma.testResult.count({ where: whereClause }),
    ]);

    return NextResponse.json({ results, total, page, limit });
  } catch (error: unknown) {
    console.error("Get results error:", error);
    return NextResponse.json(
      { error: "Failed to fetch test results." },
      { status: 500 }
    );
  }
}
