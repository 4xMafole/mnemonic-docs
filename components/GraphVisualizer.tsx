import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GraphNode, GraphEdge } from '../types';

interface InternalGraphNode extends GraphNode {
    x: number;
    y: number;
}

interface SimulationNode {
    x: number;
    y: number;
    vx: number;
    vy: number;
}

interface SimulationState {
    nodes: Map<string, SimulationNode>;
}

const VIEWBOX_WIDTH = 500;
const VIEWBOX_HEIGHT = 400;

interface GraphVisualizerProps {
    nodes: GraphNode[];
    edges: GraphEdge[];
    highlightedNodeIds?: string[];
    highlightedEdgeIds?: string[];
}

export const GraphVisualizer: React.FC<GraphVisualizerProps> = ({ nodes, edges, highlightedNodeIds = [], highlightedEdgeIds = [] }) => {
    const [renderedNodes, setRenderedNodes] = useState<InternalGraphNode[]>([]);
    const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
    const simulationRef = useRef<SimulationState>({ nodes: new Map() });
    const animationFrameRef = useRef<number>();
    const svgRef = useRef<SVGSVGElement>(null);

    const nodeMap = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes]);
    const highlightedNodesSet = useMemo(() => new Set(highlightedNodeIds), [highlightedNodeIds]);
    // FIX: Corrected a corrupted useMemo call.
    const highlightedEdgesSet = useMemo(() => new Set(highlightedEdgeIds), [highlightedEdgeIds]);
    
    const focusSet = useMemo(() => {
        if (!draggedNodeId) return null;
        const focusedNodes = new Set<string>([draggedNodeId]);
        const focusedEdges = new Set<string>();
        edges.forEach(edge => {
            if (edge.source === draggedNodeId) {
                focusedNodes.add(edge.target);
                focusedEdges.add(edge.id);
            }
            if (edge.target === draggedNodeId) {
                focusedNodes.add(edge.source);
                focusedEdges.add(edge.id);
            }
        });
        return { nodes: focusedNodes, edges: focusedEdges };
    }, [draggedNodeId, edges]);
    
    useEffect(() => {
        const simNodes = simulationRef.current.nodes;
        const newSimNodes = new Map<string, SimulationNode>();

        nodes.forEach(node => {
            const existingNode = simNodes.get(node.id);
            if (existingNode) {
                newSimNodes.set(node.id, existingNode);
            } else {
                newSimNodes.set(node.id, {
                    x: VIEWBOX_WIDTH / 2 + (Math.random() - 0.5) * 50,
                    y: VIEWBOX_HEIGHT / 2 + (Math.random() - 0.5) * 50,
                    vx: 0,
                    vy: 0,
                });
            }
        });
        
        const nodeIds = new Set(nodes.map(n => n.id));
        simulationRef.current.nodes.forEach((_, id) => {
            if (!nodeIds.has(id)) {
                simulationRef.current.nodes.delete(id);
            }
        });
        simulationRef.current.nodes = newSimNodes;

        const tick = () => {
            const state = simulationRef.current;
            if (state.nodes.size === 0) {
                 animationFrameRef.current = requestAnimationFrame(tick);
                 return;
            }

            const repulsionStrength = -12000;
            const linkStrength = 0.05;
            const centerStrength = 0.02;
            const damping = 0.9;
            const idealLinkDistance = 120;

            const allNodePos: SimulationNode[] = Array.from(state.nodes.values());
            
            for (const nodeA of allNodePos) {
                if (draggedNodeId && (state.nodes.get(draggedNodeId) === nodeA)) continue;
                for (const nodeB of allNodePos) {
                     if (nodeA === nodeB) continue;
                    const dx = nodeB.x - nodeA.x;
                    const dy = nodeB.y - nodeA.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                    const force = repulsionStrength / (distance * distance);
                    const fx = (dx / distance) * force;
                    const fy = (dy / distance) * force;
                    nodeA.vx += fx;
                    nodeA.vy += fy;
                }
                const dcx = VIEWBOX_WIDTH / 2 - nodeA.x;
                const dcy = VIEWBOX_HEIGHT / 2 - nodeA.y;
                nodeA.vx += dcx * centerStrength;
                nodeA.vy += dcy * centerStrength;
            }
            
            edges.forEach(edge => {
                const nodeA = state.nodes.get(edge.source);
                const nodeB = state.nodes.get(edge.target);
                if (!nodeA || !nodeB) return;
                
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                const displacement = distance - idealLinkDistance;
                const force = displacement * linkStrength;
                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force;
                nodeA.vx += fx;
                nodeA.vy += fy;
                nodeB.vx -= fx;
                nodeB.vy -= fy;
            });

            const nodeRadius = 15;
            const nodePadding = 40; 
            const minDistance = (nodeRadius * 2) + nodePadding;

            for (let i = 0; i < allNodePos.length; i++) {
                const nodeA = allNodePos[i];
                 if (draggedNodeId && (state.nodes.get(draggedNodeId) === nodeA)) continue;

                nodeA.vx *= damping;
                nodeA.vy *= damping;
                nodeA.x += nodeA.vx;
                nodeA.y += nodeA.vy;

                for (let j = i + 1; j < allNodePos.length; j++) {
                    const nodeB = allNodePos[j];
                    const dx = nodeB.x - nodeA.x;
                    const dy = nodeB.y - nodeA.y;
                    const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                    if (distance < minDistance) {
                        const overlap = minDistance - distance;
                        const adjustX = (dx / distance) * (overlap / 2);
                        const adjustY = (dy / distance) * (overlap / 2);
                        nodeA.x -= adjustX;
                        nodeA.y -= adjustY;
                        nodeB.x += adjustX;
                        nodeB.y += adjustY;
                    }
                }
            }

            const newRenderedNodes: InternalGraphNode[] = [];
            state.nodes.forEach((node, id) => {
                node.x = Math.max(20, Math.min(VIEWBOX_WIDTH - 20, node.x));
                node.y = Math.max(20, Math.min(VIEWBOX_HEIGHT - 20, node.y));
                const originalNode = nodeMap.get(id);
                if (originalNode) {
                    newRenderedNodes.push({ ...originalNode, x: node.x, y: node.y });
                }
            });

            setRenderedNodes(newRenderedNodes);
            animationFrameRef.current = requestAnimationFrame(tick);
        };
        animationFrameRef.current = requestAnimationFrame(tick);
        return () => { if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current); };
    }, [nodes, edges, nodeMap, draggedNodeId]);

    const handleDragStart = (e: React.MouseEvent | React.TouchEvent, nodeId: string) => {
        e.stopPropagation();
        setDraggedNodeId(nodeId);
    };

    const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!draggedNodeId || !svgRef.current) return;

        let clientX, clientY;
        if ('touches' in e) {
            // Touch event
            if(e.touches.length === 0) return;
            e.preventDefault();
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            // Mouse event
            clientX = e.clientX;
            clientY = e.clientY;
        }

        const CTM = svgRef.current.getScreenCTM();
        if (!CTM) return;
        const pt = svgRef.current.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const svgPoint = pt.matrixTransform(CTM.inverse());
        const simNode = simulationRef.current.nodes.get(draggedNodeId);
        if (simNode) {
            simNode.x = svgPoint.x;
            simNode.y = svgPoint.y;
            simNode.vx = 0;
            simNode.vy = 0;
        }
    };
    
    const handleDragEnd = () => {
        if (draggedNodeId) {
            const simNode = simulationRef.current.nodes.get(draggedNodeId);
            if (simNode) {
                simNode.vx = 0;
                simNode.vy = 0;
            }
            setDraggedNodeId(null);
        }
    };
    
    const nodesToRender = useMemo(() => {
        if (!draggedNodeId) return renderedNodes;
        const selected = renderedNodes.find(n => n.id === draggedNodeId);
        if (!selected) return renderedNodes;
        return [...renderedNodes.filter(n => n.id !== draggedNodeId), selected];
    }, [renderedNodes, draggedNodeId]);

    return (
        <div className="w-full h-full relative overflow-hidden bg-slate-900 rounded-lg">
            <svg 
                ref={svgRef} 
                width="100%" 
                height="100%" 
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchMove={handleDragMove}
                onTouchEnd={handleDragEnd}
                className="bg-grid"
                style={{ cursor: draggedNodeId ? 'grabbing' : 'default' }}
            >
                <defs>
                    <marker id="arrowhead" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
                    </marker>
                    <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(56, 189, 248, 0.8)" />
                        <stop offset="60%" stopColor="rgba(56, 189, 248, 0.4)" />
                        <stop offset="100%" stopColor="rgba(56, 189, 248, 0)" />
                    </radialGradient>
                </defs>

                {renderedNodes.length > 0 && edges.map(edge => {
                    const sourceNode = renderedNodes.find(n => n.id === edge.source);
                    const targetNode = renderedNodes.find(n => n.id === edge.target);
                    if (!sourceNode || !targetNode) return null;
                    
                    const isHighlighted = highlightedEdgesSet.has(edge.id) || (highlightedNodesSet.has(edge.source) && highlightedNodesSet.has(edge.target));
                    const isDimmed = focusSet ? !focusSet.edges.has(edge.id) : false;

                    const dx = targetNode.x - sourceNode.x;
                    const dy = targetNode.y - sourceNode.y;
                    const mag = Math.sqrt(dx*dx + dy*dy);
                    if (mag === 0) return null;
                    const endX = targetNode.x - (dx / mag) * 18;
                    const endY = targetNode.y - (dy / mag) * 18;

                    return (
                        <g key={edge.id} className="transition-opacity duration-300" style={{ opacity: isDimmed ? 0.1 : 1 }}>
                            <path
                                d={`M ${sourceNode.x} ${sourceNode.y} L ${endX} ${endY}`}
                                stroke={isHighlighted ? '#f59e0b' : '#475569'}
                                strokeWidth="1"
                                strokeDasharray="4 2"
                                markerEnd="url(#arrowhead)"
                            />
                             <text
                                x={(sourceNode.x + targetNode.x) / 2}
                                y={(sourceNode.y + targetNode.y) / 2}
                                fill="#0f172a"
                                stroke="#0f172a"
                                strokeWidth="8"
                                strokeLinejoin="round"
                                fontSize="10"
                                textAnchor="middle"
                            >
                                {edge.label}
                            </text>
                            <text
                                x={(sourceNode.x + targetNode.x) / 2}
                                y={(sourceNode.y + targetNode.y) / 2}
                                fill={isHighlighted ? '#fde047' : '#94a3b8'}
                                fontSize="10"
                                textAnchor="middle"
                                className="font-mono"
                            >
                                {edge.label}
                            </text>
                        </g>
                    );
                })}

                {nodesToRender.map(node => {
                    const isHighlighted = highlightedNodesSet.has(node.id);
                    const isDimmed = focusSet ? !focusSet.nodes.has(node.id) : false;

                    return (
                        <g 
                            key={node.id} 
                            transform={`translate(${node.x},${node.y})`} 
                            onMouseDown={(e) => handleDragStart(e, node.id)}
                            onTouchStart={(e) => handleDragStart(e, node.id)}
                            className="transition-opacity duration-300"
                            style={{ 
                                cursor: 'grab',
                                opacity: isDimmed ? 0.1 : 1,
                            }}
                        >
                            <circle cx="0" cy="0" r="25" fill="url(#node-glow)" opacity="0.5" />
                            <circle cx="0" cy="0" r="15" fill="#0f172a" stroke={isHighlighted ? '#f59e0b' : '#38bdf8'} strokeWidth={isHighlighted ? 2 : 1} />
                             <text
                                x="0"
                                y="28"
                                fill={isHighlighted ? '#fde047' : '#e2e8f0'}
                                fontSize="9"
                                textAnchor="middle"
                             >
                                {node.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
            <style>{`
                .bg-grid {
                    background-color: #0f172a;
                    background-image:
                        linear-gradient(rgba(51, 65, 85, 0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(51, 65, 85, 0.5) 1px, transparent 1px);
                    background-size: 25px 25px;
                    animation: pan 60s linear infinite;
                }
                @keyframes pan {
                    0% { background-position: 0 0; }
                    100% { background-position: 250px 250px; }
                }
            `}</style>
        </div>
    );
};