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
                        Effective Date: April 22, 2026
                    </p>

                    <div className="space-y-6 text-slate-700 leading-7">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                1. Acceptance of Terms
                            </h2>
                            <p>
                                By accessing or using EMA, you agree to
                                these Terms and Conditions and our related
                                policies. If you do not agree, do not use the
                                service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                2. Eligibility and Account Security
                            </h2>
                            <p>
                                You must provide accurate registration details
                                and keep your credentials secure. You are
                                responsible for all activity under your account
                                and for promptly notifying us of unauthorized
                                access.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                3. Service Scope
                            </h2>
                            <p>
                                EMA helps automate email-related
                                workflows, including parsing messages, drafting
                                responses, creating action items, and calendar
                                coordination. Integrations with third-party
                                providers (for example Google and Microsoft)
                                are subject to their terms and availability.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                4. User Responsibilities
                            </h2>
                            <p>
                                You agree to use the service lawfully and not
                                to upload harmful, infringing, or abusive
                                content. You remain responsible for reviewing
                                and approving AI-generated outputs where your
                                workflow requires human confirmation.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                5. Billing, Renewals, and Cancellation
                            </h2>
                            <p>
                                Paid subscriptions are billed based on your
                                selected plan. Unless otherwise stated, plans
                                renew automatically at the end of each billing
                                cycle. You can cancel future renewals at any
                                time from your account settings.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                6. Intellectual Property
                            </h2>
                            <p>
                                The service, platform design, branding, and
                                software remain the property of EMA and
                                its licensors. You may not reverse engineer,
                                copy, resell, or exploit the service except as
                                permitted by law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                7. Availability and Changes
                            </h2>
                            <p>
                                We may improve, modify, suspend, or discontinue
                                features at any time. We are not liable for
                                temporary outages caused by maintenance,
                                provider downtime, or events beyond our
                                reasonable control.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                8. Disclaimers and Limitation of Liability
                            </h2>
                            <p>
                                The service is provided on an &quot;as is&quot;
                                and &quot;as available&quot; basis. To the
                                extent permitted by law, we disclaim implied
                                warranties and are not liable for indirect,
                                incidental, special, consequential, or punitive
                                damages.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                9. Termination
                            </h2>
                            <p>
                                We may suspend or terminate access for material
                                violations of these terms, suspected abuse, or
                                legal compliance requirements. You may stop
                                using the service at any time.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                10. Governing Law
                            </h2>
                            <p>
                                These terms are governed by applicable laws in
                                India, without regard to conflict-of-law
                                principles, unless mandatory local law requires
                                otherwise.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                11. Contact
                            </h2>
                            <p>
                                For questions regarding these terms, contact us
                                at ema@aranax.tech.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
