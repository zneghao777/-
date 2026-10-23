import React, { useState, useEffect } from 'react';
import { Language, AppTheme, AmbientSoundType } from '../types';
import { translations } from '../utils/i18n';
import { soundEngine } from '../utils/audioSynth';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Wind, 
  Radio, 
  Bell, 
  Sparkles, 
  Copy, 
  Download,
  Maximize2
} from 'lucide-react';

interface FocusSanctuaryViewProps {
  language: Language;
  theme: AppTheme;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const FocusSanctuaryView: React.FC<FocusSanctuaryViewProps> = ({
  language,
  theme,
  onShowToast,
}) => {
  const t = translations[language];
  const isDark = theme === 'aurora';

  // Timer states
  const [initialMinutes, setInitialMinutes] = useState(25);
  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(2);

  // Soundscape states
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('off');
  const [volume, setVolume] = useState(0.35);

  // Zen Writing Pad
  const [zenText, setZenText] = useState(
    language === 'zh-CN'
      ? `晨曦初现，窗棂泛着淡蓝色的光晕。\n\n此时的世界还未喧嚣，思绪得以在最纯粹的空白中舒展。把注意力的镜头拉近：专注在当下的呼吸，专注在笔尖流淌的每一个词句。`
      : `Dawn breaks with a soft azure shimmer across the horizon.\n\nThe world has not yet stirred into noise, leaving thoughts to unfold in pristine calm. Breathe gently, anchored in this very second of creative flow.`
  );

  // Timer interval
  useEffect(() => {
    let interval: number | null = null;
    if (isActive && secondsRemaining > 0) {
      interval = window.setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (isActive && secondsRemaining === 0) {
      setIsActive(false);
      setCompletedSessions((prev) => prev + 1);
      onShowToast(t.focusCompletedNotice, 'success');
      soundEngine.setSound('chime', 0.5);
      setTimeout(() => soundEngine.stop(), 6000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsRemaining, onShowToast, t.focusCompletedNotice]);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      soundEngine.stop();
    };
  }, []);

  const handleStartPause = () => {
    setIsActive(!isActive);
  };

  const handleReset = (mins = initialMinutes) => {
    setIsActive(false);
    setInitialMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  const handleSoundChange = (type: AmbientSoundType) => {
    setAmbientSound(type);
    soundEngine.setSound(type, volume);
  };

  const handleVolumeChange = (vol: number) => {
    setVolume(vol);
    soundEngine.setVolume(vol);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = ((initialMinutes * 60 - secondsRemaining) / (initialMinutes * 60)) * 100;

  // Words count calculation
  const wordCount = zenText.trim() ? zenText.trim().replace(/\s+/g, ' ').length : 0;
  const estReadingMinutes = Math.max(1, Math.ceil(wordCount / 300));

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full px-4 sm:px-6 py-4 overflow-y-auto scrollbar-thin">
      {/* Top Banner */}
      <div className={`p-4 sm:p-5 rounded-3xl mb-4 backdrop-blur-xl border transition-all ${
        isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/80'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
              {t.focusTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.focusSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-sky-700 dark:text-sky-300 bg-sky-100/70 dark:bg-sky-950/60 px-3 py-1.5 rounded-2xl border border-sky-200/60 dark:border-sky-800/60 shrink-0">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>{t.todayFocusTime}: {completedSessions * 25} {t.minutes}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
        
        {/* LEFT COLUMN: TIMER & SOUNDSCAPE (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          
          {/* Circular Countdown Card */}
          <div className={`p-6 rounded-3xl backdrop-blur-xl border flex flex-col items-center justify-center text-center relative overflow-hidden ${
            isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/85'
          }`}>
            {/* Ambient inner soft glow */}
            <div className="absolute inset-0 bg-radial from-sky-400/10 via-transparent to-transparent pointer-events-none" />

            {/* Presets */}
            <div className="flex items-center gap-1.5 mb-6 bg-slate-200/40 dark:bg-slate-800/50 p-1 rounded-2xl border border-white/60 dark:border-white/10 text-xs">
              <button
                onClick={() => handleReset(25)}
                className={`px-3 py-1 rounded-xl transition-all font-medium ${
                  initialMinutes === 25 ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                25m
              </button>
              <button
                onClick={() => handleReset(45)}
                className={`px-3 py-1 rounded-xl transition-all font-medium ${
                  initialMinutes === 45 ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                45m
              </button>
              <button
                onClick={() => handleReset(60)}
                className={`px-3 py-1 rounded-xl transition-all font-medium ${
                  initialMinutes === 60 ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                60m
              </button>
              <button
                onClick={() => handleReset(5)}
                className={`px-3 py-1 rounded-xl transition-all font-medium ${
                  initialMinutes === 5 ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                5m 休息
              </button>
            </div>

            {/* Big Countdown Display */}
            <div className="relative w-48 h-48 flex items-center justify-center my-2">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-slate-200/60 dark:stroke-slate-800/80"
                  strokeWidth="5"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  className="stroke-sky-500 transition-all duration-1000 ease-linear"
                  strokeWidth="5"
                  strokeDasharray={264}
                  strokeDashoffset={264 - (264 * progressPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>

              <div className="absolute flex flex-col items-center">
                <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white tabular-nums">
                  {formattedTime}
                </span>
                <span className="text-[11px] text-slate-400 font-medium mt-1">
                  {isActive ? (language === 'zh-CN' ? '心流运转中' : 'Flow in progress') : (language === 'zh-CN' ? '静候启程' : 'Ready')}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={handleStartPause}
                className={`px-6 py-2.5 rounded-2xl font-semibold text-xs text-white shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 shadow-sky-500/25'
                }`}
              >
                {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isActive ? t.pauseTimer : t.startTimer}</span>
              </button>

              <button
                onClick={() => handleReset()}
                className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
                title={t.resetTimer}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Soundscapes Card */}
          <div className={`p-5 rounded-3xl backdrop-blur-xl border ${
            isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/85'
          }`}>
            <div className="flex items-center justify-between mb-3.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white font-display">
                {t.ambientSound}
              </span>
              <div className="flex items-center gap-2">
                {volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-sky-500" />}
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleSoundChange(ambientSound === 'rain' ? 'off' : 'rain')}
                className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                  ambientSound === 'rain'
                    ? 'bg-sky-500/15 border-sky-400/50 text-sky-600 dark:text-sky-300 shadow-xs'
                    : 'bg-white/60 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                }`}
              >
                <CloudRain className={`w-4 h-4 ${ambientSound === 'rain' ? 'text-sky-500' : 'text-slate-400'}`} />
                <span>{t.soundRain}</span>
              </button>

              <button
                onClick={() => handleSoundChange(ambientSound === 'breeze' ? 'off' : 'breeze')}
                className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                  ambientSound === 'breeze'
                    ? 'bg-sky-500/15 border-sky-400/50 text-sky-600 dark:text-sky-300 shadow-xs'
                    : 'bg-white/60 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                }`}
              >
                <Wind className={`w-4 h-4 ${ambientSound === 'breeze' ? 'text-sky-500' : 'text-slate-400'}`} />
                <span>{t.soundBreeze}</span>
              </button>

              <button
                onClick={() => handleSoundChange(ambientSound === 'whitenoise' ? 'off' : 'whitenoise')}
                className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                  ambientSound === 'whitenoise'
                    ? 'bg-sky-500/15 border-sky-400/50 text-sky-600 dark:text-sky-300 shadow-xs'
                    : 'bg-white/60 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                }`}
              >
                <Radio className={`w-4 h-4 ${ambientSound === 'whitenoise' ? 'text-sky-500' : 'text-slate-400'}`} />
                <span>{t.soundWhiteNoise}</span>
              </button>

              <button
                onClick={() => handleSoundChange(ambientSound === 'chime' ? 'off' : 'chime')}
                className={`p-3 rounded-2xl border text-xs font-medium flex items-center gap-2.5 transition-all cursor-pointer ${
                  ambientSound === 'chime'
                    ? 'bg-sky-500/15 border-sky-400/50 text-sky-600 dark:text-sky-300 shadow-xs'
                    : 'bg-white/60 dark:bg-slate-800/50 border-slate-200/60 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-sky-300'
                }`}
              >
                <Bell className={`w-4 h-4 ${ambientSound === 'chime' ? 'text-sky-500' : 'text-slate-400'}`} />
                <span>{t.soundChime}</span>
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ZEN WRITING CANVAS (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col">
          <div className={`flex-1 flex flex-col p-5 rounded-3xl backdrop-blur-xl border ${
            isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/85'
          }`}>
            {/* Header of writing canvas */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display">
                  {t.zenEditorTitle}
                </h3>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>{t.wordCount}: <strong className="text-slate-700 dark:text-slate-200 font-mono">{wordCount}</strong></span>
                <span>·</span>
                <span>{t.readingTime}: <strong className="text-slate-700 dark:text-slate-200 font-mono">{estReadingMinutes}m</strong></span>
                
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(zenText);
                    onShowToast(t.copySuccess, 'success');
                  }}
                  className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors ml-1"
                  title="Copy text"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Distraction free editor */}
            <textarea
              value={zenText}
              onChange={(e) => setZenText(e.target.value)}
              placeholder={t.zenEditorPlaceholder}
              className="flex-1 w-full mt-4 p-2 text-sm leading-relaxed bg-transparent border-0 focus:outline-none resize-none font-sans text-slate-800 dark:text-slate-100 scrollbar-thin"
              rows={14}
            />

            {/* Bottom inspiration prompt */}
            <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800/60 text-center">
              <p className="text-[11px] text-slate-400 italic">
                “晨曦微光，心流自成；行于专注，灵感如泉。”
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
