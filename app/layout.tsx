import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Museo Slab is bundled in public/assets/font and loaded locally with next/font/local.
// The font files were supplied with this project; they were not fetched from an online font service.
const museoSlab = localFont({
  src: [
    { path: "../public/assets/font/Museo_Slab_100.otf", weight: "100", style: "normal" },
    { path: "../public/assets/font/Museo_Slab_100italic.otf", weight: "100", style: "italic" },
    { path: "../public/assets/font/Museo_Slab_300.otf", weight: "300", style: "normal" },
    { path: "../public/assets/font/Museo_Slab_300italic.otf", weight: "300", style: "italic" },
    { path: "../public/assets/font/Museo_Slab_500.otf", weight: "500", style: "normal" },
    { path: "../public/assets/font/Museo_Slab_500italic.otf", weight: "500", style: "italic" },
    { path: "../public/assets/font/Museo_Slab_700.otf", weight: "700", style: "normal" },
    { path: "../public/assets/font/Museo_Slab_700italic.otf", weight: "700", style: "italic" },
    { path: "../public/assets/font/Museo_Slab_900.otf", weight: "900", style: "normal" },
    { path: "../public/assets/font/Museo_Slab_900italic.otf", weight: "900", style: "italic" },
    { path: "../public/assets/font/Museo_Slab_1000.otf", weight: "1000", style: "normal" },
    { path: "../public/assets/font/Museo_Slab_1000italic.otf", weight: "1000", style: "italic" },
  ],
  variable: "--font-museo-slab",
  display: "swap",
});

export const metadata: Metadata = {
  title: "University of Global Health Equity",
  description:
    "The University of Global Health Equity is building a future where quality health care is accessible to everyone.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${museoSlab.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
