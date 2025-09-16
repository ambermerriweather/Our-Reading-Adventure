import React, { useState, useEffect } from 'react';
import type { ReadingLogEntry, User, ClassSettings } from './types';
import { INITIAL_LOG_DATA, STUDENT_ROSTER, INITIAL_CLASS_SETTINGS } from './constants';
import Dashboard from './components/Dashboard';
import ReadingLogForm from './components/ReadingLogForm';
import Header from './components/Header';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import ManageClass from './components/ManageClass';

const LOGS_STORAGE_KEY = 'ourReadingAdventuresLogs';
const ROSTER_STORAGE_KEY = 'ourReadingAdventuresRoster';
const SETTINGS_STORAGE_KEY = 'ourReadingAdventuresSettings';

function App() {
  const [logs, setLogs] = useState<ReadingLogEntry[]>(() => {
    try {
      const savedLogs = localStorage.getItem(LOGS_STORAGE_KEY);
      return savedLogs ? JSON.parse(savedLogs) : INITIAL_LOG_DATA;
    } catch (error) {
      console.error("Could not parse logs from localStorage", error);
      return INITIAL_LOG_DATA;
    }
  });

  const [roster, setRoster] = useState<User[]>(() => {
    try {
      const savedRoster = localStorage.getItem(ROSTER_STORAGE_KEY);
      return savedRoster ? JSON.parse(savedRoster) : STUDENT_ROSTER;
    } catch (error) {
      console.error("Could not parse roster from localStorage", error);
      return STUDENT_ROSTER;
    }
  });

  const [classSettings, setClassSettings] = useState<ClassSettings>(() => {
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      return savedSettings ? JSON.parse(savedSettings) : INITIAL_CLASS_SETTINGS;
    } catch (error) {
      console.error("Could not parse settings from localStorage", error);
      return INITIAL_CLASS_SETTINGS;
    }
  });
  
  const [view, setView] = useState<'dashboard' | 'form' | 'manage'>('dashboard');
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error("Could not save logs to localStorage", error);
    }
  }, [logs]);

  useEffect(() => {
    try {
      localStorage.setItem(ROSTER_STORAGE_KEY, JSON.stringify(roster));
    } catch (error) {
      console.error("Could not save roster to localStorage", error);
    }
  }, [roster]);

  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(classSettings));
    } catch (error) {
      console.error("Could not save settings to localStorage", error);
    }
  }, [classSettings]);

  const addLog = (newLog: Omit<ReadingLogEntry, 'timestamp'>) => {
    const logWithTimestamp: ReadingLogEntry = {
      ...newLog,
      timestamp: new Date().toISOString(),
    };
    setLogs(prevLogs => [logWithTimestamp, ...prevLogs]);
    if (currentUser?.role === 'student') {
        setView('dashboard');
    }
  };
  
  const updateLog = (updatedLog: ReadingLogEntry) => {
    setLogs(prevLogs => prevLogs.map(log => log.timestamp === updatedLog.timestamp ? updatedLog : log));
  };

  const updateUser = (updatedUser: User) => {
    setRoster(prevRoster => prevRoster.map(user => user.id === updatedUser.id ? updatedUser : user));
    if (currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  };

  const addStudent = (name: string, avatar: string, password?: string) => {
    const newStudent: User = {
        id: `s${new Date().getTime()}`,
        name: name.trim(),
        avatar,
        role: 'student',
        password: password || `pass${new Date().getTime()}`,
        goalAchievedWeeks: []
    };
    setRoster(prevRoster => [...prevRoster, newStudent]);
  };

  const removeStudent = (studentId: string) => {
    if (window.confirm('Are you sure you want to remove this student? This action cannot be undone.')) {
        setRoster(prevRoster => prevRoster.filter(user => user.id !== studentId));
        // Optional: Also remove student's logs
        // setLogs(prevLogs => prevLogs.filter(log => log.studentId !== studentId));
    }
  };

  const updateStudentPassword = (studentId: string, newPassword: string) => {
    setRoster(prevRoster => prevRoster.map(user => 
        user.id === studentId ? { ...user, password: newPassword } : user
    ));
  };
  
  const updateClassSettings = (newSettings: ClassSettings) => {
    setClassSettings(newSettings);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('dashboard');
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };
  
  const renderView = () => {
    if (!currentUser) return null;
    
    switch (view) {
      case 'dashboard':
        return currentUser.role === 'teacher' 
          ? <Dashboard logs={logs} roster={roster} onUpdateLog={updateLog} onUpdateUser={updateUser} />
          : <StudentDashboard logs={logs.filter(log => log.studentId === currentUser.id)} student={currentUser} onUpdateUser={updateUser} />;
      case 'form':
        return <ReadingLogForm onSubmit={addLog} currentUser={currentUser} />;
      case 'manage':
        return currentUser.role === 'teacher' 
          ? <ManageClass 
              roster={roster.filter(u => u.role === 'student')} 
              onAddStudent={addStudent} 
              onRemoveStudent={removeStudent}
              onUpdateStudentPassword={updateStudentPassword}
              classSettings={classSettings}
              onUpdateClassSettings={updateClassSettings}
            />
          : null; // Students cannot access this view
      default:
        return null;
    }
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} roster={roster} classCode={classSettings.classCode} />;
  }

  return (
    <div className="min-h-screen bg-blue-50 text-gray-800">
      <Header currentUser={currentUser} onLogout={handleLogout} setView={setView} currentView={view} />
      <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {renderView()}
      </main>
    </div>
  );
}

export default App;