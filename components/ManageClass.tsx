import React, { useState } from 'react';
import type { User, ClassSettings } from '../types';

interface ManageClassProps {
  roster: User[];
  onAddStudent: (name: string, avatar: string, password?: string) => void;
  onRemoveStudent: (studentId: string) => void;
  classSettings: ClassSettings;
  onUpdateClassSettings: (settings: ClassSettings) => void;
  onUpdateStudentPassword: (studentId: string, newPassword: string) => void;
}

const AVATARS = ['avatar1', 'avatar2', 'avatar3', 'avatar4', 'avatar5', 'avatar6'];

const AvatarDisplay: React.FC<{ name: string; size?: 'sm' | 'md' | 'lg' }> = ({ name, size = 'md' }) => {
    const colors = ['bg-red-200', 'bg-green-200', 'bg-blue-200', 'bg-yellow-200', 'bg-purple-200', 'bg-pink-200'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const sizeClasses = {
        sm: 'w-8 h-8 text-sm',
        md: 'w-10 h-10 text-base',
        lg: 'w-12 h-12 text-lg',
    }
    return (
        <div className={`rounded-full ${colors[colorIndex]} flex items-center justify-center font-bold text-gray-600 flex-shrink-0 ${sizeClasses[size]}`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
};

const ManageClass: React.FC<ManageClassProps> = ({ roster, onAddStudent, onRemoveStudent, classSettings, onUpdateClassSettings, onUpdateStudentPassword }) => {
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentPassword, setNewStudentPassword] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState(AVATARS[0]);
    const [editableClassCode, setEditableClassCode] = useState(classSettings.classCode);
    
    const [editingStudentId, setEditingStudentId] = useState<string | null>(null);
    const [newPasswordValue, setNewPasswordValue] = useState('');

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (newStudentName.trim() && newStudentPassword.trim()) {
            onAddStudent(newStudentName, selectedAvatar, newStudentPassword);
            setNewStudentName('');
            setNewStudentPassword('');
            setSelectedAvatar(AVATARS[0]);
        } else {
            alert('Please provide a name and a password for the new student.');
        }
    };

    const handleClassCodeChange = () => {
        if (editableClassCode.trim()) {
            onUpdateClassSettings({ ...classSettings, classCode: editableClassCode.trim().toUpperCase() });
            alert('Class code updated!');
        }
    };
    
    const handleStartEditPassword = (student: User) => {
        setEditingStudentId(student.id);
        setNewPasswordValue(''); // Clear previous value
    };

    const handleCancelEditPassword = () => {
        setEditingStudentId(null);
        setNewPasswordValue('');
    };

    const handleSavePassword = () => {
        if (editingStudentId && newPasswordValue.trim()) {
            onUpdateStudentPassword(editingStudentId, newPasswordValue.trim());
            setEditingStudentId(null);
            setNewPasswordValue('');
        } else {
            alert('Password cannot be empty.');
        }
    };

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Class Settings</h2>
                <div className="flex items-center space-x-2">
                    <label htmlFor="classCode" className="text-gray-600">Class Code:</label>
                    <input 
                        id="classCode"
                        type="text"
                        value={editableClassCode}
                        onChange={e => setEditableClassCode(e.target.value)}
                        className="font-mono bg-gray-100 text-gray-800 px-3 py-1 rounded-md border border-gray-300 uppercase"
                    />
                    <button onClick={handleClassCodeChange} className="bg-teal-500 text-white px-4 py-1 rounded-md text-sm font-semibold hover:bg-teal-600">Save Code</button>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Add a New Student</h3>
                    <form onSubmit={handleAddStudent} className="space-y-4">
                        <div>
                            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student's Full Name</label>
                            <input
                                type="text"
                                id="studentName"
                                value={newStudentName}
                                onChange={(e) => setNewStudentName(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                placeholder="e.g., Jane Doe"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="studentPassword" className="block text-sm font-medium text-gray-700">Initial Password</label>
                            <input
                                type="text"
                                id="studentPassword"
                                value={newStudentPassword}
                                onChange={(e) => setNewStudentPassword(e.target.value)}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                placeholder="e.g., secret123"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Choose an Avatar</label>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {AVATARS.map(avatar => (
                                    <button
                                        key={avatar}
                                        type="button"
                                        onClick={() => setSelectedAvatar(avatar)}
                                        className={`p-1 rounded-full transition-all ${selectedAvatar === avatar ? 'ring-2 ring-teal-500 ring-offset-2' : ''}`}
                                    >
                                        <AvatarDisplay name={avatar.replace('avatar', 'A')} size="md" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-teal-600 text-white py-2 rounded-md font-semibold hover:bg-teal-700">
                            Add Student
                        </button>
                    </form>
                </div>

                <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Current Roster ({roster.length} students)</h3>
                    <div className="max-h-96 overflow-y-auto pr-2 space-y-3">
                        {roster.sort((a,b) => a.name.localeCompare(b.name)).map(student => (
                            <div key={student.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-md min-h-[64px]">
                                <div className="flex items-center space-x-3">
                                    <AvatarDisplay name={student.name} size="md" />
                                    <span className="font-medium text-gray-800">{student.name}</span>
                                </div>
                                {editingStudentId === student.id ? (
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            type="text" 
                                            value={newPasswordValue}
                                            onChange={(e) => setNewPasswordValue(e.target.value)}
                                            placeholder="New Password"
                                            className="w-32 p-1 border border-gray-300 rounded-md text-sm"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleSavePassword}
                                            className="text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 px-3 py-1 rounded-md"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelEditPassword}
                                            className="text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                      <button
                                          onClick={() => handleStartEditPassword(student)}
                                          className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md"
                                      >
                                          Reset Pass
                                      </button>
                                      <button
                                          onClick={() => onRemoveStudent(student.id)}
                                          className="text-sm font-medium text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md"
                                      >
                                          Remove
                                      </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManageClass;