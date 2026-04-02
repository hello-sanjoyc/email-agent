import { useState } from "react";
import type {ChangeEvent, MouseEvent} from "react";
interface FormData {
  name: string;
  email: string;
  message: string;
}

export default function Enquiry() {
  const [formData, setFormData] = useState<FormData>({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    // TODO: wire up to actual submission logic
    setSubmitted(true);
  };

  return (
    <section id="contact" className="py-24 px-6 bg-slate-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Enterprise Inquiry</h2>
        <p className="text-slate-600 mb-12">
          Looking for a tailored solution for your organization? Send us a message.
        </p>

        {submitted ? (
          <div className="flex flex-col items-center gap-4 py-16">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
            </div>
            <p className="text-xl font-semibold text-slate-900">Message sent!</p>
            <p className="text-slate-500">We'll be in touch shortly.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0d7ff2] transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Work Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@company.com"
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0d7ff2] transition-colors"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your needs..."
                rows={4}
                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-[#0d7ff2] transition-colors resize-none"
              />
            </div>

            <div className="md:col-span-2">
              <button
                onClick={handleSubmit}
                className="w-full bg-[#0d7ff2] text-white py-4 rounded-xl font-bold hover:brightness-110 active:scale-[0.99] transition-all shadow-lg shadow-blue-500/20"
              >
                Send Inquiry
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}