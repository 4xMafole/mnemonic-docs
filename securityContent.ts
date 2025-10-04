import { Section } from './types';

const healthcareScenario = {
    nodes: [
        { id: 'alice', label: 'Dr. Alice', type: 'user' as const },
        { id: 'bob', label: 'Dr. Bob', type: 'user' as const },
        { id: 'john', label: 'John (Patient)', type: 'resource' as const },
        { id: 'cardiology', label: 'Cardiology Dept', type: 'group' as const },
        { id: 'records', label: 'Cardiac Records', type: 'resource' as const },
    ],
    edges: [
        { source: 'alice', target: 'john', label: 'treated_by' },
        { source: 'alice', target: 'cardiology', label: 'member_of' },
        { source: 'cardiology', target: 'records', label: 'has_access' },
    ],
    policies: {
        description: "Policy: A doctor can access patient records if they are a member of a department that has access to those records. Access to a specific patient requires a direct 'treated_by' relationship.",
    },
    principals: ['Dr. Alice', 'Dr. Bob'],
    resources: ['John (Patient)', 'Cardiac Records'],
};


export const securityContent: Section[] = [
    {
        id: 'sec-doc-info',
        title: 'Document Information',
        content: [
            { type: 'list', items: [
                'Title: Security & Permissions Model for Mnemonic Computing',
                'Version: 0.1',
                'Date: September 20, 2025',
                'Status: Draft',
                'Related Document: Mnemonic Computing Specification v0.1',
            ]}
        ]
    },
    {
        id: 'sec-summary',
        title: 'Executive Summary',
        content: [
            { type: 'text', content: "This whitepaper presents a comprehensive security and permissions model for Mnemonic Computing environments, introducing Relationship-Based Access Control (ReBAC) as the primary authorization mechanism. Unlike traditional role-based systems, this model leverages the semantic graph structure to create dynamic, context-aware access control policies that naturally integrate with the Mnemonic Computing paradigm." },
            { type: 'header', level: 3, content: 'Key Innovation' },
            { type: 'text', content: "Security policies are expressed as graph relationships themselves, making permissions first-class citizens in the semantic graph and enabling unprecedented flexibility in access control management." },
            { type: 'header', level: 3, content: 'Core Benefits:' },
            { type: 'list', items: [
                'Native graph integration with security as part of the data model',
                'Dynamic access control based on changing relationships',
                'Contextual permissions that adapt to graph topology',
                'Audit trail integration through graph history tracking',
            ]},
        ],
    },
    {
        id: 'sec-intro',
        title: '1. Introduction',
        content: [
            { type: 'header', level: 2, content: '1.1 Security Challenges in Graph Computing' },
            { type: 'definitionList', items: [
                { term: 'Static Permission Models', definition: "Role-based access control (RBAC) assumes fixed hierarchies that don't adapt to dynamic relationships." },
                { term: 'Context Insensitivity', definition: 'Traditional systems cannot incorporate relationship context into authorization decisions.' },
                { term: 'Graph Topology Blindness', definition: 'Conventional access control ignores the interconnected nature of graph data.' },
                { term: 'Scalability Constraints', definition: 'Managing permissions for highly connected data becomes administratively complex.' },
            ]},
            { type: 'header', level: 2, content: '1.2 Relationship-Based Access Control (ReBAC)' },
            { type: 'text', content: "ReBAC addresses these limitations by treating relationships as the foundation for authorization decisions. This approach provides several advantages:" },
            { type: 'list', items: [
                'Natural Integration: Security policies use the same graph primitives as application logic.',
                'Dynamic Adaptation: Permissions automatically adjust as relationships change.',
                'Context Awareness: Authorization considers the full relationship context.',
                'Scalable Management: Graph-based policies scale with system complexity.',
            ]},
            { type: 'header', level: 2, content: '1.3 Design Principles' },
            { type: 'list', items: [
                '1. Security as Graph Data: Permissions are concepts and relationships in the semantic graph.',
                '2. Principle of Least Privilege: Default deny with explicit grant requirements.',
                '3. Contextual Authorization: Decisions based on relationship patterns and constraints.',
                '4. Audit Transparency: Complete operation history through graph versioning.',
                '5. Performance Optimization: Efficient access control evaluation through graph indices.',
            ]},
        ],
    },
    {
        id: 'sec-theoretical-foundation',
        title: '2. Theoretical Foundation',
        content: [
            { type: 'header', level: 2, content: '2.1 Formal Model Definition' },
            { type: 'text', content: 'The ReBAC model for Mnemonic Computing is formally defined as: S = (G, P, E, A)'},
            { type: 'list', items: [
                'G: The semantic graph containing concepts and relationships',
                'P: Set of security principals (users, groups, services)',
                'E: Set of security policies expressed as graph patterns',
                'A: Authorization function A: (P, Operation, Target) → {Grant, Deny}',
            ]},
            { type: 'header', level: 2, content: '2.2 Security Graph Extension' },
            { type: 'text', content: 'The semantic graph is extended with security-specific concepts and relationships:'},
            { type: 'header', level: 3, content: 'Security Concepts:'},
            { type: 'code', content: `Principal := User | Group | Service | Role
Permission := Read | Write | Execute | Admin
Resource := Concept | Relationship | SubGraph
Policy := GraphPattern with AccessSpec`},
            { type: 'header', level: 3, content: 'Security Relationships:'},
            { type: 'code', content: `has_permission(Principal, Permission, Resource)
member_of(Principal, Group)
owns(Principal, Resource)
delegates_to(Principal, Principal, Permission)
applies_to(Policy, ResourcePattern)`},
            { type: 'header', level: 2, content: '2.3 Access Control Semantics' },
            { type: 'text', content: 'This formalization enables complex authorization scenarios like transitive permissions, conditional access, pattern-based authorization, and delegation chains.'},
        ]
    },
    {
        id: 'sec-rebac-arch',
        title: '3. ReBAC Architecture',
        content: [
            { type: 'header', level: 2, content: '3.1.1 Core Permission Types' },
            { type: 'header', level: 3, content: 'Basic Permissions:'},
            { type: 'code', content: `ReadPermission := { scope: ConceptPattern, ... }
WritePermission := { scope: RelationshipPattern, ... }
ExecutePermission := { scope: QueryPattern, ... }`},
            { type: 'header', level: 3, content: 'Composite Permissions:'},
            { type: 'code', content: `OwnershipPermission := ReadPermission ∧ WritePermission ∧ AdminPermission
AdminPermission := { manage_permissions: Boolean, ... }`},
            { type: 'header', level: 2, content: '3.1.2 Permission Inheritance' },
            { type: 'text', content: 'The system supports multiple inheritance mechanisms. The most common is Group-Based Inheritance, where a user inherits the permissions of any group they are a member of. The visualizer below demonstrates this core concept.'},
            { type: 'inheritanceVisualizer' },
            { type: 'header', level: 3, content: 'Ownership-Based Inheritance:'},
            { type: 'code', content: `RELATE(user_bob, owns, project_alpha)
RELATE(project_alpha, grants_access, full_permissions)
// Bob gets full permissions on project_alpha`},
            { type: 'header', level: 2, content: '3.2 Policy Expression Language' },
            { type: 'text', content: 'Policies are expressed using graph patterns with security annotations:'},
            { type: 'code', content: `// Policy Syntax
Policy :=
    GRANT | DENY
    Permission+
    TO Principal+
    ON ResourcePattern
    WHERE ConstraintExpression*
    VALID_FOR TimeRange?`},
            { type: 'code', content: `// Example: Contextual access based on relationships
GRANT write_permission
TO ?user
ON (?resource, owned_by, ?user)
WHERE (?user, member_of, active_employees)`},
            { type: 'header', level: 2, content: '3.3 Dynamic Policy Evaluation' },
            { type: 'text', content: 'The evaluation algorithm collects applicable policies, evaluates them in order of precedence, and checks constraints against the graph state.'},
        ]
    },
    {
        id: 'sec-implementation',
        title: '4. Implementation Design',
        content: [
            { type: 'header', level: 2, content: '4.1 Security Graph Schema' },
            { type: 'header', level: 3, content: '4.1.1 Core Security Concepts' },
            { type: 'code', content: `SecurityPrincipal := { id: UUID, type: UserType, ... }
Permission := { id: UUID, name: String, scope: ResourcePattern, ... }
Policy := { id: UUID, effect: Grant | Deny, ... }`},
            { type: 'header', level: 2, content: '4.1.2 Relationship Types' },
            { type: 'code', content: `// Principal relationships
member_of(Principal, Group)
inherits_from(Group, Group)

// Permission relationships
has_permission(Principal, Permission, Resource)
grants(ResourceOwner, Permission, Principal)
delegates(Principal, Principal, Permission)

// Policy relationships
applies_to(Policy, ResourcePattern)
overrides(Policy, Policy)` },
            { type: 'header', level: 2, content: '4.2 Authorization Engine Architecture' },
            { type: 'definitionList', items: [
                { term: 'Policy Engine', definition: 'Handles policy compilation, optimization, and conflict detection.'},
                { term: 'Access Control Interceptor', definition: 'Intercepts operations, manages security context, and generates audit events.'},
                { term: 'Audit Service', definition: 'Provides comprehensive operation logging and compliance reporting.'},
            ]},
            { type: 'header', level: 2, content: '4.3 Performance Integration' },
            { type: 'header', level: 3, content: '4.3.1 Security-Aware Query Processing' },
            { type: 'text', content: 'The system integrates authorization into query execution by augmenting queries with security constraints. The interactive tool below shows how a user\'s query is rewritten by the system to enforce access policies automatically.' },
            { type: 'secureQueryVisualizer' },
            { type: 'header', level: 3, content: '4.3.2 Caching Strategy' },
            { type: 'list', items: ['TTL-based caching of authorization decisions', 'Invalidation on relevant graph changes', 'Compiled policy representations for fast evaluation']},
        ]
    },
    {
        id: 'sec-protocols',
        title: '5. Security Protocols',
        content: [
            { type: 'header', level: 2, content: '5.1.1 Multi-Factor Authentication' },
            { type: 'list', items: ['Primary Factors: Username/password (Argon2), API keys, Certificate-based auth', 'Secondary Factors: TOTP, FIDO2/WebAuthn, Biometrics']},
            { type: 'header', level: 2, content: '5.1.2 Session Management' },
            { type: 'list', items: ['Cryptographically secure session tokens', 'Configurable session timeouts', 'Automatic session refresh with sliding windows']},
            { type: 'header', level: 2, content: '5.2 Encryption and Data Protection' },
            { type: 'list', items: ['Encryption at Rest: AES-256 for concept payloads, key rotation, HSM integration', 'Encryption in Transit: TLS 1.3 for all communication, Mutual TLS for service-to-service']},
            { type: 'header', level: 2, content: '5.3 Audit and Compliance' },
            { type: 'list', items: ['Comprehensive audit trail for all security-relevant operations', 'Regulatory Compliance: GDPR, SOX, HIPAA, PCI DSS support through lineage tracking and logging.']},
        ]
    },
    {
        id: 'sec-performance',
        title: '6. Performance Considerations',
        content: [
            { type: 'header', level: 2, content: '6.1.1 Query Optimization' },
            { type: 'text', content: 'Security-Aware Indexing includes specialized indices for common authorization patterns, principal-to-resource access, and permission inheritance.'},
            { type: 'header', level: 2, content: '6.1.2 Caching Architecture' },
            { type: 'list', items: ['L1: In-memory authorization decision cache', 'L2: Compiled policy cache', 'L3: Principal attribute cache']},
            { type: 'header', level: 2, content: '6.2 Scalability Design' },
            { type: 'list', items: ['Horizontally scalable authorization service', 'Consistent hashing for principal distribution', 'Eventual consistency for non-critical permissions, strong consistency for administrative operations.']},
        ]
    },
    {
        id: 'sec-case-studies',
        title: '7. Case Studies',
        content: [
            { type: 'header', level: 2, content: '7.1 Healthcare Information System' },
            { type: 'text', content: 'Scenario: A hospital system using Mnemonic Computing for patient records management. The interactive visualizer below demonstrates how ReBAC policies are evaluated based on the graph relationships.' },
            { type: 'rebacVisualizer', scenario: healthcareScenario },
            { type: 'header', level: 2, content: '7.2 Financial Services Platform' },
            { type: 'text', content: 'Scenario: Investment management firm with complex organizational hierarchies and data sensitivity levels.' },
            { type: 'code', content: `# Hierarchical access control
RELATE(portfolio_x, managed_by, advisor_bob)
RELATE(advisor_bob, reports_to, manager_carol)
# Classification-based access
RELATE(market_data, classification_level, public)`},
            { type: 'header', level: 2, content: '7.3 Collaborative Research Platform' },
            { type: 'text', content: 'Scenario: Multi-institutional research collaboration with dynamic project teams and data sharing agreements.' },
            { type: 'code', content: `# Dynamic project membership
RELATE(researcher_alice, member_of, ai_ethics_project)
# Institution-based restrictions
GRANT access_permission ON (?dataset, owned_by, ?institution)
WHERE (?researcher, affiliated_with, ?user_institution)`},
        ]
    },
    {
        id: 'sec-future',
        title: '8. Future Directions',
        content: [
            { type: 'header', level: 2, content: '8.1.1 Machine Learning Integration' },
            { type: 'list', items: ['Anomaly detection for unusual access patterns', 'Risk scoring based on access context', 'Predictive security policy recommendations']},
            { type: 'header', level: 2, content: '8.1.2 Zero-Trust Architecture' },
            { type: 'list', items: ['Real-time risk assessment for every operation', 'Device and location-based access control', 'Micro-segmentation within the semantic graph']},
            { type: 'header', level: 2, content: '8.2 Interoperability and Standards' },
            { type: 'list', items: ['OAuth 2.0 / OpenID Connect: Federation with external identity providers', 'SAML Integration: Enterprise SSO integration', 'XACML Integration: Translation between ReBAC and XACML policies']},
            // FIX: Corrected a typo from 'alevel' to 'level'.
            { type: 'header', level: 2, content: '8.3 Emerging Technologies' },
            { type: 'list', items: ['Blockchain Integration: Immutable audit trails, cryptographic proof of policy compliance', 'Homomorphic Encryption: Encrypted graph operations, secure multi-party computation']},
        ]
    },
    {
        id: 'sec-conclusion',
        title: 'Conclusion',
        content: [
            { type: 'text', content: 'The Relationship-Based Access Control model for Mnemonic Computing represents a significant advancement in graph-based security architecture. By treating security policies as first-class graph entities, the system achieves unprecedented flexibility, scalability, and integration with application logic.'},
        ]
    }
];