import { Section } from './types';

export const specificationContent: Section[] = [
  {
    id: 'spec-doc-info',
    title: 'Document Information',
    content: [
      { type: 'list', items: [
        'Title: Mnemonic Computing Specification',
        'Version: 0.1',
        'Date: August 15, 2025',
        'Status: Draft for Review',
      ]}
    ]
  },
  {
    id: 'spec-abstract',
    title: 'Abstract',
    content: [
      { type: 'text', content: 'This document specifies the Mnemonic Computing paradigm, a novel approach to data representation and computation based on an association-addressable semantic graph. It defines the core data model, operational semantics, and system constraints required to implement a compliant Mnemonic Runtime Environment (MRE).' },
    ]
  },
  {
    id: 'spec-intro',
    title: '1. Introduction & Rationale',
    content: [
      { type: 'header', level: 2, content: '1.1 The Problem with Location-Addressable Memory' },
      { type: 'text', content: 'Traditional computing models are built upon location-addressable memory, where data is stored and retrieved from specific, numbered addresses. This requires developers to manage complex layers of abstraction (pointers, object-relational mappers, etc.) to translate between high-level concepts and low-level storage. This "semantic gap" is a primary source of complexity and error in modern software.' },
      { type: 'header', level: 2, content: '1.2 The Mnemonic Paradigm' },
      { type: 'text', content: 'Mnemonic Computing proposes an alternative: association-addressable data. In this model, data is addressed not by its location, but by its relationships to other data. The core of the system is a semantic graph where concepts and their interconnections are first-class citizens. This approach fundamentally aligns the data model with human cognition, which is inherently associative.' },
      { type: 'paradigmVisualizer' }
    ]
  },
  {
    id: 'spec-core-model',
    title: '2. Core Data Model',
    content: [
      { type: 'header', level: 2, content: '2.1 Concepts' },
      { type: 'text', content: 'A Concept is the fundamental unit of information in the Mnemonic system. It is an atomic, indivisible entity that represents a person, place, thing, or idea. Each Concept is uniquely identified and can hold unstructured data.' },
      { type: 'header', level: 2, content: '2.2 Relationships' },
      { type: 'text', content: 'A Relationship is a directed, labeled connection between two Concepts. It represents a semantic link, such as "works for," "is located in," or "invented." Relationships are first-class entities and form the basis of the graph structure.' },
      { type: 'coreModelVisualizer' },
      { type: 'header', level: 2, content: '2.3 The Semantic Graph' },
      { type: 'text', content: 'The Semantic Graph, denoted as G, is the tuple (C, R), where C is the set of all Concepts and R is the set of all Relationships. The interactive playground below allows you to manipulate a live semantic graph.' },
      { type: 'mnemonicPlayground' },
    ]
  },
  {
    id: 'spec-ops-semantics',
    title: '3. Operational Semantics',
    content: [
      { type: 'header', level: 2, content: '3.1 Core Operations' },
      { type: 'text', content: 'The Mnemonic Runtime Environment (MRE) MUST support four fundamental, atomic operations:' },
      { type: 'definitionList', items: [
        { term: 'STORE(data)', definition: 'Creates a new Concept in the graph containing the provided data and returns its unique identifier.' },
        { term: 'RELATE(source, label, target)', definition: 'Creates a new directed Relationship with the given label from the source Concept to the target Concept.' },
        { term: 'RETRIEVE(pattern)', definition: 'Queries the graph for all subgraphs that match the given pattern. This is the primary method of data retrieval.' },
        { term: 'UNRELATE(pattern)', definition: 'Removes all Relationships from the graph that match the given pattern.' },
      ]},
      { type: 'header', level: 2, content: '3.2 Transactional Semantics' },
      { type: 'text', content: 'All graph modifications must occur within an ACID-compliant transaction. The specification mandates a Multi-Version Concurrency Control (MVCC) model to ensure high concurrency without locking. This provides snapshot isolation for all RETRIEVE operations.' },
      { type: 'mvccVisualizer' },
      { type: 'header', level: 2, content: '3.3 Formal Semantics' },
      { type: 'text', content: 'The operational semantics are formally defined using a state-transition system. The state of the MRE is represented by a tuple (G, σ, κ), where G is the current graph state, σ is the set of variable bindings, and κ is the continuation stack. The visualizer below demonstrates the state transitions for a simple RETRIEVE query.' },
      { type: 'semanticsVisualizer' }
    ]
  },
  {
    id: 'spec-constraints',
    title: '4. Constraints and Types',
    content: [
      { type: 'header', level: 2, content: '4.1 Type System' },
      { type: 'text', content: 'While the core graph is schemaless, the MRE supports an optional, powerful type system for enforcing data integrity. A "Concept Type" is a set of constraints that a Concept must satisfy.' },
      { type: 'header', level: 3, content: '4.1.1 Relationship Constraints' },
      { type: 'text', content: 'Types can define constraints on the relationships a concept can have, including their labels, target types, and cardinality (e.g., "A Person must have exactly one `age` relationship pointing to an Integer"). The interactive visualizer below allows you to define constraints for a "Person" type and see a valid instance.' },
      { type: 'constraintVisualizer' },
      { type: 'header', level: 3, content: '4.1.2 Dependent Types' },
      { type: 'text', content: 'The type system supports dependent types, where the constraints on one part of a concept can depend on the value of another. For example, an `Employee` type might require the `salary` to be greater than the `min_wage` of their `employer`.' },
      { type: 'dependentTypeVisualizer' }
    ]
  },
  {
    id: 'spec-persistence',
    title: '5. Persistence Model',
    content: [
      { type: 'header', level: 2, content: '5.1 Append-Only Log' },
      { type: 'text', content: 'All state-changing operations (STORE, RELATE, UNRELATE) must first be written to a durable, append-only Write-Ahead Log (WAL). This ensures that the system can recover from crashes without data loss. The log provides a complete, ordered history of all modifications.' },
      { type: 'header', level: 2, content: '5.2 In-Memory Index' },
      { type: 'text', content: 'For performance, the MRE maintains an in-memory index of the graph structure. This index is reconstructed from the log on startup and is updated asynchronously after log entries are committed. This architecture, often seen in high-performance databases, separates the durability of writes from the overhead of indexing.' },
      { type: 'persistenceVisualizer' },
    ]
  }
];