import React, { useState, useEffect, useRef } from 'react';
import { translations } from '../utils/i18n';
import { Language, UserProfile, AppTheme } from '../types';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Lightbulb, 
  Briefcase, 
  Zap, 
  Moon, 
  Sun,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface AuthScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: AppTheme;
  onThemeToggle: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeToggle,
  onLoginSuccess,
  onShowToast,
}) => {
  const t = translations[language];

  // Auth Mode: 'signin' | 'signup' | 'forgot'
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [email, setEmail] = useState('creative.mind@tianzhi.ai');
  const [password, setPassword] = useState('aurora2026flow');
  const [name, setName] = useState('林晨曦 (Alex)');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Mouse Glow & Card Tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const glowLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (glowLayerRef.current) {
        glowLayerRef.current.style.setProperty('--mouse-x', `${x}px`);
        glowLayerRef.current.style.setProperty('--mouse-y', `${y}px`);
      }

      if (window.innerWidth >= 1024 && cardRef.current) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const deltaX = (x - centerX) / 85;
        const deltaY = (y - centerY) / 85;
        cardRef.current.style.transform = `perspective(1200px) rotateY(${deltaX * 0.45}deg) rotateX(${-deltaY * 0.45}deg)`;
      }
    };

    const handleMouseLeave = () => {
      if (cardRef.current) {
        cardRef.current.style.transform = 'perspective(1200px) rotateY(0deg) rotateX(0deg)';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user: UserProfile = {
        id: 'usr_' + Date.now(),
        name: authMode === 'signup' && name ? name : '林晨曦 (Alex)',
        email: email || 'creative.mind@tianzhi.ai',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        role: 'Creator & Thinker',
        flowScore: 98,
      };

      if (authMode === 'forgot') {
        onShowToast(t.resetSentSuccess, 'success');
        setAuthMode('signin');
        return;
      }

      onShowToast(`${t.welcomeBack}, ${user.name}!`, 'success');
      onLoginSuccess(user);
    }, 600);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const guestUser: UserProfile = {
        id: 'usr_guest_demo',
        name: language === 'zh-CN' ? '晨曦探索者' : language === 'it' ? 'Esploratore Ospite' : 'Guest Explorer',
        email: 'explorer@tianzhi.ai',
        avatar: '',
        role: 'Pro Explorer',
        flowScore: 100,
      };
      onShowToast(`${t.welcomeBack}, ${guestUser.name}!`, 'success');
      onLoginSuccess(guestUser);
    }, 400);
  };

  const isDark = theme === 'aurora';

  return (
    <div className={`relative min-h-screen w-full flex items-center justify-center p-3 sm:p-6 lg:p-10 overflow-x-hidden transition-colors duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0a0e17] via-[#0f131c] to-[#181b25] text-slate-100' 
        : 'bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#edf2f7] text-slate-800'
    }`}>
      {/* 鼠标动态跟随微光层 */}
      <div 
        ref={glowLayerRef} 
        className={`fixed inset-0 pointer-events-none z-0 ${isDark ? 'mouse-glow-dark' : 'mouse-glow'}`}
      />

      {/* 静态/浮动多维柔和光晕 */}
      <div className={`fixed -top-24 -left-20 w-[520px] h-[520px] rounded-full blur-[110px] pointer-events-none ambient-blob-1 z-0 ${
        isDark 
          ? 'bg-gradient-to-tr from-teal-500/20 via-sky-600/15 to-transparent' 
          : 'bg-gradient-to-tr from-sky-200/50 via-teal-100/40 to-transparent'
      }`} />
      <div className={`fixed -bottom-28 -right-20 w-[580px] h-[580px] rounded-full blur-[130px] pointer-events-none ambient-blob-2 z-0 ${
        isDark 
          ? 'bg-gradient-to-bl from-purple-600/20 via-blue-600/15 to-teal-500/15' 
          : 'bg-gradient-to-bl from-purple-200/45 via-amber-100/40 to-sky-100/30'
      }`} />
      <div className={`fixed top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 rounded-full blur-[90px] pointer-events-none z-0 ${
        isDark ? 'bg-cyan-900/20' : 'bg-rose-100/30'
      }`} />

      {/* 主体一体化毛玻璃悬浮卡片 */}
      <div 
        ref={cardRef}
        id="interactiveCard"
        className={`relative z-10 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row transition-transform duration-300 backdrop-blur-xl ${
          isDark ? 'dark-glass-shell border border-white/10' : 'glass-shell border border-white/85'
        }`}
      >
        {/* LEFT: 浅冰蓝灵感透亮展示栏 (48%) */}
        <section className={`lg:w-[48%] p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative overflow-hidden ${
          isDark ? 'dark-glass-panel-left' : 'glass-panel-left'
        }`}>
          {/* 极简高光流光点缀 */}
          <div className="absolute -right-20 -top-20 w-44 h-44 bg-white/40 dark:bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

          {/* 品牌徽标与名称 */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-500 p-[1.5px] shadow-md shadow-sky-500/20 flex items-center justify-center">
                <div className="w-full h-full bg-white/95 dark:bg-slate-900/90 rounded-[14px] flex items-center justify-center backdrop-blur-sm">
                  <Layers className="w-5 h-5 text-sky-600 dark:text-sky-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                    {t.appName}
                  </span>
                  <span className="text-[11px] font-semibold text-sky-700 dark:text-sky-300 bg-sky-100/80 dark:bg-sky-950/60 px-2 py-0.5 rounded-full border border-sky-200/60 dark:border-sky-800/60">
                    {t.personalBadge}
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 tracking-wide font-normal">
                  {t.brandSubtitle}
                </span>
              </div>
            </div>

            {/* Quick theme toggle */}
            <button
              onClick={onThemeToggle}
              className="lg:hidden p-2 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 hover:text-sky-600 transition-colors"
              title="Toggle Theme"
              type="button"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>

          {/* 中心主标语与愿景 */}
          <div className="relative z-10 my-8 lg:my-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 border border-sky-200/60 dark:border-sky-800/60 text-sky-700 dark:text-sky-300 text-xs font-medium mb-5 shadow-xs backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
              {t.sloganTag}
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug mb-4 font-display">
              {t.heroTitleLine1}
              <br />
              {t.heroTitleLine2}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-8 max-w-sm">
              {t.heroDesc}
            </p>

            {/* 个人随身助手三大特性卡片 */}
            <div className="space-y-3">
              {/* Item 1 */}
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 hover:bg-white/95 dark:hover:bg-slate-900/90 border border-white/80 dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-md flex items-start gap-3.5 group cursor-default">
                <div className="w-8 h-8 rounded-xl bg-sky-100/80 dark:bg-sky-950/80 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5 border border-sky-200/50 dark:border-sky-800/50 group-hover:scale-105 transition-transform">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-display">
                    {t.feature1Title}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {t.feature1Desc}
                  </p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 hover:bg-white/95 dark:hover:bg-slate-900/90 border border-white/80 dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-md flex items-start gap-3.5 group cursor-default">
                <div className="w-8 h-8 rounded-xl bg-purple-100/80 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 mt-0.5 border border-purple-200/50 dark:border-purple-800/50 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-display">
                    {t.feature2Title}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {t.feature2Desc}
                  </p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-slate-900/60 hover:bg-white/95 dark:hover:bg-slate-900/90 border border-white/80 dark:border-white/10 shadow-sm transition-all duration-300 hover:shadow-md flex items-start gap-3.5 group cursor-default">
                <div className="w-8 h-8 rounded-xl bg-teal-100/80 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 mt-0.5 border border-teal-200/50 dark:border-teal-800/50 group-hover:scale-105 transition-transform">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-slate-900 dark:text-slate-100 font-display">
                    {t.feature3Title}
                  </h3>
                  <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                    {t.feature3Desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 左侧底部装饰标记 */}
          <div className="relative z-10 pt-4 flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {t.engineReady}
            </span>
            <span className="font-mono text-[10px]">{t.versionTag}</span>
          </div>
        </section>

        {/* RIGHT: 纯净通透玻璃表单栏 (52%) */}
        <section className={`lg:w-[52%] p-8 sm:p-12 lg:p-14 flex flex-col justify-between relative backdrop-blur-md ${
          isDark ? 'dark-glass-panel-right' : 'glass-panel-right'
        }`}>
          {/* 顶部多语言胶囊切换 + 主题切换 */}
          <div className="w-full flex items-center justify-between gap-3">
            <div className="hidden lg:flex items-center">
              <button
                onClick={onThemeToggle}
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 bg-slate-200/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 transition-colors flex items-center gap-1.5 text-xs px-2.5"
                type="button"
                title="Toggle Theme"
              >
                {isDark ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.themeLight}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-slate-600" />
                    <span>{t.themeDark}</span>
                  </>
                )}
              </button>
            </div>

            {/* 语言选择胶囊 */}
            <nav aria-label="Language selection" className="inline-flex p-1 bg-slate-200/50 dark:bg-slate-800/60 backdrop-blur-md rounded-full border border-white/70 dark:border-white/10 shadow-inner">
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                  language === 'en'
                    ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 font-semibold shadow-sm border border-slate-200/60 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                type="button"
              >
                {language === 'en' && <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />}
                English
              </button>

              <button
                onClick={() => onLanguageChange('zh-CN')}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                  language === 'zh-CN'
                    ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 font-semibold shadow-sm border border-slate-200/60 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                type="button"
              >
                {language === 'zh-CN' && <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />}
                简体中文
              </button>

              <button
                onClick={() => onLanguageChange('it')}
                className={`px-3 py-1 rounded-full text-xs transition-all duration-200 flex items-center gap-1.5 focus:outline-none ${
                  language === 'it'
                    ? 'bg-white dark:bg-slate-700 text-sky-700 dark:text-sky-300 font-semibold shadow-sm border border-slate-200/60 dark:border-slate-600'
                    : 'text-slate-600 dark:text-slate-400 font-medium hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                type="button"
              >
                {language === 'it' && <span className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400" />}
                Italiano
              </button>
            </nav>
          </div>

          {/* 中心个人登录/注册表单 */}
          <div className="w-full max-w-sm mx-auto my-auto py-6">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white font-display">
                {authMode === 'signin' && t.welcomeBack}
                {authMode === 'signup' && t.createAccountTitle}
                {authMode === 'forgot' && t.resetPasswordTitle}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {authMode === 'signin' && t.loginSubtitle}
                {authMode === 'signup' && t.registerSubtitle}
                {authMode === 'forgot' && t.resetPasswordDesc}
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Full Name (Sign Up only) */}
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300" htmlFor="name">
                    {t.fullName}
                  </label>
                  <div className="relative rounded-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className={`block w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-2xl focus:outline-none transition-all duration-200 ${
                        isDark 
                          ? 'bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 dark-input-glow' 
                          : 'bg-white/80 border border-slate-200/90 text-slate-800 placeholder-slate-400 input-glow'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* 账号/邮箱 */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-300" htmlFor="email">
                  {t.emailOrAccount}
                </label>
                <div className="relative rounded-2xl">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className={`block w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-2xl focus:outline-none transition-all duration-200 ${
                      isDark 
                        ? 'bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 dark-input-glow' 
                        : 'bg-white/80 border border-slate-200/90 text-slate-800 placeholder-slate-400 input-glow'
                    }`}
                  />
                </div>
              </div>

              {/* 密码 (Sign In & Sign Up) */}
              {authMode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-300" htmlFor="password">
                      {t.password}
                    </label>
                    {authMode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => setAuthMode('forgot')}
                        className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                      >
                        {t.forgotPassword}
                      </button>
                    )}
                  </div>
                  <div className="relative rounded-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className={`block w-full pl-10 pr-10 py-2.5 sm:py-3 text-sm rounded-2xl focus:outline-none transition-all duration-200 ${
                        isDark 
                          ? 'bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 dark-input-glow' 
                          : 'bg-white/80 border border-slate-200/90 text-slate-800 placeholder-slate-400 input-glow'
                      }`}
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (Sign Up only) */}
              {authMode === 'signup' && (
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-300" htmlFor="confirmPass">
                    {t.confirmPassword}
                  </label>
                  <div className="relative rounded-2xl">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <input
                      id="confirmPass"
                      name="confirmPass"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className={`block w-full pl-10 pr-4 py-2.5 sm:py-3 text-sm rounded-2xl focus:outline-none transition-all duration-200 ${
                        isDark 
                          ? 'bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 dark-input-glow' 
                          : 'bg-white/80 border border-slate-200/90 text-slate-800 placeholder-slate-400 input-glow'
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* 记住登录 & 安全标识 (Sign In only) */}
              {authMode === 'signin' && (
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      id="remember"
                      name="remember"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500 transition-colors"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 select-none">
                      {t.rememberMe}
                    </span>
                  </label>
                  <span className="text-xs text-slate-400 dark:text-slate-500">
                    {t.secureChannel}
                  </span>
                </div>
              )}

              {/* 登录/注册按钮（高级克莱因蓝/湖蓝渐变） */}
              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-shimmer relative overflow-hidden w-full py-3 px-4 rounded-2xl font-medium text-sm text-white bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:via-sky-500 hover:to-blue-500 active:scale-[0.99] transition-all duration-200 shadow-lg shadow-sky-500/25 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-offset-2 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60"
                >
                  <span className="relative z-10 font-semibold tracking-wide">
                    {isLoading ? '...' : authMode === 'signin' ? t.signInBtn : authMode === 'signup' ? t.signUpBtn : t.sendResetLink}
                  </span>
                  <ArrowRight className="relative z-10 w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              {/* 快捷访客体验按钮 */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleGuestLogin}
                  className="w-full py-2.5 px-3 rounded-2xl text-xs font-semibold text-slate-600 dark:text-slate-300 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 border border-slate-200/60 dark:border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                  <span>{t.quickDemoBtn}</span>
                </button>
              </div>
            </form>

            {/* 切换登录 / 注册 / 返回 */}
            <div className="mt-7 pt-5 border-t border-slate-200/60 dark:border-slate-800 text-center">
              {authMode === 'signin' ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.firstTimePrompt}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className="font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline transition-colors ml-1 cursor-pointer"
                  >
                    {t.freeRegister}
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t.alreadyHaveAccount}{' '}
                  <button
                    type="button"
                    onClick={() => setAuthMode('signin')}
                    className="font-semibold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline transition-colors ml-1 cursor-pointer"
                  >
                    {t.backToLogin}
                  </button>
                </p>
              )}
            </div>
          </div>

          {/* 右下极简点缀 */}
          <div className="w-full flex items-center justify-center text-[11px] text-slate-400 dark:text-slate-500">
            <span>{t.flowQuote}</span>
          </div>
        </section>
      </div>
    </div>
  );
};
