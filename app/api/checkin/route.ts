import { NextRequest, NextResponse } from 'next/server';
import { redis } from '@/lib/redis';

type Streak = {
  fid: number;
  current: number;
  best: number;
  count: number;
  lastISO: string | null;
};

const today = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD
const yesterdayISO = () => {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
};

export async function POST(req: NextRequest) {
  try {
    const { fid, habit = 'Exercise' } = await req.json() as { fid?: number, habit?: string };
    if (!fid) return NextResponse.json({ error: 'Missing fid' }, { status: 400 });

    const key = `streak:${fid}:${habit}`;
    const raw = await redis.get<Streak>(key);
    const t = today();

    if (!raw) {
      const base: Streak = { fid, current: 1, best: 1, count: 1, lastISO: t };
      await redis.set(key, base);
      return NextResponse.json({ ok: true, streak: base });
    }

    if (raw.lastISO === t) {
      return NextResponse.json({ ok: true, streak: raw, alreadyToday: true });
    }

    const y = yesterdayISO();
    let current = 1;
    if (raw.lastISO === y) current = raw.current + 1;

    const best = Math.max(raw.best, current);
    const count = raw.count + 1;
    const streak: Streak = { fid, current, best, count, lastISO: t };

    await redis.set(key, streak);
    return NextResponse.json({ ok: true, streak });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as Error)?.message ?? 'error' }, { status: 500 });
  }
}