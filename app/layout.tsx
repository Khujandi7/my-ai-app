import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'English Mastery Quiz',
  description: 'Интерактивная викторина для изучения английского языка с геймификацией.',
  openGraph: {
    title: 'English Mastery Quiz',
    description: 'Интерактивная викторина для изучения английского языка с геймификацией.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
