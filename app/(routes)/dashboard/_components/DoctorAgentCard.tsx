import React from 'react'
import Image from "next/image";
import { Button } from '@/components/ui/button';
import { IconArrowRight } from '@tabler/icons-react';

export type doctorAgent = {
    id: number,
    specialist: string,
    description: string,
    image: string,
    agentPrompt: string,
    voiceId: string;
    
}

type props = {
    doctorAgent: doctorAgent
}

function DoctorAgentCard({ doctorAgent }: props) {
  return (
    <div className=''>
        <Image 
            src={doctorAgent.image} 
            alt={doctorAgent.specialist}
            width={300}
            height={350}
            className='w-full h-[400px] object-cover rounded-xl'
            
        />
        <h2 className='font-bold mt-1'>{doctorAgent.specialist}</h2>
        <p className='line-clamp-2 text-sm text-gray-500'>{doctorAgent.description}</p>
        
    </div>
  )
}

export default DoctorAgentCard