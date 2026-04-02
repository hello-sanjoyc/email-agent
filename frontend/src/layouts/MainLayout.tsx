import type { ReactNode } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

interface MainLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

export default function MainLayout({ children, showFooter = false }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans antialiased">
      <NavBar />
      <main className="pt-24">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
