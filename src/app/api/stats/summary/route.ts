import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;

    const [totalTests, results, pbs] = await Promise.all([
      prisma.testResult.count({ where: { userId } }),
      prisma.testResult.findMany({
        where: { userId },
        select: {
          wpm: true,
          rawWpm: true,
          accuracy: true,
          duration: true,
          createdAt: true,
          mode: true,
          subMode: true,
        },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.personalBest.findMany({
        where: { userId },
        orderBy: { wpm: "desc" },
      }),
    ]);

    let totalDuration = 0;
    let sumWpm = 0;
    let sumAcc = 0;
    let highestWpm = 0;

    for (const r of results) {
      totalDuration += r.duration || 0;
      sumWpm += r.wpm;
      sumAcc += r.accuracy;
      if (r.wpm > highestWpm) highestWpm = r.wpm;
    }

    const avgWpm = results.length > 0 ? Math.round(sumWpm / results.length) : 0;
    const avgAccuracy = results.length > 0 ? Math.round((sumAcc / results.length) * 10) / 10 : 0;

    return NextResponse.json({
      totalTests,
      totalDurationSeconds: Math.round(totalDuration),
      highestWpm,
      avgWpm,
      avgAccuracy,
      personalBests: pbs,
      recentHistory: results.slice(0, 15).reverse(),
    });
  } catch (error) {
    console.error("Stats summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats summary." },
      { status: 500 }
    );
  }
}
