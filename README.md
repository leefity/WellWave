# WellWave – AI Health Consultation Voice Assistant

## 📑 Table of Contents
- [Problem Statement](#-problem-statement)
- [Tech Stack](#-tech-stack)
- [Process Flow](#-process-flow)
- [Solution Description](#-solution-description)
- [System Architecture](#-system-architecture)
- [Features](#-features)
- [Future Enhancements](#-future-enhancements)

---

## 📌 Problem Statement
Access to healthcare can be complex and fragmented.  
Patients often struggle with:
- Identifying the right specialist for their symptoms.  
- Maintaining records of past consultations.  
- Booking consultations quickly and easily.  
- Communicating naturally with doctors.  

**WellWave** solves this by providing an **AI-enabled voice assistant** for end-to-end healthcare consultation:
- From symptom entry → doctor matching → booking → real-time voice consultation → logs and records.

---

## ⚙️ Tech Stack

### Frontend
- **Next.js (React Framework)** – UI and routing.  
- **TypeScript** – Strong typing for scalable and safe development.  
- **Tailwind CSS / shadcn/ui** – Modern styling and UI components.  

### Backend
- **Drizzle ORM** – Type-safe ORM for managing queries.  
- **Neon Database (PostgreSQL Cloud)** – Stores users, consultations, logs, and bookings.  
- **Next.js API Routes** – Serverless backend logic.  

### AI & Voice Layer
- **OpenAI GPT** – Symptom analysis, AI consultation notes.  
- **OpenAI Whisper** – Speech-to-text for user input and consultations.  
- **SMD AI & Wappy AI** – Additional AI modules for medical decision support and voice enhancements.  
- **WebRTC** – Real-time doctor-patient voice consultation.  

### Infrastructure
- **Authentication** – Clerk
- **Cloud Deployment** – (Vercel for frontend, Neon for database).  

---

## 🔄 Process Flow

1. **User Authentication**  
   - Signup/login via Clerk
   - User data securely stored in Neon DB.  

2. **Dashboard**  
   - Displays upcoming consultations, past logs, and symptom history.  

3. **Symptom Entry & AI Assistance**  
   - User enters symptoms (voice/text).  
   - Whisper → converts voice to text.  
   - GPT + SMD AI + Wappy AI → analyze symptoms and suggest doctors.  

4. **Doctor Matching & Booking**  
   - List of specialists shown.  
   - User books a consultation slot.  
   - Stored in Neon DB via Drizzle ORM.  

5. **Voice Consultation**  
   - At appointment time → patient joins a **WebRTC** call with the doctor.  
   - AI may assist with note-taking and translation.  

6. **Logs & Records**  
   - Consultation notes + transcripts saved in Neon DB.  
   - Accessible later via dashboard.  

---

## ✅ Solution Description
**WellWave** is an **AI-powered healthcare voice assistant** designed to make healthcare:  
- **Simple** – Patients use natural voice/text to describe symptoms.  
- **Smart** – AI triages symptoms and matches with the right specialist.  
- **Seamless** – Booking and consultation happen on the same platform.  
- **Secure** – All records stored in encrypted Neon PostgreSQL DB.  

With AI-driven analysis, patients receive the right consultation quickly while maintaining a digital record of their healthcare journey.

---

## 🏗️ System Architecture

---



---

## ✨ Features
- 🔐 Secure **login/signup** with user accounts.  
- 📊 Personalized **dashboard** with past logs and consultations.  
- 🎙️ **Voice & text** symptom entry.  
- 🧠 **AI-driven triage** to suggest relevant doctors.  
- 📅 **Consultation booking** with specialists.  
- 📞 Real-time **doctor-patient voice calls**.  
- 📑 Automatic **consultation logs** and records.  

---

## 🚀 Future Enhancements
- 🩺 Integration with wearable health devices for real-time vitals.  
- 🌎 Multi-language support for accessibility.  
- 📹 Video consultations in addition to voice.  
- 📜 AI-generated prescription summaries.  
- 🔔 Smart health reminders & follow-up notifications.  

---
