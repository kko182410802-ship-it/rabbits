import React, { useState } from 'react';
import { BunnyRunner, ACCESSORY_LABELS } from '../types';
import { BunnyFrontDisplay } from './BunnyGraphic';
import { RotateCcw, Users, Copy, Check, Trophy } from 'lucide-react';

interface PodiumModalProps {
  runners: BunnyRunner[];
  onRestartSame: () => void;
  onEditParticipants: () => void;
}

export const PodiumModal: React.FC<PodiumModalProps> = ({
  runners,
  onRestartSame,
  onEditParticipants,
}) => {
  const [copied, setCopied] = useState(false);

  // Sort runners by finishRank (1, 2, 3...)
  const rankedRunners = [...runners].sort((a, b) => {
    if (a.finishRank && b.finishRank) return a.finishRank - b.finishRank;
    if (a.finishRank) return -1;
    if (b.finishRank) return 1;
    return b.x - a.x;
  });

  const firstPlace = rankedRunners[0];
  const secondPlace = rankedRunners[1];
  const thirdPlace = rankedRunners[2];

  const firstTime = firstPlace?.finishTime || 0;

  const handleCopyResults = () => {
    const lines = [
      '🐰✨ [토끼 달리기 대회 최종 결과] ✨🐰',
      '──────────────────────────',
      ...rankedRunners.map((r, i) => {
        const medal = i === 0 ? '🥇 1등' : i === 1 ? '🥈 2등' : i === 2 ? '🥉 3등' : `${i + 1}등`;
        const timeSec = r.finishTime ? `${(r.finishTime / 1000).toFixed(2)}초` : '-';
        return `${medal} : ${r.name} (${ACCESSORY_LABELS[r.theme.accessory]}) - ${timeSec}`;
      }),
      '──────────────────────────',
      '축하합니다! 모두 수고했어요 🥕🎉',
    ];

    navigator.clipboard.writeText(lines.join('\n')).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Title Banner */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100/90 border border-amber-300 text-amber-900 text-sm font-extrabold shadow-sm">
          <Trophy className="w-4 h-4 text-amber-600" />
          레이스 종료! 모든 토끼 도착 완료
        </div>
        <h2 className="text-3xl md:text-5xl font-black text-slate-800 tracking-tight font-display">
          경주 완료! 🎉
        </h2>
        <p className="text-slate-600 text-sm md:text-base font-medium">
          최종 순위를 확인하고 친구들과 함께 축하해 주세요!
        </p>
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      <div className="bg-gradient-to-b from-sky-50 via-white to-amber-50 rounded-3xl p-6 md:p-8 border-2 border-amber-200/80 shadow-lg">
        <div className="flex items-end justify-center gap-3 md:gap-8 max-w-2xl mx-auto pt-4 pb-2">
          {/* 2nd Place Podium (Left) */}
          {secondPlace && (
            <div className="flex-1 flex flex-col items-center">
              <div className="mb-2">
                <BunnyFrontDisplay
                  theme={secondPlace.theme}
                  name={secondPlace.name}
                  size={95}
                  medal="silver"
                  isDancing={true}
                />
              </div>
              <div className="text-center mb-2">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                  🥈 2등 (은메달)
                </span>
                <p className="text-base md:text-lg font-black text-slate-800 truncate max-w-[120px]">
                  {secondPlace.name}
                </p>
                <p className="text-xs font-mono text-slate-500">
                  {secondPlace.finishTime ? `${(secondPlace.finishTime / 1000).toFixed(2)}초` : ''}
                </p>
              </div>
              {/* Podium Step */}
              <div className="w-full h-24 md:h-28 bg-gradient-to-t from-slate-300 to-slate-200 rounded-t-2xl border-2 border-b-0 border-slate-400 flex flex-col items-center justify-center shadow-md">
                <span className="text-2xl md:text-3xl font-black text-slate-700">2</span>
                <span className="text-[11px] font-bold text-slate-600">SILVER</span>
              </div>
            </div>
          )}

          {/* 1st Place Podium (Center - Highest) */}
          {firstPlace && (
            <div className="flex-1 flex flex-col items-center -translate-y-4">
              <div className="relative mb-2">
                {/* Crown glow */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl animate-bounce">
                  👑
                </div>
                <BunnyFrontDisplay
                  theme={firstPlace.theme}
                  name={firstPlace.name}
                  size={120}
                  medal="gold"
                  isDancing={true}
                />
              </div>
              <div className="text-center mb-2">
                <span className="inline-block bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-xs mb-1">
                  🥇 1등 (챔피언)
                </span>
                <p className="text-lg md:text-2xl font-black text-amber-950 truncate max-w-[140px]">
                  {firstPlace.name}
                </p>
                <p className="text-xs font-mono font-bold text-amber-800">
                  {firstPlace.finishTime ? `${(firstPlace.finishTime / 1000).toFixed(2)}초` : ''}
                </p>
              </div>
              {/* Podium Step */}
              <div className="w-full h-32 md:h-36 bg-gradient-to-t from-amber-400 to-amber-300 rounded-t-2xl border-2 border-b-0 border-amber-500 flex flex-col items-center justify-center shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 animate-pulse pointer-events-none" />
                <span className="text-3xl md:text-4xl font-black text-amber-950">1</span>
                <span className="text-xs font-extrabold text-amber-900 tracking-wider">GOLD</span>
              </div>
            </div>
          )}

          {/* 3rd Place Podium (Right) */}
          {thirdPlace && (
            <div className="flex-1 flex flex-col items-center">
              <div className="mb-2">
                <BunnyFrontDisplay
                  theme={thirdPlace.theme}
                  name={thirdPlace.name}
                  size={90}
                  medal="bronze"
                  isDancing={true}
                />
              </div>
              <div className="text-center mb-2">
                <span className="text-xs font-black text-amber-700 uppercase tracking-wider">
                  🥉 3등 (동메달)
                </span>
                <p className="text-base md:text-lg font-black text-slate-800 truncate max-w-[120px]">
                  {thirdPlace.name}
                </p>
                <p className="text-xs font-mono text-slate-500">
                  {thirdPlace.finishTime ? `${(thirdPlace.finishTime / 1000).toFixed(2)}초` : ''}
                </p>
              </div>
              {/* Podium Step */}
              <div className="w-full h-18 md:h-20 bg-gradient-to-t from-amber-700 to-amber-600 rounded-t-2xl border-2 border-b-0 border-amber-800 flex flex-col items-center justify-center shadow-md">
                <span className="text-xl md:text-2xl font-black text-amber-100">3</span>
                <span className="text-[10px] font-bold text-amber-200">BRONZE</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* FULL RANKING TABLE */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
            <span>📋</span> 전체 순위표 (총 {rankedRunners.length}마리)
          </h3>
          <button
            onClick={handleCopyResults}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" /> 복사 완료!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" /> 결과 텍스트 복사
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-1">
          {rankedRunners.map((runner, index) => {
            const rank = index + 1;
            const diffTime =
              index > 0 && runner.finishTime && firstTime
                ? `+${((runner.finishTime - firstTime) / 1000).toFixed(2)}초`
                : '챔피언 🌟';

            return (
              <div
                key={runner.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  rank === 1
                    ? 'bg-amber-50/70 border-amber-300 shadow-xs'
                    : rank === 2
                    ? 'bg-slate-50 border-slate-200'
                    : rank === 3
                    ? 'bg-orange-50/50 border-orange-200'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Rank Badge */}
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                      rank === 1
                        ? 'bg-amber-400 text-amber-950 shadow-sm'
                        : rank === 2
                        ? 'bg-slate-300 text-slate-800'
                        : rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {rank}
                  </span>

                  {/* Bunny Preview with Name on Tummy */}
                  <div className="shrink-0">
                    <BunnyFrontDisplay
                      theme={runner.theme}
                      name={runner.name}
                      size={44}
                      isDancing={rank <= 3}
                    />
                  </div>

                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm md:text-base leading-tight">
                      {runner.name}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {ACCESSORY_LABELS[runner.theme.accessory]}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="block font-mono text-xs font-bold text-slate-700">
                    {runner.finishTime ? `${(runner.finishTime / 1000).toFixed(2)}초` : '-'}
                  </span>
                  <span className="block text-[10px] text-slate-400 font-medium">{diffTime}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ACTION BUTTONS (다시 달리기, 참가자 수정) */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 pb-6">
        <button
          onClick={onRestartSame}
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-extrabold text-base shadow-lg shadow-rose-200 flex items-center gap-2 transform active:scale-95 transition-all"
        >
          <RotateCcw className="w-5 h-5" /> 다시 달리기 🔁
        </button>

        <button
          onClick={onEditParticipants}
          className="px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-extrabold text-base border-2 border-slate-200 shadow-sm flex items-center gap-2 transform active:scale-95 transition-all"
        >
          <Users className="w-5 h-5" /> 참가자 명단 수정 👥
        </button>
      </div>
    </div>
  );
};
