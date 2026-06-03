'use client';

import { useParams } from 'next/navigation';
import FamilyTimeline from '../components/FamilyTimeline';
import Link from 'next/link'; // <--- ADD THIS IMPORT AT THE TOP

export default function MemberPage() {
  const params = useParams();
  const member = params.member as string;

  return (
    <main style={{ margin: 0, padding: 0 }}>
      
      {/* 1. TOP NAVIGATION: Add this here */}
      <div style={{ padding: '20px', borderBottom: '1px solid #eee' }}>
        <Link href="/" style={{ fontSize: '0.8rem', color: '#666' }}>
          ← All Family Members
        </Link>
        <h1>{member.toUpperCase()}&apos;s Archive</h1>
      </div>

      {/* 2. YOUR TIMELINE */}
      <FamilyTimeline memberScope={member} />

      {/* 3. BOTTOM NAVIGATION: Add this here */}
      <div style={{ padding: '20px', marginTop: '20px', borderTop: '1px solid #ccc' }}>
        <Link href="/upload" style={{ color: '#0070f3', textDecoration: 'underline' }}>
          + Upload a new memory for {member}
        </Link>
      </div>

    </main>
  );
}