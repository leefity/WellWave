// This file contains a Next.js API route for managing medical chat sessions.
// It handles both POST (creating a new session) and GET (retrieving session details).

import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from 'uuid';
import { eq, desc } from 'drizzle-orm'; // Import both 'eq' and 'desc'

// POST endpoint to create a new session
// This function creates a new medical chat session and stores it in the database.
export async function POST(req: NextRequest) {
  try {
    // Destructure notes and selectedDoctor from the request body.
    const { notes, selectedDoctor } = await req.json();
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    const sessionId = uuidv4();
    const result = await db.insert(SessionChatTable).values({
      sessionId: sessionId,
      createdBy: user.primaryEmailAddress.emailAddress,
      notes: notes,
      selectedDoctor: selectedDoctor,
      createdOn: (new Date()).toString(),
    }).returning({
      sessionId: SessionChatTable.sessionId,
      selectedDoctor: SessionChatTable.selectedDoctor,
    });
    
    // Return the created session details.
    return NextResponse.json(result[0]);

  } catch (e) {
    console.error("Error creating session:", e);
    // Return a proper error response with a 500 status code.
    return NextResponse.json({ error: "Failed to create session." }, { status: 500 });
  }
}

// GET endpoint to retrieve session details
// This function fetches session data based on the provided sessionId or all sessions for a user.
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('sessionId');
    const user = await currentUser();

    if (!user || !user.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: "User not authenticated." }, { status: 401 });
    }

    if (sessionId === 'all') {
      // Fetch all sessions for the current user, ordered by creation date.
      const result = await db.select()
        .from(SessionChatTable)
        .where(eq(SessionChatTable.createdBy, user.primaryEmailAddress.emailAddress))
        .orderBy(desc(SessionChatTable.id)); // Use 'desc' for descending order.
      
      return NextResponse.json(result); // Return the full array of results.
    } else if (sessionId) {
      // Fetch a single session by its unique sessionId.
      const result = await db.select()
        .from(SessionChatTable)
        .where(eq(SessionChatTable.sessionId, sessionId as string));
      
      return NextResponse.json(result); // Return the first (and only) result.
    } else {
      // Handle case where no sessionId is provided.
      return NextResponse.json({ error: "Session ID is missing." }, { status: 400 });
    }

  } catch (e) {
    console.error("Error fetching session details:", e);
    // Return a proper error response with a 500 status code.
    return NextResponse.json({ error: "Failed to fetch session details." }, { status: 500 });
  }
}
