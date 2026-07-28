import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { SocketProvider } from '@/contexts/SocketContext';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata = {
  title: 'VibeRoom',
  description: 'Real-time video chat, DMs & live translation',
  themeColor: '#7C3AED',
  manifest: '/manifest.webmanifest',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
      </head>
      <body>
        <ToastProvider>
          <AuthProvider>
            <SocketProvider>
              {children}
            </SocketProvider>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
