import React, { useState, useRef, useEffect } from 'react';
import { Language, AppTheme, ChatMessage, TaskItem, DraftItem, SparkItem } from '../types';
import { translations } from '../utils/i18n';
import { 
  Send, 
  Sparkles, 
  BrainCircuit, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  Check, 
  ListPlus, 
  FileText, 
  Bookmark, 
  RotateCw,
  Lightbulb
} from 'lucide-react';

interface DeepThinkingViewProps {
  language: Language;
  theme: AppTheme;
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  onAddDraft: (draft: Omit<DraftItem, 'id' | 'updatedAt'>) => void;
  onAddSpark: (spark: Omit<SparkItem, 'id' | 'createdAt'>) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const DeepThinkingView: React.FC<DeepThinkingViewProps> = ({
  language,
  theme,
  onAddTask,
  onAddDraft,
  onAddSpark,
  onShowToast,
}) => {
  const t = translations[language];
  const isDark = theme === 'aurora';

  const [mode, setMode] = useState<'deep' | 'instant' | 'structured'>('deep');
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [expandedTraceId, setExpandedTraceId] = useState<string | null>('initial_msg');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initial greeting conversation
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'initial_msg',
      role: 'assistant',
      text: language === 'zh-CN'
        ? `清晨好。我是你的天质思维搭档。无论是生活抉择的千头万绪、年度构想的阻力拆解，还是艺术创作的灵感捕获，我都准备好与你一同展开深度推演。今天你想探讨什么主题？`
        : language === 'it'
        ? `Buongiorno. Sono il tuo partner di pensiero TianZhi. Dai nodi complessi delle decisioni quotidiane allo sviluppo di idee creative, sono pronto ad affiancarti con ragionamenti profondi. Di cosa desideri parlare oggi?`
        : `Good morning. I am your TianZhi thinking companion. Whether untangling complex decisions, breaking down procrastination bottlenecks, or crafting creative prose, I am ready to reason through it alongside you. What would you like to explore today?`,
      thinkingProcess: language === 'zh-CN'
        ? [
            '1. 分析清晨思维心流状态：认知负荷较低，注意力处于黄金窗口期。',
            '2. 调动结构化提问模型：鼓励用户聚焦于高杠杆、高价值的命题。',
            '3. 设定回应基调：沉静、温和、富有启发性，避免浮躁的机械回答。'
          ]
        : language === 'it'
        ? [
            '1. Analisi dello stato cognitivo mattutino: carico mentale minimo, massima ricettività.',
            '2. Attivazione del modello di indagine maieutica per favorire chiarezza.',
            '3. Tono stabilito: sereno, incisivo e orientato al flow creativo.'
          ]
        : [
            '1. Evaluating morning cognitive state: high receptivity, peak window for clarity.',
            '2. Activating reflective inquiry schema to foster high-leverage outcomes.',
            '3. Establishing tone: tranquil, lucid, deeply encouraging, non-robotic.'
          ],
      thinkingDuration: '1.2s',
      timestamp: Date.now() - 60000,
      mode: 'deep'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSend = (textToSend?: string) => {
    const prompt = (textToSend || inputText).trim();
    if (!prompt || isThinking) return;

    const userMsg: ChatMessage = {
      id: 'usr_' + Date.now(),
      role: 'user',
      text: prompt,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    // Generate response with intelligent thinking trace
    setTimeout(() => {
      let reasoningSteps: string[] = [];
      let finalAnswer = '';

      if (prompt.includes('拖延') || prompt.includes('procrastination') || prompt.includes('ritardo')) {
        reasoningSteps = [
          '• 识别核心阻力：拖延本质不是时间管理缺陷，而是情绪调节与认知门槛过高。',
          '• 解构阻力切入点：将巨型宏观目标细分至「5分钟内不可抗拒的原子动作」。',
          '• 建立正反馈循环：设计即时多巴胺反馈，绕过杏仁核防御机制。'
        ];
        finalAnswer = language === 'zh-CN'
          ? `面对这个延迟的项目，我们可以用**「极低阻力切入法」**破局：\n\n1. **定义微步（Micro-Action）**：今天只打开项目文件夹，写下第 1 个问题或标题，不强求得出结论。\n2. **物理环境重构**：将手机置于视线之外，设定一个 15 分钟的专注计时，约定时间一到即可停下。\n3. **接纳初始粗糙**：允许前两稿的缺陷，创意的精粹是在重温与修葺中浮现的。\n\n需要我将这 3 个动作直接为你生成晨间待办任务吗？`
          : `To break through procrastination, here is an effortless 3-step entry:\n\n1. **Define a Micro-Action**: Spend just 3 minutes creating the blank doc and typing the first paragraph.\n2. **Low-Stakes Focus**: Set a 15-minute gentle timer with ambient rain sounds; grant yourself full permission to pause after.\n3. **Embrace Imperfection**: The true beauty of creation comes from iteration, never the initial draft.`;
      } else if (prompt.includes('晨曦') || prompt.includes('散文') || prompt.includes('prose') || prompt.includes('alba')) {
        reasoningSteps = [
          '• 捕捉晨光意象：天青色晨雾、晨光投射在书桌木纹上的明暗交界。',
          '• 构建感官共鸣：微凉的晨风、远处的低沉鸣响、意识苏醒时的清澈感。',
          '• 提炼心流语调：节奏轻盈，留白深远。'
        ];
        finalAnswer = language === 'zh-CN'
          ? `晨光初起时，窗外是一抹未被世俗声浪浸染的浅青。\n\n当第一缕微光斜切过木质案几，空气里游弋着夜露未歇的凉意。在这个没有催促与喧嚣的纯白缝隙里，思绪像一泓清泉悄然复苏。每一笔书写，不再是向外界的证明，而是灵魂向晨光借来的一段自省与自由。`
          : `At dawn, the horizon breathes in tones of porcelain azure before the world awakens.\n\nAs the first slant of morning light brushes across the desk, thoughts crystallize in rare silence. In this untouched sanctuary of time, creation is not an obligation—it is a quiet conversation between the waking mind and the luminous day ahead.`;
      } else {
        reasoningSteps = [
          `• 解析输入语意：「${prompt.slice(0, 30)}...」`,
          '• 提取关键概念框架与多维度因果联系。',
          '• 构思高杠杆洞见并转化为可落地的结构化输出。'
        ];
        finalAnswer = language === 'zh-CN'
          ? `关于「${prompt}」，经过深度推演，核心脉络可归纳为以下要点：\n\n- **核心洞察**：任何复杂的构想，首要在于剥离表象噪音，看清底层约束。\n- **行动支点**：先确定不可变基线，再在弹性空间里发挥最大创造力。\n- **持续推进**：保持沉浸与反馈节奏，将灵感迅速锚定为书面文字与日常实践。`
          : `Regarding "${prompt}", here is a structured synthesis:\n\n- **Core Insight**: Complex challenges unburden themselves once we isolate invariant constraints from surface noise.\n- **Leverage Point**: Anchor the essential baseline first, leaving ample creative room for spontaneous insight.\n- **Next Action**: Capture the primary realization immediately into your workspace notes.`;
      }

      const assistantMsg: ChatMessage = {
        id: 'ast_' + Date.now(),
        role: 'assistant',
        text: finalAnswer,
        thinkingProcess: mode === 'instant' ? undefined : reasoningSteps,
        thinkingDuration: mode === 'deep' ? '2.4s' : '0.8s',
        timestamp: Date.now(),
        mode,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setIsThinking(false);
      setExpandedTraceId(assistantMsg.id);
    }, 1200);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    onShowToast(t.copySuccess, 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleConvertToTask = (text: string) => {
    const title = text.split('\n')[0].replace(/[#*•\d.-]/g, '').trim().slice(0, 40) || '晨间深度思考要点';
    onAddTask({
      title,
      category: '深度思考',
      priority: 'high',
      dueDate: '今天',
      timeEst: '25m',
    });
    onShowToast(`${t.tabTasks} +1`, 'success');
  };

  const handleSaveAsDraft = (text: string) => {
    onAddDraft({
      title: '深度推演文稿 · ' + new Date().toLocaleDateString(),
      type: 'essay',
      content: text,
    });
    onShowToast(`${t.tabDrafts} +1`, 'success');
  };

  const handleSaveAsSpark = (text: string) => {
    onAddSpark({
      title: text.slice(0, 20) + '...',
      content: text,
      tag: '思考火花',
      color: 'bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-800',
      pinned: true,
    });
    onShowToast(`${t.tabSparks} +1`, 'success');
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto w-full px-4 sm:px-6 py-4">
      {/* Top Banner / Mode Switcher */}
      <div className={`p-4 sm:p-5 rounded-3xl mb-4 backdrop-blur-xl border transition-all ${
        isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/80'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-sky-500" />
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display">
                {t.deepThinkTitle}
              </h2>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t.deepThinkSubtitle}
            </p>
          </div>

          {/* Mode Segmented Control */}
          <div className="inline-flex p-1 bg-slate-200/50 dark:bg-slate-800/60 rounded-2xl border border-white/60 dark:border-white/10 text-xs shrink-0 self-start sm:self-center">
            <button
              onClick={() => setMode('deep')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                mode === 'deep'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.modeDeep}
            </button>
            <button
              onClick={() => setMode('instant')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                mode === 'instant'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.modeInstant}
            </button>
            <button
              onClick={() => setMode('structured')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-medium ${
                mode === 'structured'
                  ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {t.modeStructured}
            </button>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            {msg.role === 'user' ? (
              <div className="max-w-2xl px-5 py-3 rounded-2xl rounded-br-xs bg-gradient-to-r from-sky-500 to-blue-600 text-white text-sm shadow-md shadow-sky-500/15">
                <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                <div className="text-[10px] text-sky-100/70 text-right mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ) : (
              <div className={`max-w-3xl w-full p-5 rounded-3xl rounded-tl-xs backdrop-blur-xl border transition-all ${
                isDark 
                  ? 'bg-slate-900/70 border-white/10 text-slate-100 shadow-xl' 
                  : 'bg-white/85 border-white/90 text-slate-800 shadow-sm'
              }`}>
                {/* Header of message */}
                <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                      <Sparkles className="w-3 h-3" />
                    </div>
                    <span className="font-semibold text-slate-700 dark:text-slate-200 font-display">
                      {t.appName}
                    </span>
                    {msg.thinkingDuration && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        · {t.thinkingCompleted} ({msg.thinkingDuration})
                      </span>
                    )}
                  </div>

                  <span className="text-[10px]">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Thinking Process Accordion (Transparent Reasoning Trace) */}
                {msg.thinkingProcess && msg.thinkingProcess.length > 0 && (
                  <div className="mb-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/30 border border-sky-100 dark:border-sky-900/50 overflow-hidden">
                    <button
                      onClick={() => setExpandedTraceId(expandedTraceId === msg.id ? null : msg.id)}
                      className="w-full px-3.5 py-2 flex items-center justify-between text-xs font-medium text-sky-700 dark:text-sky-300 hover:bg-sky-100/40 dark:hover:bg-sky-900/40 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <BrainCircuit className="w-3.5 h-3.5" />
                        <span>{t.thinkingTraceTitle}</span>
                      </span>
                      {expandedTraceId === msg.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {expandedTraceId === msg.id && (
                      <div className="p-3.5 pt-1 space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono border-t border-sky-100/80 dark:border-sky-900/30">
                        {msg.thinkingProcess.map((step, idx) => (
                          <div key={idx} className="leading-relaxed">
                            {step}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Final Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Action Bar for Assistant Message */}
                <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="px-2.5 py-1 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                      title={t.copySuccess}
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === msg.id ? 'Copied' : '复制'}</span>
                    </button>

                    <button
                      onClick={() => handleConvertToTask(msg.text)}
                      className="px-2.5 py-1 rounded-xl text-slate-500 hover:text-sky-600 dark:hover:text-sky-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <ListPlus className="w-3.5 h-3.5" />
                      <span>{t.convertToTask}</span>
                    </button>

                    <button
                      onClick={() => handleSaveAsDraft(msg.text)}
                      className="px-2.5 py-1 rounded-xl text-slate-500 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{t.saveAsDraft}</span>
                    </button>

                    <button
                      onClick={() => handleSaveAsSpark(msg.text)}
                      className="px-2.5 py-1 rounded-xl text-slate-500 hover:text-teal-600 dark:hover:text-teal-300 hover:bg-teal-50 dark:hover:bg-teal-950/40 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      <span>{t.saveAsSpark}</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleSend(messages[messages.length - 2]?.text || '重新构思并深化推演')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title={t.regenerate}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {isThinking && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/70 dark:bg-slate-900/60 border border-white/80 dark:border-white/10 w-fit backdrop-blur-sm animate-pulse">
            <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
            <span className="text-xs text-slate-500 dark:text-slate-400">
              天质 AI 正在推演多维思考链...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Chips */}
      {messages.length <= 2 && (
        <div className="py-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" />
            灵感切入:
          </span>
          {[t.quickPrompt1, t.quickPrompt2, t.quickPrompt3, t.quickPrompt4].map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-white/70 dark:bg-slate-800/70 hover:bg-white dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 transition-all shrink-0 cursor-pointer shadow-xs hover:border-sky-300"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Composer */}
      <div className={`mt-2 p-2.5 rounded-3xl backdrop-blur-xl border transition-all ${
        isDark ? 'dark-glass-shell border-white/10' : 'glass-shell border-white/85'
      }`}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={2}
            placeholder={t.inputPlaceholder}
            className={`w-full p-2.5 text-sm bg-transparent border-0 focus:outline-none resize-none leading-relaxed ${
              isDark ? 'text-white placeholder-slate-500' : 'text-slate-800 placeholder-slate-400'
            }`}
          />

          <button
            type="submit"
            disabled={!inputText.trim() || isThinking}
            className="p-3 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-md shadow-sky-500/20 disabled:opacity-40 transition-all cursor-pointer shrink-0"
            title={t.send}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
