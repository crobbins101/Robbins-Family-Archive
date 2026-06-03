'use client';

import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase'; 

export default function AudioUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [member, setMember] = useState('christopher'); // Default assignment selection
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => { setIsDragging(false); };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) { processSelectedFile(e.dataTransfer.files[0]); }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { processSelectedFile(e.target.files[0]); }
  };

  const processSelectedFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith('audio/')) {
      alert('Please upload an audio file (MP3, WAV, M4A, etc.)');
      return;
    }
    setFile(selectedFile);
    setStatus('idle');
  };

  // REAL PRODUCTION UPLOAD SYSTEM
  const startProcessing = async () => {
    if (!file || !title.trim()) {
      alert('Please select a file and provide a title for the archive.');
      return;
    }

    setStatus('uploading');
    setErrorMessage('');

    try {
      // 1. Get a clean, lowercase file extension
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'mp3';
      
      // 2. Strip out spaces or strange characters from the member name variable
      const safeMember = member.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
      
      // 3. BULLETPROOF FLAT PATH: No nested subfolders, just a clean, valid URL filename string
      const filePath = `${safeMember}-${Date.now()}.${fileExt}`;
      
      console.log("Targeting Safe Supabase Path:", filePath);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: storageData, error: storageError } = await supabase.storage
        .from('family-media')
        .upload(filePath, file);

      if (storageError) throw storageError;

      // 5. Fetch the newly created public link for that audio file asset
      const { data: { publicUrl } } = supabase.storage
        .from('family-media')
        .getPublicUrl(filePath);

      // 6. Format a clean, database-compliant ISO date string (YYYY-MM-DD)
      const cleanISODate = new Date().toISOString().split('T')[0];

      // 7. Write a permanent index row directly to your database table
      const { error: dbError } = await supabase
        .from('timeline')
        .insert([
          {
            member: member.toLowerCase().trim(),
            type: 'audio',
            title: title.trim(),
            description: description.trim(),
            file_url: publicUrl,
            event_date: cleanISODate
          }
        ]);

      if (dbError) throw dbError;
      setStatus('success');
    } catch (err: any) {
      console.error("Supabase Operation Failed:", err);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setStatus('error');
      setErrorMessage(err.message || 'An unexpected transmission crash occurred.');
    }
  };

  const resetUploader = () => {
    setFile(null);
    setTitle('');
    setDescription('');
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md border border-slate-200 space-y-4">
      <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        🎙️ Add Audio Record to Cloud Archive
      </h2>

      {/* Metadata Form Elements */}
      {status === 'idle' && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Archive Entry Title</label>
            <input 
              type="text" 
              placeholder="e.g., Christmas Morning 1998 Around the Tree" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign to Member Vault</label>
              <select 
                value={member} 
                onChange={(e) => setMember(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white text-slate-800 focus:outline-none"
              >
                <option value="mom">Mom</option>
                <option value="dad">Dad</option>
                <option value="christopher">Christopher</option>
                <option value="jennifer">Jennifer</option>
                <option value="matthew">Matthew</option>
                <option value="nathan">Nathan</option>
                <option value="genessa">Genessa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Context Notes & Summary</label>
            <textarea 
              rows={3}
              placeholder="Add details, translatable timestamps, or background context..." 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 text-slate-800"
            />
          </div>
        </div>
      )}

      {/* Drag & Drop Zone */}
      {status === 'idle' && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
          }`}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="audio/*" className="hidden" />
          <div className="text-3xl mb-1">📤</div>
          {file ? (
            <div>
              <p className="text-sm font-semibold text-slate-700">Selected Audio:</p>
              <p className="text-xs text-blue-600 font-mono break-all mt-0.5">{file.name}</p>
            </div>
          ) : (
            <div>
              <p className="text-slate-600 text-sm font-medium">Click to select or drag family audio clip here</p>
              <p className="text-xs text-slate-400 mt-0.5">MP3, WAV, or M4A assets</p>
            </div>
          )}
        </div>
      )}

      {/* Action Button */}
      {file && status === 'idle' && (
        <button
          onClick={startProcessing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-colors shadow-sm"
        >
          Commit Memory to Cloud Database
        </button>
      )}

      {/* Uploading Status View */}
      {status === 'uploading' && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center">
          <div className="animate-spin text-3xl mb-2">🔄</div>
          <p className="text-sm font-medium text-slate-700">Uploading payload directly to Supabase storage buckets...</p>
          <p className="text-xs text-slate-400 mt-1">Do not close this application frame.</p>
        </div>
      )}

      {/* Error Interface Handlers */}
      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl space-y-2">
          <p className="text-sm font-bold text-red-800">❌ Live Database Pipeline Interrupted</p>
          <p className="text-xs text-red-600 bg-white p-2 rounded border border-red-100 font-mono break-all">{errorMessage}</p>
          <button onClick={() => setStatus('idle')} className="w-full bg-red-600 hover:bg-red-700 text-white text-xs py-1.5 rounded-lg transition-colors">
            Attempt Re-entry
          </button>
        </div>
      )}

      {/* Success Confirmation Layout */}
      {status === 'success' && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
          <div className="text-3xl">✨</div>
          <h3 className="text-lg font-bold text-emerald-900">Archived Successfully</h3>
          <p className="text-xs text-emerald-700 max-w-md mx-auto">
            The media asset file has been safely written to your cloud bucket storage, and an indexing row index record was injected into the family table engine.
          </p>
          <button onClick={resetUploader} className="bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            Upload Another Record
          </button>
        </div>
      )}
    </div>
  );
}