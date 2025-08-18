import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { sessionDetail, medicalReport } from '../medical-agent/[sessionId]/page';
import moment from 'moment'

type props={
    record:sessionDetail
}

function ViewReportDialog({record}:props) {
  return (
    <Dialog>
  <DialogTrigger>
    <Button className='cursor-pointer' variant={'link'} size={'sm'}>View Report</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle asChild>
        <h2 className='text-center text-4xl'>Medical Report</h2>
      </DialogTitle>
      <DialogDescription asChild>
        <div className='mt-5'>
            <h2 className='font-bold text-blue-500 text-lg  border-b pb-1 border-blue-500'>Visit Info</h2>
            <div className='grid grid-cols-2'>
                
                    <h2><span className='font-bold'>Doctor Specialization:</span> {record.selectedDoctor?.specialist}</h2>
                    <h2>Visit Date: {moment(new Date(record?.createdOn)).fromNow()}</h2>
                
            </div>


            <div className='mt-5'>
                <h2 className='font-bold text-blue-500 text-lg  border-b pb-1 border-blue-500'>Main Complaint</h2>
                <p className='text-gray-600'>{record?.report?.chiefComplaint  || 'Not mentioned'}</p>
            </div>

             
             <div className='mt-5'>
                <h2 className='font-bold text-blue-500 text-lg  border-b pb-1 border-blue-500'>Symptoms</h2>
                <p className='text-gray-600'>
                                  {/* Check if symptoms is an array and has items before joining */}
                                  {Array.isArray(record?.report?.symptoms) && record.report.symptoms.length > 0
                                    ? record.report.symptoms.join(', ')
                                    : 'Not mentioned'}
                                </p>
            </div>

            <div className='mt-5'>
                <h2 className='font-bold text-blue-500 text-lg  border-b pb-1 border-blue-500'>Duration</h2>
                <p className='text-gray-600'>{record?.report?.duration  || 'Not mentioned'}</p>
            </div>

            <div className='mt-5'>
                <h2 className='font-bold text-blue-500 text-lg  border-b pb-1 border-blue-500'>Severity</h2>
                <p className='text-gray-600'>{record?.report?.severity  || 'Not mentioned'}</p>
            </div>

            <div className='mt-5'>
                <h2 className='font-bold text-blue-500 text-lg  border-b pb-1 border-blue-500'>Medications</h2>
                <p className='text-gray-600'>
                                    {/* Check if medications is an array and has items before joining */}
                                    {Array.isArray(record?.report?.medicationsMentioned) && record.report.medicationsMentioned.length > 0
                                      ? record.report.medicationsMentioned.join(', ')
                                      : 'Not mentioned'}
                                </p>
            </div>

            <div className='mt-5'>
                <h2 className='font-bold text-blue-500 text-lg  border-b pb-1 border-blue-500'>Advice</h2>
                <p className='text-gray-600'>
                                    {/* Check if recommendations is an array and has items before joining */}
                                    {Array.isArray(record?.report?.recommendations) && record.report.recommendations.length > 0
                                      ? record.report.recommendations.join(', ')
                                      : 'Not mentioned'}
                                </p>
            </div>

            <div className='mt-5'>
                <h2 className='font-bold text-blue-500 text-lg  border-b pb-1 border-blue-500'>Summary</h2>
                <p className='text-gray-600'>{record?.report?.summary  || 'Not mentioned'}</p>
            </div>



            
            

          

        </div>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
  )
}

export default ViewReportDialog