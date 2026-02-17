import './globals.css';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'AlwaysOn — Life Operating System',
  description: 'Even when motivation is off, the system stays on. Islamic, discipline-first Life Operating System.',
  manifest: '/manifest.json',
  themeColor: '#0a0e1a',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="AlwaysOn" />
      </head>
      <body>
        {children}
        <Navbar />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
