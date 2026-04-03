import MainLayout from "../layouts/MainLayout";

export default function PrivacyPolicyPage() {
    return (
        <MainLayout showFooter>
            <section className="px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto rounded-3xl border border-purple-100 bg-white p-6 md:p-10 shadow-sm">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Privacy Policy
                    </h1>
                    <p className="text-sm text-slate-500 mb-8">
                        Effective Date: April 4, 2026
                    </p>

                    <div className="space-y-6 text-slate-700 leading-7">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                1. Information We Collect
                            </h2>
                            <p>
                                We may collect account details, profile information, and usage
                                data required to provide and improve Email Agent.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                2. How We Use Information
                            </h2>
                            <p>
                                Your information is used to operate the service, process
                                subscriptions, provide support, and enhance product quality.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                3. Data Sharing
                            </h2>
                            <p>
                                We do not sell your personal information. Data may be shared with
                                trusted providers strictly for service operations and payment
                                processing.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                4. Security
                            </h2>
                            <p>
                                We use industry-standard safeguards to protect your data, but no
                                system can guarantee absolute security.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                5. Your Rights
                            </h2>
                            <p>
                                You may request access, correction, or deletion of your personal
                                data, subject to applicable legal requirements.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                6. Contact
                            </h2>
                            <p>
                                For privacy-related requests, contact us at ema@aranax.tech.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
