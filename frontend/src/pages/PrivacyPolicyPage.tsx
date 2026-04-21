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
                        Effective Date: April 22, 2026
                    </p>

                    <div className="space-y-6 text-slate-700 leading-7">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                1. Information We Collect
                            </h2>
                            <p>
                                We collect information you provide directly,
                                such as name, email, login credentials, support
                                messages, and billing details. We also process
                                technical and usage metadata needed to operate,
                                secure, and improve EMA.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                2. Connected Account Data
                            </h2>
                            <p>
                                If you connect email or calendar providers, we
                                process the minimum required data to perform
                                requested automations, such as classifying
                                messages, generating drafts, extracting action
                                items, and creating calendar events.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                3. How We Use Information
                            </h2>
                            <p>
                                We use information to provide core service
                                functionality, manage subscriptions, detect and
                                prevent abuse, offer customer support, and
                                improve reliability and performance.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                4. Data Sharing and Disclosure
                            </h2>
                            <p>
                                We do not sell your personal information. We may
                                share data with trusted service providers that
                                support hosting, payments, analytics, and
                                customer communications under contractual
                                confidentiality and security obligations. We may
                                also disclose information when legally required.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                5. Security
                            </h2>
                            <p>
                                We use reasonable administrative, technical, and
                                organizational safeguards, including encrypted
                                transport and controlled access. No system is
                                completely secure, and you should also protect
                                your account credentials.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                6. Retention
                            </h2>
                            <p>
                                We retain personal data only as long as
                                necessary for legitimate business and legal
                                purposes, including account management, fraud
                                prevention, billing records, and dispute
                                resolution.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                7. Your Rights and Choices
                            </h2>
                            <p>
                                Subject to applicable law, you can request
                                access, correction, export, or deletion of your
                                personal data, and may object to or restrict
                                certain processing activities. You may also
                                disconnect third-party account integrations at
                                any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                8. Children&apos;s Privacy
                            </h2>
                            <p>
                                EMA is not intended for children under
                                13, and we do not knowingly collect personal
                                information from children.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                9. Policy Updates
                            </h2>
                            <p>
                                We may update this Privacy Policy from time to
                                time. Material changes will be reflected by
                                updating the effective date on this page.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                10. Contact
                            </h2>
                            <p>
                                For privacy-related requests, contact us at
                                ema@aranax.tech.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
