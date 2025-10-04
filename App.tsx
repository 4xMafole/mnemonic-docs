import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentSection } from './components/ContentSection';
import { Header } from './components/Header';
import { documents } from './constants';
import { Section, Document } from './types';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeDocKey, setActiveDocKey] = useState<string>(documents[0].key);
  
  const activeDocument = documents.find(doc => doc.key === activeDocKey) || documents[0];
  const activeDocContent = activeDocument.content;

  const [activeSection, setActiveSection] = useState<string>(activeDocContent[0]?.id || '');
  const observer = useRef<IntersectionObserver | null>(null);
  const sectionRefs = useRef<Map<string, HTMLElement>>(new Map());

  const handleIntersect = useCallback((entries: IntersectionObserverEntry[]) => {
    const visibleEntries = entries.filter(entry => entry.isIntersecting);
    if (visibleEntries.length > 0) {
      visibleEntries.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const topVisibleId = visibleEntries[0].target.id;
      setActiveSection(topVisibleId);
    }
  }, []);
  
  // This effect runs when the document changes
  useEffect(() => {
    // Disconnect the old observer
    observer.current?.disconnect();
    sectionRefs.current.clear();
    
    // Reset active section to the top of the new document
    const newFirstSection = activeDocContent[0]?.id;
    if (newFirstSection) {
        setActiveSection(newFirstSection);
        window.scrollTo(0, 0); // Scroll to top on doc change
    }

    // Create a new observer for the new document's content
    observer.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    });

    // We need to wait for the DOM to update with the new sections
    const timeoutId = setTimeout(() => {
      sectionRefs.current.forEach((ref) => {
        if (ref) {
          observer.current?.observe(ref);
        }
      });
    }, 100); // A small delay to ensure refs are populated

    return () => {
      clearTimeout(timeoutId);
      observer.current?.disconnect();
    };
  }, [activeDocKey, activeDocContent, handleIntersect]);

  const setRef = (id: string, el: HTMLElement | null) => {
    if (el) {
      sectionRefs.current.set(id, el);
    } else {
      sectionRefs.current.delete(id);
    }
  };

  const handleDocChange = (key: string) => {
    setActiveDocKey(key);
    setIsSidebarOpen(false); // Close sidebar on mobile when changing docs
  };

  return (
    <div className="flex min-h-screen font-sans">
      <Sidebar 
        sections={activeDocContent} 
        activeSection={activeSection} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}

      <main className="flex-1 md:ml-64 lg:ml-72 xl:ml-80">
        <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12">
          <Header 
            onToggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
            documents={documents}
            activeDocument={activeDocument}
            onDocChange={handleDocChange}
          />
          <div className="mt-16 space-y-16">
            {activeDocContent.map((section: Section) => (
              <ContentSection 
                key={section.id} 
                section={section} 
                setRef={setRef} 
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
