import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ToastProvider } from "@/components/ui/Toast";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || "https://saba-portfolio.vercel.app"),
  title: "Saba Zulfiqar | Full Stack Developer",
  description:
    "Portfolio of Saba Zulfiqar, Full Stack Developer with 1 year of experience building web applications with Next.js, React, Node.js, TypeScript, and PostgreSQL.",
  keywords: [
    "Saba Zulfiqar",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Remote Developer",
  ],
  authors: [{ name: "Saba Zulfiqar", url: "https://typeoye.com" }],
  openGraph: {
    title: "Saba Zulfiqar | Full Stack Developer",
    description:
      "Full stack developer building web applications end to end with Next.js, TypeScript, Node.js, and PostgreSQL.",
    url: "https://saba-portfolio.vercel.app",
    siteName: "Saba Zulfiqar Portfolio",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Saba Zulfiqar logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Saba Zulfiqar | Full Stack Developer",
    description: "Full stack developer with 1 year of experience building web apps with Next.js and TypeScript.",
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }, { url: "/favicon.ico" }],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Saba Zulfiqar",
  jobTitle: "Full Stack Developer",
  email: "sabazulfiqar926@gmail.com",
  telephone: "+92 307 5834975",
  url: "https://saba-portfolio.vercel.app",
  sameAs: ["https://www.linkedin.com/in/saba-zulfiqar-015059356/"],
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Allama Iqbal Open University",
  },
  worksFor: {
    "@type": "Organization",
    name: "Orzeh Technologies",
  },
  knowsAbout: [
    "JavaScript",
    "TypeScript",
    "React.js",
    "Next.js",
    "Node.js",
    "PostgreSQL",
    "Tailwind CSS",
  ],
  address: {
    "@type": "PostalAddress",
    addressCountry: "PK",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="font-sans bg-[#090a0f] text-slate-100 antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
