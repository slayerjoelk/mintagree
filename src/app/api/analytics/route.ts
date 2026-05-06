import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getUserAnalytics } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await getUserAnalytics(session.user.id);
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("Analytics error:", e);
    return NextResponse.json({ error: "Failed to load analytics" }, { status: 500 });
  }
}
