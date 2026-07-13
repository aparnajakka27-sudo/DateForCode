import Link from 'next/link';
import Logo from '../components/Logo';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col items-center justify-center p-8 text-center">
      <Logo className="mb-12 scale-125" />
      <h1 className="text-6xl font-serif font-bold text-[var(--text-primary)] mb-4">404</h1>
      <p className="text-xl text-[var(--text-muted)] mb-12 max-w-md mx-auto font-serif">
        The page you are looking for has been moved or doesn't exist in our current protocol.
      </p>
      <Link 
        href="/" 
        className="px-10 py-4 bg-[#FF4D6D] text-white rounded-full text-sm font-bold uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all"
      >
        Return to Mission Control
      </Link>
    </div>
  );
}
