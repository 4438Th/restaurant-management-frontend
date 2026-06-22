"use client";

import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function LogoutPage() {
  return (
    <div className="bg-background min-h-screen w-full flex items-center justify-center p-4">
      <main className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-8 flex flex-col items-center text-center">
        {/* Status Icon */}
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-6">
          <Icon name="CheckCircle" className="text-primary w-8 h-8" />
        </div>

        {/* Typography */}
        <h1 className="text-[24px] font-semibold tracking-[-0.01em] text-on-surface mb-2">
          You have been logged out
        </h1>
        <p className="text-[14px] text-on-surface-variant mb-8">
          For your security, please close your browser window if you are using a
          public or shared computer.
        </p>

        {/* Actions */}
        <div className="w-full flex flex-col gap-4">
          <Link
            className="w-full bg-primary-container text-on-primary py-2.5 px-4 rounded-lg text-[12px] font-semibold flex items-center justify-center gap-2 hover:bg-primary transition-colors"
            href="/login"
          >
            <Icon name="LogIn" className="w-4 h-4" />
            Login Again
          </Link>

          <div className="mt-4 pt-4 border-t border-outline-variant w-full">
            <p className="text-[12px] text-on-surface-variant flex items-center justify-center gap-1">
              <Icon name="Lock" className="w-4 h-4" />
              ProOps RMS Secure Session
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
