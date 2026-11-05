import React, { useEffect, useRef, useState } from 'react';
import { BunnyRunner } from '../types';
import { BunnySideRunner } from './BunnyGraphic';
import { Eye, Focus } from 'lucide-react';

interface RaceTrackProps {
  runners: BunnyRunner[];
  totalDistance: number;
  finishLineX: number;
  isRacing: boolean;
  raceSpeed: number;
  onToggleSpeed: () => void;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({
  runners,
  totalDistance,
  finishLineX,
  isRacing,
  raceSpeed,
  onToggleSpeed,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [cameraMode, setCameraMode] = useState<'follow' | 'free'>('follow');

  // Track dimensions
  const trackPixelWidth = 2400; // Total track horizontal length in px
  const laneHeight = 84; // px per lane

  // Find leader position for camera tracking
  const maxRunnerX = Math.max(...runners.map((r) => r.x), 0);

  // Auto scroll camera to follow the race leaders
  useEffect(() => {
    if (cameraMode !== 'follow' || !isRacing) return;
    const container = containerRef.current;
    if (!container) return;

    // Leader position in container pixels
    const leaderPx = (maxRunnerX / totalDistance) * trackPixelWidth;
    const viewportWidth = container.clientWidth;
    // Keep leader at ~60% of viewport width
    const targetScroll = Math.max(0, leaderPx - viewportWidth * 0.6);

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth',
    });
  }, [maxRunnerX, cameraMode, isRacing, totalDistance]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border-4 border-amber-100 bg-[#FFFDF7] shadow-xl">
      {/* Track HUD & Minimap Top Bar */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50 to-sky-50 px-4 py-2.5 border-b border-amber-200/60 flex flex-wrap items-center justify-between gap-3">
        {/* Minimap: Shows all bunnies along the 0-100% course */}
        <div className="flex-1 min-w-[280px]">
          <div className="flex items-center justify-between text-xs font-bold text-amber-900/80 mb-1 px-1">
            <span className="flex items-center gap-1">🚩 출발 (0%)</span>
            <span className="text-[11px] font-medium text-slate-500">
              도착 완료: {runners.filter((r) => r.finished).length} / {runners.length}
            </span>
            <span className="flex items-center gap-1 text-rose-600 font-extrabold">🏁 도착 (100%)</span>
          </div>
          <div className="relative h-4 bg-white/90 rounded-full border border-amber-300 shadow-inner overflow-hidden">
            {/* 25%, 50%, 75% tick marks */}
            <div className="absolute top-0 bottom-0 left-[25%] w-[1px] bg-amber-200" />
            <div className="absolute top-0 bottom-0 left-[50%] w-[1px] bg-amber-200" />
            <div className="absolute top-0 bottom-0 left-[75%] w-[1px] bg-amber-200" />
            <div
              className="absolute top-0 bottom-0 left-[90%] w-1.5 bg-rose-400 opacity-80"
              title="도착선"
            />

            {/* Bunny Mini Indicators */}
            {runners.map((runner) => {
              const pct = Math.min(100, Math.max(0, (runner.x / totalDistance) * 100));
              return (
                <div
                  key={runner.id}
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-100 z-10"
                  style={{ left: `${pct}%` }}
                  title={`${runner.name} (${runner.finished ? '도착!' : Math.round(pct) + '%'})`}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white shadow-sm flex items-center justify-center text-[8px] font-black"
                    style={{
                      backgroundColor: runner.theme.furColor,
                      borderColor: runner.theme.bibBorder,
                      color: runner.theme.textColor,
                    }}
                  >
                    🐰
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Camera Controls & Speed Control */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setCameraMode(cameraMode === 'follow' ? 'free' : 'follow')}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl border flex items-center gap-1.5 transition-all ${
              cameraMode === 'follow'
                ? 'bg-rose-500 text-white border-rose-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="카메라 모드 변경"
          >
            {cameraMode === 'follow' ? (
              <>
                <Focus className="w-3.5 h-3.5" /> 1위 추적 카메라
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" /> 자유 시점
              </>
            )}
          </button>

          <button
            onClick={onToggleSpeed}
            className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 transition-all"
            title="달리기 속도 조절"
          >
            속도: {raceSpeed === 1 ? '보통 (1x)' : '빠름 (1.5x) ⚡️'}
          </button>
        </div>
      </div>

      {/* Main Race Arena with Horizontal Scrolling */}
      <div
        ref={containerRef}
        className="relative overflow-x-auto overflow-y-hidden max-h-[72vh] select-none scrollbar-thin scrollbar-thumb-amber-200 scrollbar-track-transparent"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        <div
          className="relative"
          style={{
            width: `${trackPixelWidth}px`,
            height: `${runners.length * laneHeight + 60}px`,
          }}
        >
          {/* Top Meadow / Sky Border with Flowers and Clouds */}
          <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-sky-100 to-emerald-100 border-b border-emerald-300 flex items-center px-4 overflow-hidden">
            {/* Floating Clouds */}
            <div className="flex gap-40 text-lg opacity-80 animate-pulse">
              <span>☁️</span>
              <span>🌸</span>
              <span>☁️</span>
              <span>🌼</span>
              <span>☁️</span>
              <span>🥕</span>
              <span>☁️</span>
              <span>🌸</span>
              <span>☁️</span>
              <span>🌼</span>
              <span>☁️</span>
            </div>
          </div>

          {/* Running Lanes Container */}
          <div className="absolute top-10 left-0 right-0 bottom-6 bg-[#FEF9E7]">
            {/* Grass Edges */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#10B981_1px,transparent_1px)] [background-size:16px_16px]" />

            {/* Individual Lanes */}
            {runners.map((runner, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={runner.id}
                  className={`relative flex items-center border-b border-amber-200/70 transition-colors ${
                    isEven ? 'bg-[#FFFDF4]' : 'bg-[#FEF6DD]'
                  }`}
                  style={{ height: `${laneHeight}px` }}
                >
                  {/* Lane Number Badge (Pinned on Left) */}
                  <div className="sticky left-0 z-20 flex items-center gap-1.5 pl-3 pr-2 py-1 bg-white/95 backdrop-blur-xs rounded-r-xl border border-l-0 border-amber-200 shadow-sm shrink-0">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shadow-xs"
                      style={{
                        backgroundColor: runner.theme.furColor,
                        borderColor: runner.theme.bibBorder,
                        borderWidth: 1.5,
                        color: runner.theme.textColor,
                      }}
                    >
                      {index + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 max-w-[70px] truncate">
                      {runner.name}
                    </span>
                  </div>

                  {/* Lane dashed center guide line */}
                  <div className="absolute left-28 right-0 top-1/2 -translate-y-1/2 border-b border-dashed border-amber-300/80 pointer-events-none" />
                </div>
              );
            })}

            {/* START LINE (출발선) at X = 120px */}
            <div
              className="absolute top-0 bottom-0 z-10 flex flex-col items-center pointer-events-none"
              style={{ left: '120px' }}
            >
              <div className="bg-rose-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-md -translate-y-2 whitespace-nowrap">
                출발선 START
              </div>
              <div className="flex-1 w-3 bg-repeating-linear-gradient-45 from-rose-500 to-white [background-size:12px_12px] opacity-90 shadow-sm" />
            </div>

            {/* MILESTONE MARKERS: 25%, 50%, 75% */}
            {[0.25, 0.5, 0.75].map((ratio) => {
              const xPos = 120 + ratio * (trackPixelWidth * 0.85 - 120);
              return (
                <div
                  key={ratio}
                  className="absolute top-0 bottom-0 pointer-events-none flex flex-col items-center opacity-60"
                  style={{ left: `${xPos}px` }}
                >
                  <div className="bg-amber-200 text-amber-900 text-[10px] font-bold px-1.5 py-0.5 rounded-md -translate-y-1">
                    {ratio * 100}%
                  </div>
                  <div className="flex-1 w-[2px] border-r-2 border-dotted border-amber-400" />
                </div>
              );
            })}

            {/* FINISH LINE (도착선) at 85% of track */}
            <div
              className="absolute top-0 bottom-0 z-10 flex flex-col items-center pointer-events-none"
              style={{ left: `${trackPixelWidth * 0.85}px` }}
            >
              {/* Grand Finish Banner Arch */}
              <div className="bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 text-white text-xs font-black px-4 py-1 rounded-full shadow-lg -translate-y-3 whitespace-nowrap animate-bounce flex items-center gap-1">
                <span>🏁</span> 도착선 FINISH <span>🎉</span>
              </div>
              {/* Checkered Racing Ribbon */}
              <div className="flex-1 w-5 bg-[repeating-conic-gradient(#000_0%_25%,#fff_0%_50%)] [background-size:12px_12px] shadow-md border-x border-slate-700" />
            </div>

            {/* Victory Celebration Zone past the finish line */}
            <div
              className="absolute top-0 bottom-0 right-0 pointer-events-none bg-gradient-to-r from-emerald-50/60 to-emerald-100/90 border-l border-emerald-300 flex items-center justify-around text-2xl opacity-60"
              style={{ left: `${trackPixelWidth * 0.85 + 24}px` }}
            >
              <span>🌸</span>
              <span>🥕</span>
              <span>⭐</span>
              <span>🎉</span>
              <span>🌼</span>
              <span>🎈</span>
            </div>

            {/* RUNNING BUNNIES! */}
            {runners.map((runner, index) => {
              // Convert runner.x (0 to totalDistance) to horizontal pixel position
              // 0 corresponds to 120px (Start line)
              // totalDistance corresponds to trackPixelWidth * 0.95
              const startPx = 80;
              const finishPx = trackPixelWidth * 0.85;
              const courseLength = finishPx - startPx;
              const runnerPixelX = startPx + (runner.x / finishLineX) * courseLength;
              const topY = index * laneHeight + (laneHeight - 72) / 2;

              return (
                <div
                  key={runner.id}
                  className="absolute z-20 pointer-events-none transition-transform duration-75 will-change-transform"
                  style={{
                    transform: `translate3d(${runnerPixelX}px, ${topY}px, 0)`,
                  }}
                >
                  {/* Status Bubble over Bunny (Spurt / Finished / Curious) */}
                  {runner.finished ? (
                    <div className="absolute -top-4 left-6 -translate-x-1/2 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm animate-bounce whitespace-nowrap z-30">
                      도착! 🏆 {runner.finishRank}등
                    </div>
                  ) : runner.burstType === 'spurt' ? (
                    <div className="absolute -top-4 left-6 -translate-x-1/2 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-sm whitespace-nowrap animate-pulse">
                      스퍼트! ⚡️
                    </div>
                  ) : runner.burstType === 'curious' ? (
                    <div className="absolute -top-4 left-6 -translate-x-1/2 bg-sky-500 text-white text-[9px] font-black px-1.5 py-0.2 rounded-md shadow-sm whitespace-nowrap">
                      두리번 👀
                    </div>
                  ) : null}

                  {/* Dust Puff / Sparkles behind feet when running fast */}
                  {isRacing && !runner.finished && runner.isAirborne && (
                    <div className="absolute bottom-1 -left-2 text-[10px] opacity-75 animate-ping">
                      💨
                    </div>
                  )}

                  {/* The Beautiful Bunny Runner Graphic */}
                  <BunnySideRunner
                    theme={runner.theme}
                    name={runner.name}
                    isAirborne={runner.isAirborne}
                    hopPhase={runner.hopCycle / (Math.PI * 2)}
                    isFinished={runner.finished}
                    burstType={runner.burstType}
                    scale={1}
                  />
                </div>
              );
            })}
          </div>

          {/* Bottom Meadow Border */}
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-emerald-200 to-emerald-100 border-t border-emerald-300 flex items-center justify-around px-4 overflow-hidden">
            <span className="text-xs">🌱</span>
            <span className="text-xs">🌼</span>
            <span className="text-xs">🌱</span>
            <span className="text-xs">🌸</span>
            <span className="text-xs">🌱</span>
            <span className="text-xs">🌼</span>
            <span className="text-xs">🌱</span>
            <span className="text-xs">🌸</span>
            <span className="text-xs">🌱</span>
          </div>
        </div>
      </div>
    </div>
  );
};
