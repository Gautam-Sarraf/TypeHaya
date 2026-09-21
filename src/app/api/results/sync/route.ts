import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { results } = await req.json();
    if (!Array.isArray(results) || results.length === 0) {
      return NextResponse.json({ success: true, count: 0 });
    }

    let syncedCount = 0;

    for (const item of results) {
      const wpm = Number(item.wpm);
      const rawWpm = Number(item.rawWpm || wpm);
      const accuracy = Number(item.accuracy || 100);
      const mode = item.mode || "time";
      const subMode = String(item.subMode || "30");

      const created = await prisma.testResult.create({
        data: {
          userId: session.userId,
          wpm,
          rawWpm,
          accuracy,
          consistency: Number(item.consistency || 100),
          mode,
          subMode,
          language: item.language || "english",
          punctuation: Boolean(item.punctuation),
          numbers: Boolean(item.numbers),
          duration: Number(item.duration || 30),
          charStats: item.charStats || {},
          wpmTimeline: item.wpmTimeline || [],
          keyStats: item.keyStats || {},
          createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
        },
      });

      // Update personal best if higher
      const existingPb = await prisma.personalBest.findUnique({
        where: {
          userId_mode_subMode: {
            userId: session.userId,
            mode,
            subMode,
          },
        },
      });

      if (!existingPb || wpm > existingPb.wpm) {
        await prisma.personalBest.upsert({
          where: {
            userId_mode_subMode: {
              userId: session.userId,
              mode,
              subMode,
            },
          },
          create: {
            userId: session.userId,
            mode,
            subMode,
            wpm,
            rawWpm,
            accuracy,
            testResultId: created.id,
          },
          update: {
            wpm,
            rawWpm,
            accuracy,
            testResultId: created.id,
          },
        });
      }

      syncedCount++;
    }

    return NextResponse.json({ success: true, count: syncedCount });
  } catch (error) {
    console.error("Sync results error:", error);
    return NextResponse.json(
      { error: "Failed to sync guest results." },
      { status: 500 }
    );
  }
}
