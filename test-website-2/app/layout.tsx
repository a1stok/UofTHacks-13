import type { Metadata } from "next";
import "./globals.css";
import { SessionRecorderProvider } from "../components/SessionRecorderProvider";

import { ResetSessionButton } from "../components/ResetSessionButton";

export const metadata: Metadata = {
  title: "Frictionless",
  description: "The AI UX Researcher — Detect friction patterns and get prioritized UI fixes with evidence",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background font-sans antialiased">
        <SessionRecorderProvider version="B" enabled={true}>
          {children}
          <ResetSessionButton />
        </SessionRecorderProvider>
      </body>
    </html>
  );
}