import React from 'react';
import type { ReadingLogEntry, Achievement, User } from '../types';
import { ReflectionType } from '../types';
import { POINTS_CONFIG } from '../constants';

// --- ICONS ---
const StreakIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l.643-.643a1 1 0 00-1.414-1.414l-1.45 1.45a1 1 0 00-.293.707v.214a1 1 0 00.293.707l1.45 1.45a1 1 0 001.414-1.414l-.643-.643c.208.376.477.704.822.934a1 1 0 001.45-.385c.345-.595.345-1.31 0-1.905zM8.34 17.653a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.934l.643-.643a1 1 0 00-1.414-1.414l-1.45 1.45a1 1 0 00-.293.707v.214a1 1 0 00.293.707l1.45 1.45a1 1 0 001.414-1.414l-.643-.643c.208.376.477.704.822.934a1 1 0 001.45-.385c.345-.595.345-1.31 0-1.905zm3.66-5.433a.6.6 0 01.634.634 1.75 1.75 0 003.5 0 .6.6 0 01.634-.634 1.75 1.75 0 000-3.5 .6.6 0 01-.634-.634 1.75 1.75 0 00-3.5 0 .6.6 0 01-.634.634 1.75 1.75 0 000 3.5z" clipRule="evenodd" />
    </svg>
);
const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.255 0 2.443-.29 3.5-.804V4.804zM14.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4z" />
    </svg>
);
const GenreIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
);
const DeepDiveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);

// --- ACHIEVEMENT DEFINITIONS ---
const ALL_ACHIEVEMENTS: Achievement[] = [
    { id: 'streak3', name: 'On a Roll', description: 'Maintain a 3-day reading streak.', icon: StreakIcon },
    { id: 'streak7', name: 'Dedicated Reader', description: 'Maintain a 7-day reading streak!', icon: StreakIcon },
    { id: 'book1', name: 'Page Turner', description: 'Finish your first book.', icon: BookIcon },
    { id: 'book5', name: 'Bookworm', description: 'Finish 5 different books.', icon: BookIcon },
    { id: 'book10', name: 'Librarian in Training', description: 'Finish 10 different books!', icon: BookIcon },
    { id: 'genre3', name: 'Genre Explorer', description: 'Read books from 3 different genres.', icon: GenreIcon },
    { id: 'genre5', name: 'Genre Master', description: 'Read books from 5 different genres.', icon: GenreIcon },
    { id: 'deepdive1', name: 'Deep Thinker', description: 'Complete your first Deep Dive reflection.', icon: DeepDiveIcon },
];

// --- GAMIFICATION & ACHIEVEMENT LOGIC ---

export const getWeekIdentifier = (d: Date = new Date()): string => {
    const date = new Date(d.valueOf());
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    const week1 = new Date(date.getFullYear(), 0, 4);
    const weekNumber = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
    return `${date.getFullYear()}-${weekNumber}`;
};

export const calculateTotalPoints = (student: User, logs: ReadingLogEntry[]): number => {
    let totalPoints = 0;

    logs.forEach(log => {
        totalPoints += POINTS_CONFIG.PER_LOG;
        if (log.finishedBook) {
            totalPoints += POINTS_CONFIG.FINISH_BOOK;
        }
        if (log.reflectionType === ReflectionType.DEEP_DIVE) {
            totalPoints += POINTS_CONFIG.DEEP_DIVE;
        }
    });

    if (student.goalAchievedWeeks) {
        totalPoints += student.goalAchievedWeeks.length * POINTS_CONFIG.GOAL_ACHIEVED;
    }

    return totalPoints;
}

export const checkAndCompleteGoal = (student: User, logs: ReadingLogEntry[]): boolean => {
    const { goal, goalAchievedWeeks = [] } = student;
    const currentWeekId = getWeekIdentifier();

    if (!goal || goal.weekIdentifier !== currentWeekId || goalAchievedWeeks.includes(currentWeekId)) {
        return false;
    }
    
    const logsThisWeek = logs.filter(log => getWeekIdentifier(new Date(log.timestamp)) === currentWeekId);
    
    if (goal.type === 'books') {
        const finishedBooksThisWeek = new Set(logsThisWeek.filter(log => log.finishedBook).map(l => l.bookTitle)).size;
        return finishedBooksThisWeek >= goal.value;
    } else if (goal.type === 'minutes') {
        const minutesReadThisWeek = logsThisWeek.reduce((sum, log) => sum + (log.minutesRead || 0), 0);
        return minutesReadThisWeek >= goal.value;
    }
    
    return false;
}

export const calculateCurrentStreak = (logs: ReadingLogEntry[]): number => {
    if (logs.length === 0) return 0;

    const uniqueDates = [...new Set(logs.map(log => log.timestamp.split('T')[0]))].sort((a,b) => b.localeCompare(a));
    if (uniqueDates.length === 0) return 0;
    
    const toYYYYMMDD = (d: Date) => d.toISOString().split('T')[0];
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (uniqueDates[0] !== toYYYYMMDD(today) && uniqueDates[0] !== toYYYYMMDD(yesterday)) {
      return 0; // Streak is not current
    }

    let streak = 1;
    for (let i = 0; i < uniqueDates.length - 1; i++) {
      const currentDate = new Date(uniqueDates[i]);
      const prevDate = new Date(uniqueDates[i+1]);
      const diffTime = currentDate.getTime() - prevDate.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break; // Gap detected
      }
    }
    return streak;
}

export const calculateAchievements = (logs: ReadingLogEntry[], streak: number): Achievement[] => {
    const earned: Achievement[] = [];

    const finishedBooks = new Set(logs.filter(log => log.finishedBook).map(log => log.bookTitle)).size;
    const uniqueGenres = new Set(logs.map(log => log.genre)).size;
    const hasDeepDive = logs.some(log => log.reflectionType === ReflectionType.DEEP_DIVE);
    
    if (streak >= 3) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'streak3')!);
    if (streak >= 7) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'streak7')!);
    if (finishedBooks >= 1) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'book1')!);
    if (finishedBooks >= 5) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'book5')!);
    if (finishedBooks >= 10) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'book10')!);
    if (uniqueGenres >= 3) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'genre3')!);
    if (uniqueGenres >= 5) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'genre5')!);
    if (hasDeepDive) earned.push(ALL_ACHIEVEMENTS.find(a => a.id === 'deepdive1')!);

    return earned;
};

// --- COMPONENT ---
const Achievements: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  if (achievements.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Keep reading to earn your first badge!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {achievements.map((ach) => {
        const Icon = ach.icon;
        return (
          <div 
            key={ach.id} 
            className="group relative bg-gray-50 p-4 rounded-lg text-center shadow-sm border border-gray-200 flex flex-col items-center justify-center transition-transform hover:scale-105" 
          >
            <div className="text-yellow-500 w-12 h-12 flex items-center justify-center mb-2">
              <Icon />
            </div>
            <p className="font-bold text-sm text-gray-800 leading-tight">{ach.name}</p>
            <div className="absolute bottom-full mb-2 w-max px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              {ach.description}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Achievements;