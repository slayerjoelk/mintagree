import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { checkReceiptLimit } from "@/lib/plans";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limitStatus = await checkReceiptLimit(session.user.id);
  return NextResponse.json({ limitStatus });
}
