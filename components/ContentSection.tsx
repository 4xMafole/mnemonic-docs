import React from 'react';
import { Section, ContentElement } from '../types';
import { CodeBlock } from './CodeBlock';
import { ArchitectureDiagram } from './ArchitectureDiagram';
import { MvccVisualizer } from './MvccVisualizer';
import { SemanticsVisualizer } from './SemanticsVisualizer';
import { ConstraintVisualizer } from './ConstraintVisualizer';
import { PersistenceVisualizer } from './PersistenceVisualizer';
import { DependentTypeVisualizer } from './DependentTypeVisualizer';
import { LsmTreeVisualizer } from './LsmTreeVisualizer';
import { ParadigmVisualizer } from './ParadigmVisualizer';
import { MnemonicPlayground } from './MnemonicPlayground';
import { SecureQueryVisualizer } from './SecureQueryVisualizer';
import { RebacVisualizer } from './RebacVisualizer';
import { CoreModelVisualizer } from './CoreModelVisualizer';
import { QueryPipelineVisualizer } from './QueryPipelineVisualizer';
import { InheritanceVisualizer } from './InheritanceVisualizer';

interface ContentSectionProps {
  section: Section;
  setRef: (id: string, el: HTMLElement | null) => void;
}

const renderContentElement = (element: ContentElement, index: number) => {
  switch (element.type) {
    case 'text':
      return <p key={index} className="text-slate-400 my-4 leading-relaxed">{element.content}</p>;
    case 'header':
      const Tag = `h${element.level}`;
      const classes: { [key: number]: string } = {
        2: 'text-2xl sm:text-3xl font-bold text-slate-200 mt-12 mb-4 border-b border-slate-700 pb-2',
        3: 'text-xl sm:text-2xl font-semibold text-slate-200 mt-8 mb-3',
      };
      return React.createElement(Tag, { key: index, className: classes[element.level] || '' }, element.content);
    case 'list':
      return (
        <ul key={index} className="list-disc list-inside space-y-2 my-4 text-slate-400 pl-4">
          {element.items.map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      );
    case 'code':
      return <CodeBlock key={index} language={element.language} content={element.content} />;
    case 'definitionList':
      return (
        <dl key={index} className="my-6 space-y-4">
          {element.items.map((item, i) => (
            <div key={i}>
              <dt className="font-semibold text-slate-200">{item.term}</dt>
              <dd className="text-slate-400 pl-4 border-l-2 border-slate-700 ml-2 mt-1">{item.definition}</dd>
            </div>
          ))}
        </dl>
      );
    case 'architectureDiagram':
        return <ArchitectureDiagram key={index} />;
    case 'mvccVisualizer':
        return <MvccVisualizer key={index} />;
    case 'semanticsVisualizer':
        return <SemanticsVisualizer key={index} />;
    case 'constraintVisualizer':
        return <ConstraintVisualizer key={index} />;
    case 'persistenceVisualizer':
        return <PersistenceVisualizer key={index} />;
    case 'dependentTypeVisualizer':
        return <DependentTypeVisualizer key={index} />;
    case 'lsmTreeVisualizer':
        return <LsmTreeVisualizer key={index} />;
    case 'paradigmVisualizer':
        return <ParadigmVisualizer key={index} />;
    case 'mnemonicPlayground':
        return <MnemonicPlayground key={index} />;
    case 'secureQueryVisualizer':
        return <SecureQueryVisualizer key={index} />;
    case 'rebacVisualizer':
        return <RebacVisualizer key={index} scenario={element.scenario} />;
    case 'coreModelVisualizer':
        return <CoreModelVisualizer key={index} />;
    case 'queryPipelineVisualizer':
        return <QueryPipelineVisualizer key={index} />;
    case 'inheritanceVisualizer':
        return <InheritanceVisualizer key={index} />;
    default:
      return null;
  }
};

export const ContentSection: React.FC<ContentSectionProps> = ({ section, setRef }) => {
  return (
    <section ref={(el) => setRef(section.id, el)} id={section.id}>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-tight border-b border-slate-800 pb-4">
        {section.title}
      </h2>
      <div className="mt-4">
        {section.content.map(renderContentElement)}
      </div>
    </section>
  );
};