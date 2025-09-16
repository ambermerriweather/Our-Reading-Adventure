
import React, { useState, useEffect, useMemo } from 'react';
import type { ReadingLogEntry } from '../types';
import { generateBookCover } from '../services/geminiService';

interface BookshelfProps {
  logs: ReadingLogEntry[];
}

const BookCover: React.FC<{ title: string; author: string }> = ({ title, author }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCover = async () => {
      try {
        const base64Image = await generateBookCover(title, author);
        if (isMounted && base64Image) {
          setImageUrl(`data:image/png;base64,${base64Image}`);
        }
      } catch (error) {
        console.error('Failed to fetch book cover:', error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    fetchCover();
    return () => { isMounted = false; };
  }, [title, author]);

  // Placeholder component for loading and error states
  const Placeholder = () => (
    <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center p-2 rounded-md text-center">
      <p className="text-xs font-bold text-gray-600">{title}</p>
      <p className="text-xs text-gray-500 mt-1">{author}</p>
    </div>
  );

  return (
    <div 
      className="aspect-[3/4] w-full bg-white rounded-md shadow-lg overflow-hidden transition-transform duration-200 hover:-translate-y-2"
      title={`${title} by ${author}`}
    >
      {isLoading ? (
         <div className="w-full h-full bg-gray-200 flex items-center justify-center animate-pulse">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
            </svg>
         </div>
      ) : imageUrl ? (
        <img src={imageUrl} alt={`Cover for ${title}`} className="w-full h-full object-cover" />
      ) : (
        <Placeholder />
      )}
    </div>
  );
};

const Bookshelf: React.FC<BookshelfProps> = ({ logs }) => {
  const uniqueBooks = useMemo(() => {
    const bookMap = new Map<string, { title: string; author: string }>();
    logs.forEach(log => {
      const key = `${log.bookTitle.toLowerCase()}|${log.author.toLowerCase()}`;
      if (!bookMap.has(key)) {
        bookMap.set(key, { title: log.bookTitle, author: log.author });
      }
    });
    return Array.from(bookMap.values());
  }, [logs]);

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="bg-orange-800 bg-opacity-75 p-4 rounded-lg shadow-inner">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
        {uniqueBooks.map((book) => (
          <BookCover key={`${book.title}-${book.author}`} title={book.title} author={book.author} />
        ))}
        {uniqueBooks.length === 0 && (
          <div className="col-span-full flex items-center justify-center h-40">
            <p className="text-yellow-200">Your bookshelf is empty. Log a book to start!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookshelf;
