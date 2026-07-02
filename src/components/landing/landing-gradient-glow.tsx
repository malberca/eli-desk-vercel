import Image from "next/image";

import { cn } from "@/lib/utils";

/** Decorative gradient PNGs in public/assets/landing/ */
export const LANDING_GRADIENT_ASSETS = {
  /** Bump ?v= when replacing the file in public/assets/landing/ */
  heroRibbon: "/assets/landing/eli-gradient-bg0.png?v=2",
  pricingAmbient: "/assets/landing/eli-gradient-bg0-B.png",
  /** Horizontal hero — gradient bg, macro ELI (preferida) */
  heroRobot: "/assets/landing/elibg2.png",
  hero: "/assets/landing/eli-gradient-bg.png",
  solution: "/assets/landing/eli-gradient-bg2.png",
  cta: "/assets/landing/eli-gradient-bg1.png",
} as const;

type LandingGradientGlowProps = {
  src: string;
  className?: string;
  imageClassName?: string;
  opacity?: number;
  sizes?: string;
};

export function LandingGradientGlow({
  src,
  className,
  imageClassName,
  opacity = 0.3,
  sizes = "50vw",
}: LandingGradientGlowProps) {
  return (
    <div className={cn("pointer-events-none absolute overflow-hidden", className)} aria-hidden>
      <Image src={src} alt="" fill sizes={sizes} className={cn("object-cover", imageClassName)} style={{ opacity }} />
    </div>
  );
}
