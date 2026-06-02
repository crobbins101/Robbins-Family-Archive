import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize the OpenAI engine with your secure environment token
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No audio file provided to backend' }, { status: 400 });
    }

    // 1. Forward the raw browser file payload straight to OpenAI Whisper AI
    const transcriptionResponse = await openai.audio.transcriptions.create({
      file: file,
      model: 'whisper-1',
    });

    // 2. Deliver the freshly transcribed text output back to your frontend layout
    return NextResponse.json({ 
      success: true, 
      text: transcriptionResponse.text 
    });

  } catch (error: any) {
    console.error('Whisper API Engine Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed processing audio transcription' }, 
      { status: 500 }
    );
  }
}