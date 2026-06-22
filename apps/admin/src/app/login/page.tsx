"use client";

import Link from "next/link";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Icon } from "@/components/ui/icon";

export default function LoginPage() {
  return (
    <div className="bg-surface text-on-surface h-screen w-full overflow-hidden flex">
      {/* Left Side */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-highest flex-col justify-between overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-on-background/90 via-on-background/50 to-on-background/20 z-10" />

        <div className="relative z-20 p-8">
          <div className="flex items-center gap-2">
            <Icon name="ChefHat" className="text-primary-fixed w-8 h-8" />
            <span className="text-[36px] font-bold tracking-[-0.02em] text-on-primary">
              ProOps RMS
            </span>
          </div>
          <p className="text-[16px] text-on-primary/80 mt-1">
            Enterprise Hospitality Management
          </p>
        </div>

        <div className="relative z-20 p-8 mb-8">
          <blockquote className="text-[24px] font-semibold tracking-[-0.01em] text-on-primary max-w-md">
            &ldquo;Streamlining our operations across 50 locations was
            impossible until ProOps. It&apos;s the nervous system of our
            restaurant group.&rdquo;
          </blockquote>
          <div className="mt-4 flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
              <Icon name="User" className="text-on-surface w-5 h-5" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-on-primary">
                Sarah Jenkins
              </p>
              <p className="text-[14px] text-on-primary/70">
                Director of Operations, Culinary Collective
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-surface p-6 relative">
        <div className="absolute top-6 left-6 lg:hidden flex items-center gap-2">
          <Icon name="ChefHat" className="text-primary w-6 h-6" />
          <span className="text-[18px] font-bold text-on-surface">
            ProOps RMS
          </span>
        </div>

        <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm transition-colors duration-300 hover:border-primary/30">
          <div className="mb-8">
            <h1 className="text-[36px] font-bold tracking-[-0.02em] text-on-surface mb-1">
              Welcome back
            </h1>
            <p className="text-[14px] text-on-surface-variant">
              Please enter your credentials to access the dashboard.
            </p>
          </div>

          <ErrorBanner message="Invalid username or password. Please try again or contact your administrator." />

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <InputField
              label="Username / Employee ID"
              iconName="Contact"
              id="username"
              placeholder="Enter your ID"
              defaultValue="manager_sj"
              isError={true}
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  className="block text-[12px] font-semibold text-on-surface"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  href="#"
                  className="text-[12px] font-semibold text-primary hover:text-primary-fixed-dim transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <InputField
                label=""
                iconName="Lock"
                id="password"
                type="password"
                placeholder="••••••••"
                defaultValue="wrongpassword"
                isError={true}
              />
            </div>

            <div className="flex items-center mt-2 mb-6">
              <input
                className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded bg-surface"
                id="remember-me"
                type="checkbox"
              />
              <label
                className="ml-2 block text-[14px] text-on-surface-variant"
                htmlFor="remember-me"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit">Login to ProOps</Button>
          </form>

          <div className="mt-6 border-t border-outline-variant pt-4 text-center">
            <p className="text-[14px] text-on-surface-variant">
              Need help?{" "}
              <Link
                href="#"
                className="text-[12px] font-semibold text-primary hover:underline"
              >
                Contact IT Support
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
