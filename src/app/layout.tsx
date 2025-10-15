import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HyperFurl - From thought to form",
  description: "Turn your ideas into beautiful images and matching theme songs with our futuristic AI studio",
  keywords: "AI image generation, music generation, artificial intelligence, creative studio",
  authors: [{ name: "HyperFurl Studio" }],
  openGraph: {
    title: "HyperFurl - From thought to form",
    description: "Turn your ideas into beautiful images and matching theme songs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HyperFurl - From thought to form",
    description: "Turn your ideas into beautiful images and matching theme songs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-background text-foreground">
        {children}
        {/* HyperFurl hooks will be initialized via the hooks file */}
      </body>
    </html>
  );
}
