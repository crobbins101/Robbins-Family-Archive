import Link from 'next/link';
import AudioUploader from '../components/AudioUploader'; // adjust path if your folder structure differs

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl mb-6">
        <Link href="/" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
          ← Back to Robbins Family Dashboard
        </Link>
      </div>
      
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-950">Memory Upload Center</h1>
        <p className="text-slate-500 text-sm mt-1">Preserve recorded histories, voice notes, and audio archives.</p>
      </div>

      <AudioUploader />
    </main>
  );
}