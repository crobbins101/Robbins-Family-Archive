'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function FamilyTimeline({ memberScope }: { memberScope: string }) {
  const [memories, setMemories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemories = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('timeline')
        .select('*')
        .ilike('member', memberScope)
        .order('event_date', { ascending: false });

      if (error) console.error('Supabase Error:', error);
      else setMemories(data || []);
      setLoading(false);
    };
    fetchMemories();
  }, [memberScope]);

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('timeline').delete().eq('id', id);
    if (error) alert("Failed to delete.");
    else setMemories(memories.filter((m) => m.id !== id));
  };

  // Helper to render media based on type
  const renderMedia = (m: any) => {
    if (!m.file_url) return <p>{m.description}</p>;

    if (m.type === 'image') {
      return <img src={m.file_url} alt={m.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />;
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

  if (loading) return <p>Loading memories...</p>;

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