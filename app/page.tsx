import Link from 'next/link';

export default function HomePage() {
  const kids = [
    { name: 'Christopher', slug: 'christopher' },
    { name: 'Jennifer', slug: 'jennifer' },
    { name: 'Matthew', slug: 'matthew' },
    { name: 'Nathan', slug: 'nathan' },
    { name: 'Genessa', slug: 'genessa' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col items-center">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-2">Robbins</h1>
        <p className="text-slate-500 text-lg">Family Archive & Cloud Records</p>
      </header>

      <div className="w-full max-w-5xl flex flex-col items-center gap-12">
        <section className="grid grid-cols-2 gap-8 w-full max-w-xl">
          <Link href="/mom" className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 text-center hover:shadow-md hover:border-blue-500 transition-all group">
            <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600">Mom</h2>
            <p className="text-xs text-slate-400 mt-1">View Cloud Vault</p>
          </Link>
          <Link href="/dad" className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 text-center hover:shadow-md hover:border-blue-500 transition-all group">
            <h2 className="text-2xl font-bold text-slate-800 group-hover:text-blue-600">Dad</h2>
            <p className="text-xs text-slate-400 mt-1">View Cloud Vault</p>
          </Link>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
          {kids.map((kid) => (
            <Link key={kid.slug} href={`/${kid.slug}`} className="p-5 bg-white rounded-xl shadow-sm border border-slate-200 text-center hover:shadow-md hover:border-emerald-500 transition-all group">
              <h3 className="text-lg font-semibold text-slate-800 group-hover:text-emerald-600 break-words">{kid.name}</h3>
              <p className="text-xs text-slate-400 mt-1">Timeline</p>
            </Link>
          ))}
        </section>
      </div>

      <footer className="mt-24 p-4 bg-white rounded-xl border border-slate-200 text-center max-w-md w-full shadow-sm">
        <p className="font-semibold text-slate-800 text-sm mb-2">📥 Media Integration Terminal</p>
        <Link href="/upload" className="block w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium py-2 rounded-lg transition-colors text-center">
          Go to File Upload Page
        </Link>
      </footer>
    </main>
  );
}