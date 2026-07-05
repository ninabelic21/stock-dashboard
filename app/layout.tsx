import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vermögen — Stock Dashboard",
  description: "Privates Portfolio-Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}
