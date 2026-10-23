import React, { useState } from 'react';
import { Language, AppTheme, TaskItem, DraftItem, SparkItem, TaskPriority } from '../types';
import { translations } from '../utils/i18n';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Sparkles, 
  Wand2, 
  Copy, 
  FileEdit, 
  Bookmark, 
  Pin, 
  Search, 
  Check,
  ListTodo,
  Clock,
  Tag,
  ArrowUpDown
} from 'lucide-react';

interface AssistantStudioViewProps {
  language: Language;
  theme: AppTheme;
  tasks: TaskItem[];
  drafts: DraftItem[];
  sparks: SparkItem[];
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onReorderTasks: (tasks: TaskItem[]) => void;
  onAddDraft: (draft: Omit<DraftItem, 'id' | 'updatedAt'>) => void;
  onUpdateDraft: (id: string, content: string, title?: string) => void;
  onDeleteDraft: (id: string) => void;
  onAddSpark: (spark: Omit<SparkItem, 'id' | 'createdAt'>) => void;
  onTogglePinSpark: (id: string) => void;
  onDeleteSpark: (id: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AssistantStudioView: React.FC<AssistantStudioViewProps> = ({
  language,
  theme,
  tasks,
  drafts,
  sparks,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onReorderTasks,
  onAddDraft,
  onUpdateDraft,
  onDeleteDraft,
  onAddSpark,
  onTogglePinSpark,
  onDeleteSpark,
  onShowToast,
}) => {
  const t = translations[language];
  const isDark = theme === 'aurora';

  // Sub-tab: 'tasks' | 'drafts' | 'sparks'
  const [activeTab, setActiveTab] = useState<'tasks' | 'drafts' | 'sparks'>('tasks');

  // Task creation state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>('medium');
  const [newTaskCategory, setNewTaskCategory] = useState('晨曦工作');

  // Draft state
  const [selectedDraftId, setSelectedDraftId] = useState<string>(drafts[0]?.id || '');
  const [isPolishing, setIsPolishing] = useState(false);
  const selectedDraft = drafts.find((d) => d.id === selectedDraftId) || drafts[0];

  // Spark state
  const [sparkSearch, setSparkSearch] = useState('');
  const [newSparkTitle, setNewSparkTitle] = useState('');
  const [newSparkContent, setNewSparkContent] = useState('');
  const [newSparkTag, setNewSparkTag] = useState('灵感火花');
  const [isCreatingSpark, setIsCreatingSpark] = useState(false);

  // New task submit
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      title: newTaskTitle.trim(),
      category: newTaskCategory,
      priority: newTaskPriority,
      dueDate: '今天',
      timeEst: '25m',
    });
    setNewTaskTitle('');
    onShowToast(`${t.tabTasks} +1`, 'success');
  };

  // AI Smart Prioritize
  const handleAutoPrioritize = () => {
    const priorityWeights: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
    const sorted = [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      return priorityWeights[b.priority] - priorityWeights[a.priority];
    });
    onReorderTasks(sorted);
    onShowToast(language === 'zh-CN' ? '已根据认知心流节奏重新排序！' : 'Optimized tasks by cognitive flow!', 'success');
  };

  // AI Polish Draft
  const handlePolishDraft = (style: 'formal' | 'warm' | 'concise' | 'literary') => {
    if (!selectedDraft) return;
    setIsPolishing(true);

    setTimeout(() => {
      let polished = selectedDraft.content;
      if (style === 'formal') {
        polished = `【商务正式修正稿】\n\n尊敬的伙伴：\n\n${selectedDraft.content}\n\n顺祝商祺，期待进一步推进合作。`;
      } else if (style === 'warm') {
        polished = `【温和亲切风格】\n\n你好呀！\n\n${selectedDraft.content}\n\n愿你拥有清澈愉悦的一天，随时保持交流！`;
      } else if (style === 'concise') {
        polished = `【精简要点总结】\n• 核心目标：明确首要交付成果与时间节点\n• 推进重点：${selectedDraft.content.slice(0, 50)}...\n• 下一步动作：按既定计划平稳推进。`;
      } else if (style === 'literary') {
        polished = `【典雅文采润色】\n\n晨曦浸润之时，文思自如流淌。\n\n${selectedDraft.content}\n\n以素雅之心，会意于纸墨间。`;
      }

      onUpdateDraft(selectedDraft.id, polished);
      setIsPolishing(false);
      onShowToast(language === 'zh-CN' ? '文稿打磨完成！' : 'Draft polished successfully!', 'success');
    }, 700);
  };

  // Copy draft
  const handleCopyDraft = () => {
    if (!selectedDraft) return;
    navigator.clipboard.writeText(selectedDraft.content);
    onShowToast(t.copySuccess, 'success');
  };

  // Create Spark
  const handleCreateSpark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSparkTitle.trim()) return;
    const colors = [
      'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
      'bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-800',
      'bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800',
      'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    onAddSpark({
      title: newSparkTitle.trim(),
      content: newSparkContent.trim() || newSparkTitle.trim(),
      tag: newSparkTag || '随想',
      color: randomColor,
      pinned: false,
    });

    setNewSparkTitle('');
    setNewSparkContent('');
    setIsCreatingSpark(false);
    onShowToast(`${t.tabSparks} +1`, 'success');
  };

  const filteredSparks = sparks.filter(
    (s) =>
      s.title.toLowerCase().includes(sparkSearch.toLowerCase()) ||
      s.content.toLowerCase().includes(sparkSearch.toLowerCase()) ||
      s.tag.toLowerCase().includes(sparkSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full px-4 sm:px-6 py-4">
      {/* Top Banner with Sub-tabs */}
      <div className={`p-4 sm:p-5 rounded-3xl mb-4 backdrop-blur-xl border transition-all ${
        isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/80'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
              {t.assistantTitle}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.assistantSubtitle}
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="inline-flex p-1 bg-slate-200/50 dark:bg-slate-800/60 rounded-2xl border border-white/60 dark:border-white/10 text-xs shrink-0 self-start sm:self-center">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                activeTab === 'tasks'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <ListTodo className="w-3.5 h-3.5" />
              <span>{t.tabTasks} ({tasks.filter(t => !t.completed).length})</span>
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                activeTab === 'drafts'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <FileEdit className="w-3.5 h-3.5" />
              <span>{t.tabDrafts} ({drafts.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('sparks')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer font-medium flex items-center gap-1.5 ${
                activeTab === 'sparks'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>{t.tabSparks} ({sparks.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: SMART TASKS */}
      {activeTab === 'tasks' && (
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Quick Add Bar */}
          <div className={`p-4 rounded-3xl backdrop-blur-xl border ${
            isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/80'
          }`}>
            <form onSubmit={handleCreateTask} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder={t.taskTitlePlaceholder}
                className={`flex-1 px-4 py-2.5 rounded-2xl text-sm focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 dark-input-glow'
                    : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 input-glow'
                }`}
              />

              <div className="flex items-center gap-2">
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                  className={`px-3 py-2 rounded-2xl text-xs font-medium focus:outline-none ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}
                >
                  <option value="high">{t.priorityHigh}</option>
                  <option value="medium">{t.priorityMedium}</option>
                  <option value="low">{t.priorityLow}</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t.addTask}</span>
                </button>

                <button
                  type="button"
                  onClick={handleAutoPrioritize}
                  className="px-3.5 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200/80 dark:border-slate-700 flex items-center gap-1.5 cursor-pointer shrink-0"
                  title={t.aiAutoPrioritize}
                >
                  <ArrowUpDown className="w-3.5 h-3.5 text-sky-500" />
                  <span className="hidden md:inline">{t.aiAutoPrioritize}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Task List */}
          <div className="space-y-2.5">
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm">
                {t.noTasks}
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    task.completed
                      ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/40 dark:border-slate-800/40'
                      : isDark
                      ? 'bg-slate-900/70 border-white/10 hover:border-sky-500/30 shadow-sm'
                      : 'bg-white/80 border-white/90 hover:border-sky-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="text-slate-400 hover:text-sky-600 transition-colors cursor-pointer shrink-0"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        task.completed ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {task.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {task.category}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.timeEst}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      task.priority === 'high'
                        ? 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900/60'
                        : task.priority === 'medium'
                        ? 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/40 dark:border-amber-900/60'
                        : 'text-slate-600 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700'
                    }`}>
                      {task.priority === 'high' ? t.priorityHigh : task.priority === 'medium' ? t.priorityMedium : t.priorityLow}
                    </span>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DRAFTS & WRITING */}
      {activeTab === 'drafts' && (
        <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">
          {/* Drafts Sidebar */}
          <div className="w-full md:w-64 flex flex-col gap-2 shrink-0 overflow-y-auto max-h-48 md:max-h-full">
            <button
              onClick={() => {
                onAddDraft({
                  title: '新文稿 · ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  type: 'note',
                  content: '',
                });
              }}
              className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.newDraft}</span>
            </button>

            {drafts.map((draft) => (
              <div
                key={draft.id}
                onClick={() => setSelectedDraftId(draft.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  selectedDraft?.id === draft.id
                    ? isDark
                      ? 'bg-sky-500/20 border-sky-400/40 text-white font-medium'
                      : 'bg-white border-sky-300 text-sky-900 shadow-sm font-semibold'
                    : 'bg-white/60 dark:bg-slate-900/40 border-transparent hover:border-slate-200 dark:hover:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="min-w-0">
                  <p className="text-xs truncate">{draft.title}</p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {draft.content ? draft.content.slice(0, 30) : '（空白草稿）'}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDraft(draft.id);
                  }}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Draft Editor & Polish Bar */}
          <div className={`flex-1 flex flex-col p-4 sm:p-5 rounded-3xl backdrop-blur-xl border ${
            isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/85'
          }`}>
            {selectedDraft ? (
              <>
                {/* Title and Polish Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60 dark:border-slate-800">
                  <input
                    type="text"
                    value={selectedDraft.title}
                    onChange={(e) => onUpdateDraft(selectedDraft.id, selectedDraft.content, e.target.value)}
                    className="text-base font-bold text-slate-900 dark:text-white bg-transparent border-0 focus:outline-none font-display"
                    placeholder={t.draftTitlePlaceholder}
                  />

                  {/* AI Polish Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handlePolishDraft('formal')}
                      disabled={isPolishing}
                      className="px-2.5 py-1 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Wand2 className="w-3 h-3 text-sky-500" />
                      <span>{t.polishFormal}</span>
                    </button>
                    <button
                      onClick={() => handlePolishDraft('warm')}
                      disabled={isPolishing}
                      className="px-2.5 py-1 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 text-purple-500" />
                      <span>{t.polishWarm}</span>
                    </button>
                    <button
                      onClick={() => handlePolishDraft('concise')}
                      disabled={isPolishing}
                      className="px-2.5 py-1 rounded-xl text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    >
                      <span>{t.polishConcise}</span>
                    </button>
                    <button
                      onClick={handleCopyDraft}
                      className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title={t.copySuccess}
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content Textarea */}
                <textarea
                  value={selectedDraft.content}
                  onChange={(e) => onUpdateDraft(selectedDraft.id, e.target.value)}
                  placeholder={t.draftContentPlaceholder}
                  className="flex-1 w-full mt-4 text-sm bg-transparent border-0 focus:outline-none resize-none leading-relaxed font-sans text-slate-800 dark:text-slate-100"
                />
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                请先选择或新建一份文稿
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SPARKS & KNOWLEDGE BOOKMARKS */}
      {activeTab === 'sparks' && (
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Action bar with search and quick capture */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={sparkSearch}
                onChange={(e) => setSparkSearch(e.target.value)}
                placeholder={t.searchSparks}
                className={`w-full pl-9 pr-4 py-2 rounded-2xl text-xs focus:outline-none transition-all ${
                  isDark
                    ? 'bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 dark-input-glow'
                    : 'bg-white border border-slate-200 text-slate-800 placeholder-slate-400 input-glow'
                }`}
              />
            </div>

            <button
              onClick={() => setIsCreatingSpark(true)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-sky-500/20 flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t.newSpark}</span>
            </button>
          </div>

          {/* Quick Create Modal / Inline Drawer */}
          {isCreatingSpark && (
            <div className={`p-4 rounded-3xl backdrop-blur-xl border animate-in fade-in slide-in-from-top-2 ${
              isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/85'
            }`}>
              <form onSubmit={handleCreateSpark} className="space-y-3">
                <input
                  type="text"
                  value={newSparkTitle}
                  onChange={(e) => setNewSparkTitle(e.target.value)}
                  placeholder={t.sparkTitlePlaceholder}
                  className={`w-full px-4 py-2 rounded-xl text-xs focus:outline-none ${
                    isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-200'
                  }`}
                  required
                />
                <textarea
                  value={newSparkContent}
                  onChange={(e) => setNewSparkContent(e.target.value)}
                  placeholder={t.sparkContentPlaceholder}
                  rows={3}
                  className={`w-full px-4 py-2 rounded-xl text-xs focus:outline-none resize-none ${
                    isDark ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-800 border-slate-200'
                  }`}
                />
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={newSparkTag}
                    onChange={(e) => setNewSparkTag(e.target.value)}
                    placeholder="标签，如：灵感、书摘、哲学"
                    className={`px-3 py-1.5 rounded-xl text-[11px] focus:outline-none ${
                      isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-700'
                    }`}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingSpark(false)}
                      className="px-3 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold"
                    >
                      保存
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Sparks Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pr-1">
            {filteredSparks.map((spark) => (
              <div
                key={spark.id}
                className={`p-4 rounded-3xl border transition-all duration-300 hover:shadow-md flex flex-col justify-between ${
                  spark.pinned ? 'ring-2 ring-sky-400/40 shadow-sm' : ''
                } ${spark.color}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/60 px-2 py-0.5 rounded-full border border-slate-200/50 dark:border-slate-700">
                      #{spark.tag}
                    </span>

                    <button
                      onClick={() => onTogglePinSpark(spark.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        spark.pinned ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={spark.pinned ? t.unpinSpark : t.pinSpark}
                    >
                      <Pin className={`w-3.5 h-3.5 ${spark.pinned ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 dark:text-white font-display mb-1.5 leading-snug">
                    {spark.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                    {spark.content}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between text-[10px] text-slate-400">
                  <span>{new Date(spark.createdAt).toLocaleDateString()}</span>
                  <button
                    onClick={() => onDeleteSpark(spark.id)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
