import MainLayout from "../layouts/MainLayout";

export default function TermsAndConditionsPage() {
    return (
        <MainLayout showFooter>
            <section className="px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto rounded-3xl border border-purple-100 bg-white p-6 md:p-10 shadow-sm">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Terms and Conditions
                    </h1>
                    <p className="text-sm text-slate-500 mb-8">
                        Effective Date: April 4, 2026
                    </p>

                    <div className="space-y-6 text-slate-700 leading-7">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                1. Acceptance of Terms
                            </h2>
                            <p>
                                By accessing or using Email Agent, you agree to these Terms and
                                Conditions. If you do not agree, do not use the service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                2. Use of Service
                            </h2>
                            <p>
                                You agree to use the service only for lawful purposes and in
                                compliance with all applicable laws, regulations, and platform
                                policies.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                3. Accounts and Billing
                            </h2>
                            <p>
                                Paid subscriptions are billed according to the plan selected.
                                You are responsible for maintaining accurate billing information.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                4. Availability and Changes
                            </h2>
                            <p>
                                We may update, suspend, or discontinue parts of the service from
                                time to time, including features and pricing.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                5. Limitation of Liability
                            </h2>
                            <p>
                                To the maximum extent permitted by law, Email Agent is provided
                                "as is" without warranties, and we are not liable for indirect,
                                incidental, or consequential damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                6. Contact
                            </h2>
                            <p>
                                For questions regarding these terms, contact us at
                                ema@aranax.tech.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
