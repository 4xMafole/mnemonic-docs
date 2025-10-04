// For document structure
export interface TextElement {
  type: 'text';
  content: string;
}

export interface HeaderElement {
  type: 'header';
  level: number;
  content: string;
}

export interface ListElement {
  type: 'list';
  items: string[];
}

export interface CodeElement {
  type: 'code';
  language?: string;
  content: string;
}

export interface DefinitionListElement {
  type: 'definitionList';
  items: { term: string; definition: string }[];
}

// For special visualizer components
export interface ArchitectureDiagramElement {
  type: 'architectureDiagram';
}

export interface LsmTreeVisualizerElement {
    type: 'lsmTreeVisualizer';
}

export interface MvccVisualizerElement {
    type: 'mvccVisualizer';
}

export interface SemanticsVisualizerElement {
    type: 'semanticsVisualizer';
}

export interface ConstraintVisualizerElement {
    type: 'constraintVisualizer';
}

export interface PersistenceVisualizerElement {
    type: 'persistenceVisualizer';
}

export interface DependentTypeVisualizerElement {
    type: 'dependentTypeVisualizer';
}

export interface ParadigmVisualizerElement {
    type: 'paradigmVisualizer';
}

export interface MnemonicPlaygroundElement {
    type: 'mnemonicPlayground';
}

export interface SecureQueryVisualizerElement {
    type: 'secureQueryVisualizer';
}

export interface RebacVisualizerElement {
    type: 'rebacVisualizer';
    scenario: RebacScenario;
}

export interface CoreModelVisualizerElement {
    type: 'coreModelVisualizer';
}

export interface QueryPipelineVisualizerElement {
    type: 'queryPipelineVisualizer';
}

export interface InheritanceVisualizerElement {
    type: 'inheritanceVisualizer';
}


export type ContentElement =
  | TextElement
  | HeaderElement
  | ListElement
  | CodeElement
  | DefinitionListElement
  | ArchitectureDiagramElement
  | LsmTreeVisualizerElement
  | MvccVisualizerElement
  | SemanticsVisualizerElement
  | ConstraintVisualizerElement
  | PersistenceVisualizerElement
  | DependentTypeVisualizerElement
  | ParadigmVisualizerElement
  | MnemonicPlaygroundElement
  | SecureQueryVisualizerElement
  | RebacVisualizerElement
  | CoreModelVisualizerElement
  | QueryPipelineVisualizerElement
  | InheritanceVisualizerElement;

export interface Section {
  id: string;
  title: string;
  content: ContentElement[];
}

export interface Document {
  key: string;
  title:string;
  shortTitle: string;
  content: Section[];
}

// For Graph Visualizer
export interface GraphNode {
  id: string;
  label: string;
  type?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

// For ReBAC Visualizer
export interface RebacNode {
    id: string;
    label: string;
    type: 'user' | 'group' | 'resource';
}

export interface RebacEdge {
    source: string;
    target: string;
    label: string;
}

export interface RebacScenario {
    nodes: RebacNode[];
    edges: RebacEdge[];
    policies: { description: string };
    principals: string[];
    resources: string[];
}