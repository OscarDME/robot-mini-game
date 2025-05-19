import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CodeFix: Aprende Jugando - Juego educativo de programación',
  description: 'Juego educativo para aprender conceptos básicos de programación mediante la corrección de errores en código.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <main>
          {children}
        </main>
        <footer className="py-6 text-center text-sm text-gray-500">
          <p>CodeFix: Aprende Jugando - Un proyecto educativo alineado con ODS 4: Educación de calidad</p>
        </footer>
      </body>
    </html>
  );
}