import React, { useState, useMemo, useEffect } from 'react';
import { marked } from 'marked';
import type { ReadingLogEntry, User, ReadingGoal } from '../types';
import { analyzeStudentReadings, analyzeClassReadings, generateBookFeedback } from '../services/geminiService';
import Bookshelf from './Bookshelf';
// FIX: Import calculation logic from Achievements component file where it is now co-located.
import { calculateCurrentStreak, calculateTotalPoints, getWeekIdentifier } from './Achievements';

interface DashboardProps {
  logs: ReadingLogEntry[];
  roster: User[];
  onUpdateLog: (log: ReadingLogEntry) => void;
  onUpdateUser: (user: User) => void;
}

const StatCard: React.FC<{ title: string; value: React.ReactNode; icon: React.ReactNode }> = ({ title, value, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-teal-100 p-3 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

const BookStackIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>);
const StarIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>);
const FireIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>);

const Dashboard: React.FC<DashboardProps> = ({ logs, roster, onUpdateLog, onUpdateUser }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [studentAnalysisHtml, setStudentAnalysisHtml] = useState<string>('');
  const [classAnalysisHtml, setClassAnalysisHtml] = useState<string>('');
  const [isLoadingStudent, setIsLoadingStudent] = useState<boolean>(false);
  const [isLoadingClass, setIsLoadingClass] = useState<boolean>(false);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [error, setError] = useState<string>('');
  
  const [editingLogTimestamp, setEditingLogTimestamp] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  
  const students = useMemo(() => roster.filter(u => u.role === 'student').sort((a,b) => a.name.localeCompare(b.name)), [roster]);
  const studentLogs = useMemo(() => logs.filter(log => log.studentId === selectedStudentId), [logs, selectedStudentId]);
  const selectedStudent = useMemo(() => roster.find(s => s.id === selectedStudentId), [roster, selectedStudentId]);

  const classStats = useMemo(() => {
    if (logs.length === 0) return { totalBooks: 0, avgRating: 'N/A', topStreak: 0 };
    const totalBooks = new Set(logs.map(log => log.bookTitle.toLowerCase())).size;
    const avgRating = (logs.reduce((acc, log) => acc + log.rating, 0) / logs.length).toFixed(1);
    const topStreak = Math.max(0, ...students.map(s => calculateCurrentStreak(logs.filter(l => l.studentId === s.id))));
    return { totalBooks, avgRating, topStreak };
  }, [logs, students]);

  useEffect(() => {
    const fetchAnalysis = async () => {
        setIsLoadingStudent(true);
        setError('');
        setStudentAnalysisHtml('');
        try {
            const result = await analyzeStudentReadings(studentLogs);
            const html = await marked.parse(result);
            setStudentAnalysisHtml(html);
        } catch (err) {
            console.error("Analysis fetch error:", err);
            setError('Failed to get AI analysis. Please check your connection or API key.');
        } finally {
            setIsLoadingStudent(false);
        }
    };

    if (selectedStudentId && studentLogs.length > 0) {
        fetchAnalysis();
    } else {
        setStudentAnalysisHtml('');
        setError('');
        setIsLoadingStudent(false);
    }
  }, [selectedStudentId, studentLogs]);

  const handleGetClassAnalysis = async () => {
    setIsLoadingClass(true);
    setClassAnalysisHtml('');
    try {
        const result = await analyzeClassReadings(logs);
        const html = await marked.parse(result);
        setClassAnalysisHtml(html);
    } catch (err) {
        console.error("Class analysis fetch error:", err);
    } finally {
        setIsLoadingClass(false);
    }
  };
  
  const handleSaveFeedback = () => {
    if (!editingLogTimestamp) return;
    const logToUpdate = logs.find(log => log.timestamp === editingLogTimestamp);
    if (logToUpdate) {
        onUpdateLog({ ...logToUpdate, teacherFeedback: feedbackText });
    }
    setEditingLogTimestamp(null);
    setFeedbackText('');
  };

  const handleGenerateFeedback = async (log: ReadingLogEntry) => {
    setIsGeneratingFeedback(true);
    const feedback = await generateBookFeedback(log);
    setFeedbackText(feedback);
    setIsGeneratingFeedback(false);
  };

  const handleSetGoal = (student: User, type: 'books' | 'minutes', value: number) => {
    const weekIdentifier = getWeekIdentifier();
    const newGoal: ReadingGoal = { type, value, weekIdentifier };
    onUpdateUser({ ...student, goal: newGoal });
  };

  return (
    <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Class Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <StatCard title="Total Unique Books Read" value={classStats.totalBooks} icon={<BookStackIcon />} />
                <StatCard title="Class Average Rating" value={`${classStats.avgRating} ★`} icon={<StarIcon />} />
                <StatCard title="Top Reading Streak" value={`${classStats.topStreak} days`} icon={<FireIcon />} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Class Bookshelf</h3>
                    <Bookshelf logs={logs} />
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Class Reading Analysis</h3>
                    <button onClick={handleGetClassAnalysis} disabled={isLoadingClass} className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 disabled:bg-gray-400">
                        {isLoadingClass ? 'Analyzing...' : 'Generate Class Insights'}
                    </button>
                    {classAnalysisHtml && (
                        <div className="mt-4 p-4 bg-teal-50 border border-teal-200 rounded-lg prose prose-sm max-w-none prose-headings:text-teal-800"
                             dangerouslySetInnerHTML={{ __html: classAnalysisHtml }} />
                    )}
                </div>
            </div>
        </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Student Goals & Points</h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">This Week's Goal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Points</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {students.map(student => {
                        const currentGoal = student.goal?.weekIdentifier === getWeekIdentifier() ? student.goal : undefined;
                        const studentLogs = logs.filter(l => l.studentId === student.id);
                        const totalPoints = calculateTotalPoints(student, studentLogs);
                        return (
                            <tr key={student.id}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{student.name}</td>
                                <td className="px-4 py-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <select 
                                            value={currentGoal?.type || 'minutes'}
                                            onChange={e => handleSetGoal(student, e.target.value as 'books' | 'minutes', currentGoal?.value || (e.target.value === 'books' ? 1 : 30))}
                                            className="p-1 border border-gray-300 rounded-md text-sm"
                                        >
                                            <option value="minutes">Minutes</option>
                                            <option value="books">Books</option>
                                        </select>
                                        <input 
                                            type="number"
                                            value={currentGoal?.value || ''}
                                            onChange={e => handleSetGoal(student, currentGoal?.type || 'minutes', parseInt(e.target.value) || 0)}
                                            className="w-20 p-1 border border-gray-300 rounded-md text-sm"
                                            placeholder="Set goal"
                                        />
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-sm font-bold text-teal-600">{totalPoints}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Student Deep Dive</h2>
        <select value={selectedStudentId} onChange={e => setSelectedStudentId(e.target.value)} className="w-full sm:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-teal-500 focus:border-teal-500">
          <option value="">-- Select a Student --</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>

        {selectedStudent && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Bookshelf for {selectedStudent.name}</h3>
            <Bookshelf logs={studentLogs} />
            
            <h3 className="text-lg font-semibold text-gray-700 mt-6 mb-4">Log History & Feedback</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book & Reflection</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teacher Feedback</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {studentLogs.map(log => (
                            <tr key={log.timestamp}>
                                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(log.timestamp).toLocaleDateString()}</td>
                                <td className="px-4 py-4 text-sm text-gray-600 max-w-md">
                                    <p className="font-bold text-gray-900">{log.bookTitle} {log.finishedBook && '✅'}</p>
                                    <p className="mt-1 italic line-clamp-2">"{log.quickThought || log.deepDiveAnalysis}"</p>
                                </td>
                                <td className="px-4 py-4 text-sm text-gray-600 max-w-md">
                                    {editingLogTimestamp === log.timestamp ? (
                                        <div className="space-y-2">
                                            <textarea 
                                                value={feedbackText}
                                                onChange={(e) => setFeedbackText(e.target.value)}
                                                className="w-full p-2 border border-gray-300 rounded-md"
                                                rows={4}
                                            />
                                            <div className="flex justify-between items-center">
                                                <div className="flex space-x-2">
                                                    <button onClick={handleSaveFeedback} className="bg-teal-500 text-white px-3 py-1 text-xs rounded hover:bg-teal-600">Save</button>
                                                    <button onClick={() => {setEditingLogTimestamp(null); setFeedbackText('')}} className="bg-gray-200 text-gray-700 px-3 py-1 text-xs rounded hover:bg-gray-300">Cancel</button>
                                                </div>
                                                <button onClick={() => handleGenerateFeedback(log)} disabled={isGeneratingFeedback} className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 disabled:opacity-50 flex items-center space-x-1">
                                                    {isGeneratingFeedback ? (<span>Generating...</span>) : (<span>✨ Generate with AI</span>)}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p className="whitespace-pre-wrap">{log.teacherFeedback || 'No feedback yet.'}</p>
                                            <button 
                                                onClick={() => {
                                                    setEditingLogTimestamp(log.timestamp);
                                                    setFeedbackText(log.teacherFeedback || '');
                                                }}
                                                className="mt-1 text-xs text-teal-600 hover:text-teal-800 font-semibold"
                                            >
                                                {log.teacherFeedback ? 'Edit Feedback' : 'Add Feedback'}
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;