"use client";

import React, { useState } from "react";
import Link from "next/link";
import { InputField } from "@/components/ui/input-field";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/ui/error-banner";
import { Icon } from "@/components/ui/icon";

export default function LoginPage() {
  const [username, setUsername] = useState("manager_sj");
  const [password, setPassword] = useState("wrongpassword");
  const [errorMessage] = useState(
    "Invalid username or password. Please try again or contact your administrator.",
  );

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="bg-surface text-on-surface h-screen w-full overflow-hidden flex">
      {/* Left Side: Branding & Imagery */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-surface-container-highest flex-col justify-between overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAv99I064F7jJynkfVZLCLAU4G2R-RwHexCQnzTn4fLrnnlpwLRRUYusWeNyW3WmmNCWE2uwIV9Z_ZoLNT3aD7sWRTS3haHtIPqAEbZifHpFFaxGLVTCDRg_tM2zHlGrP_JzdlQ1-GGCN2JDRnF6Qq4wqf3mCOZZFvI2vQimfdFHOGDqJ0YDq07bmMw5lnvbu98-d7H19GoZBHc1V5jFFy5mqWLFjSOto-ZVVhtEaOuJB-1hWJoPkSGa6XABGFI7LIVZw_T7pod7Pc')",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-on-background/90 via-on-background/50 to-on-background/20 z-10" />

        {/* Branding Header */}
        <div className="relative z-20 p-xl">
          <div className="flex items-center gap-sm">
            <Icon
              name="restaurant_menu"
              className="text-primary-fixed text-[32px]"
            />
            <span className="text-[36px] font-bold tracking-tight text-on-primary">
              ProOps RMS
            </span>
          </div>
          <p className="text-[16px] text-on-primary/80 mt-xs">
            Enterprise Hospitality Management
          </p>
        </div>

        {/* Value Proposition / Quote */}
        <div className="relative z-20 p-xl mb-xl">
          <blockquote className="text-[24px] font-semibold leading-8 text-on-primary max-w-md">
            {
              "“Streamlining our operations across 50 locations was impossible until ProOps. It's the nervous system of our restaurant group.”"
            }
          </blockquote>
          <div className="mt-md flex items-center gap-sm">
            <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center">
              <Icon name="person" className="text-on-surface" />
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

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-surface p-lg relative">
        <div className="absolute top-lg left-lg lg:hidden flex items-center gap-sm">
          <Icon name="restaurant_menu" className="text-primary" />
          <span className="text-[18px] font-bold text-on-surface">
            ProOps RMS
          </span>
        </div>

        <div className="w-full max-w-md bg-surface-container-lowest p-xl rounded-xl border border-outline-variant shadow-sm transition-colors duration-300 hover:border-primary/30">
          <div className="mb-xl">
            <h1 className="text-[36px] font-bold text-on-surface mb-xs">
              Welcome back
            </h1>
            <p className="text-[14px] text-on-surface-variant">
              Please enter your credentials to access the dashboard.
            </p>
          </div>

          <ErrorBanner message={errorMessage} />

          <form onSubmit={handleLogin} className="space-y-md">
            <InputField
              id="username"
              label="Username / Employee ID"
              iconName="badge"
              placeholder="Enter your ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              isError={!!errorMessage}
            />

            <div>
              <div className="flex items-center justify-between mb-xs">
                <label
                  className="block text-[12px] font-semibold text-on-surface"
                  htmlFor="password"
                >
                  Password
                </label>
                <Link
                  className="text-[12px] font-semibold text-primary hover:text-primary-fixed-dim transition-colors"
                  href="#"
                >
                  Forgot password?
                </Link>
              </div>
              <InputField
                id="password"
                label=""
                type="password"
                iconName="lock"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isError={!!errorMessage}
              />
            </div>

            <div className="flex items-center mt-sm mb-lg">
              <input
                className="h-4 w-4 text-primary focus:ring-primary border-outline-variant rounded bg-surface"
                id="remember-me"
                type="checkbox"
              />
              <label
                className="ml-sm block text-[14px] text-on-surface-variant"
                htmlFor="remember-me"
              >
                Remember me for 30 days
              </label>
            </div>

            <Button type="submit">Login to ProOps</Button>
          </form>

          <div className="mt-lg border-t border-outline-variant pt-md text-center">
            <p className="text-[14px] text-on-surface-variant">
              Need help?{" "}
              <Link
                className="text-[12px] font-semibold text-primary hover:underline"
                href="#"
              >
                Contact IT Support
              </Link>
            </p>
          </div>
        </div>

        <div className="absolute bottom-lg left-0 right-0 flex justify-center gap-md lg:justify-end lg:pr-lg">
          <Link
            className="text-[12px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            href="#"
          >
            Privacy Policy
          </Link>
          <Link
            className="text-[12px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            href="#"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </div>
  );
}
