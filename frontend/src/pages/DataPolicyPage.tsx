import MainLayout from "../layouts/MainLayout";

export default function DataPolicyPage() {
    return (
        <MainLayout showFooter>
            <section className="px-6 py-12 md:py-16">
                <div className="max-w-4xl mx-auto rounded-3xl border border-purple-100 bg-white p-6 md:p-10 shadow-sm">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Data Policy
                    </h1>
                    <p className="text-sm text-slate-500 mb-8">
                        Effective Date: April 22, 2026
                    </p>

                    <div className="space-y-6 text-slate-700 leading-7">
                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                1. Purpose
                            </h2>
                            <p>
                                This Data Policy explains how EMA
                                collects, processes, stores, and deletes data
                                used to provide email automation services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                2. Data Categories
                            </h2>
                            <p>
                                Data we handle may include account profile data,
                                connected provider identifiers, selected email
                                and calendar content needed for requested
                                automations, service logs, and billing records.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                3. Processing Activities
                            </h2>
                            <p>
                                Our systems process data to classify incoming
                                emails, generate drafts and summaries, detect
                                action items, and create calendar events or
                                workflow updates according to your configured
                                preferences.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                4. Data Minimization
                            </h2>
                            <p>
                                We aim to process only the minimum data needed
                                to deliver requested functionality. Access to
                                customer data is restricted based on role and
                                operational need.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                5. AI and Model Usage
                            </h2>
                            <p>
                                AI processing is used to generate
                                classification, summaries, and draft outputs.
                                We do not sell customer content, and we do not
                                permit use of customer content for unrelated
                                marketing purposes.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                6. Security Controls
                            </h2>
                            <p>
                                We apply technical and organizational controls,
                                including encrypted data transfer, access
                                controls, and monitoring, to reduce unauthorized
                                access and misuse risks.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                7. Retention and Deletion
                            </h2>
                            <p>
                                Data is retained only as long as needed for
                                service delivery, legal obligations, and
                                legitimate operational purposes. You may request
                                deletion of eligible personal data by contacting
                                support.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                8. Third-Party Processors
                            </h2>
                            <p>
                                We use vetted third-party providers for hosting,
                                payment processing, analytics, and communication
                                delivery. These providers are required to
                                protect data under contractual safeguards.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                9. International Data Transfers
                            </h2>
                            <p>
                                Where data is transferred across jurisdictions,
                                we apply appropriate safeguards required by
                                applicable law.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                10. Contact
                            </h2>
                            <p>
                                For data handling questions or requests, contact
                                us at ema@aranax.tech.
                            </p>
                        </section>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
