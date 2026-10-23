export type Language = 'zh-CN' | 'en' | 'it';

export type AppTheme = 'dawn' | 'aurora';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  flowScore: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  thinkingProcess?: string[];
  thinkingDuration?: string;
  timestamp: number;
  mode?: 'deep' | 'instant' | 'structured';
}

export type TaskPriority = 'high' | 'medium' | 'low';

export interface TaskItem {
  id: string;
  title: string;
  category: string;
  priority: TaskPriority;
  completed: boolean;
  dueDate: string;
  timeEst: string;
}

export interface DraftItem {
  id: string;
  title: string;
  type: 'email' | 'essay' | 'proposal' | 'note';
  recipient?: string;
  content: string;
  updatedAt: number;
}

export interface SparkItem {
  id: string;
  title: string;
  content: string;
  tag: string;
  color: string;
  pinned: boolean;
  createdAt: number;
}

export type AmbientSoundType = 'off' | 'rain' | 'breeze' | 'whitenoise' | 'chime';
