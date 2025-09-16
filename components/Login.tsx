import React, { useState } from 'react';
import type { User } from '../types';
import { TEACHER_PASSWORD } from '../constants';

interface LoginProps {
  roster: User[];
  onLogin: (user: User) => void;
  classCode: string;
}

const BookIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);

const Avatar: React.FC<{ name: string }> = ({ name }) => {
    const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    return (
        <div className={`w-10 h-10 rounded-full ${colors[colorIndex]} flex items-center justify-center font-bold text-gray-600`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
};

const Login: React.FC<LoginProps> = ({ roster, onLogin, classCode }) => {
  const [step, setStep] = useState<'initial' | 'teacherLogin' | 'studentCodeEntry' | 'studentProfileSelect' | 'studentPasswordEntry'>('initial');
  const [selectedStudent, setSelectedStudent] = useState<User | null>(null);
  const [password, setPassword] = useState('');
  const [enteredClassCode, setEnteredClassCode] = useState('');
  const [error, setError] = useState('');

  const students = roster.filter(user => user.role === 'student').sort((a,b) => a.name.localeCompare(b.name));

  const reset = () => {
    setStep('initial');
    setSelectedStudent(null);
    setPassword('');
    setEnteredClassCode('');
    setError('');
  };

  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === TEACHER_PASSWORD) {
      setError('');
      onLogin({ id: 't1', role: 'teacher', name: 'Teacher', avatar: 'teacher' });
    } else {
      setError('Incorrect password.');
    }
  };

  const handleStudentCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredClassCode.toUpperCase() === classCode.toUpperCase()) {
        setError('');
        setStep('studentProfileSelect');
    } else {
        setError('Incorrect class code.');
    }
  };

  const handleStudentProfileSelect = (student: User) => {
    setSelectedStudent(student);
    setStep('studentPasswordEntry');
    setError('');
  };

  const handleStudentPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent && password === selectedStudent.password) {
        setError('');
        onLogin(selectedStudent);
    } else {
        setError('Incorrect password.');
    }
  };

  const renderInitial = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-600">Who are you?</h3>
      <button 
        onClick={() => { setStep('teacherLogin'); setError(''); }}
        className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-teal-600 transition-colors"
      >
        I'm the Teacher
      </button>
      <button 
        onClick={() => { setStep('studentCodeEntry'); setError(''); }}
        className="w-full bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-colors"
      >
        I'm a Student
      </button>
    </div>
  );

  const renderTeacherLogin = () => (
    <form onSubmit={handleTeacherLogin} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Teacher Login</h3>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            autoFocus
        />
        <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-teal-600">
            Log In
        </button>
        <button onClick={reset} type="button" className="text-sm text-gray-500 hover:underline">Back</button>
    </form>
  );

  const renderStudentCodeEntry = () => (
    <form onSubmit={handleStudentCodeSubmit} className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Student Login</h3>
        <input
            type="text"
            value={enteredClassCode}
            onChange={(e) => setEnteredClassCode(e.target.value)}
            placeholder="Enter Class Code"
            className="w-full p-3 border border-gray-300 rounded-lg uppercase"
            autoFocus
        />
        <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-teal-600">
            Join
        </button>
        <button onClick={reset} type="button" className="text-sm text-gray-500 hover:underline">Back</button>
    </form>
  );

  const renderStudentProfileSelect = () => (
    <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-700">Select your profile:</h3>
        <div className="max-h-60 overflow-y-auto border rounded-lg p-2 space-y-2">
            {students.map(student => (
                <div 
                    key={student.id} 
                    onClick={() => handleStudentProfileSelect(student)}
                    className={`flex items-center space-x-4 p-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-100`}
                >
                    <Avatar name={student.name} />
                    <span className="text-lg font-medium text-gray-800">{student.name}</span>
                </div>
            ))}
        </div>
        <button onClick={() => { setStep('studentCodeEntry'); setError(''); }} className="text-sm text-gray-500 hover:underline">Back</button>
    </div>
  );

  const renderStudentPasswordEntry = () => (
     <form onSubmit={handleStudentPasswordSubmit} className="space-y-4">
        <div className="flex items-center space-x-4 p-2">
            <Avatar name={selectedStudent!.name} />
            <h3 className="text-lg font-medium text-gray-700">Welcome, {selectedStudent!.name}</h3>
        </div>
        <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full p-3 border border-gray-300 rounded-lg"
            autoFocus
        />
        <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-teal-600">
            Log In
        </button>
        <button onClick={() => { setStep('studentProfileSelect'); setError(''); setPassword(''); }} type="button" className="text-sm text-gray-500 hover:underline">Back to profiles</button>
    </form>
  );

  const renderContent = () => {
    switch(step) {
      case 'initial': return renderInitial();
      case 'teacherLogin': return renderTeacherLogin();
      case 'studentCodeEntry': return renderStudentCodeEntry();
      case 'studentProfileSelect': 
        return students.length > 0 ? renderStudentProfileSelect() : (
            <div>
                <p>Your teacher needs to add you to the class first!</p>
                <button onClick={reset} className="mt-4 text-sm text-blue-500 hover:underline">Back to start</button>
            </div>
        );
      case 'studentPasswordEntry': return renderStudentPasswordEntry();
      default: return renderInitial();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
            <BookIcon />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome to</h1>
        <h2 className="text-4xl font-extrabold text-teal-600 mb-8">Our Reading Adventures</h2>
        
        {error && <p className="text-red-500 text-sm mb-4 font-semibold">{error}</p>}
        
        {renderContent()}
      </div>
    </div>
  );
};

export default Login;