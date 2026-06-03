'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function FamilyTimeline({ memberScope }: { memberScope: string }) {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ... useEffect and handleDelete stay here ...

  // Helper function defined inside the component, ABOVE the main return
  const renderMedia = (m: any) => {
    if (!m.file_url) return <p>{m.description}</p>;
    if (m.type === 'image') {
      return (
        <Image 
          src={m.file_url} 
          alt={m.title || "Image"} 
          width={500} height={300} 
          style={{ maxWidth: '100%', borderRadius: '8px', height: 'auto' }} 
        />
      );
    }
    if (m.type === 'audio') {
      return (
        <audio controls style={{ width: '100%' }}>
          <source src={m.file_url} type="audio/mpeg" />
        </audio>
      );
    }
    return <p>{m.description}</p>;
  };

  // UI RENDERING STARTS HERE
  if (loading) return <p>Loading memories...</p>;

  return (
    <div style={{ padding: '20px', borderLeft: '2px solid #ddd', marginLeft: '40px' }}>
      {memories.map((m) => (
        <div key={m.id}>
           {/* ... your map content ... */}
           {renderMedia(m)}
        </div>
      ))}
    </div>
  );
} // <--- THIS BRACE CLOSES THE MAIN FUNCTION