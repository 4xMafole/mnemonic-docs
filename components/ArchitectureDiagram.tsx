import React, { useState } from 'react';

const layers = [
  { 
    name: 'Application Layer', 
    description: 'Provides tools and UIs for developers and users to interact with the system.',
    components: ['Developer Tools', 'Explorer UI', 'Client SDKs']
  },
  { 
    name: 'API Gateway', 
    description: 'A unified entry point for all client requests, routing them to the appropriate services.',
    components: ['Graph Query API', 'Admin API', 'Monitoring API']
  },
  { 
    name: 'Mnemonic Runtime Environment', 
    description: 'The core of the system, handling graph operations, transactions, and queries.',
    components: ['Graph Engine', 'Security Engine', 'Query Engine', 'Transaction Mgr', 'Constraint Validator', 'Index Manager']
  },
  { 
    name: 'Storage Layer', 
    description: 'Manages the physical persistence of data using an append-only log and a key-value store.',
    components: ['RocksDB Engine', 'Append-Only WAL', 'Backup & Recovery']
  },
];

const AnimatedBackground = () => (
    <div className="absolute inset-0 z-0 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-slate-900" />
        <div 
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-radial-gradient from-sky-500/20 to-transparent rounded-full animate-[pulse_5s_ease-in-out_infinite]"
        />
    </div>
);

const DataFlowConnector: React.FC = () => (
    <div className="relative h-16 w-full hidden md:flex justify-center items-center">
        <div className="h-full w-px bg-slate-700/50" />
        <div 
            className="absolute top-0 left-0 w-full h-full"
            style={{
                maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)',
            }}
        >
             <div 
                className="absolute w-full h-1/2 bg-gradient-to-b from-transparent to-sky-400/50 opacity-50 animate-[flow_4s_linear_infinite]"
                style={{ top: '-50%' }}
             />
        </div>
    </div>
);


export const ArchitectureDiagram: React.FC = () => {
  const [hoveredLayer, setHoveredLayer] = useState<string | null>(null);

  return (
    <div className="my-8 w-full flex justify-center items-center p-4">
        <div className="w-full max-w-2xl relative border border-slate-800 rounded-xl overflow-hidden">
            <AnimatedBackground />

            <div className="relative z-10 p-6 md:p-10 flex flex-col items-center">
                {layers.map((layer, index) => {
                  const isHovered = hoveredLayer === layer.name;

                  return (
                      <React.Fragment key={layer.name}>
                          {index > 0 && <DataFlowConnector />}
                          <div
                              onMouseEnter={() => setHoveredLayer(layer.name)}
                              onMouseLeave={() => setHoveredLayer(null)}
                              className="w-full relative group transition-all duration-300"
                          >
                              {/* Background Glow */}
                              <div
                                  className="absolute -inset-4 bg-sky-400/30 rounded-full blur-3xl transition-opacity duration-300"
                                  style={{ opacity: isHovered ? 0.8 : 0 }}
                              />

                              <div 
                                  className="relative w-full p-4 md:p-6 rounded-xl border transition-all duration-300 bg-slate-900/70 backdrop-blur-md"
                                  style={{
                                      borderColor: isHovered ? 'rgba(56, 189, 248, 0.5)' : 'rgba(51, 65, 85, 0.7)',
                                      boxShadow: isHovered ? `0 0 20px rgba(56, 189, 248, 0.2)` : '0 2px 4px rgba(0,0,0,0.1)',
                                  }}
                              >
                                  <h3 className="text-center font-bold text-sky-400 text-base md:text-lg">{layer.name}</h3>
                                  <p className="text-center text-xs text-slate-400 mt-1 mb-4 hidden md:block">{layer.description}</p>
                                  
                                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                                      {layer.components.map(comp => (
                                          <div key={comp} className="bg-slate-800/80 border border-slate-700/50 px-3 py-1.5 rounded-full text-center">
                                              <p className="text-xs md:text-sm text-slate-300 whitespace-nowrap">{comp}</p>
                                          </div>
                                      ))}
                                  </div>
                              </div>
                          </div>
                      </React.Fragment>
                  );
                })}
            </div>
             <style>{`
                @keyframes flow {
                    0% { transform: translateY(0%); }
                    100% { transform: translateY(200%); }
                }
                 .bg-radial-gradient {
                    background-image: radial-gradient(circle, var(--tw-gradient-from), var(--tw-gradient-to));
                 }
            `}</style>
        </div>
    </div>
  );
};