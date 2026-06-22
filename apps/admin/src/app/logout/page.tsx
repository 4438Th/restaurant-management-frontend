"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/icon";

export default function LoggedOutPage() {
  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-md">
      <main className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-xl flex flex-col items-center text-center">
        {/* Status Icon */}
        <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-lg">
          <Icon name="check_circle" className="text-primary text-[32px]" />
        </div>

        {/* Typography */}
        <h1 className="text-[24px] font-semibold text-on-surface mb-sm">
          You have been logged out
        </h1>
        <p className="text-[14px] text-on-surface-variant mb-xl">
          For your security, please close your browser window if you are using a
          public or shared computer.
        </p>

        {/* Actions */}
        <div className="w-full flex flex-col gap-md">
          <Link
            href="/login"
            className="w-full bg-primary-container text-on-primary py-2.5 px-md rounded-lg text-[12px] font-semibold flex items-center justify-center gap-sm hover:bg-primary transition-colors"
          >
            <Icon name="login" className="text-[18px]" />
            Login Again
          </Link>

          <div className="mt-md pt-md border-t border-outline-variant w-full">
            <p className="text-[12px] font-semibold text-on-surface-variant flex items-center justify-center gap-xs">
              <Icon name="lock" className="text-[16px]" />
              ProOps RMS Secure Session
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
