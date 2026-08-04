import "./global.css";
import { QueryProvider } from "@/providers/query-provider";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "HTH RMS",
  description: "Enterprise Hospitality Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`light ${inter.variable}`}>
      <body className="antialiased">
        <QueryProvider>
          {children}
          <Toaster
            duration={3500}
            position="top-right"
            richColors
            closeButton
          />
        </QueryProvider>
      </body>
    </html>
  );
}
