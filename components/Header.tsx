import React, { useState, useRef, useEffect } from 'react';
import { Document } from '../types';

interface HeaderProps {
  onToggleSidebar: () => void;
  documents: Document[];
  activeDocument: Document;
  onDocChange: (key: string) => void;
}

const DocSwitcher: React.FC<Omit<HeaderProps, 'onToggleSidebar'>> = ({ documents, activeDocument, onDocChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative mt-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full md:w-auto flex items-center justify-between px-4 py-2 text-left bg-slate-800/70 border border-slate-700 rounded-md text-sm text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <span>{activeDocument.shortTitle}</span>
        <svg className={`w-5 h-5 ml-2 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full md:w-72 rounded-md shadow-lg bg-slate-800 ring-1 ring-slate-700">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {documents.map(doc => (
              <button
                key={doc.key}
                onClick={() => {
                  onDocChange(doc.key);
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-sky-400"
                role="menuitem"
              >
                {doc.shortTitle}
                <span className="block text-xs text-slate-500">{doc.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


export const Header: React.FC<HeaderProps> = ({ onToggleSidebar, documents, activeDocument, onDocChange }) => {
  return (
    <header className="border-b border-slate-800 pb-8">
      <div className="flex justify-between items-start mb-2">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-100 tracking-tight break-words">
              {activeDocument.title}
            </h1>
            <p className="mt-4 text-base md:text-lg text-slate-400">
              A New Software Paradigm for Association-Addressable Data
            </p>
          </div>
          <button
            onClick={onToggleSidebar}
            className="p-2 ml-4 text-slate-400 hover:text-white md:hidden"
            aria-label="Open menu"
          >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
      </div>

      <DocSwitcher documents={documents} activeDocument={activeDocument} onDocChange={onDocChange} />
      
    </header>
  );
};
