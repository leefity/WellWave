"use client"
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { doctorAgent } from '../../_components/DoctorAgentCard';
import { Circle, Loader, PhoneCall, PhoneOff } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Vapi from '@vapi-ai/web';
import { index } from 'drizzle-orm/gel-core';

export type medicalReport = {
    chiefComplaint: string,
    symptoms: string[],
    duration: string,
    severity: string,
    medicationsMentioned: string[],
    recommendations: string[],
    summary: string,
}

export type sessionDetail = {
    id: number,
    notes: string,
    sessionId: string,
    report: medicalReport,
    selectedDoctor: doctorAgent,
    createdOn: string,

}
type messages = {
    role: string,
    text: string
}

function MedicalAgent() {
    const { sessionId } = useParams();
    const router = useRouter(); // Initialize the router
    const [sessionDetail, setSessionDetail] = useState<sessionDetail>();
    const [callStarted, setCallStarted] = useState(false);
    const [vapiInstance, setVapiInstance] = useState<any>();
    const [currentRole, setCurrentRole] = useState<string | null>();
    const [liveTranscript, setLiveTranscript] = useState<string>();
    const [messages, setMessages] = useState<messages[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch session details on component load
    useEffect(() => {
        sessionId && GetSessionDetails();
    }, [sessionId])

    // Centralized Vapi instance and event handling logic
    useEffect(() => {
        if (!vapiInstance) return;

        // Listeners for Vapi events
        const onCallStart = () => setCallStarted(true);
        const onCallEnd = async () => {
            setCallStarted(false);
            console.log('Call ended. Generating report...');
            setLoading(true);
            // Trigger report generation after the call is officially over
            await GenerateReport();
            setLoading(false);
            // Redirect to the dashboard after the call ends
            router.push('/dashboard');
        };

        const onMessage = (message: any) => {
            if (message.type === 'transcript') {
                const { role, transcriptType, transcript } = message;
                console.log(`${role}: ${transcript}`);
                if (transcriptType === 'partial') {
                    setLiveTranscript(transcript);
                    setCurrentRole(role);
                } else if (transcriptType === 'final') {
                    setMessages((prev: any) => [...prev, { role: role, text: transcript }]);
                    setLiveTranscript("");
                    setCurrentRole(null);
                }
            }
        };

        vapiInstance.on('call-start', onCallStart);
        vapiInstance.on('call-end', onCallEnd);
        vapiInstance.on('message', onMessage);

        // Clean up event listeners on component unmount or when dependencies change
        return () => {
            if (vapiInstance) {
                vapiInstance.off('call-start', onCallStart);
                vapiInstance.off('call-end', onCallEnd);
                vapiInstance.off('message', onMessage);
            }
        };
    }, [vapiInstance, sessionId, messages, sessionDetail, router]); // Add router to the dependency array

    const GetSessionDetails = async () => {
        const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
        console.log(result.data);
        setSessionDetail(result.data);
    }

    const StartCall = () => {
        if (vapiInstance) {
            vapiInstance.start(process.env.NEXT_PUBLIC_VAPI_VOICE_AGENT_ID);
        } else {
            const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
            setVapiInstance(vapi);
            vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_AGENT_ID);
        }
    };

    const endCall = () => {
        if (vapiInstance) {
            vapiInstance.stop();
        }
    };

    const GenerateReport = async () => {
        try {
            const result = await axios.post('/api/medical-report', {
                messages: messages,
                sessionDetail: sessionDetail,
                sessionId: sessionId
            });
            console.log("Report generation successful:", result.data);
            return result.data;
        } catch (e) {
            console.error("Failed to generate report on client side:", e);
            // You might want to handle this error more gracefully in the UI
        }
    }

    return (
        <div className='p-5 border rounded-3xl bg-secondary'>
            <div className='flex justify-between items-center'>
                <h2 className='p-1 px-2 border rounded-md flex gap-2 items-center'><Circle className={`w-4 h-4 rounded-full ${callStarted ? 'bg-green-500' : 'bg-red-500'}`} />{callStarted ? 'connected...' : 'Not Connected'}</h2>
                <h2 className='font-bold text-xl text-gray-400'>00:00</h2>
            </div>

            {sessionDetail && <div className='flex items-center flex-col mt-10'>
                <Image src={sessionDetail?.selectedDoctor?.image} alt={sessionDetail?.selectedDoctor?.specialist}
                    width={120}
                    height={120}
                    className='h-[100px] w-[100px] object-cover rounded-full border'
                />
                <h2 className='mt-2 text-lg'>{sessionDetail?.selectedDoctor?.specialist}</h2>
                <p className='text-sm text-gray-400'>AI Medical Agent</p>

                <div className='mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72'>
                    {messages?.slice(-4).map((msg: messages, index) => (
                        <h2 className='text-gray-400 p-2' key={index}>{msg.role} : {msg.text}</h2>
                    ))}
                    {liveTranscript && liveTranscript.length > 0 && <h2 className='text-lg'>{currentRole} : {liveTranscript}</h2>}
                </div>

                {!callStarted ? (
                    <Button className='mt-20' onClick={StartCall} disabled={loading}>
                        {loading ? <Loader className='animate-spin' /> : <PhoneCall />} Start Call
                    </Button>
                ) : (
                    <Button variant='destructive' onClick={endCall} disabled={loading}>
                        {loading ? <Loader className='animate-spin' /> : <PhoneOff />} Disconnect
                    </Button>
                )}
            </div>}
        </div>
    )
}

export default MedicalAgent;