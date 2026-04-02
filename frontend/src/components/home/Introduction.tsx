export default function Introduction() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24 px-6">
      {/* Background gradient blob */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-500/5 to-transparent pointer-events-none blur-3xl rounded-full" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left: Copy */}
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#0d7ff2] text-xs font-bold uppercase tracking-wider mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0d7ff2] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0d7ff2]" />
            </span>
            Next-Gen Intelligence
          </div>

          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Your <span className="text-[#0d7ff2]">AI Email</span> Assistant
          </h1>

          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Effortlessly manage your inbox with an AI that drafts, prioritizes, and schedules for you.
            Reclaim your focus and let intelligence handle the noise.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button className="bg-[#0d7ff2] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-2xl shadow-blue-500/30 hover:scale-105 transition-transform">
              Start Free Trial
            </button>
            <button className="bg-white text-slate-700 px-8 py-4 rounded-xl text-lg font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">play_circle</span>
              Watch Demo
            </button>
          </div>
        </div>

        {/* Right: Dashboard preview */}
        <div className="relative group">
          <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full group-hover:bg-blue-500/15 transition-colors" />
          <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-2xl">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAVu34qtYRpEGo5ii2uCi-wZNy4QxOZsrwEreajCO103FgbKmI-cTmXIvGFxoQJxP62DR8mtIkiNroWSIynbogQII6bFfq4Fsl_h3yBQXufrxaVBT8h0-m0aIMIohq1_IsKa5w5oGUI96PuK2ZptDZJ9rNnemmOhi7vyASFCjQ8W_wkQjCufqVpWfuQd26cC6oRD1i34GTxHdf7uV_iL_LefTSw9di9TWCosQ3vGipYk68iUqRhUlFUR93tfSkGhQbwGudseppnRA"
              alt="Dashboard Preview"
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Floating card */}
          <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl border border-slate-100 shadow-2xl hidden md:flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-green-600">task_alt</span>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">Inbox Cleaned</p>
              <p className="text-xs text-slate-500">142 messages archived</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}