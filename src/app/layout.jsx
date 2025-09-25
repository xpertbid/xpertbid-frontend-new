import "./globals.css";
import Script from "next/script";
import { AuthProvider } from "@/contexts/AuthContext";
import { KycProvider } from "@/contexts/KycContext";
import { CartProvider } from "@/contexts/CartContext";
import { CurrencyProvider, LanguageProvider } from '@/contexts/CurrencyLanguageContext';
import ErrorBoundary from '@/components/ErrorBoundary';

export const metadata = {
  title: "WoodMart - Premium Furniture & Home Decor Store",
  description: "Discover amazing furniture and home decor items at unbeatable prices. Quality meets style in every piece.",
  keywords: "furniture, home decor, living room, bedroom, kitchen, office, modern furniture, quality furniture",
  authors: [{ name: "WoodMart Team" }],
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>
          <KycProvider>
            <CartProvider>
              <LanguageProvider>
                <CurrencyProvider>
                  <ErrorBoundary>
                    {children}
                  </ErrorBoundary>
                </CurrencyProvider>
              </LanguageProvider>
            </CartProvider>
          </KycProvider>
        </AuthProvider>
        <Script 
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
        <Script id="font-loader">
          {`
            // Font loading optimization
            if ('fonts' in document) {
              Promise.all([
                document.fonts.load('500 14px Poppins'),
                document.fonts.load('400 14px Inter'),
                document.fonts.load('600 32px Poppins')
              ]).then(() => {
                document.documentElement.classList.add('fonts-loaded');
              });
            } else {
              // Fallback for browsers without font loading API
              setTimeout(() => {
                document.documentElement.classList.add('fonts-loaded');
              }, 1000);
            }
          `}
        </Script>
      </body>
    </html>
  );
}

