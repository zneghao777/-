import React, { useState } from 'react';
import { Language, UserProfile, AppTheme } from '../types';
import { translations } from '../utils/i18n';
import { 
  Layers, 
  Sun, 
  Moon, 
  LogOut, 
  Sparkles, 
  BrainCircuit, 
  CalendarCheck2, 
  Hourglass,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentTab: 'deep' | 'assistant' | 'focus';
  onSelectTab: (tab: 'deep' | 'assistant' | 'focus') => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: AppTheme;
  onThemeToggle: () => void;
  user: UserProfile;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  user,
  onLogout,
}) => {
  const t = translations[language];
  const isDark = theme === 'aurora';
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-xl border-b transition-colors duration-300 ${
      isDark 
        ? 'bg-[#0f131c]/80 border-white/10 text-slate-100' 
        : 'bg-white/75 border-slate-200/80 text-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-500 p-[1.5px] shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white/95 dark:bg-slate-900/90 rounded-[10px] flex items-center justify-center">
              <Layers className="w-4 h-4 text-sky-600 dark:text-sky-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap">
              {t.appName}
            </span>
            <span className="hidden sm:inline-block text-[10px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-800/60">
              {t.personalBadge}
            </span>
          </div>
        </div>

        {/* Zone 2: 3 Clean single-line navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => onSelectTab('deep')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
              currentTab === 'deep'
                ? isDark
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30 shadow-xs'
                  : 'bg-white text-sky-700 shadow-sm border border-slate-200/80 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            <span>{t.navDeepThinking}</span>
          </button>

          <button
            onClick={() => onSelectTab('assistant')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
              currentTab === 'assistant'
                ? isDark
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30 shadow-xs'
                  : 'bg-white text-sky-700 shadow-sm border border-slate-200/80 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <CalendarCheck2 className="w-4 h-4" />
            <span>{t.navAssistant}</span>
          </button>

          <button
            onClick={() => onSelectTab('focus')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap shrink-0 transition-all duration-200 cursor-pointer ${
              currentTab === 'focus'
                ? isDark
                  ? 'bg-sky-500/15 text-sky-300 border border-sky-400/30 shadow-xs'
                  : 'bg-white text-sky-700 shadow-sm border border-slate-200/80 font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Hourglass className="w-4 h-4" />
            <span>{t.navFocus}</span>
          </button>
        </nav>

        {/* Zone 3: Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Theme switcher */}
          <button
            onClick={onThemeToggle}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 transition-colors cursor-pointer"
            title="Toggle theme"
            type="button"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Language selector */}
          <div className="relative inline-flex p-0.5 bg-slate-200/60 dark:bg-slate-800/80 rounded-full border border-slate-300/40 dark:border-white/10 text-[11px] font-medium">
            <button
              onClick={() => onLanguageChange('zh-CN')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                language === 'zh-CN' ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              中
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                language === 'en' ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('it')}
              className={`px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                language === 'it' ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 font-semibold shadow-xs' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              IT
            </button>
          </div>

          {/* User Profile dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-xs hover:border-sky-300 transition-all cursor-pointer"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                {user.name.charAt(0)}
              </div>
              <span className="hidden md:inline-block text-xs font-medium text-slate-800 dark:text-slate-200 max-w-[90px] truncate">
                {user.name}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {profileOpen && (
              <div 
                className={`absolute right-0 mt-2 w-56 rounded-2xl p-2 shadow-2xl border z-50 backdrop-blur-xl animate-in fade-in slide-in-from-top-1 ${
                  isDark ? 'bg-slate-900/95 border-slate-700 text-slate-100' : 'bg-white/95 border-slate-200 text-slate-800'
                }`}
              >
                <div className="p-3 border-b border-slate-200/60 dark:border-slate-800">
                  <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                    <Sparkles className="w-3 h-3" />
                    <span>{t.statusFlowing} · 98%</span>
                  </div>
                </div>

                <div className="p-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t.logout}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};
