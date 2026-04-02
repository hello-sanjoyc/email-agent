import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4 w-full">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg
            className="w-6 h-6 text-[#0d7ff2]"
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2zm-6 12l.75 2.25L9 17l-2.25.75L6 20l-.75-2.25L3 17l2.25-.75L6 14zm8 0l.75 2.25L17 17l-2.25.75L14 20l-.75-2.25L11 17l2.25-.75L14 14z" />
          </svg>
          <span className="text-xl font-bold tracking-tight text-slate-900">AI Email Agent</span>
        </div>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive
                ? "text-[#0d7ff2] font-semibold border-b-2 border-[#0d7ff2] pb-1"
                : "text-slate-500 font-medium hover:text-[#0d7ff2] transition-all duration-300"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/plans"
            className={({ isActive }) =>
              isActive
                ? "text-[#0d7ff2] font-semibold border-b-2 border-[#0d7ff2] pb-1"
                : "text-slate-500 font-medium hover:text-[#0d7ff2] transition-all duration-300"
            }
          >
            Plans
          </NavLink>
          <a
            href="#workflow"
            className="text-slate-500 font-medium hover:text-[#0d7ff2] transition-all duration-300"
          >
            Features
          </a>
          <a
            href="#contact"
            className="text-slate-500 font-medium hover:text-[#0d7ff2] transition-all duration-300"
          >
            Contact
          </a>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          <button className="hidden sm:block text-slate-600 font-medium hover:text-slate-900 transition-all duration-300 active:scale-95">
            Login
          </button>
          <button className="bg-[#0d7ff2] text-white px-6 py-2.5 rounded-xl font-semibold shadow-lg shadow-blue-500/20 hover:brightness-110 active:scale-95 transition-all duration-200">
            Get Started
          </button>
        </div>

      </div>
    </nav>
  );
}