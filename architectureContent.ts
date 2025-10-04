import { Section } from './types';

export const architectureContent: Section[] = [
  {
    id: 'arch-doc-info',
    title: 'Document Information',
    content: [
      { type: 'list', items: [
        'Title: Mnemonic Computing Technical Architecture & Implementation Plan',
        'Version: 0.1',
        'Date: September 20, 2025',
        'Phase: Foundation (Months 1-3)',
        'Related Documents: Mnemonic Computing Specification v0.1, Security & Permissions Model v0.1',
      ]}
    ]
  },
  {
    id: 'arch-summary',
    title: 'Executive Summary',
    content: [
        { type: 'text', content: "This document defines the technical architecture and implementation roadmap for the Mnemonic Computing platform's foundational phase. The plan establishes concrete technology choices, architectural patterns, and development milestones to transform the theoretical specification into a working prototype." },
        { type: 'header', level: 3, content: 'Technology Stack Decision:' },
        { type: 'list', items: [
            'Core Language: Rust for performance, memory safety, and concurrency',
            'Storage Backend: RocksDB for high-performance embedded key-value storage',
            'Explorer UI: Modern web stack with D3.js for graph visualization',
        ]},
        { type: 'header', level: 3, content: 'Phase 1 Objectives:' },
        { type: 'list', items: [
            'Implement core Mnemonic Runtime Environment (MRE)',
            'Develop foundational graph operations (STORE, RELATE, RETRIEVE, UNRELATE)',
            'Create basic security and permissions framework',
            'Build developer tooling and debugging capabilities',
            'Establish performance benchmarking infrastructure',
        ]},
    ]
  },
  {
    id: 'arch-overview',
    title: '1. Architecture Overview',
    content: [
      { type: 'header', level: 2, content: '1.1 High-Level Architecture' },
      { type: 'text', content: 'The Mnemonic Computing platform follows a layered architecture that separates concerns while maintaining tight integration between components. Hover over a layer in the diagram below to learn more.' },
      { type: 'architectureDiagram' },
      { type: 'header', level: 2, content: '1.2 Core Design Principles' },
      { type: 'definitionList', items: [
          { term: 'Performance First', definition: 'Every component designed for high-throughput, low-latency operations.' },
          { term: 'Memory Safety', definition: "Rust's ownership system prevents entire classes of bugs common in systems programming." },
          { term: 'Modular Design', definition: 'Clean interfaces between components enable independent development and testing.' },
          { term: 'Observability', definition: 'Comprehensive metrics, logging, and tracing built into every layer.' },
          { term: 'Extensibility', definition: 'Plugin architecture for custom storage backends, query optimizers, and security policies.' },
      ]},
    ],
  },
  {
    id: 'tech-stack',
    title: '2. Technology Stack Rationale',
    content: [
      { type: 'header', level: 2, content: '2.1 Rust for Core Implementation' },
      { type: 'header', level: 3, content: 'Performance Benefits:'},
      { type: 'list', items: [
        'Zero-cost abstractions with C++ level performance',
        'Excellent multi-threading support with data race prevention',
        'Minimal runtime overhead suitable for embedded deployment',
        'LLVM-based optimization for maximum efficiency',
      ]},
      { type: 'header', level: 3, content: 'Safety Benefits:'},
      { type: 'list', items: [
        'Memory safety without garbage collection overhead',
        'Thread safety enforced at compile time',
        'Pattern matching for robust error handling',
        'Strong type system prevents many runtime errors',
      ]},
      { type: 'header', level: 3, content: 'Ecosystem Advantages:'},
      { type: 'list', items: [
        'Excellent RocksDB bindings with rocksdb crate',
        'Rich concurrency primitives with tokio and rayon',
        'Comprehensive serialization support with serde',
        'Production-ready HTTP frameworks with axum or warp',
      ]},
      { type: 'header', level: 3, content: 'Code Example:'},
      { type: 'code', language: 'rust', content: `use rocksdb::{DB, Options, WriteBatch};
use uuid::Uuid;
use serde::{Serialize, Deserialize};

#[derive(Serialize, Deserialize, Clone)]
pub struct Concept {
    pub id: Uuid,
    pub data: serde_json::Value,
    pub created_at: SystemTime,
    pub metadata: ConceptMetadata,
}

pub struct GraphEngine {
    db: Arc<DB>,
    indices: IndexManager,
    transaction_manager: TransactionManager,
}

impl GraphEngine {
    pub async fn store(&self, concept_data: serde_json::Value) -> Result<Uuid, GraphError> {
        let concept_id = Uuid::new_v4();
        let concept = Concept {
            id: concept_id,
            data: concept_data,
            created_at: SystemTime::now(),
            metadata: ConceptMetadata::default(),
        };
        let mut batch = WriteBatch::default();
        batch.put(
            format!("concept:{}", concept_id),
            bincode::serialize(&concept)?
        );
        self.db.write(batch)?;
        self.indices.add_concept(&concept).await?;
        Ok(concept_id)
    }
}` },
      { type: 'header', level: 2, content: '2.2 RocksDB for Storage Backend' },
      { type: 'header', level: 3, content: 'Architecture Fit:'},
      { type: 'list', items: [
          'LSM-tree structure optimized for write-heavy graph workloads',
          'Column families enable logical separation of concepts, relationships, and indices',
          'Built-in compression reduces storage requirements',
          'ACID transactions support complex graph operations',
      ]},
      { type: 'text', content: 'The following animation demonstrates the core mechanism of a Log-Structured Merge-Tree (LSM-Tree), which is the engine that powers RocksDB. It shows how incoming writes are buffered in memory and then flushed to immutable, sorted files on disk, which are later merged for efficiency.' },
      { type: 'lsmTreeVisualizer' },
      { type: 'header', level: 3, content: 'RocksDB Configuration:'},
      { type: 'code', language: 'rust', content: `pub fn create_graph_db(path: &Path) -> Result<DB, rocksdb::Error> {
    let mut opts = Options::default();
    opts.create_if_missing(true);
    opts.set_max_open_files(10000);
    opts.set_use_fsync(false);

    let concept_cf = ColumnFamilyDescriptor::new("concepts", opts.clone());
    let relationship_cf = ColumnFamilyDescriptor::new("relationships", opts.clone());
    let index_cf = ColumnFamilyDescriptor::new("indices", opts.clone());

    DB::open_cf_descriptors(&db_opts, path, vec![concept_cf, relationship_cf, index_cf])
}`},
    { type: 'header', level: 2, content: '2.3 Explorer UI Technology Stack' },
    { type: 'definitionList', items: [
        { term: 'Frontend Framework', definition: 'React with TypeScript' },
        { term: 'Visualization Library', definition: 'D3.js with WebGL acceleration' },
        { term: 'State Management', definition: 'Zustand for lightweight, predictable state' },
        { term: 'UI Components', definition: 'Tailwind CSS + Headless UI' },
    ]},
    ],
  },
  {
      id: 'system-architecture',
      title: '3. System Architecture',
      content: [
          { type: 'header', level: 2, content: '3.1 Mnemonic Runtime Environment (MRE)'},
          { type: 'header', level: 3, content: '3.1.1 Graph Engine Core'},
          { type: 'text', content: 'The Graph Engine provides the fundamental operations for concept and relationship management.'},
          { type: 'code', language: 'rust', content: `pub trait GraphEngine: Send + Sync {
    async fn store(&self, concept: ConceptData) -> Result<ConceptId, GraphError>;
    async fn relate(&self, source: ConceptId, rel_type: &str, target: ConceptId) -> Result<RelationshipId, GraphError>;
    async fn retrieve(&self, pattern: QueryPattern) -> Result<QueryResults, GraphError>;
    // Transaction support
    async fn begin_transaction(&self) -> Result<TransactionId, GraphError>;
    async fn commit_transaction(&self, txn_id: TransactionId) -> Result<(), GraphError>;
}`},
          { type: 'header', level: 3, content: '3.1.2 Index Management System'},
          { type: 'text', content: 'Efficient querying requires specialized indices for different access patterns.'},
          { type: 'code', language: 'rust', content: `pub struct IndexManager {
    // Core indices for basic operations
    concept_by_id: Arc<RwLock<HashMap<ConceptId, ConceptRecord>>>,
    relationships_by_source: Arc<RwLock<HashMap<ConceptId, Vec<RelationshipId>>>>,
    // Specialized indices for query optimization
    concept_type_index: Arc<TypeIndex>,
    relationship_pattern_index: Arc<PatternIndex>,
}`},
          { type: 'header', level: 3, content: '3.1.3 Query Engine Architecture'},
          { type: 'text', content: 'The Query Engine translates high-level patterns into efficient graph traversals. The process is a pipeline that moves from parsing the query, to optimizing it, executing it against the graph, and finally caching the results for future use.'},
          { type: 'queryPipelineVisualizer' },
          { type: 'code', language: 'rust', content: `pub struct QueryEngine {
    graph: Arc<dyn GraphEngine>,
    optimizer: QueryOptimizer,
    executor: QueryExecutor,
    cache: Arc<QueryCache>,
}`},
          { type: 'header', level: 2, content: '3.2 Concurrency and Transaction Management'},
          { type: 'header', level: 3, content: '3.2.1 MVCC Implementation'},
          { type: 'text', content: "Following the specification's MVCC design:"},
          { type: 'code', language: 'rust', content: `pub struct TransactionManager {
    active_transactions: Arc<RwLock<HashMap<TransactionId, Transaction>>>,
    version_store: Arc<VersionStore>,
    conflict_detector: Arc<ConflictDetector>,
}

#[derive(Clone)]
pub struct Transaction {
    pub id: TransactionId,
    pub start_timestamp: Timestamp,
    pub read_set: HashSet<ConceptId>,
    pub write_set: HashSet<ConceptId>,
    pub snapshot: GraphSnapshot,
}`},
          { type: 'header', level: 3, content: '3.2.2 Version Store Design'},
          { type: 'code', language: 'rust', content: `pub struct VersionStore {
    concept_versions: Arc<RwLock<HashMap<ConceptId, Vec<ConceptVersion>>>>,
    relationship_versions: Arc<RwLock<HashMap<RelationshipId, Vec<RelationshipVersion>>>>,
    gc_manager: Arc<GarbageCollector>,
}`},
          { type: 'header', level: 2, content: '3.3 Security Integration'},
          { type: 'header', level: 3, content: '3.3.1 Security Engine Architecture'},
          { type: 'code', language: 'rust', content: `pub struct SecurityEngine {
    policy_engine: Arc<PolicyEngine>,
    principal_manager: Arc<PrincipalManager>,
    audit_logger: Arc<AuditLogger>,
    session_manager: Arc<SessionManager>,
}`},
      ],
  },
  {
      id: 'implementation-components',
      title: '4. Implementation Components',
      content: [
          { type: 'header', level: 2, content: '4.1 Core Library Structure'},
          { type: 'code', language: 'bash', content: `mnemonic-core/
├── Cargo.toml
└── src/
    ├── lib.rs          # Public API exports
    ├── graph/          # Graph engine implementation
    ├── query/          # Query processing
    ├── transaction/    # Transaction management
    ├── security/       # Security framework
    └── types/          # Core data types`},
          { type: 'header', level: 2, content: '4.2 API Layer Design'},
          { type: 'code', language: 'rust', content: `// REST API with axum framework
pub fn create_app(state: AppState) -> Router {
    Router::new()
        .route("/concepts", post(create_concept))
        .route("/concepts/:id", get(get_concept))
        .route("/relationships", post(create_relationship))
        .route("/query", post(execute_query))
        .with_state(state)
        .layer(TraceLayer::new_for_http())
}`},
        { type: 'header', level: 2, content: '4.3 Explorer UI Architecture'},
          { type: 'code', language: 'bash', content: `src/
├── components/
│   ├── GraphVisualization/
│   │   ├── GraphCanvas.tsx       # D3.js integration
│   │   ├── NodeComponent.tsx
│   │   └── EdgeComponent.tsx
│   └── QueryBuilder/
├── hooks/
│   ├── useGraphData.ts
│   └── useQueryEngine.ts
└── stores/
    ├── graphStore.ts
    └── queryStore.ts`},
      ]
  },
  {
      id: 'dev-phases',
      title: '5. Development Phases',
      content: [
          { type: 'header', level: 2, content: '5.1 Phase 1.1: Core Infrastructure (Weeks 1-4)'},
          { type: 'list', items: ['Set up development environment and CI/CD pipeline', 'Implement basic RocksDB integration', 'Create fundamental data types and serialization', 'Establish testing framework and benchmarking harness']},
          { type: 'header', level: 2, content: '5.2 Phase 1.2: Graph Operations (Weeks 5-8)'},
          { type: 'list', items: ['Implement core graph operations (STORE, RELATE, UNRELATE, RETRIEVE)', 'Build index management system', 'Create basic query pattern matching', 'Establish transaction boundaries']},
          { type: 'header', level: 2, content: '5.3 Phase 1.3: Query Engine (Weeks 9-10)'},
          { type: 'list', items: ['Develop query optimization algorithms', 'Implement advanced pattern matching', 'Create query result caching system', 'Build query performance monitoring']},
          { type: 'header', level: 2, content: '5.4 Phase 1.4: Security Framework (Weeks 11-12)'},
          { type: 'list', items: ['Implement basic ReBAC security model', 'Create authentication and session management', 'Build policy evaluation engine', 'Establish audit logging framework']},
      ]
  },
  {
      id: 'performance-reqs',
      title: '6. Performance Requirements',
      content: [
          { type: 'header', level: 2, content: '6.1 Latency Targets'},
          { type: 'list', items: ['STORE operation: <1ms average, <5ms P99', 'RELATE operation: <1ms average, <3ms P99', 'Simple RETRIEVE (single hop): <2ms average, <10ms P99', 'Complex RETRIEVE (multi-hop): <20ms average, <100ms P99']},
          { type: 'header', level: 2, content: '6.2 Throughput Targets'},
          { type: 'list', items: ['Mixed workload: >10,000 ops/sec', 'Read-heavy workload: >50,000 ops/sec', 'Write-heavy workload: >5,000 ops/sec']},
          { type: 'header', level: 2, content: '6.3 Resource Utilization'},
          { type: 'list', items: ['Base memory footprint: <100MB', 'Memory per 1M concepts: <2GB', 'Index memory overhead: <30% of data size', 'Compression ratio: >3:1 for typical graph data']},
      ]
  },
  {
      id: 'testing-strategy',
      title: '7. Testing Strategy',
      content: [
          { type: 'header', level: 2, content: '7.1 Unit Testing Framework'},
          { type: 'text', content: 'Property-based testing with quickcheck to ensure correctness across a wide range of inputs.'},
          { type: 'code', language: 'rust', content: `#[quickcheck]
fn store_retrieve_consistency(concept_data: ArbitraryConceptData) -> TestResult {
    // ...
}`},
          { type: 'header', level: 2, content: '7.2 Integration Testing'},
          { type: 'text', content: 'End-to-end tests covering graph operations and security integration.'},
          { type: 'code', language: 'rust', content: `#[tokio::test]
async fn end_to_end_graph_operations() {
    let engine = create_test_graph_engine().await;
    let person_id = engine.store(json!({"type": "person", "name": "Alice"})).await.unwrap();
    // ...
}`},
        { type: 'header', level: 2, content: '7.3 Performance Testing'},
        { type: 'text', content: 'Benchmarking for core operations and complex queries using Bencher.'},
        { type: 'code', language: 'rust', content: `#[bench]
fn bench_complex_query(b: &mut Bencher) {
    // ...
}`},
      ]
  },
  {
      id: 'deployment',
      title: '8. Deployment Architecture',
      content: [
          { type: 'header', level: 2, content: '8.1 Development Environment'},
          { type: 'code', language: 'yaml', content: `# docker-compose.yml for development
version: '3.8'
services:
  mnemonic-core:
    build: .
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
  explorer-ui:
    build: ./explorer-ui
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8080`},
          { type: 'header', level: 2, content: '8.2 Production Deployment'},
          { type: 'code', language: 'yaml', content: `# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mnemonic-runtime
spec:
  replicas: 3
  template:
    spec:
      containers:
        - name: mre
          image: mnemonic/runtime:latest`},
        { type: 'header', level: 2, content: '8.3 Monitoring and Observability'},
        { type: 'text', content: 'Metrics collection using Prometheus.'},
        { type: 'code', language: 'rust', content: `pub struct MnemonicMetrics {
    // Operation counters
    pub store_operations_total: Counter,
    // Latency histograms
    pub store_duration_seconds: Histogram,
    // Resource gauges
    pub active_concepts: Gauge,
}`},
      { type: 'header', level: 2, content: '8.4 Configuration Management'},
        { type: 'text', content: 'Configuration structure with environment override.'},
        { type: 'code', language: 'rust', content: `#[derive(Debug, Deserialize, Serialize)]
pub struct MnemonicConfig {
    pub server: ServerConfig,
    pub storage: StorageConfig,
    pub performance: PerformanceConfig,
}

impl MnemonicConfig {
    pub fn load() -> Result<Self, ConfigError> {
        // ... load from file and environment
    }
}`},
      ]
  },
  {
    id: 'arch-conclusion',
    title: 'Conclusion',
    content: [
      { type: 'text', content: 'This technical architecture and implementation plan provides a comprehensive roadmap for building the foundational Mnemonic Computing platform. The chosen technology stack of Rust + RocksDB offers optimal performance characteristics while maintaining safety and reliability.' },
      { type: 'header', level: 3, content: 'Key Success Factors:' },
      { type: 'list', items: ['Incremental Development', 'Performance Focus', 'Comprehensive Testing', 'Production Readiness'] },
    ]
  }
];