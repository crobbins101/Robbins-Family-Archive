'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function FamilyTimeline({ memberScope }: { memberScope: string }) {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH DATA FROM SUPABASE
  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('timeline')
        .select('*')
        .ilike('member', memberScope)
        .order('event_date', { ascending: false });

      if (error) {
        console.error('Supabase Error:', error);
      } else {
        setMemories(data || []);
      }
      setLoading(false);
    };

    if (memberScope) {
      fetchMemories();
    }
  }, [memberScope]);

  // DELETE HANDLER
  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('timeline').delete().eq('id', id);
    if (error) alert("Failed to delete.");
    else setMemories(memories.filter((m) => m.id !== id));
  };

  // RENDER MEDIA HELPER
  const renderMedia = (m: any) => {
    if (!m.file_url) return <p>{m.description}</p>;
    if (m.type === 'image') {
      return (
        <Image 
          src={m.file_url} 
          alt={m.title || "Image"} 
          width={500} 
          height={300} 
          style={{ maxWidth: '100%', borderRadius: '8px', height: 'auto' }} 
        />
      );
    }
    if (m.type === 'audio') {
      return (
        <audio controls style={{ width: '100%' }}>
          <source src={m.file_url} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      );
    }
    return <p>{m.description}</p>;
  };

  // UI RENDERING
  if (loading) return <p>Loading memories...</p>;
  if (memories.length === 0) return <p>No memories found for {memberScope}.</p>;

  return (
    <div style={{ padding: '20px', borderLeft: '2px solid #ddd', marginLeft: '40px' }}>
      {memories.map((m) => (
        <div key={m.id} style={{ marginBottom: '40px', padding: '15px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ margin: '0', color: '#666' }}>{m.event_date}</h4>
              <h3 style={{ margin: '5px 0' }}>{m.title}</h3>
            </div>
            <button onClick={() => {
              const val = prompt("Type 'DELETE' to confirm.");
              if (val === 'DELETE') handleDelete(m.id);
            }}>Delete</button>
          </div>
          
          <div style={{ marginTop: '15px' }}>
            {renderMedia(m)}
          </div>
        </div>
      ))}
    </div>
  );
}