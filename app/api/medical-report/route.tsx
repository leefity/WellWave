// This is the API route file
import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const REPORT_GEN_PROMPT=`You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the transcript, generate a structured report with the following fields:

1.sessionId: a unique session identifier
2.agent: the medical specialist name (e.g., "General Physician AI")
3.user: name of the patient or "Anonymous" if not provided
4.timestamp: current date and time in ISO format
5.chiefComplaint: one-sentence summary of the main health concern
6.summary: a 2-3 sentence summary of the conversation, symptoms, and recommendations
7.symptoms: list of symptoms mentioned by the user
8.duration: how long the user has experienced the symptoms
9.severity: mild, moderate, or severe
10.medicationsMentioned: list of any medicines mentioned
11.recommendations: list of AI suggestions (e.g., rest, see a doctor)
Return the result in this JSON format:

{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommendations": ["rec1", "rec2"],
}
Only include valid fields. Respond with nothing else.`

export async function POST(req:NextRequest) {
  const {sessionId,sessionDetail,messages}=await req.json();

  // Log the sessionId to confirm it is being received correctly
  console.log("Received sessionId:", sessionId);

  try{
    const UserInput="Doctor Info: "+JSON.stringify(sessionDetail)+",Conversation:"+JSON.stringify(messages);
    
    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite-preview-06-17",
      messages: [
        {role:'system',content:REPORT_GEN_PROMPT },
        { role: "user", content:UserInput}
      ],
    });
    
    const rawResp = completion.choices[0].message;
    // @ts-ignore
    const Resp = rawResp.content.trim().replace('```json','').replace('```','');
    
    // Log the raw AI response before parsing to check for invalid JSON
    console.log("Raw AI Response:", Resp);

    const JSONResp = JSON.parse(Resp);
    
    // Attempt to save to database
    const result = await db.update(SessionChatTable)
      .set({ report: JSONResp })
      .where(eq(SessionChatTable.sessionId, sessionId));

    // Log the result of the database update operation
    console.log("Drizzle ORM update result:", result);
    
    // If the update was successful, this should contain information like row count.
    if (result.rowCount > 0) {
        console.log(`Report for session ${sessionId} successfully updated.`);
    } else {
        console.log(`No rows were updated for session ${sessionId}. Check if the sessionId exists.`);
    }

    return NextResponse.json(JSONResp);

  } catch(e) {
    // Log the error to your server console for debugging
    console.error("Error generating or saving report:", e);
    
    // Return a descriptive error message to the client
    return NextResponse.json({ error: "Failed to generate or save report" }, { status: 500 });
  }
}