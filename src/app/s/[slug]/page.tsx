import Link from 'next/link';

export const dynamic = 'force-dynamic';

async function getShare(slug: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/share/${slug}`, {
      // Ensure SSR fetch from same host in production when BASE_URL is not set
      cache: 'no-store',
      // In Next 15, relative fetch in server components is still okay, but to support both, handle base URL.
      // If no base URL, try relative and hope runtime host is used.
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    // Fallback to relative fetch for environments without BASE_URL
    try {
      const res = await fetch(`/api/share/${slug}`, { cache: 'no-store' } as any);
      if (!res.ok) return null;
      return res.json();
    } catch {
      return null;
    }
  }
}

export default async function SharedPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getShare(slug);

  if (!data) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-12">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-2xl font-semibold text-gray-800">Link not available</h1>
          <p className="mt-3 text-gray-600">This share may have expired or never existed.</p>
          <Link href="/" className="mt-6 inline-block rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F2D675] px-4 py-2 text-white font-medium shadow hover:from-[#C4A030] hover:to-[#E2C665]">
            Go to Sonity
          </Link>
        </div>
      </main>
    );
  }

  const text: string = data.text || '';

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Shared Music</h1>
          <Link href="/" className="text-[#B89C2C] hover:text-[#a28925]">Open Sonity</Link>
        </div>

        <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="prose max-w-none whitespace-pre-wrap text-gray-800">
            {text}
          </div>
        </div>

        <p className="mt-4 text-sm text-gray-500">Publicly viewable. Do not share sensitive information.</p>
      </div>
    </main>
  );
}
