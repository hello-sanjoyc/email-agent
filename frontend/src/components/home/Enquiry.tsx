import { useState } from "react";
import type { ChangeEvent, MouseEvent } from "react";
interface FormData {
    name: string;
    email: string;
    phone: string;
    company: string;
    message: string;
}

export default function Enquiry() {
    const [formData, setFormData] = useState<FormData>({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: "",
    });
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        // validate
        const newErrors: Partial<FormData> = {};
        if (!formData.name.trim())
            newErrors.name = "Please enter your full name.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\+?[0-9\s().-]{7,}$/;
        if (!formData.email.trim())
            newErrors.email = "Please enter your email address.";
        else if (!emailRegex.test(formData.email))
            newErrors.email = "Please enter a valid email address.";
        if (!formData.phone.trim())
            newErrors.phone = "Please enter your phone number.";
        else if (!phoneRegex.test(formData.phone))
            newErrors.phone = "Please enter a valid phone number.";
        if (
            formData.company &&
            formData.company.trim().length > 0 &&
            formData.company.trim().length < 2
        )
            newErrors.company = "Company name must be at least 2 characters.";
        if (!formData.message.trim())
            newErrors.message = "Please enter a message.";
        else if (formData.message.trim().length < 10)
            newErrors.message = "Message must be at least 10 characters.";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        // TODO: wire up to actual submission logic
        setSubmitted(true);
    };

    return (
        <section id="contact" className="py-24 px-6 bg-slate-50">
            <div className="max-w-4xl mx-auto text-center">
                <h2
                    className="text-3xl font-bold text-slate-900 mb-4"
                    data-aos="fade-up"
                >
                    Request a Demo
                </h2>
                <p className="text-slate-600 mb-12" data-aos="fade-up" data-aos-delay="80">
                    Looking for a tailored solution for your organization? Send
                    us a message.
                </p>

                <div
                    className="bg-white rounded-4xl shadow-md p-8"
                    data-aos="fade-up"
                    data-aos-delay="140"
                >
                    {submitted ? (
                        <div className="flex flex-col items-center gap-4 py-16" data-aos="zoom-in">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-green-600 text-4xl">
                                    check_circle
                                </span>
                            </div>
                            <p className="text-xl font-semibold text-slate-900">
                                Message sent!
                            </p>
                            <p className="text-slate-500">
                                We'll be in touch shortly.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                            <div className="space-y-2" data-aos="fade-right" data-aos-delay="160">
                                <label className="font-bold text-slate-700 ml-1">
                                    Full Name
                                </label>
                                <input
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    aria-invalid={!!errors.name}
                                    className={`w-full bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0d7ff2] transition-colors border ${errors.name ? "border-red-500" : "border-purple-200"}`}
                                />
                                {errors.name && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2" data-aos="fade-left" data-aos-delay="180">
                                <label className="font-bold text-slate-700 ml-1">
                                    Email
                                </label>
                                <input
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@company.com"
                                    aria-invalid={!!errors.email}
                                    className={`w-full bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0d7ff2] transition-colors border ${errors.email ? "border-red-500" : "border-purple-200"}`}
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2" data-aos="fade-right" data-aos-delay="200">
                                <label className="font-bold text-slate-700 ml-1">
                                    Phone
                                </label>
                                <input
                                    name="phone"
                                    type="text"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 555 555 5555"
                                    aria-invalid={!!errors.phone}
                                    className={`w-full bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0d7ff2] transition-colors border ${errors.phone ? "border-red-500" : "border-purple-200"}`}
                                />
                                {errors.phone && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2" data-aos="fade-left" data-aos-delay="220">
                                <label className="font-bold text-slate-700 ml-1">
                                    Company
                                </label>
                                <input
                                    name="company"
                                    type="text"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Your company"
                                    aria-invalid={!!errors.company}
                                    className={`w-full bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0d7ff2] transition-colors border ${errors.company ? "border-red-500" : "border-purple-200"}`}
                                />
                                {errors.company && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.company}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2 space-y-2" data-aos="fade-up" data-aos-delay="240">
                                <label className="font-bold text-slate-700 ml-1">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about your needs..."
                                    rows={4}
                                    aria-invalid={!!errors.message}
                                    className={`w-full bg-white rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0d7ff2] transition-colors resize-none border ${errors.message ? "border-red-500" : "border-purple-200"}`}
                                />
                                {errors.message && (
                                    <p className="text-red-600 text-sm mt-1">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            <div className="md:col-span-2 flex justify-center" data-aos="zoom-in" data-aos-delay="260">
                                <button
                                    onClick={handleSubmit}
                                    className="dark-btn ml-0"
                                >
                                    Send Inquiry
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
