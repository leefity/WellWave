import React from 'react';

import { AIDoctorAgents } from '@/shared/list'; 
import DoctorAgentCard, { doctorAgent } from '../_components/DoctorAgentCard';

function AgentsPage() {
    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Available Medical Agents</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {AIDoctorAgents.map((agent: doctorAgent) => (
                    <div key={agent.id} className="flex flex-col items-center">
                        <h2 className="text-lg font-bold mb-2">{agent.voiceId}</h2>
                        <DoctorAgentCard doctorAgent={agent} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AgentsPage;