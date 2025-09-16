import React, { useMemo, useEffect } from 'react';
import type { ReadingLogEntry, User } from '../types';
import Bookshelf from './Bookshelf';
// FIX: Import calculation logic from Achievements component file where it is now co-located.
import Achievements, { calculateAchievements, calculateCurrentStreak, calculateTotalPoints, getWeekIdentifier, checkAndCompleteGoal } from './Achievements';

interface StudentDashboardProps {
  logs: ReadingLogEntry[];
  student: User;
  onUpdateUser: (user: User) => void;
}

const StatCard: React.FC<{ title: string; value: React.ReactNode }> = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-3xl font-bold text-teal-600">{value}</p>
  </div>
);

const StudentDashboard: React.FC<StudentDashboardProps> = ({ logs, student, onUpdateUser }) => {
  const totalBooks = useMemo(() => new Set(logs.map(log => log.bookTitle)).size, [logs]);
  const readingStreak = useMemo(() => calculateCurrentStreak(logs), [logs]);
  const earnedAchievements = useMemo(() => calculateAchievements(logs, readingStreak), [logs, readingStreak]);
  const totalPoints = useMemo(() => calculateTotalPoints(student, logs), [student, logs]);

  const POINTS_PER_LEVEL = 250;
  const readerLevel = Math.floor(totalPoints / POINTS_PER_LEVEL) + 1;
  const pointsForNextLevel = totalPoints % POINTS_PER_LEVEL;
  const progressPercentage = (pointsForNextLevel / POINTS_PER_LEVEL) * 100;
  
  // Check for goal completion on log/student data change
  useEffect(() => {
    const goalCompleted = checkAndCompleteGoal(student, logs);
    if (goalCompleted) {
        const weekIdentifier = getWeekIdentifier();
        const updatedUser = {
            ...student,
            goalAchievedWeeks: [...(student.goalAchievedWeeks || []), weekIdentifier],
        };
        onUpdateUser(updatedUser);
    }
  }, [logs, student, onUpdateUser]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Points" value={totalPoints} />
        <StatCard title="Reader Level" value={readerLevel} />
        <StatCard title="Different Books Read" value={totalBooks} />
        <StatCard title="Reading Streak" value={`${readingStreak} days`} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-bold text-gray-800">Level {readerLevel} Progress</h3>
        <p className="text-sm text-gray-500 mb-2">{pointsForNextLevel} / {POINTS_PER_LEVEL} points to next level</p>
        <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-teal-500 h-4 rounded-full" style={{ width: `${progressPercentage}%` }}></div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Achievements</h2>
        <Achievements achievements={earnedAchievements} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Bookshelf</h2>
        <Bookshelf logs={logs} />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">My Reading Log</h2>
        <div className="space-y-6">
          {logs.length > 0 ? logs.map(log => (
            <div key={log.timestamp} className="p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-start">
                  <div>
                      <p className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</p>
                      <p className="font-bold text-lg text-gray-900">{log.bookTitle}</p>
                      <p className="text-sm text-gray-500 -mt-1">by {log.author}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lg text-yellow-500">{'★'.repeat(log.rating)}{'☆'.repeat(5-log.rating)}</span>
                    {log.finishedBook && <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">FINISHED</span>}
                  </div>
              </div>
              <p className="mt-3 italic text-gray-700">"{log.quickThought || log.deepDiveAnalysis}"</p>
              {log.teacherFeedback && (
                  <div className="mt-4 p-3 bg-teal-50 border-l-4 border-teal-400">
                      <p className="font-bold text-sm text-teal-800">Teacher's Feedback:</p>
                      <p className="text-sm text-teal-900 whitespace-pre-wrap">{log.teacherFeedback}</p>
                  </div>
              )}
            </div>
          )) : (
            <p className="text-center text-gray-500 py-8">You haven't logged any books yet. Go to "New Log Entry" to start!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;