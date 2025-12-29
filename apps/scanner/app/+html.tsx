import { ScrollViewStyleReset } from 'expo-router/html';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />

        {/* PWA Primary Meta Tags */}
        <meta name="application-name" content="Handwriting Scanner" />
        <meta name="description" content="Scan handwritten documents and convert them to digital tables using AI-powered OCR" />
        <meta name="theme-color" content="#2563eb" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#1e3a5f" media="(prefers-color-scheme: dark)" />
        <meta name="color-scheme" content="light dark" />

        {/* iOS PWA Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Scanner" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/pwa/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/pwa/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/pwa/apple-touch-icon-180x180.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/pwa/apple-touch-icon-167x167.png" />

        {/* Apple Splash Screens */}
        <link rel="apple-touch-startup-image" href="/pwa/apple-splash-2048-2732.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/pwa/apple-splash-1668-2388.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/pwa/apple-splash-1536-2048.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/pwa/apple-splash-1125-2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/pwa/apple-splash-1242-2688.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/pwa/apple-splash-750-1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/pwa/apple-splash-1242-2208.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" />
        <link rel="apple-touch-startup-image" href="/pwa/apple-splash-640-1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" />

        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* Standard Icons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/pwa/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/pwa/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/pwa/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/pwa/icon-512x512.png" />

        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#2563eb" />
        <meta name="msapplication-TileImage" content="/pwa/icon-144x144.png" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />

        {/* Service Worker Registration */}
        <script dangerouslySetInnerHTML={{ __html: serviceWorkerScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #fff;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #000;
  }
}`;

const serviceWorkerScript = `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/sw.js')
      .then(function(registration) {
        console.log('[App] ServiceWorker registered with scope:', registration.scope);

        // Check for updates periodically
        setInterval(function() {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour

        // Handle updates
        registration.addEventListener('updatefound', function() {
          var newWorker = registration.installing;
          newWorker.addEventListener('statechange', function() {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              console.log('[App] New version available');
            }
          });
        });
      })
      .catch(function(error) {
        console.log('[App] ServiceWorker registration failed:', error);
      });
  });
}
`;
