import React, { useState, useRef } from 'react';
import type { ReadingLogEntry, User } from '../types';
import { ReflectionType, DeepDiveFocus } from '../types';
import { GENRES, DEEP_DIVE_FOCI } from '../constants';

interface ReadingLogFormProps {
  onSubmit: (log: Omit<ReadingLogEntry, 'timestamp'>) => void;
  currentUser: User;
}

const AlertIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9 13a1 1 0 112 0v-5a1 1 0 11-2 0v5zm2-8a1 1 0 10-2 0 1 1 0 002 0z" clipRule="evenodd" />
    </svg>
);

const ReadingLogForm: React.FC<ReadingLogFormProps> = ({ onSubmit, currentUser }) => {
  const [formData, setFormData] = useState({
    bookTitle: '',
    author: '',
    rating: 3,
    format: 'Print' as 'Print' | 'eBook' | 'Audiobook' | 'Comic',
    genre: GENRES[0],
    finishedBook: false,
    quickThought: '',
    minutesRead: 30,
    deepDiveFocus: DeepDiveFocus.THEME,
    deepDiveAnalysis: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const showDeepDive = formData.finishedBook;

  const bookTitleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const quickThoughtRef = useRef<HTMLTextAreaElement>(null);
  const deepDiveAnalysisRef = useRef<HTMLTextAreaElement>(null);

  const fieldRefs: Record<string, React.RefObject<any>> = {
    bookTitle: bookTitleRef,
    author: authorRef,
    quickThought: quickThoughtRef,
    deepDiveAnalysis: deepDiveAnalysisRef,
  };

  const validate = (): string | null => {
      const newErrors: Record<string, string> = {};
      
      if (!formData.bookTitle.trim()) newErrors.bookTitle = 'Book title is required.';
      if (!formData.author.trim()) newErrors.author = 'Author is required.';

      if (showDeepDive) {
        if (formData.deepDiveAnalysis.trim().length < 50) {
          newErrors.deepDiveAnalysis = 'Since you finished the book, please provide a detailed analysis (minimum 50 characters).';
        }
      } else {
        if (formData.quickThought.trim().length < 20) {
          newErrors.quickThought = 'Please write a bit more for your reflection (minimum 20 characters).';
        }
      }

      setErrors(newErrors);
      const errorKeys = Object.keys(newErrors);
      return errorKeys.length > 0 ? errorKeys[0] : null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    
    setFormData(prev => ({ 
        ...prev, 
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : (name === 'rating' || name === 'minutesRead' ? parseInt(value) || 0 : value)
    }));

    if (errors[name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const firstErrorField = validate();
    if (firstErrorField) {
      fieldRefs[firstErrorField]?.current?.focus();
      return;
    }
    
    const reflectionType = showDeepDive ? ReflectionType.DEEP_DIVE : ReflectionType.QUICK_THOUGHT;
    
    const submissionData: Omit<ReadingLogEntry, 'timestamp'> = {
        studentId: currentUser.id,
        studentName: currentUser.name,
        bookTitle: formData.bookTitle.trim(),
        author: formData.author.trim(),
        rating: formData.rating,
        format: formData.format,
        genre: formData.genre,
        reflectionType,
        finishedBook: formData.finishedBook,
        quickThought: formData.quickThought.trim(),
        minutesRead: formData.minutesRead,
    };

    if (reflectionType === ReflectionType.DEEP_DIVE) {
        submissionData.deepDiveFocus = formData.deepDiveFocus;
        submissionData.deepDiveAnalysis = formData.deepDiveAnalysis.trim();
    } else {
        submissionData.deepDiveFocus = undefined;
        submissionData.deepDiveAnalysis = undefined;
    }

    onSubmit(submissionData);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">New Reading Log</h2>
      <p className="text-gray-500 mb-6">Fill in the details about the book you're reading, {currentUser.name}.</p>
      
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg mb-6" role="alert">
          <ul className="list-disc list-inside">
            {Object.values(errors).map((error, index) => <li key={index}>{error}</li>)}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="p-4 border rounded-md">
            <legend className="text-lg font-semibold px-2">Book Details</legend>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="md:col-span-2">
                  <label htmlFor="studentName" className="block text-sm font-medium text-gray-700">Student Name</label>
                  <input type="text" name="studentName" id="studentName" value={currentUser.name} required disabled className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 disabled:cursor-not-allowed" />
                </div>
                <div>
                  <label htmlFor="bookTitle" className="block text-sm font-medium text-gray-700">Book Title</label>
                  <input ref={bookTitleRef} type="text" name="bookTitle" id="bookTitle" value={formData.bookTitle} onChange={handleChange} required className={`mt-1 block w-full p-2 border ${errors.bookTitle ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                </div>
                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author</label>
                  <input ref={authorRef} type="text" name="author" id="author" value={formData.author} onChange={handleChange} required className={`mt-1 block w-full p-2 border ${errors.author ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`} />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Star Rating: {formData.rating}</label>
                      <input type="range" name="rating" id="rating" min="1" max="5" value={formData.rating} onChange={handleChange} className="mt-1 block w-full" />
                    </div>
                    <div>
                      <label htmlFor="format" className="block text-sm font-medium text-gray-700">Format</label>
                      <select name="format" id="format" value={formData.format} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                        {['Print', 'eBook', 'Audiobook', 'Comic'].map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
                      <select name="genre" id="genre" value={formData.genre} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </div>
                </div>
            </div>
        </fieldset>

        <fieldset className="p-4 border rounded-md">
            <legend className="text-lg font-semibold px-2">Reflection</legend>
            <div className="mt-4">
                <div className="flex items-center">
                    <input type="checkbox" name="finishedBook" id="finishedBook" checked={formData.finishedBook} onChange={handleChange} className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                    <label htmlFor="finishedBook" className="ml-2 block text-sm font-medium text-gray-900">I finished this book!</label>
                </div>
            </div>

            {showDeepDive ? (
              <div className="mt-4 space-y-4 p-4 border rounded-md border-teal-200 bg-teal-50">
                <p className="text-sm text-teal-800 font-semibold">Great job! Time for a Deep Dive Reflection.</p>
                <div>
                  <label htmlFor="deepDiveFocus" className="block text-sm font-medium text-gray-700">Deep Dive Focus</label>
                  <select name="deepDiveFocus" id="deepDiveFocus" value={formData.deepDiveFocus} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                    {DEEP_DIVE_FOCI.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="deepDiveAnalysis" className="block text-sm font-medium text-gray-700">Analysis</label>
                  <textarea ref={deepDiveAnalysisRef} name="deepDiveAnalysis" id="deepDiveAnalysis" value={formData.deepDiveAnalysis} onChange={handleChange} required rows={5} className={`mt-1 block w-full p-2 border ${errors.deepDiveAnalysis ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}></textarea>
                  {errors.deepDiveAnalysis ?
                    <p className="mt-1 text-sm text-red-600">{errors.deepDiveAnalysis}</p> :
                    <p className="mt-1 text-sm text-gray-500">Minimum 50 characters required.</p>
                  }
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="quickThought" className="block text-sm font-medium text-gray-700">One thought about this book</label>
                  <textarea ref={quickThoughtRef} name="quickThought" id="quickThought" value={formData.quickThought} onChange={handleChange} required rows={3} className={`mt-1 block w-full p-2 border ${errors.quickThought ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm`}></textarea>
                  <p className="mt-1 text-sm text-gray-500">Minimum 20 characters required.</p>
                </div>
                <div>
                  <label htmlFor="minutesRead" className="block text-sm font-medium text-gray-700">Minutes read today</label>
                  <input type="number" name="minutesRead" id="minutesRead" value={formData.minutesRead} onChange={handleChange} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
              </div>
            )}
        </fieldset>

        <div className="flex justify-end">
          <button type="submit" className="bg-teal-600 text-white px-8 py-3 rounded-md hover:bg-teal-700 font-semibold text-lg">Submit Log</button>
        </div>
      </form>
    </div>
  );
};

export default ReadingLogForm;