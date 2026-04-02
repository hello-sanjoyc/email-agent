export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white text-sm font-sans">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 py-12 max-w-7xl mx-auto">
        {/* Brand */}
        <div className="mb-8 md:mb-0 text-center md:text-left">
          <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
            <svg
              className="w-6 h-6 text-[#0d7ff2]"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm-6 12l.75 2.25L9 17l-2.25.75L6 20l-.75-2.25L3 17l2.25-.75L6 14zm8 0l.75 2.25L17 17l-2.25.75L14 20l-.75-2.25L11 17l2.25-.75L14 14z" />
            </svg>
            <span className="text-lg font-bold text-slate-900">AI Email Agent</span>
          </div>
          <p className="text-slate-500 max-w-xs">
            Intelligent email management for high-performance teams. Built for privacy, speed, and focus.
          </p>
        </div>

        {/* Links + copyright + socials */}
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex gap-8">
            {["Privacy Policy", "Terms of Service", "Security", "Status"].map((link) => (
              <a
                key={link}
                href="#"
                className="text-slate-500 hover:text-[#0d7ff2] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <p className="text-slate-500">© 2024 AI Email Agent. All rights reserved.</p>

          <div className="flex gap-4">
            {/* Twitter / X */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-[#0d7ff2] transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>
            {/* GitHub */}
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-[#0d7ff2] transition-colors"
              aria-label="GitHub"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
