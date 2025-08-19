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

// Define the types for your data structures
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

// Reusable popup component to display the call limit message
function CallLimitPopup({ show, onClose }: { show: boolean, onClose: () => void }) {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <h2 className="text-xl font-bold mb-4">Call Limit Reached</h2>
                <p className="text-gray-700">
                    You have reached the maximum number of 9 calls. Please try again later.
                </p>
                <button
                    onClick={onClose}
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
}

function MedicalAgent() {
    const { sessionId } = useParams();
    const router = useRouter();
    const [sessionDetail, setSessionDetail] = useState<sessionDetail>();
    const [callStarted, setCallStarted] = useState(false);
    const [vapiInstance, setVapiInstance] = useState<any>();
    const [currentRole, setCurrentRole] = useState<string | null>();
    const [liveTranscript, setLiveTranscript] = useState<string>();
    const [messages, setMessages] = useState<messages[]>([]);
    const [loading, setLoading] = useState(false);

    // Initialize callCount by reading from local storage.
    // If local storage is empty, default to 0.
    const [callCount, setCallCount] = useState(() => {
        if (typeof window !== 'undefined') {
            const storedCount = localStorage.getItem('callCount');
            return storedCount ? parseInt(storedCount, 10) : 0;
        }
        return 0;
    });
    const [showPopup, setShowPopup] = useState(false);

    // Update local storage whenever callCount changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('callCount', String(callCount));
        }
    }, [callCount]);

    useEffect(() => {
        sessionId && GetSessionDetails();
    }, [sessionId])

    useEffect(() => {
        if (!vapiInstance) return;

        const onCallStart = () => {
            setCallStarted(true);
            setCallCount(prevCount => prevCount + 1);
        };
        const onCallEnd = async () => {
            setCallStarted(false);
            setLoading(true);
            await GenerateReport();
            setLoading(false);
            router.push('/dashboard');
        };

        const onMessage = (message: any) => {
            if (message.type === 'transcript') {
                const { role, transcriptType, transcript } = message;
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

        return () => {
            if (vapiInstance) {
                vapiInstance.off('call-start', onCallStart);
                vapiInstance.off('call-end', onCallEnd);
                vapiInstance.off('message', onMessage);
            }
        };
    }, [vapiInstance, sessionId, messages, sessionDetail, router]);

    const GetSessionDetails = async () => {
        const result = await axios.get('/api/session-chat?sessionId=' + sessionId);
        setSessionDetail(result.data);
    }

    const StartCall = () => {
        // Check if the call limit has been reached
        if (callCount >= 9) {
            setShowPopup(true);
            return;
        }

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
            return result.data;
        } catch (e) {
            console.error("Failed to generate report on client side:", e);
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
                <p className='text-sm text-gray-400'>Voice ID: {sessionDetail?.selectedDoctor?.voiceId}</p>

                <div className='mt-12 overflow-y-auto flex flex-col items-center px-10 md:px-28 lg:px-52 xl:px-72'>
                    {messages?.slice(-4).map((msg: messages, index) => (
                        <h2 className='text-gray-400 p-2' key={index}>{msg.role} : {msg.text}</h2>
                    ))}
                    {liveTranscript && liveTranscript.length > 0 && <h2 className='text-lg'>{currentRole} : {liveTranscript}</h2>}
                </div>

                <div className='mt-8 text-center'>
                    <p className='text-sm text-gray-500'>Calls remaining: {9 - callCount}</p>
                </div>

                {!callStarted ? (
                    <Button className='mt-2' onClick={StartCall} disabled={loading || callCount >= 9}>
                        {loading ? <Loader className='animate-spin' /> : <PhoneCall />} Start Call
                    </Button>
                ) : (
                    <Button variant='destructive' onClick={endCall} disabled={loading}>
                        {loading ? <Loader className='animate-spin' /> : <PhoneOff />} Disconnect
                    </Button>
                )}
            </div>}
            
            <CallLimitPopup show={showPopup} onClose={() => setShowPopup(false)} />
        </div>
    )
}

export default MedicalAgent;
