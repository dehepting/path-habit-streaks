import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

export async function GET(req: NextRequest) {
  const fid = Number(new URL(req.url).searchParams.get('fid') ?? 0);
  const habit = new URL(req.url).searchParams.get('habit') ?? 'Exercise';
  if (!fid) return NextResponse.json({ error: 'Missing fid' }, { status: 400 });

  const streak = await redis.get(`streak:${fid}:${habit}`);
  return NextResponse.json({ ok: true, streak: streak ?? null });
}