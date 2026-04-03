import type { ReactNode } from "react";
import NavBar from "../components/layout/NavBar";
import Footer from "../components/layout/Footer";

interface MainLayoutProps {
    children: ReactNode;
    showFooter?: boolean;
}

export default function MainLayout({
    children,
    showFooter = false,
}: MainLayoutProps) {
    return (
        <div className="min-h-screen bg-light-purple font-sans antialiased">
            <NavBar />
            <main className="pt-4 p-0">{children}</main>
            {showFooter && <Footer />}
        </div>
    );
}
