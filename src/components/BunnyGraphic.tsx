import React from 'react';
import { BunnyTheme } from '../types';

interface BunnySideRunnerProps {
  theme: BunnyTheme;
  name: string;
  isAirborne?: boolean;
  hopPhase?: number; // 0 to 1
  isFinished?: boolean;
  burstType?: 'normal' | 'spurt' | 'curious';
  scale?: number;
}

export const BunnySideRunner: React.FC<BunnySideRunnerProps> = ({
  theme,
  name,
  isAirborne = false,
  hopPhase = 0,
  isFinished = false,
  burstType = 'normal',
  scale = 1,
}) => {
  // Calculate leg & ear rotation based on hopPhase
  const legCycle = Math.sin(hopPhase * Math.PI * 2);
  const earTilt = isFinished ? 5 : burstType === 'spurt' ? 24 : 12 + legCycle * 8;
  const frontPawRot = isAirborne ? -25 : legCycle * 30;
  const backPawRot = isAirborne ? 35 : -legCycle * 30;
  const tailBounce = Math.sin(hopPhase * Math.PI * 2) * 4;

  // Shorten name if too long or adjust font size
  const displayName = name.length > 5 ? name.slice(0, 4) + '..' : name;
  const fontSize = displayName.length <= 2 ? 10 : displayName.length <= 3 ? 9 : 8;

  return (
    <div
      className="relative select-none pointer-events-none"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'bottom center',
        filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))',
      }}
    >
      <svg
        viewBox="0 0 100 80"
        className="w-[90px] h-[72px] overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Shadow under bunny on track */}
        <ellipse
          cx="45"
          cy="74"
          rx={isAirborne ? 18 : 24}
          ry={isAirborne ? 3 : 5}
          fill="rgba(0,0,0,0.12)"
          className="transition-all duration-100"
        />

        {/* Group with hop bounce and lean */}
        <g
          transform={`translate(0, ${isAirborne ? -10 : 0}) rotate(${
            isFinished ? (Math.sin(hopPhase * Math.PI * 4) * 6) : burstType === 'spurt' ? 6 : legCycle * 3
          }, 45, 60)`}
        >
          {/* Fluffy Tail */}
          <circle
            cx="14"
            cy={50 + tailBounce}
            r="8"
            fill={theme.furHighlight}
            stroke={theme.bibBorder}
            strokeWidth="1.2"
          />
          <circle cx="13" cy={49 + tailBounce} r="5" fill="#FFFFFF" />

          {/* Back Paws (Left) */}
          <g transform={`rotate(${backPawRot}, 30, 64)`}>
            <ellipse
              cx="30"
              cy="65"
              rx="9"
              ry="5"
              fill={theme.furColor}
              stroke={theme.bibBorder}
              strokeWidth="1"
            />
            {/* Paw pads */}
            <circle cx="26" cy="65" r="1.5" fill={theme.earInnerColor} />
            <circle cx="31" cy="65" r="1.5" fill={theme.earInnerColor} />
          </g>

          {/* Plump Body */}
          <path
            d="M 22 52 C 20 38, 34 32, 54 34 C 68 36, 75 48, 70 60 C 65 70, 32 72, 22 52 Z"
            fill={theme.furColor}
            stroke={theme.bibBorder}
            strokeWidth="1.5"
          />

          {/* Front Paws (Far) */}
          <g transform={`rotate(${-frontPawRot}, 58, 62)`}>
            <ellipse
              cx="58"
              cy="63"
              rx="7"
              ry="4"
              fill={theme.furColor}
              stroke={theme.bibBorder}
              strokeWidth="1"
            />
          </g>

          {/* Tummy Name Bib (Prominent, High-Contrast Participant Name Badge) */}
          <g transform="translate(42, 53)">
            {/* Oval Bib Background */}
            <ellipse
              cx="0"
              cy="0"
              rx="18"
              ry="11"
              fill={theme.bibBg}
              stroke={theme.bibBorder}
              strokeWidth="1.5"
            />
            {/* Subtle inner dashed stitch */}
            <ellipse
              cx="0"
              cy="0"
              rx="16"
              ry="9.5"
              fill="none"
              stroke={theme.accentColor}
              strokeWidth="0.8"
              strokeDasharray="2 2"
              opacity="0.6"
            />
            {/* Participant Name on Tummy */}
            <text
              x="0"
              y={fontSize === 10 ? 3.5 : 3}
              textAnchor="middle"
              fill={theme.textColor}
              fontWeight="900"
              fontSize={fontSize}
              fontFamily="'Jua', 'Noto Sans KR', sans-serif"
              letterSpacing="-0.3px"
            >
              {displayName}
            </text>
          </g>

          {/* Cute Bunny Ears (Pointing Back / Flapping with wind) */}
          {/* Back Ear */}
          <g transform={`rotate(${-earTilt - 8}, 52, 25)`}>
            <path
              d="M 52 25 C 44 14, 38 -2, 46 -8 C 53 -4, 58 12, 56 25 Z"
              fill={theme.furColor}
              stroke={theme.bibBorder}
              strokeWidth="1.2"
            />
            <path
              d="M 51 22 C 46 13, 42 0, 47 -4 C 51 -1, 54 11, 53 22 Z"
              fill={theme.earInnerColor}
              opacity="0.85"
            />
          </g>

          {/* Front Ear */}
          <g transform={`rotate(${-earTilt}, 58, 25)`}>
            <path
              d="M 58 25 C 50 12, 45 -4, 54 -10 C 62 -6, 65 10, 62 25 Z"
              fill={theme.furColor}
              stroke={theme.bibBorder}
              strokeWidth="1.4"
            />
            <path
              d="M 57 21 C 52 11, 48 -2, 54 -6 C 59 -2, 61 9, 59 21 Z"
              fill={theme.earInnerColor}
              opacity="0.9"
            />
          </g>

          {/* Bunny Head */}
          <ellipse
            cx="64"
            cy="34"
            rx="15"
            ry="14"
            fill={theme.furColor}
            stroke={theme.bibBorder}
            strokeWidth="1.5"
          />

          {/* Rosy Cheek */}
          <ellipse cx="68" cy="40" rx="3.5" ry="2.2" fill="#FF9EAA" opacity="0.8" />

          {/* Big Sparkly Kawaii Eye */}
          <g transform="translate(68, 31)">
            {isFinished ? (
              // Happy squint eye "^"
              <path
                d="M -3 1 Q 0 -3 3 1"
                fill="none"
                stroke="#1E293B"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : burstType === 'curious' ? (
              // Curious wide round eye
              <>
                <circle cx="0" cy="0" r="3.2" fill="#1E293B" />
                <circle cx="1" cy="-1" r="1.2" fill="#FFFFFF" />
              </>
            ) : (
              // Determined sparkly running eye
              <>
                <ellipse cx="0" cy="0" rx="3.4" ry="4" fill="#1E293B" />
                <circle cx="1.2" cy="-1.4" r="1.4" fill="#FFFFFF" />
                <circle cx="-0.8" cy="1.2" r="0.7" fill="#FFFFFF" />
              </>
            )}
          </g>

          {/* Little Nose & Mouth */}
          <polygon points="76,36 79,35 77,37" fill="#F472B6" />
          <path
            d="M 76 38 Q 78 40 80 38"
            fill="none"
            stroke="#64748B"
            strokeWidth="1"
            strokeLinecap="round"
          />

          {/* Tiny Whiskers */}
          <line x1="72" y1="37" x2="80" y2="35" stroke="#94A3B8" strokeWidth="0.8" opacity="0.7" />
          <line x1="72" y1="39" x2="81" y2="40" stroke="#94A3B8" strokeWidth="0.8" opacity="0.7" />

          {/* Front Paws (Near) */}
          <g transform={`rotate(${frontPawRot}, 54, 60)`}>
            <ellipse
              cx="54"
              cy="62"
              rx="7.5"
              ry="4.5"
              fill={theme.furColor}
              stroke={theme.bibBorder}
              strokeWidth="1.2"
            />
            {/* Tiny paw lines */}
            <line x1="57" y1="60" x2="59" y2="61" stroke={theme.bibBorder} strokeWidth="0.8" />
            <line x1="57" y1="63" x2="59" y2="63" stroke={theme.bibBorder} strokeWidth="0.8" />
          </g>

          {/* Accessory on Ear or Head */}
          <g transform="translate(60, 20)">
            {theme.accessory === 'ribbon' && (
              <g transform="scale(0.8) translate(-6, -6)">
                <path d="M 0 0 L 8 -5 L 8 5 Z" fill="#FB7185" />
                <path d="M 0 0 L -8 -5 L -8 5 Z" fill="#FB7185" />
                <circle cx="0" cy="0" r="2.5" fill="#FFE4E6" stroke="#FB7185" strokeWidth="0.8" />
              </g>
            )}
            {theme.accessory === 'flower' && (
              <g transform="scale(0.8) translate(-4, -6)">
                {[0, 72, 144, 216, 288].map((deg) => (
                  <circle
                    key={deg}
                    cx={Math.cos((deg * Math.PI) / 180) * 4}
                    cy={Math.sin((deg * Math.PI) / 180) * 4}
                    r="2.8"
                    fill="#F472B6"
                  />
                ))}
                <circle cx="0" cy="0" r="2" fill="#FEF08A" />
              </g>
            )}
            {theme.accessory === 'crown' && (
              <g transform="scale(0.75) translate(-8, -12)">
                <polygon
                  points="0,6 4,0 8,6 12,0 16,6 14,10 2,10"
                  fill="#FBBF24"
                  stroke="#D97706"
                  strokeWidth="0.8"
                />
                <circle cx="4" cy="0" r="1" fill="#EF4444" />
                <circle cx="8" cy="6" r="0.8" fill="#3B82F6" />
                <circle cx="12" cy="0" r="1" fill="#10B981" />
              </g>
            )}
            {theme.accessory === 'carrot' && (
              <g transform="scale(0.75) rotate(-20) translate(-4, -8)">
                <polygon points="0,0 6,-3 14,-1 2,5" fill="#FB923C" stroke="#EA580C" strokeWidth="0.8" />
                <path d="M 0 0 L -4 -4 M 0 0 L -3 -6" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}
            {theme.accessory === 'star' && (
              <g transform="scale(0.8) translate(-6, -8)">
                <polygon
                  points="6,0 7.8,4.2 12,4.5 8.8,7.3 9.8,11.5 6,9.2 2.2,11.5 3.2,7.3 0,4.5 4.2,4.2"
                  fill="#FACC15"
                  stroke="#EAB308"
                  strokeWidth="0.6"
                />
              </g>
            )}
            {theme.accessory === 'glasses' && (
              <g transform="scale(0.8) translate(4, 8)">
                <circle cx="0" cy="0" r="4" fill="none" stroke="#6366F1" strokeWidth="1.2" />
                <circle cx="8" cy="0" r="4" fill="none" stroke="#6366F1" strokeWidth="1.2" />
                <line x1="4" y1="0" x2="4" y2="0" stroke="#6366F1" strokeWidth="1.2" />
                <line x1="-4" y1="0" x2="-8" y2="-2" stroke="#6366F1" strokeWidth="1" />
              </g>
            )}
            {theme.accessory === 'clover' && (
              <g transform="scale(0.75) translate(-6, -6)">
                {[0, 90, 180, 270].map((deg) => (
                  <circle
                    key={deg}
                    cx={Math.cos((deg * Math.PI) / 180) * 3}
                    cy={Math.sin((deg * Math.PI) / 180) * 3}
                    r="2.5"
                    fill="#4ADE80"
                  />
                ))}
                <path d="M 0 2 Q 2 6 0 8" fill="none" stroke="#16A34A" strokeWidth="1" />
              </g>
            )}
            {theme.accessory === 'strawberry' && (
              <g transform="scale(0.75) translate(-4, -6)">
                <path
                  d="M 4 0 C 8 0, 8 7, 4 9 C 0 7, 0 0, 4 0 Z"
                  fill="#EF4444"
                  stroke="#DC2626"
                  strokeWidth="0.6"
                />
                <circle cx="2" cy="3" r="0.4" fill="#FEF08A" />
                <circle cx="5" cy="4" r="0.4" fill="#FEF08A" />
                <circle cx="3" cy="6" r="0.4" fill="#FEF08A" />
                <path d="M 4 0 L 2 -2 M 4 0 L 4 -3 M 4 0 L 6 -2" stroke="#22C55E" strokeWidth="1" />
              </g>
            )}
            {theme.accessory === 'headphones' && (
              <g transform="scale(0.8) translate(-2, 4)">
                <path d="M 0 0 C 0 -12, 12 -12, 12 0" fill="none" stroke="#8B5CF6" strokeWidth="1.8" />
                <rect x="-3" y="-2" width="4" height="6" rx="2" fill="#A855F7" />
                <rect x="11" y="-2" width="4" height="6" rx="2" fill="#A855F7" />
              </g>
            )}
            {theme.accessory === 'heart' && (
              <g transform="scale(0.75) translate(-5, -7)">
                <path
                  d="M 5 3 Q 5 0 2.5 0 Q 0 0 0 2.5 Q 0 5 5 8 Q 10 5 10 2.5 Q 10 0 7.5 0 Q 5 0 5 3 Z"
                  fill="#EC4899"
                  stroke="#DB2777"
                  strokeWidth="0.6"
                />
              </g>
            )}
            {theme.accessory === 'cap' && (
              <g transform="scale(0.8) translate(-6, -6)">
                <path d="M 0 4 Q 6 -3 12 4 Z" fill="#3B82F6" />
                <path d="M 8 4 L 16 3" stroke="#1D4ED8" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}
            {theme.accessory === 'bell' && (
              <g transform="scale(0.75) translate(-5, -6)">
                <path d="M 5 0 C 2 0, 1 5, 0 7 L 10 7 C 9 5, 8 0, 5 0 Z" fill="#FBBF24" />
                <circle cx="5" cy="8" r="1.5" fill="#D97706" />
              </g>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};

interface BunnyFrontDisplayProps {
  theme: BunnyTheme;
  name: string;
  size?: number; // width in px
  medal?: 'gold' | 'silver' | 'bronze' | null;
  isDancing?: boolean;
}

export const BunnyFrontDisplay: React.FC<BunnyFrontDisplayProps> = ({
  theme,
  name,
  size = 110,
  medal = null,
  isDancing = false,
}) => {
  const displayName = name.length > 6 ? name.slice(0, 5) + '..' : name;
  const fontSize = displayName.length <= 2 ? 14 : displayName.length <= 4 ? 12 : 10;

  return (
    <div
      className={`relative inline-block select-none ${isDancing ? 'animate-bounce' : ''}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 120 140"
        className="w-full h-full overflow-visible"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Shadow */}
        <ellipse cx="60" cy="132" rx="34" ry="7" fill="rgba(0,0,0,0.12)" />

        {/* Left Ear */}
        <g transform="rotate(-6, 44, 45)">
          <path
            d="M 44 48 C 30 25, 25 -2, 38 -8 C 48 -8, 54 22, 50 48 Z"
            fill={theme.furColor}
            stroke={theme.bibBorder}
            strokeWidth="2"
          />
          <path
            d="M 43 44 C 34 24, 30 2, 38 -3 C 44 -3, 48 22, 47 44 Z"
            fill={theme.earInnerColor}
            opacity="0.9"
          />
        </g>

        {/* Right Ear */}
        <g transform="rotate(6, 76, 45)">
          <path
            d="M 76 48 C 90 25, 95 -2, 82 -8 C 72 -8, 66 22, 70 48 Z"
            fill={theme.furColor}
            stroke={theme.bibBorder}
            strokeWidth="2"
          />
          <path
            d="M 77 44 C 86 24, 90 2, 82 -3 C 76 -3, 72 22, 73 44 Z"
            fill={theme.earInnerColor}
            opacity="0.9"
          />
        </g>

        {/* Cute Plump Body */}
        <path
          d="M 32 80 C 22 105, 30 128, 60 128 C 90 128, 98 105, 88 80 C 80 68, 40 68, 32 80 Z"
          fill={theme.furColor}
          stroke={theme.bibBorder}
          strokeWidth="2"
        />

        {/* Feet / Paws */}
        <ellipse cx="44" cy="128" rx="12" ry="7" fill={theme.furColor} stroke={theme.bibBorder} strokeWidth="1.8" />
        <ellipse cx="76" cy="128" rx="12" ry="7" fill={theme.furColor} stroke={theme.bibBorder} strokeWidth="1.8" />
        {/* Foot pads */}
        <circle cx="44" cy="128" r="3" fill={theme.earInnerColor} />
        <circle cx="76" cy="128" r="3" fill={theme.earInnerColor} />

        {/* Head */}
        <circle
          cx="60"
          cy="58"
          r="28"
          fill={theme.furColor}
          stroke={theme.bibBorder}
          strokeWidth="2"
        />

        {/* Rosy Blushing Cheeks */}
        <ellipse cx="41" cy="65" rx="5.5" ry="3.5" fill="#FF9EAA" opacity="0.85" />
        <ellipse cx="79" cy="65" rx="5.5" ry="3.5" fill="#FF9EAA" opacity="0.85" />

        {/* Eyes */}
        {isDancing ? (
          // Happy Joy Eyes "^ ^"
          <>
            <path d="M 45 56 Q 49 50 53 56" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 67 56 Q 71 50 75 56" fill="none" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          // Big Sparkly Anime Eyes
          <>
            <g transform="translate(48, 55)">
              <ellipse cx="0" cy="0" rx="4.5" ry="5.5" fill="#1E293B" />
              <circle cx="1.5" cy="-2" r="1.8" fill="#FFFFFF" />
              <circle cx="-1.2" cy="2" r="1" fill="#FFFFFF" />
            </g>
            <g transform="translate(72, 55)">
              <ellipse cx="0" cy="0" rx="4.5" ry="5.5" fill="#1E293B" />
              <circle cx="1.5" cy="-2" r="1.8" fill="#FFFFFF" />
              <circle cx="-1.2" cy="2" r="1" fill="#FFFFFF" />
            </g>
          </>
        )}

        {/* Nose & Mouth */}
        <polygon points="57,63 63,63 60,66" fill="#F472B6" />
        <path
          d="M 55 67 Q 60 71 60 67 Q 60 71 65 67"
          fill="none"
          stroke="#475569"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Whiskers */}
        <line x1="33" y1="62" x2="22" y2="60" stroke="#94A3B8" strokeWidth="1" opacity="0.8" />
        <line x1="33" y1="66" x2="21" y2="67" stroke="#94A3B8" strokeWidth="1" opacity="0.8" />
        <line x1="87" y1="62" x2="98" y2="60" stroke="#94A3B8" strokeWidth="1" opacity="0.8" />
        <line x1="87" y1="66" x2="99" y2="67" stroke="#94A3B8" strokeWidth="1" opacity="0.8" />

        {/* Tummy Name Bib (Grand Centerpiece with Participant's Name) */}
        <g transform="translate(60, 96)">
          <ellipse
            cx="0"
            cy="0"
            rx="23"
            ry="16"
            fill={theme.bibBg}
            stroke={theme.bibBorder}
            strokeWidth="2"
          />
          <ellipse
            cx="0"
            cy="0"
            rx="20"
            ry="13.5"
            fill="none"
            stroke={theme.accentColor}
            strokeWidth="1"
            strokeDasharray="2.5 2.5"
            opacity="0.7"
          />
          <text
            x="0"
            y={fontSize >= 12 ? 4.5 : 4}
            textAnchor="middle"
            fill={theme.textColor}
            fontWeight="900"
            fontSize={fontSize}
            fontFamily="'Jua', 'Noto Sans KR', sans-serif"
          >
            {displayName}
          </text>
        </g>

        {/* Front Paws / Arms */}
        {isDancing ? (
          // Waving Arms Up in Joy
          <>
            <ellipse cx="32" cy="74" rx="7" ry="5" fill={theme.furColor} stroke={theme.bibBorder} strokeWidth="1.6" transform="rotate(-35, 32, 74)" />
            <ellipse cx="88" cy="74" rx="7" ry="5" fill={theme.furColor} stroke={theme.bibBorder} strokeWidth="1.6" transform="rotate(35, 88, 74)" />
          </>
        ) : (
          // Cute Little Resting Paws
          <>
            <ellipse cx="38" cy="85" rx="6.5" ry="5" fill={theme.furColor} stroke={theme.bibBorder} strokeWidth="1.6" />
            <ellipse cx="82" cy="85" rx="6.5" ry="5" fill={theme.furColor} stroke={theme.bibBorder} strokeWidth="1.6" />
          </>
        )}

        {/* Accessory on Ear or Crown */}
        <g transform="translate(60, 32)">
          {theme.accessory === 'crown' && (
            <g transform="translate(-14, -14)">
              <polygon points="0,10 7,0 14,8 21,0 28,10 25,16 3,16" fill="#FBBF24" stroke="#D97706" strokeWidth="1.2" />
              <circle cx="7" cy="0" r="1.5" fill="#EF4444" />
              <circle cx="14" cy="8" r="1.5" fill="#3B82F6" />
              <circle cx="21" cy="0" r="1.5" fill="#10B981" />
            </g>
          )}
          {theme.accessory === 'ribbon' && (
            <g transform="translate(-16, -4)">
              <path d="M 0 0 L 10 -6 L 10 6 Z" fill="#FB7185" />
              <path d="M 0 0 L -10 -6 L -10 6 Z" fill="#FB7185" />
              <circle cx="0" cy="0" r="3.5" fill="#FFE4E6" stroke="#FB7185" strokeWidth="1" />
            </g>
          )}
          {theme.accessory === 'flower' && (
            <g transform="translate(14, -4)">
              {[0, 72, 144, 216, 288].map((deg) => (
                <circle
                  key={deg}
                  cx={Math.cos((deg * Math.PI) / 180) * 5}
                  cy={Math.sin((deg * Math.PI) / 180) * 5}
                  r="3.5"
                  fill="#F472B6"
                />
              ))}
              <circle cx="0" cy="0" r="2.5" fill="#FEF08A" />
            </g>
          )}
          {theme.accessory === 'carrot' && (
            <g transform="translate(12, -4) rotate(15)">
              <polygon points="0,0 8,-4 18,-2 3,7" fill="#FB923C" stroke="#EA580C" strokeWidth="1" />
              <path d="M 0 0 L -5 -5 M 0 0 L -4 -8" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}
          {theme.accessory === 'star' && (
            <g transform="translate(-16, -6)">
              <polygon
                points="8,0 10.4,5.6 16,6 11.7,9.7 13.1,15.3 8,12.3 2.9,15.3 4.3,9.7 0,6 5.6,5.6"
                fill="#FACC15"
                stroke="#EAB308"
                strokeWidth="0.8"
              />
            </g>
          )}
          {theme.accessory === 'headphones' && (
            <g transform="translate(-20, 10)">
              <path d="M 0 0 C 0 -22, 40 -22, 40 0" fill="none" stroke="#8B5CF6" strokeWidth="3" />
              <rect x="-6" y="-4" width="8" height="12" rx="4" fill="#A855F7" />
              <rect x="38" y="-4" width="8" height="12" rx="4" fill="#A855F7" />
            </g>
          )}
          {theme.accessory === 'glasses' && (
            <g transform="translate(-16, 22)">
              <circle cx="6" cy="0" r="6" fill="none" stroke="#6366F1" strokeWidth="2" />
              <circle cx="26" cy="0" r="6" fill="none" stroke="#6366F1" strokeWidth="2" />
              <line x1="12" y1="0" x2="20" y2="0" stroke="#6366F1" strokeWidth="2" />
            </g>
          )}
          {theme.accessory === 'heart' && (
            <g transform="translate(-16, -6)">
              <path
                d="M 6 4 Q 6 0 3 0 Q 0 0 0 3 Q 0 6 6 10 Q 12 6 12 3 Q 12 0 9 0 Q 6 0 6 4 Z"
                fill="#EC4899"
                stroke="#DB2777"
                strokeWidth="0.8"
              />
            </g>
          )}
          {theme.accessory === 'cap' && (
            <g transform="translate(-14, -8)">
              <path d="M 0 8 Q 14 -4 28 8 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1" />
              <path d="M 20 8 L 34 7" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}
        </g>

        {/* Podium Medal Overlay */}
        {medal && (
          <g transform="translate(60, 114)">
            {/* Medal Ribbon */}
            <path d="M -8 -16 L -2 0 L 2 0 L 8 -16" fill="#EF4444" stroke="#DC2626" strokeWidth="1" />
            {/* Medal Coin */}
            <circle
              cx="0"
              cy="3"
              r="10"
              fill={
                medal === 'gold'
                  ? '#FBBF24'
                  : medal === 'silver'
                  ? '#CBD5E1'
                  : '#F59E0B'
              }
              stroke={
                medal === 'gold'
                  ? '#D97706'
                  : medal === 'silver'
                  ? '#94A3B8'
                  : '#B45309'
              }
              strokeWidth="2"
            />
            <text
              x="0"
              y="6.5"
              textAnchor="middle"
              fontSize="9"
              fontWeight="900"
              fill={medal === 'silver' ? '#334155' : '#78350F'}
              fontFamily="'Jua', sans-serif"
            >
              {medal === 'gold' ? '1' : medal === 'silver' ? '2' : '3'}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
