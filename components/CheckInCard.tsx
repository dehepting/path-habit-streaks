'use client';

import { useEffect, useMemo, useState } from 'react';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useAccount } from 'wagmi';
import Link from 'next/link';

type Streak = { fid:number; current:number; best:number; count:number; lastISO:string|null };

const HABIT_OPTIONS = [
  { name: 'Exercise', icon: '💪', color: 'blue' },
  { name: 'Read', icon: '📚', color: 'green' },
  { name: 'Meditate', icon: '🧘', color: 'purple' },
  { name: 'Drink Water', icon: '💧', color: 'cyan' },
  { name: 'Sleep Early', icon: '😴', color: 'indigo' },
  { name: 'Journal', icon: '✍️', color: 'yellow' },
  { name: 'Learn', icon: '🧠', color: 'pink' },
  { name: 'Walk', icon: '🚶', color: 'emerald' },
];

export default function CheckInCard() {
  const { context } = useMiniKit() as any;
  const { address, isConnected } = useAccount();
  const [fid, setFid] = useState<number | undefined>();
  const [streak, setStreak] = useState<Streak | null>(null);
  const [loading, setLoading] = useState(false);
  const [justChecked, setJustChecked] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState('Exercise');
  const [showHabitPicker, setShowHabitPicker] = useState(false);

  // Allow local testing in a normal browser: ?fid=123 will override
  useEffect(() => {
    const urlFid = Number(new URL(window.location.href).searchParams.get('fid') ?? 0);
    if (urlFid) {
      setFid(urlFid);
      return;
    }
    if (context?.user?.fid) {
      setFid(context.user.fid);
    } else if (address && isConnected) {
      // Use a hash of the address as a pseudo-FID for wallet-only users
      const addressHash = address.slice(2).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0);
      setFid(Math.abs(addressHash));
    }
  }, [context?.user?.fid, address, isConnected]);

  const canUse = !!fid;
  const userType = context?.user?.fid ? 'farcaster' : (isConnected ? 'wallet' : 'none');

  const load = async (f: number) => {
    const r = await fetch(`/api/streak?fid=${f}&habit=${encodeURIComponent(selectedHabit)}`);
    const j = await r.json();
    setStreak(j?.streak ?? null);
  };

  useEffect(() => { if (fid) load(fid); }, [fid, selectedHabit]);

  const onCheckIn = async () => {
    if (!fid) return;
    setLoading(true);
    try {
      const r = await fetch('/api/checkin', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ fid, habit: selectedHabit })
      });
      const j = await r.json();
      if (j?.streak) { setStreak(j.streak); setJustChecked(true); }
    } finally {
      setLoading(false);
    }
  };

  const headline = useMemo(() => {
    if (!streak) return 'Welcome back 👋';
    if (streak.current === 1) return 'Day 1 — let’s go 🔥';
    if (streak.current < 5) return `Streak ${streak.current} — momentum building`;
    if (streak.current < 15) return `Streak ${streak.current} — consistency showing`;
    return `Streak ${streak.current} — elite discipline`;
  }, [streak]);

  return (
    <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 pb-4">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">Daily Habit</h2>
        <p className="text-sm text-gray-500">Keep your streak alive</p>
      </div>

      {/* Habit Selection */}
      <div className="px-6 pb-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg">{HABIT_OPTIONS.find(h => h.name === selectedHabit)?.icon || '💪'}</span>
            </div>
            <span className="font-medium text-gray-900">{selectedHabit}</span>
          </div>
          <button
            onClick={() => setShowHabitPicker(true)}
            className="text-blue-600 text-sm font-medium hover:text-blue-700"
          >
            Change
          </button>
        </div>
      </div>

      {!canUse && (
        <div className="mx-6 mb-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <p className="text-sm text-yellow-800 mb-3 font-medium">
            Connect your wallet to start tracking
          </p>
          <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
            Connect Wallet
          </button>
        </div>
      )}

      {canUse && (
        <>
          {/* Current Streak Display */}
          <div className="px-6 pb-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900 mb-1">{streak?.current ?? 0}</div>
              <div className="text-lg text-gray-600 mb-4">day streak</div>
              {(streak?.current ?? 0) > 0 && (
                <div className="flex justify-center space-x-1 mb-4">
                  {Array.from({ length: Math.min(streak?.current ?? 0, 7) }, (_, i) => (
                    <div key={i} className="w-2 h-2 bg-green-500 rounded-full"></div>
                  ))}
                  {(streak?.current ?? 0) > 7 && <span className="text-green-500 text-sm ml-1">+{(streak?.current ?? 0) - 7}</span>}
                </div>
              )}
            </div>

            {/* Stats Row */}
            <div className="flex justify-around pt-4 border-t border-gray-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{streak?.best ?? 0}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Best</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{streak?.count ?? 0}</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">100%</div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">This Week</div>
              </div>
            </div>
          </div>

          {/* Check-in Button */}
          <div className="px-6 pb-6">
            <button
              onClick={onCheckIn}
              disabled={loading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 active:scale-[.98] shadow-md hover:shadow-lg'
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Checking in...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="text-xl mr-2">✓</span>
                  Mark Complete
                </span>
              )}
            </button>
          </div>

          {/* Milestone Celebration */}
          {justChecked && (streak?.current === 1 || streak?.current === 7 || streak?.current === 30) && (
            <div className="mx-6 mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="text-center">
                <div className="text-2xl mb-2">🎉</div>
                <p className="text-green-800 font-semibold mb-3">
                  {streak?.current === 1 && "Great start!"}
                  {streak?.current === 7 && "One week strong!"}
                  {streak?.current === 30 && "30 days! Amazing!"}
                </p>
                <a
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  href={`https://warpcast.com/~/compose?text=I%20just%20hit%20a%20${streak?.current}-day%20streak%20with%20PATH%20Habit%20Streaks%20%F0%9F%94%A5`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share Achievement
                </a>
              </div>
            </div>
          )}
        </>
      )}
      {/* Habit Picker Modal */}
      {showHabitPicker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-96 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900">Choose Your Habit</h3>
            </div>
            <div className="p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                {HABIT_OPTIONS.map((habit) => (
                  <button
                    key={habit.name}
                    onClick={() => {
                      setSelectedHabit(habit.name);
                      setShowHabitPicker(false);
                    }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedHabit === habit.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="text-2xl mb-2">{habit.icon}</div>
                    <div className="text-sm font-medium text-gray-900">{habit.name}</div>
                  </button>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowHabitPicker(false)}
                className="w-full py-2 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}