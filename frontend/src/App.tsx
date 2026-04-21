import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePage from "./pages/HomePage";
import SubscriptionPage from "./pages/SubscriptionPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import DataPolicyPage from "./pages/DataPolicyPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import "./App.css";

export default function App() {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/plans" element={<SubscriptionPage />} />
                <Route
                    path="/terms-and-conditions"
                    element={<TermsAndConditionsPage />}
                />
                <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                <Route path="/data-policy" element={<DataPolicyPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
            </Routes>
        </>
    );
}
