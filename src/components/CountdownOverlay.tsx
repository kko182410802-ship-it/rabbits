import React, { useEffect, useState } from 'react';
import { soundManager } from '../utils/audio';

interface CountdownOverlayProps {
  onComplete: () => void;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({ onComplete }) => {
  const [count, setCount] = useState<number | 'GO'>(3);

  useEffect(() => {
    // 3
    soundManager.playCountdown(3);

    const t2 = setTimeout(() => {
      setCount(2);
      soundManager.playCountdown(2);
    }, 1000);

    const t1 = setTimeout(() => {
      setCount(1);
      soundManager.playCountdown(1);
    }, 2000);

    const tGo = setTimeout(() => {
      setCount('GO');
      soundManager.playStartWhistle();
    }, 3000);

    const tEnd = setTimeout(() => {
      onComplete();
    }, 3800);

    return () => {
      clearTimeout(t2);
      clearTimeout(t1);
      clearTimeout(tGo);
      clearTimeout(tEnd);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-xs pointer-events-none select-none">
      <div className="text-center transform animate-in zoom-in-75 duration-300">
        {count === 'GO' ? (
          <div className="space-y-2">
            <span className="text-6xl md:text-8xl font-black text-rose-500 drop-shadow-[0_8px_16px_rgba(244,63,94,0.4)] tracking-wider block font-display animate-bounce">
              출발! 🏁
            </span>
            <span className="text-xl md:text-2xl font-black text-white bg-rose-600/90 px-6 py-1.5 rounded-full shadow-lg inline-block">
              달려라 토끼들! 🐰💨
            </span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-32 h-32 md:w-44 md:h-44 mx-auto rounded-full bg-white/95 border-8 border-amber-300 flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-7xl md:text-9xl font-black text-amber-500 font-display">
                {count}
              </span>
            </div>
            <p className="text-lg md:text-xl font-black text-white drop-shadow-md">
              준비하세요...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
