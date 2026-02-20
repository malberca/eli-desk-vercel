"use client";

import Image from "next/image";

import { LoginForm } from "../../_components/login-form";

export default function LoginV2() {
  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes flicker {
          0% { transform: scaleY(1) scaleX(1); opacity: 0.8; }
          100% { transform: scaleY(1.3) scaleX(0.8); opacity: 1; }
        }
      `}</style>

      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[380px]">
        {/* ELI Bot with rocket fire */}
        <div className="relative flex flex-col items-center">
          {/* Rocket fire glow */}
          <div className="absolute -bottom-4 h-16 w-20 rounded-full bg-orange-500/20 blur-2xl animate-pulse" />
          <div className="absolute -bottom-2 h-10 w-12 rounded-full bg-amber-400/30 blur-xl animate-pulse" />
          
          {/* Rocket fire flames */}
          <div className="absolute -bottom-6 flex items-center justify-center gap-0.5">
            <div 
              className="h-8 w-1.5 rounded-full bg-gradient-to-t from-transparent via-orange-500 to-amber-300 opacity-90"
              style={{ animation: "flicker 0.15s ease-in-out infinite alternate" }}
            />
            <div 
              className="h-10 w-2 rounded-full bg-gradient-to-t from-transparent via-orange-400 to-yellow-200 opacity-95"
              style={{ animation: "flicker 0.12s ease-in-out infinite alternate" }}
            />
            <div 
              className="h-12 w-2.5 rounded-full bg-gradient-to-t from-transparent via-orange-500 to-amber-200"
              style={{ animation: "flicker 0.1s ease-in-out infinite alternate" }}
            />
            <div 
              className="h-10 w-2 rounded-full bg-gradient-to-t from-transparent via-orange-400 to-yellow-200 opacity-95"
              style={{ animation: "flicker 0.13s ease-in-out infinite alternate" }}
            />
            <div 
              className="h-8 w-1.5 rounded-full bg-gradient-to-t from-transparent via-orange-500 to-amber-300 opacity-90"
              style={{ animation: "flicker 0.16s ease-in-out infinite alternate" }}
            />
          </div>

          {/* Bot image */}
          <div className="relative z-10" style={{ animation: "float 3s ease-in-out infinite" }}>
            <Image
              src="/eli-bot.webp"
              alt="ELI Bot"
              width={140}
              height={140}
              className="drop-shadow-2xl"
              priority
            />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1 text-center pt-4">
          <h1 className="font-bold text-2xl tracking-tight">ELI Desk</h1>
          <p className="text-muted-foreground text-sm">
            Panel de administración de consorcios
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full space-y-4">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground pt-4">
          Powered by{" "}
          <span className="font-semibold text-foreground">MA—NO</span>
          {" "}Consultora Digital
        </p>
      </div>
    </>
  );
}
