import Link from "next/link";
import "./globals.css";

import localFont from "next/font/local";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
import type { Metadata } from "next";

const indieFlower = localFont({
  src: "../../public/fonts/IndieFlower-Regular.ttf",
  variable: "--font-indie-flower",
  display: "swap",
});

const APP_NAME = "don't break the chain";
const APP_DEFAULT_TITLE =
  "habit tracker demo app for replicache with planetscale and prisma";
const APP_TITLE_TEMPLATE = "%s - don't break the chain";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  themeColor: "#FFFFFF",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${indieFlower.variable} font-indieFlower mx-auto max-w-[500px] p-1 `}
      >
        <nav className="border-b border-b-black mb-4">
          <Link href="/">
            <h1 className="font-semibold">[{"don't break the chain"}]</h1>
            {cookies().get("userId")?.value}
          </Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
