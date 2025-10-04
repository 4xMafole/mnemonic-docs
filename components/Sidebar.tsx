import React from 'react';
import { Section } from '../types';

interface SidebarProps {
  sections: Section[];
  activeSection: string;
  isOpen: boolean;
  onClose: () => void;
}

const NavLink: React.FC<{ section: Section; isActive: boolean; onClick: () => void }> = ({ section, isActive, onClick }) => {
  const activeClasses = 'text-sky-400 border-sky-400';
  const inactiveClasses = 'text-slate-400 border-transparent hover:text-slate-200 hover:border-slate-500';

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const targetElement = document.getElementById(section.id);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
    // Update the URL hash without a page jump, good for history/bookmarks
    if (history.pushState) {
        history.pushState(null, '', `#${section.id}`);
    } else {
        window.location.hash = `#${section.id}`;
    }
    onClick(); // This calls the onClose function passed from the parent
  };

  return (
    <li>
      <a
        href={`#${section.id}`}
        onClick={handleClick}
        className={`block border-l-2 py-2 px-4 transition-colors duration-200 text-sm ${isActive ? activeClasses : inactiveClasses}`}
      >
        {section.title}
      </a>
    </li>
  );
};


export const Sidebar: React.FC<SidebarProps> = ({ sections, activeSection, isOpen, onClose }) => {
  return (
    <aside 
      className={`fixed top-0 left-0 h-full w-64 bg-slate-900/70 backdrop-blur-lg border-r border-slate-800 z-40 transform transition-transform duration-300 ease-in-out 
      md:w-64 lg:w-72 xl:w-80
      ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
      aria-hidden={!isOpen && typeof window !== 'undefined' && window.innerWidth < 768}
    >
      <div className="h-full overflow-y-auto">
         <div className="flex justify-between items-center pt-8 pb-4 px-4 md:hidden">
            <h3 className="text-sm font-semibold uppercase text-slate-400 tracking-wider">
                Menu
            </h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
        <nav className="pt-4 pb-20 md:py-20 md:px-4">
          <h3 className="text-xs font-semibold uppercase text-slate-500 tracking-wider px-4 mb-4 hidden md:block">
            Table of Contents
          </h3>
          <ul>
            {sections.map((section) => (
              <NavLink 
                key={section.id}
                section={section}
                isActive={activeSection === section.id}
                onClick={onClose}
              />
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
};