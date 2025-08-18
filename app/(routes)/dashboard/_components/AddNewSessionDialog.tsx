"use client"
import React, { useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Loader, Loader2 } from 'lucide-react'
import axios from 'axios'
import DoctorAgentCard, { doctorAgent } from './DoctorAgentCard'
import SuggestDoctorCard from './SuggestDoctorCard'
import { useRouter } from 'next/navigation'

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const router = useRouter();

  const OnClickNext = async () => {
    setLoading(true);
    const result = await axios.post('/api/suggest-doctors', {
      notes: note
    });
    console.log(result.data);
    setSuggestedDoctors(result.data);
    setLoading(false);
  }

  const onStartConsultation = async () => {
    setLoading(true);
    // Save all info to database
    const result = await axios.post('/api/session-chat', {
      notes: note,
      selectedDoctor: selectedDoctor, // Corrected key to match the backend
    });
    console.log(result.data)
    if (result.data?.sessionId) {
      console.log(result.data.sessionId);
      // Route to new conversation screen
      router.push('/dashboard/medical-agent/'+result.data.sessionId);

      
    }
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger>
        <Button className='mt-3 cursor-pointer'>Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add required Details</DialogTitle>
          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div>
                <h2>Add Symptoms or Other Details</h2>
                <Textarea
                  placeholder='Details here...'
                  className='h-[200px] mt-2'
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2>Select the Doctor</h2>
                <div className='grid grid-cols-3 gap-5'>
                  {suggestedDoctors.map((doctor, index) => (
                    <SuggestDoctorCard
                      doctorAgent={doctor}
                      key={index}
                      setSelectedDoctor={() => setSelectedDoctor(doctor)}
                      //@ts-ignore
                      selectedDoctor={selectedDoctor}
                    />
                  ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button variant={'outline'} className='cursor-pointer'>Cancel</Button>
          </DialogClose>
          {!suggestedDoctors ? (
            <Button className='cursor-pointer' disabled={!note || loading} onClick={OnClickNext}>
              Next {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
            </Button>
          ) : (
            <Button disabled={loading || !selectedDoctor} onClick={onStartConsultation}>
              Start Consultation
              {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default AddNewSessionDialog;