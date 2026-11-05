import React, { useState } from 'react';
import { Participant, ACCESSORY_LABELS } from '../types';
import { BunnyFrontDisplay } from './BunnyGraphic';
import { UserPlus, Trash2, Sparkles, Play, AlertCircle } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface ParticipantSetupProps {
  participants: Participant[];
  onAddParticipants: (names: string[]) => void;
  onRemoveParticipant: (id: string) => void;
  onClearAll: () => void;
  onLoadPreset: () => void;
  onStartRace: () => void;
}

export const ParticipantSetup: React.FC<ParticipantSetupProps> = ({
  participants,
  onAddParticipants,
  onRemoveParticipant,
  onClearAll,
  onLoadPreset,
  onStartRace,
}) => {
  const [inputText, setInputText] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!inputText.trim()) {
      setErrorMessage('참가자 이름을 입력해 주세요.');
      return;
    }

    // Split by comma, newline, or tab
    const rawNames = inputText
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (rawNames.length === 0) {
      setErrorMessage('유효한 이름을 입력해 주세요.');
      return;
    }

    // Check existing names to prevent duplicates
    const existingNameSet = new Set(participants.map((p) => p.name.toLowerCase()));
    const duplicates: string[] = [];
    const validToAdd: string[] = [];

    rawNames.forEach((n) => {
      const lower = n.toLowerCase();
      if (existingNameSet.has(lower) || validToAdd.map((v) => v.toLowerCase()).includes(lower)) {
        duplicates.push(n);
      } else {
        validToAdd.push(n);
      }
    });

    if (duplicates.length > 0) {
      setErrorMessage(`이미 등록된 이름입니다: ${duplicates.join(', ')}`);
    }

    if (validToAdd.length > 0) {
      onAddParticipants(validToAdd);
      setInputText('');
      soundManager.playClick();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // If Enter without Shift, submit form
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Input Section Card */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-amber-100 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2">
              <span>🥕</span> 참가자 등록하기
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-0.5">
              이름을 하나씩 입력하거나, 쉼표(,) 및 줄바꿈으로 여러 명을 한 번에 추가할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onLoadPreset}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 예시 명단 불러오기
            </button>
            {participants.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> 모두 삭제
              </button>
            )}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                if (errorMessage) setErrorMessage(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder="예: 민수, 서연, 지훈, 하은 또는 줄바꿈으로 여러 명 입력"
              rows={2}
              className="w-full px-4 py-3 text-sm md:text-base rounded-2xl border-2 border-slate-200 focus:border-rose-400 focus:outline-hidden transition-all resize-none placeholder:text-slate-400 font-medium"
            />
          </div>

          {errorMessage && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs md:text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs md:text-sm shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <UserPlus className="w-4 h-4" /> 참가자 추가
            </button>
          </div>
        </form>
      </div>

      {/* Participants Preview Grid */}
      <div className="bg-[#FFFDF9] rounded-3xl p-6 md:p-8 border-2 border-amber-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg md:text-xl font-black text-slate-800 flex items-center gap-2">
              <span>🐰</span> 출전 토끼 대기실
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 font-black text-xs">
              총 {participants.length}마리
            </span>
          </div>

          {participants.length < 2 && (
            <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              최소 2마리 이상의 토끼가 필요합니다
            </span>
          )}
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-amber-200/80 bg-amber-50/30 space-y-3">
            <span className="text-4xl">🐰🧺</span>
            <p className="text-base font-extrabold text-slate-700">
              아직 등록된 토끼 선수가 없습니다!
            </p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              위 입력창에 이름을 입력하거나 '예시 명단 불러오기'를 눌러 테스트해 보세요.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4 max-h-[460px] overflow-y-auto p-1 scrollbar-thin">
            {participants.map((p, idx) => (
              <div
                key={p.id}
                className="group relative flex flex-col items-center justify-between p-3.5 rounded-2xl border-2 transition-all hover:shadow-md"
                style={{
                  backgroundColor: p.theme.furColor,
                  borderColor: p.theme.bibBorder,
                }}
              >
                {/* Delete button (Top Right) */}
                <button
                  onClick={() => {
                    onRemoveParticipant(p.id);
                    soundManager.playClick();
                  }}
                  className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 hover:bg-rose-500 hover:text-white text-slate-400 flex items-center justify-center transition-colors shadow-xs z-10"
                  title="참가자 삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>

                {/* Lane Number */}
                <div className="absolute top-2 left-2 text-[10px] font-black px-1.5 py-0.2 rounded-md bg-white/90 text-slate-700 shadow-2xs">
                  #{idx + 1}
                </div>

                {/* Front Bunny Graphic with Name on Tummy */}
                <div className="pt-2 pb-1">
                  <BunnyFrontDisplay theme={p.theme} name={p.name} size={70} />
                </div>

                {/* Name & Accessory Tag */}
                <div className="text-center w-full mt-1">
                  <h4
                    className="font-black text-sm md:text-base leading-tight truncate px-1"
                    style={{ color: p.theme.textColor }}
                  >
                    {p.name}
                  </h4>
                  <span className="text-[11px] font-bold text-slate-600/80 block mt-0.5">
                    {ACCESSORY_LABELS[p.theme.accessory]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Start Race Big Button */}
        <div className="pt-4 flex flex-col items-center gap-2">
          <button
            onClick={onStartRace}
            disabled={participants.length < 2}
            className={`w-full sm:w-auto min-w-[280px] px-8 py-4 rounded-2xl font-black text-lg md:text-xl shadow-xl flex items-center justify-center gap-3 transform transition-all ${
              participants.length >= 2
                ? 'bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-rose-200 active:scale-95 cursor-pointer animate-pulse'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
            }`}
          >
            <Play className="w-6 h-6 fill-current" />
            달리기 시작! 🏁
          </button>
          {participants.length >= 2 && (
            <span className="text-xs text-slate-500 font-medium">
              모든 토끼는 100% 동일한 확률로 공정하게 달립니다!
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
