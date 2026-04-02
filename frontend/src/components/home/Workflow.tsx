export default function Workflow() {
  return (
    <section id="workflow" className="py-24 px-6 bg-slate-50/50">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Intelligent Workflow, Simplified
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our features are designed to work invisibly, ensuring you only see what truly matters.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Card 1 — Smart Parsing (wide) */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 flex flex-col justify-between group hover:border-blue-500/50 transition-colors shadow-sm">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">

                {/* psychology icon */}
                <svg
                  className="w-10 h-10 text-[#0d7ff2] mb-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M13 8.5c0-.83-.67-1.5-1.5-1.5S10 7.67 10 8.5s.67 1.5 1.5 1.5S13 9.33 13 8.5zM9 13c0 .55.45 1 1 1h4c.55 0 1-.45 1-1s-.45-1-1-1h-4c-.55 0-1 .45-1 1zm9.93-5.6C18.45 5.2 15.67 3 12.39 3 8.89 3 6.04 5.7 6 9.19c-.02 1.8.7 3.44 1.88 4.64l.03.03c.6.63.95 1.47.98 2.33H9c0-1.12-.45-2.2-1.25-2.99C6.46 11.9 5.58 10.02 5.58 7.97 5.58 4.01 8.7 1 12.66 1c3.7 0 6.83 2.76 6.83 6.4 0 2.03-.97 3.84-2.48 5.01-.79.61-1.26 1.56-1.26 2.59h-1.11c.03-.87.38-1.71.98-2.34.02-.02.03-.04.05-.06C16.87 11.41 17.47 9.77 17.47 8c0-.18-.01-.36-.02-.54l-.02-.06z" />
                  <path d="M9 18h6v-1H9v1zm0 3h6v-1H9v1z" />
                </svg>

                <h3 className="text-2xl font-bold text-slate-900 mb-3">Smart Parsing</h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  Our AI reads and understands the context of every email, extracting action items and
                  summarizing long threads into bullet points instantly.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    {/* check_circle icon */}
                    <svg
                      className="w-5 h-5 text-[#0d7ff2] shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" />
                    </svg>
                    Contextual awareness
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg
                      className="w-5 h-5 text-[#0d7ff2] shrink-0"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5l-4-4 1.41-1.41L10 13.67l6.59-6.59L18 8.5l-8 8z" />
                    </svg>
                    One-click summaries
                  </li>
                </ul>
              </div>
              <div className="flex-1 rounded-xl overflow-hidden bg-slate-50 border border-slate-100">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAYsfnNl9dH4BLumg8BK-1CBza7yHbnprqsk1J-fTMwwuUuDfzQTOMhwe5WiAZUmq74aVJuTGcc0qi_PQTzhg16awWnoNUMPv8mGDgXLkMwr1UZ5AppLLvbJmiCRpRd-XLwEv9dZDBpvVxyzld1CfjmS2Je_8nRHXSSMySGTgFezd1wAAFNZsOaAQCI7VbPNS7TORejiMMzkgEu8QeelxxIrjliF6tbYcgoa0GEOAiTUQ_MADjQODiiopdOshXKDiVObg_DjLPxuPk"
                  alt="Email Parsing"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Card 2 — Auto Drafts */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-500/50 transition-colors shadow-sm">
            {/* edit_note icon */}
            <svg
              className="w-10 h-10 text-[#0d7ff2] mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
              <path d="M3 5h10v2H3zm0 4h7v2H3zm0 4h4v2H3z" />
            </svg>

            <h3 className="text-xl font-bold text-slate-900 mb-3">Auto-Drafts</h3>
            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              Replies drafted in your voice, ready for one-tap sending. The AI learns your tone and
              preferences over time.
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-full h-2 bg-slate-200 rounded-full mb-3" />
              <div className="w-3/4 h-2 bg-slate-200 rounded-full mb-3" />
              <div className="w-1/2 h-2 bg-blue-500/30 rounded-full" />
            </div>
          </div>

          {/* Card 3 — Calendar Sync */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 hover:border-blue-500/50 transition-colors shadow-sm">
            {/* calendar_today icon */}
            <svg
              className="w-10 h-10 text-[#0d7ff2] mb-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 3h-1V1h-2v2H7V1H5v2H4C2.9 3 2 3.9 2 5v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13zm0-15H4V5h16v1zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
            </svg>

            <h3 className="text-xl font-bold text-slate-900 mb-3">Calendar Sync</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Automatically detect meeting requests and sync them with your calendar. No more
              back-and-forth scheduling.
            </p>
          </div>

          {/* Card 4 — Secure & Private (wide) */}
          <div className="md:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 flex items-center gap-8 hover:border-blue-500/50 transition-colors shadow-sm">
            <div className="hidden sm:flex w-32 h-32 items-center justify-center rounded-full bg-blue-500/5 shrink-0">
              {/* shield_lock icon */}
              <svg
                className="w-14 h-14 text-[#0d7ff2]"
                fill="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4c1.4 0 2.5 1.1 2.5 2.5V9H14v-.5C14 7.12 13.1 6 12 6s-2 1.12-2 2.5V9H9v-.5C9 6.1 10.34 5 12 5zm2.5 10h-5c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h5c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1zm-2.5-1.5c.55 0 1-.45 1-1s-.45-1-1-1-1 .45-1 1 .45 1 1 1z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Secure &amp; Private</h3>
              <p className="text-slate-600 leading-relaxed">
                We utilize local-first processing and end-to-end encryption. Your data is never used to
                train global models, and your privacy is our top priority.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}