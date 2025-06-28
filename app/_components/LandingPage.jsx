"use client";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col ">
      {/* Main Section */}
      <main className="flex flex-col-reverse md:flex-row items-center px-8 md:px-16 lg:px-32 py-25 gap-8">
        {/* Left: Text */}
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-blue-500">
            AI Powered Mock Interview Platform
          </h2>
          <p className="text-lg text-gray-600">
            Practice smarter, get hired faster
          </p>

          <div className="space-y-5 bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🎯</div>
              <div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                  Ready to Land Your Dream Job?
                </p>
                <p className="mt-1 text-gray-700 dark:text-gray-300">
                  Begin your journey with AI-powered mock interviews designed to
                  boost your confidence and performance.
                </p>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
            >
              🚀 Get Started
            </Link>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="flex-1 flex justify-center">
          <Image
            src="/hero.png"
            alt="Interview illustration"
            width={700}
            height={600}
            className="object-contain"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center pt-12 border-t text-sm text-gray-600 space-y-2">
        <div className="font-semibold text-lg text-black">
          Build Your Confidence for Real Interviews
        </div>
        <p>Simulate realistic interview scenarios to hone your skills.</p>
        <div className="flex justify-center gap-4 text-sm text-gray-500">
          <Link href="/">Terms</Link>
          <Link href="/">Privacy</Link>
          <Link href="/">Contact</Link>
          <Link
            href="https://github.com/purveshjambhulkar/Prepify---AI-powered-Mock-Interview-Platform"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </Link>
        </div>
      </footer>
    </div>
  );
}
