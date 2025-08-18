"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useEffect, useState } from 'react'
import AddNewSessionDialog from './AddNewSessionDialog';
import axios from 'axios';
import HistoryTable from './HistoryTable';
import { sessionDetail } from '@/app/(routes)/dashboard/medical-agent/[sessionId]/page';

function HistoryList() {
  const [historyList,sethistoryList]=useState<sessionDetail[]>([]);

  useEffect(()=>{
    GetHistoryList();

  },[])

  const GetHistoryList=async()=>{
    const result = await axios.get('/api/session-chat?sessionId=all');
    console.log(result.data);
    sethistoryList(result.data);
  }


  return (
    <div className='mt-10'>
        {historyList.length==0?
        <div className='flex items-center flex-col justify-center p-7 border border-dashed rounded-2xl border-2'>
            <Image src={'/medical guy.png'} alt='empty'
            width={150}
            height={150}
            />
            <h2 className='font-bold text-xl mt-2'>No Recent Appointments</h2>
            <p>Haven't connected with a doctor yet? Now is the perfect time!</p>
            <AddNewSessionDialog/>
        </div>
        :<div>
          <HistoryTable historyList={historyList}/>
        </div>
        
    }
    </div>
  )
}

export default HistoryList