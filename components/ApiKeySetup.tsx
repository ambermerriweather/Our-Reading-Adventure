import React, { useState } from 'react';

interface ApiKeySetupProps {
  onApiKeySubmit: (key: string) => void;
}

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H5v-2H3v-2H1v-4a6 6 0 016-6h4a6 6 0 016 6zM15 7v2" />
    </svg>
);

const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ onApiKeySubmit }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      onApiKeySubmit(key.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="flex justify-center mb-4">
            <KeyIcon />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Setup Required</h1>
        <h2 className="text-xl font-bold text-teal-600 mb-4">Enter Your Gemini API Key</h2>
        
        <p className="text-sm text-gray-600 mb-6">
          To power the AI features, this app needs a Google Gemini API key. 
          Your key will be saved securely in your browser's local storage and will not be shared.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <input
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your API Key"
                className="w-full p-3 border border-gray-300 rounded-lg"
                autoFocus
            />
            <button type="submit" className="w-full bg-teal-500 text-white py-3 rounded-lg font-semibold text-lg hover:bg-teal-600 transition-colors">
                Save and Continue
            </button>
        </form>
        <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-gray-500 hover:underline">
          Get a Gemini API Key from Google AI Studio
        </a>
      </div>
    </div>
  );
};

export default ApiKeySetup;
