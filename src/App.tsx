import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Participant, BunnyRunner, GameStage, generateBunnyTheme } from './types';
import { ParticipantSetup } from './components/ParticipantSetup';
import { RaceTrack } from './components/RaceTrack';
import { CountdownOverlay } from './components/CountdownOverlay';
import { PodiumModal } from './components/PodiumModal';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { soundManager } from './utils/audio';
import { Volume2, VolumeX, Sparkles, Trophy, RotateCcw } from 'lucide-react';

// Sample Default Participants
const DEFAULT_NAMES = ['민수', '서연', '지훈', '하은', '도윤', '채원'];
const PRESET_SAMPLE_NAMES = [
  '토토',
  '깡총이',
  '모찌',
  '초코',
  '별이',
  '달이',
  '뽀삐',
  '루루',
  '구름이',
  '솜이',
];

const FINISH_LINE_X = 900;
const TOTAL_TRACK_DISTANCE = 1000;

export default function App() {
  const [participants, setParticipants] = useState<Participant[]>(() => {
    // Load from localStorage if present
    try {
      const saved = localStorage.getItem('bunny_race_participants');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 2) return parsed;
      }
    } catch {
      // Ignore
    }
    return DEFAULT_NAMES.map((name, i) => ({
      id: `bunny-${Date.now()}-${i}`,
      name,
      theme: generateBunnyTheme(i),
    }));
  });

  const [gameStage, setGameStage] = useState<GameStage>('SETUP');
  const [runners, setRunners] = useState<BunnyRunner[]>([]);
  const [raceSpeed, setRaceSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Sync sound manager state
  useEffect(() => {
    soundManager.enabled = soundEnabled;
  }, [soundEnabled]);

  // Persist participants
  useEffect(() => {
    try {
      localStorage.setItem('bunny_race_participants', JSON.stringify(participants));
    } catch {
      // Ignore
    }
  }, [participants]);

  // Add multiple or single participants
  const handleAddParticipants = (names: string[]) => {
    setParticipants((prev) => {
      const nextList = [...prev];
      names.forEach((name) => {
        const index = nextList.length;
        nextList.push({
          id: `bunny-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name,
          theme: generateBunnyTheme(index),
        });
      });
      return nextList;
    });
  };

  const handleRemoveParticipant = (id: string) => {
    setParticipants((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      // Re-assign complementary themes so colors stay varied
      return filtered.map((p, i) => ({
        ...p,
        theme: generateBunnyTheme(i),
      }));
    });
  };

  const handleClearAll = () => {
    setParticipants([]);
    soundManager.playClick();
  };

  const handleLoadPreset = () => {
    const list = PRESET_SAMPLE_NAMES.map((name, i) => ({
      id: `bunny-preset-${i}-${Date.now()}`,
      name,
      theme: generateBunnyTheme(i),
    }));
    setParticipants(list);
    soundManager.playClick();
  };

  // Start the race sequence: Initialize runners -> Countdown -> Race
  const handleStartRace = () => {
    if (participants.length < 2) return;

    // Build runners array
    const initRunners: BunnyRunner[] = participants.map((p, index) => ({
      ...p,
      laneIndex: index,
      x: 0,
      hopCycle: Math.random() * Math.PI * 2,
      isAirborne: false,
      speed: 0,
      finished: false,
      finishTime: null,
      finishRank: null,
      burstType: 'normal',
      burstRemaining: 0.5 + Math.random() * 0.8,
    }));

    setRunners(initRunners);
    setGameStage('COUNTDOWN');
  };

  // Callback when countdown 3, 2, 1, 출발 completes
  const handleCountdownComplete = () => {
    setGameStage('RACING');
  };

  // Re-run the race with the exact same participants (fair fresh random seed!)
  const handleRestartSame = () => {
    handleStartRace();
  };

  // Return to setup lobby
  const handleEditParticipants = () => {
    setGameStage('SETUP');
    soundManager.playClick();
  };

  // Main Race Simulation Loop (Fair Stochastic Mechanics)
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const raceStartTimestampRef = useRef<number>(0);
  const nextRankRef = useRef<number>(1);

  const updateRace = useCallback(
    (timestamp: number) => {
      if (gameStage !== 'RACING') return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
        raceStartTimestampRef.current = timestamp;
        nextRankRef.current = 1;
      }

      // Elapsed time since last frame in seconds
      const dt = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      setRunners((currentRunners) => {
        let allDone = true;
        const nowMs = timestamp - raceStartTimestampRef.current;

        // Find average progress to maintain nail-biting close race
        const nonFinished = currentRunners.filter((r) => !r.finished);
        const avgX =
          nonFinished.length > 0
            ? nonFinished.reduce((sum, r) => sum + r.x, 0) / nonFinished.length
            : FINISH_LINE_X;

        const updated: BunnyRunner[] = currentRunners.map((runner): BunnyRunner => {
          if (runner.finished) {
            // Finished bunny gentle victory hop
            const newHop = runner.hopCycle + 4 * dt;
            return {
              ...runner,
              hopCycle: newHop,
              isAirborne: Math.sin(newHop) > 0.4,
            };
          }

          allDone = false;

          let burstType: BunnyRunner['burstType'] = runner.burstType;
          let burstRemaining = runner.burstRemaining - dt;

          if (burstRemaining <= 0) {
            // Pick next random burst state (100% fair independent probabilities)
            const roll = Math.random();
            if (roll < 0.18) {
              burstType = 'spurt'; // Quick speed boost
              burstRemaining = 0.4 + Math.random() * 0.7;
            } else if (roll < 0.28) {
              burstType = 'curious'; // Small pause to look around
              burstRemaining = 0.2 + Math.random() * 0.4;
            } else {
              burstType = 'normal';
              burstRemaining = 0.6 + Math.random() * 1.0;
            }
          }

          // Base speed calculation (pixels/sec in track units)
          // Normal average speed is ~75 units/sec
          let speedFactor = 1.0;
          if (burstType === 'spurt') speedFactor = 1.65;
          if (burstType === 'curious') speedFactor = 0.45;

          // Fair stochastic noise
          const stochasticJitter = (Math.random() - 0.5) * 20;

          // Subtle rubber-band suspense pull:
          // If a bunny is trailing behind the average, slight boost
          // If ahead, slight dampening, creating realistic exciting comebacks
          const gap = avgX - runner.x;
          const suspensePull = Math.max(-10, Math.min(10, gap * 0.08));

          // In the final stretch (past 80% distance), bunnies enter final all-out sprint!
          const sprintBoost = runner.x > FINISH_LINE_X * 0.8 ? 15 + Math.random() * 20 : 0;

          const targetSpeed =
            (68 * speedFactor + stochasticJitter + suspensePull + sprintBoost) * raceSpeed;
          const actualSpeed = Math.max(15, targetSpeed);

          const newX = runner.x + actualSpeed * dt;
          const newHop = runner.hopCycle + (actualSpeed * 0.14) * dt;
          const isAirborne = Math.sin(newHop) > 0.15;

          // Check if crossing the finish line
          if (newX >= FINISH_LINE_X && !runner.finished) {
            const rank = nextRankRef.current++;
            soundManager.playFinishChime();
            return {
              ...runner,
              x: FINISH_LINE_X + 15 + Math.random() * 30,
              finished: true,
              finishTime: nowMs,
              finishRank: rank,
              speed: 0,
              isAirborne: false,
              burstType: 'normal',
              burstRemaining: 0,
            };
          }

          return {
            ...runner,
            x: newX,
            speed: actualSpeed,
            hopCycle: newHop,
            isAirborne,
            burstType,
            burstRemaining,
          };
        });

        if (allDone) {
          // Transition to FINISHED stage after a short celebration pause
          setTimeout(() => {
            setGameStage('FINISHED');
            soundManager.playFanfare();
          }, 1200);
        }

        return updated;
      });

      animFrameRef.current = requestAnimationFrame(updateRace);
    },
    [gameStage, raceSpeed]
  );

  useEffect(() => {
    if (gameStage === 'RACING') {
      lastTimeRef.current = 0;
      animFrameRef.current = requestAnimationFrame(updateRace);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameStage, updateRace]);

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 flex flex-col justify-between selection:bg-rose-200 selection:text-rose-900">
      {/* Top Bar Header per Design Guidelines (Single-row, 3-zone contract) */}
      <header className="sticky top-0 z-30 bg-[#FFFDF7]/90 backdrop-blur-md border-b border-amber-100/80 px-4 md:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-2xl animate-bounce">🐰</span>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-800 font-display whitespace-nowrap">
            토끼 달리기 대회
          </h1>
        </div>

        {/* Zone 2: Navigation / Status Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <span className="text-xs text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            공정한 랜덤 시뮬레이션 레이스
          </span>
          <span className="text-xs text-slate-500">
            {gameStage === 'SETUP'
              ? `참가자 준비 중 (${participants.length}마리)`
              : gameStage === 'COUNTDOWN'
              ? '출발 카운트다운'
              : gameStage === 'RACING'
              ? '신나는 경주 진행 중 🏁'
              : '시상대 및 결과 발표 🏆'}
          </span>
        </nav>

        {/* Zone 3: Primary Action & Sound Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-900 transition-colors"
            title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
            aria-label="효과음 토글"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {gameStage === 'SETUP' ? (
            <button
              onClick={handleStartRace}
              disabled={participants.length < 2}
              className={`px-4 py-2 text-xs md:text-sm font-black rounded-xl whitespace-nowrap transition-all ${
                participants.length >= 2
                  ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm shadow-rose-200 cursor-pointer active:scale-95'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              달리기 시작 🏁
            </button>
          ) : (
            <button
              onClick={handleEditParticipants}
              className="px-3.5 py-2 text-xs md:text-sm font-extrabold rounded-xl bg-slate-900 hover:bg-slate-800 text-white shadow-sm whitespace-nowrap flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 대기실로 이동
            </button>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col justify-center">
        {/* Countdown Overlay (3, 2, 1, 출발!) */}
        {gameStage === 'COUNTDOWN' && (
          <CountdownOverlay onComplete={handleCountdownComplete} />
        )}

        {/* Confetti Canvas for Victory Podium */}
        {gameStage === 'FINISHED' && <ConfettiCanvas active={true} />}

        {/* STAGE 1: SETUP LOBBY */}
        {gameStage === 'SETUP' && (
          <ParticipantSetup
            participants={participants}
            onAddParticipants={handleAddParticipants}
            onRemoveParticipant={handleRemoveParticipant}
            onClearAll={handleClearAll}
            onLoadPreset={handleLoadPreset}
            onStartRace={handleStartRace}
          />
        )}

        {/* STAGE 2: COUNTDOWN & ACTIVE RACE */}
        {(gameStage === 'COUNTDOWN' || gameStage === 'RACING') && (
          <div className="space-y-4 animate-fade-in">
            {/* Live Race Status Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥕</span>
                <h2 className="text-lg md:text-xl font-black text-slate-800">
                  신나는 토끼 달리기!
                </h2>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200 animate-pulse">
                  {gameStage === 'COUNTDOWN' ? '출발 준비 중...' : '생중계 진행 중 🏁'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleEditParticipants}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  경주 취소 및 재설정
                </button>
              </div>
            </div>

            {/* The Race Track */}
            <RaceTrack
              runners={runners}
              totalDistance={TOTAL_TRACK_DISTANCE}
              finishLineX={FINISH_LINE_X}
              isRacing={gameStage === 'RACING'}
              raceSpeed={raceSpeed}
              onToggleSpeed={() => setRaceSpeed(raceSpeed === 1 ? 1.5 : 1)}
            />
          </div>
        )}

        {/* STAGE 3: GRAND PODIUM & RANKINGS */}
        {gameStage === 'FINISHED' && (
          <PodiumModal
            runners={runners}
            onRestartSame={handleRestartSame}
            onEditParticipants={handleEditParticipants}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 border-t border-amber-100 bg-[#FFFDF7] py-4 text-center text-xs text-slate-500 font-medium">
        <p>토끼 달리기 대회 🐰 · 학교와 친구들을 위한 공정한 레이스 게임</p>
      </footer>
    </div>
  );
}
