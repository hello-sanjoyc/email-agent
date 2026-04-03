import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import MainLayout from "../layouts/MainLayout";
import Introduction from "../components/home/Introduction";
import Workflow from "../components/home/Workflow";
import Video from "../components/home/Video";
import Faq from "../components/home/Faq";
import Enquiry from "../components/home/Enquiry";

export default function HomePage() {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({
            duration: 900,
            easing: "ease-out-cubic",
            once: true,
            offset: 50,
        });
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sectionFromQuery = params.get("section");
        const sectionFromHash = location.hash.replace("#", "");
        const sectionId = sectionFromQuery || sectionFromHash;

        if (!sectionId) return;

        let attempts = 0;
        const maxAttempts = 20;

        const scrollToSection = () => {
            const section = document.getElementById(sectionId);
            if (!section) {
                attempts += 1;
                if (attempts < maxAttempts) {
                    window.setTimeout(scrollToSection, 50);
                }
                return;
            }

            const nav = document.querySelector("nav");
            const navHeight = nav ? (nav as HTMLElement).offsetHeight : 0;
            const target =
                window.scrollY +
                section.getBoundingClientRect().top -
                navHeight -
                12;

            window.scrollTo({ top: Math.max(0, target), behavior: "smooth" });

            if (sectionFromQuery) {
                navigate("/", { replace: true });
            }
        };

        window.setTimeout(scrollToSection, 0);
    }, [location.search, location.hash, navigate]);

    return (
        <MainLayout showFooter>
            <Introduction />
            <Workflow />
            <Video />
            <Faq />
            <Enquiry />
        </MainLayout>
    );
}
