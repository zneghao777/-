/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Language, AppTheme, UserProfile, TaskItem, DraftItem, SparkItem } from './types';
import { AuthScreen } from './components/AuthScreen';
import { Header } from './components/Header';
import { DeepThinkingView } from './components/DeepThinkingView';
import { AssistantStudioView } from './components/AssistantStudioView';
import { FocusSanctuaryView } from './components/FocusSanctuaryView';
import { NotificationToast, ToastData } from './components/NotificationToast';

export default function App() {
  const [language, setLanguage] = useState<Language>('zh-CN');
  const [theme, setTheme] = useState<AppTheme>('dawn');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [currentTab, setCurrentTab] = useState<'deep' | 'assistant' | 'focus'>('deep');
  const [toasts, setToasts] = useState<ToastData[]>([]);

  // Initial demo data for rich exploration
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 'task_1',
      title: '完成「天质 AI」年度产品构想深度拆解',
      category: '深度思考',
      priority: 'high',
      completed: false,
      dueDate: '今天',
      timeEst: '45m',
    },
    {
      id: 'task_2',
      title: '整理清晨灵感火花并归纳至知识书签库',
      category: '日常整理',
      priority: 'medium',
      completed: false,
      dueDate: '今天',
      timeEst: '20m',
    },
    {
      id: 'task_3',
      title: '开启 25 分钟晨曦微风专注心流写作',
      category: '心流创作',
      priority: 'high',
      completed: true,
      dueDate: '已完成',
      timeEst: '25m',
    },
    {
      id: 'task_4',
      title: '润色发送给设计团队的晨间合作随笔',
      category: '文稿草稿',
      priority: 'low',
      completed: false,
      dueDate: '明天',
      timeEst: '15m',
    },
  ]);

  const [drafts, setDrafts] = useState<DraftItem[]>([
    {
      id: 'draft_1',
      title: '致合作伙伴的晨间创作思考',
      type: 'email',
      content: `亲爱的伙伴：\n\n晨曦微光初现，我正在梳理我们下一阶段的创作节奏。回顾近期的进展，最关键的突破在于找到了「深层思考」与「无扰心流」的平衡点。\n\n接下来，我们将继续精简繁冗琐事，让核心灵感更自如地生长。期待本周与你的进一步交流！`,
      updatedAt: Date.now() - 3600000,
    },
    {
      id: 'draft_2',
      title: '极简无扰生活笔记',
      type: 'essay',
      content: `当世界把太多的输入强加于心智，我们所缺少的往往不是信息，而是清晨那一抹宁静留白。在专注中倾听白噪音与微风，思绪便会如泉水般澄澈。`,
      updatedAt: Date.now() - 7200000,
    },
  ]);

  const [sparks, setSparks] = useState<SparkItem[]>([
    {
      id: 'spark_1',
      title: '稍纵即逝的思维火花',
      content: '灵感并非来自持续的高压运转，而是在张弛有度、晨曦破晓时的自然涌现。',
      tag: '心流哲学',
      color: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
      pinned: true,
      createdAt: Date.now() - 86400000,
    },
    {
      id: 'spark_2',
      title: '低阻力行动原则',
      content: '面对庞大的规划，把第一步切分到只需动用 3 分钟的微习惯，阻力即刻瓦解。',
      tag: '认知科学',
      color: 'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
      pinned: true,
      createdAt: Date.now() - 43200000,
    },
    {
      id: 'spark_3',
      title: '晨曦的光影质感',
      content: '观察晨光投射在桌面上的明暗交界，静默中蕴含着无限的生机与创造力。',
      tag: '感官觉知',
      color: 'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
      pinned: false,
      createdAt: Date.now() - 21600000,
    },
  ]);

  // Toast notifier
  const showToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = 'toast_' + Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Task Handlers
  const handleAddTask = (task: Omit<TaskItem, 'id' | 'completed'>) => {
    const newTask: TaskItem = {
      ...task,
      id: 'task_' + Date.now(),
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    showToast(language === 'zh-CN' ? '事项已移除' : 'Task removed', 'info');
  };

  // Draft Handlers
  const handleAddDraft = (draft: Omit<DraftItem, 'id' | 'updatedAt'>) => {
    const newDraft: DraftItem = {
      ...draft,
      id: 'draft_' + Date.now(),
      updatedAt: Date.now(),
    };
    setDrafts((prev) => [newDraft, ...prev]);
  };

  const handleUpdateDraft = (id: string, content: string, title?: string) => {
    setDrafts((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              content,
              title: title !== undefined ? title : d.title,
              updatedAt: Date.now(),
            }
          : d
      )
    );
  };

  const handleDeleteDraft = (id: string) => {
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    showToast(language === 'zh-CN' ? '文稿已删除' : 'Draft deleted', 'info');
  };

  // Spark Handlers
  const handleAddSpark = (spark: Omit<SparkItem, 'id' | 'createdAt'>) => {
    const newSpark: SparkItem = {
      ...spark,
      id: 'spark_' + Date.now(),
      createdAt: Date.now(),
    };
    setSparks((prev) => [newSpark, ...prev]);
  };

  const handleTogglePinSpark = (id: string) => {
    setSparks((prev) =>
      prev.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s))
    );
  };

  const handleDeleteSpark = (id: string) => {
    setSparks((prev) => prev.filter((s) => s.id !== id));
    showToast(language === 'zh-CN' ? '灵感书签已移除' : 'Spark removed', 'info');
  };

  const handleThemeToggle = () => {
    setTheme((prev) => (prev === 'dawn' ? 'aurora' : 'dawn'));
    showToast(
      theme === 'dawn' 
        ? (language === 'zh-CN' ? '已切换至夜幕极光模式' : 'Switched to Aurora Night mode')
        : (language === 'zh-CN' ? '已切换至晨曦微光模式' : 'Switched to Dawn Light mode'),
      'info'
    );
  };

  const isDark = theme === 'aurora';

  return (
    <div className={`min-h-screen w-full transition-colors duration-500 flex flex-col ${
      isDark ? 'dark bg-[#0a0e17] text-slate-100' : 'bg-[#f8fafc] text-slate-800'
    }`}>
      {/* If not logged in, show the exact AuthScreen from user's screenshot */}
      {!currentUser ? (
        <AuthScreen
          language={language}
          onLanguageChange={setLanguage}
          theme={theme}
          onThemeToggle={handleThemeToggle}
          onLoginSuccess={(user) => setCurrentUser(user)}
          onShowToast={showToast}
        />
      ) : (
        /* Workspace when logged in */
        <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
          {/* Subtle ambient background glow */}
          <div className={`fixed -top-24 -left-20 w-[520px] h-[520px] rounded-full blur-[120px] pointer-events-none z-0 ${
            isDark ? 'bg-teal-500/10' : 'bg-sky-200/40'
          }`} />
          <div className={`fixed -bottom-28 -right-20 w-[580px] h-[580px] rounded-full blur-[130px] pointer-events-none z-0 ${
            isDark ? 'bg-purple-600/10' : 'bg-purple-200/30'
          }`} />

          {/* Top Navigation Bar */}
          <Header
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            language={language}
            onLanguageChange={setLanguage}
            theme={theme}
            onThemeToggle={handleThemeToggle}
            user={currentUser}
            onLogout={() => {
              setCurrentUser(null);
              showToast(language === 'zh-CN' ? '已退出登录' : 'Signed out', 'info');
            }}
          />

          {/* Main Tab View */}
          <main className="flex-1 flex flex-col relative z-10">
            {currentTab === 'deep' && (
              <DeepThinkingView
                language={language}
                theme={theme}
                onAddTask={handleAddTask}
                onAddDraft={handleAddDraft}
                onAddSpark={handleAddSpark}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'assistant' && (
              <AssistantStudioView
                language={language}
                theme={theme}
                tasks={tasks}
                drafts={drafts}
                sparks={sparks}
                onAddTask={handleAddTask}
                onToggleTask={handleToggleTask}
                onDeleteTask={handleDeleteTask}
                onReorderTasks={setTasks}
                onAddDraft={handleAddDraft}
                onUpdateDraft={handleUpdateDraft}
                onDeleteDraft={handleDeleteDraft}
                onAddSpark={handleAddSpark}
                onTogglePinSpark={handleTogglePinSpark}
                onDeleteSpark={handleDeleteSpark}
                onShowToast={showToast}
              />
            )}

            {currentTab === 'focus' && (
              <FocusSanctuaryView
                language={language}
                theme={theme}
                onShowToast={showToast}
              />
            )}
          </main>
        </div>
      )}

      {/* Global Notifications */}
      <NotificationToast toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
