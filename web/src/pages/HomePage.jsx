import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { ArrowRightIcon, SparklesIcon } from "lucide-react";

function HomePage() {
  return (
    <div className="bg-base-100 flex h-screen text-base">
      {/* LEFT SIDE */}
      <div className="relative flex flex-1 flex-col overflow-hidden p-8 lg:p-12">
        {/* NAVBAR */}
        <nav className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="flex size-9 items-center justify-center rounded-xl
             bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-gray-500/20
          "
            >
              <SparklesIcon className="text-primary-content size-5" />
            </div>
            <span className="text-xl font-bold">ChatLorVCL</span>
          </div>

          <div className="flex items-center gap-2">
            <SignInButton mode="modal">
              <button className="text-base-content/50 hover:text-base-content px-5 py-2.5 text-sm font-medium transition">
                Sign in
              </button>
            </SignInButton>

            <SignUpButton mode="modal">
              <button className="btn gap-2 rounded-full border-none bg-gradient-to-r from-amber-500 to-orange-500 text-sm font-semibold shadow-lg shadow-orange-500/25 hover:opacity-90">
                Get Started
                <ArrowRightIcon className="h-4 w-4" />
              </button>
            </SignUpButton>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <div className="relative z-10 flex max-w-xl flex-1 flex-col justify-center">
          {/* Tag */}
          <div className="mb-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-4 py-2 font-mono text-xs uppercase tracking-wider text-amber-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
              Now Available
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-mono text-5xl font-bold leading-[1.05] tracking-tight lg:text-6xl xl:text-7xl">
            Messaging for
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">
              everyone
            </span>
          </h1>

          {/* Description */}
          <p className="text-base-content/70 mt-6 max-w-md text-lg leading-relaxed">
            Secure, blazing-fast conversations with real-time presence and instant delivery. Connect
            with anyone, anywhere.
          </p>

          {/* CTA BTNS */}
          <div className="mt-10 flex items-center gap-4">
            <SignUpButton mode="modal">
              <button className="bg-base-100 text-base-content hover:bg-base-200 group flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold transition">
                Start chatting
                <ArrowRightIcon className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </SignUpButton>

            <SignInButton mode="modal">
              <button className="text-base-content/60 hover:text-base-content px-8 py-4 font-semibold transition">
                I have an account
              </button>
            </SignInButton>
          </div>

          {/* Avatars */}
          <div className="mt-8 flex items-center gap-4">
            <div className="avatar-group -space-x-3">
              <div className="avatar">
                <div className="border-base-100 w-10 rounded-full border-2">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="border-base-100 w-10 rounded-full border-2">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="border-base-100 w-10 rounded-full border-2">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar">
                <div className="border-base-100 w-10 rounded-full border-2">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
                    alt="User avatar"
                  />
                </div>
              </div>
              <div className="avatar avatar-placeholder">
                <div className="border-base-100 bg-base-300 text-base-content w-10 rounded-full border-2">
                  <span className="font-mono text-xs">+5k</span>
                </div>
              </div>
            </div>
            <span className="text-base-content/70 text-sm">
              Join <span className="text-base-content/80 font-mono">10,000+</span> happy users
            </span>
          </div>

          {/* STATS */}
          <div className="mt-12 flex items-center gap-10">
            <div>
              <div className="font-mono text-2xl font-bold">10K+</div>
              <div className="text-base-content/60 mt-1 text-xs uppercase tracking-wider">
                Users
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <div className="font-mono text-2xl font-bold">99.9%</div>
              <div className="text-base-content/60 mt-1 text-xs uppercase tracking-wider">
                Uptime
              </div>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <div className="font-mono text-2xl font-bold">&lt;50ms</div>
              <div className="text-base-content/60 mt-1 text-xs uppercase tracking-wider">
                Latency
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="bg-base-200 relative hidden flex-1 items-center justify-center overflow-hidden lg:flex">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
          }}
        />

        {/* Radial Glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2
           rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-[100px]"
        />

        {/* Image Container */}
        <div className="relative z-10">
          {/* Decorative border */}
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-b from-white/20 to-white/5 p-px">
            <div className="bg-base-200 h-full w-full rounded-3xl" />
          </div>

          {/* Card */}
          <div className="border-base-300 bg-base-200/80 relative rounded-3xl border p-6 shadow-2xl backdrop-blur-xl">
            <img src="/auth.png" alt="Chat illustration" className="w-80 rounded-2xl xl:w-96" />

            {/* Floating elements */}
            <div className="absolute -right-4 -top-4 rounded-full border border-emerald-500/30 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-400 backdrop-blur-sm">
              ● 36 online
            </div>

            <div className="bg-base-300/40 border-base-300 absolute -bottom-4 -left-4 rounded-2xl border px-4 py-2.5 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-500" />
                  <div className="h-6 w-6 rounded-full bg-gradient-to-br from-rose-400 to-pink-500" />
                </div>
                <span className="text-base-content/80 text-sm">typing...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default HomePage;
