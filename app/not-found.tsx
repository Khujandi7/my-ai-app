import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#6366F1] flex flex-col items-center justify-center p-6 text-white text-center">
      <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl max-w-md w-full shadow-2xl border border-white/20">
        <h1 className="text-6xl font-black text-yellow-300 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-3">Страница не найдена</h2>
        <p className="text-white/80 mb-6">
          Похоже, эта страница потерялась или переместилась.
        </p>
        <Link
          href="/"
          className="inline-block bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold px-6 py-3 rounded-2xl transition shadow-lg"
        >
          Вернуться на главную
        </Link>
      </div>
    </div>
  );
}
