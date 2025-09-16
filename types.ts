import type React from 'react';

export enum ReflectionType {
  QUICK_THOUGHT = 'Quick thought',
  DEEP_DIVE = 'Deep Dive',
}

export enum DeepDiveFocus {
  THEME = 'Theme',
  CHARACTER_CHANGE = 'Character change',
  AUTHOR_CRAFT = 'Author craft move',
  EVIDENCE_EXPLANATION = 'Evidence and explanation',
  VOCABULARY = 'Vocabulary in context',
  TEXT_TO_WORLD = 'Text to world connection',
}

export interface ReadingGoal {
  type: 'books' | 'minutes';
  value: number;
  weekIdentifier: string; // e.g., "2024-31"
}

export interface ReadingLogEntry {
  timestamp: string;
  studentId: string;
  studentName: string;
  bookTitle: string;
  author: string;
  rating: number;
  format: 'Print' | 'eBook' | 'Audiobook' | 'Comic';
  genre: string;
  reflectionType: ReflectionType;
  finishedBook: boolean;
  teacherFeedback?: string;
  quickThought?: string;
  minutesRead?: number;
  deepDiveFocus?: DeepDiveFocus;
  deepDiveAnalysis?: string;
}

export interface ClassSettings {
  classCode: string;
}

export interface User {
  id: string;
  role: 'teacher' | 'student';
  name: string;
  avatar: string;
  password?: string;
  goal?: ReadingGoal;
  goalAchievedWeeks?: string[];
}

export interface Achievement {
  id: string;
  name:string;
  description: string;
  icon: React.ComponentType;
}