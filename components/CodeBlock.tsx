import React from 'react';

interface CodeBlockProps {
  language?: string;
  content: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, content }) => {
  return (
    <div className="my-6">
      <pre className="bg-slate-800/50 p-4 rounded-lg text-sm text-slate-300 font-mono whitespace-pre-wrap break-words">
        <code className={`language-${language || 'plaintext'}`}>
          {content.trim()}
        </code>
      </pre>
    </div>
  );
};