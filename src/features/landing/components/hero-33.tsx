"use client";

import { Chip } from "@heroui/react";
import { motion } from "motion/react";
import { LinkButton } from "@/components/ui/link-button";
import { HERO_VIDEO_URL } from "@/lib/site";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

export function Hero33() {
  return (
    <section className="dark relative flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground">
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black/80 via-black/30 to-black/50" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-4 pt-28 pb-10 lg:px-8 lg:pb-16 xl:px-16">
        <motion.div
          {...fadeIn}
          className="flex w-full flex-col gap-4 lg:flex-row lg:items-end lg:justify-between lg:gap-8"
        >
          <div className="flex max-w-[34rem] flex-col gap-4">
            <Chip
              variant="tertiary"
              className="h-7 w-fit rounded-full border border-foreground bg-transparent px-3 py-1 text-sm font-normal text-foreground"
            >
              Remates judiciales en Colombia
            </Chip>
            <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              Encuentra oportunidades inmobiliarias únicas en remates
              judiciales en toda Colombia
            </h1>
          </div>

          <div className="flex max-w-[30.625rem] flex-col gap-3 sm:gap-4 lg:shrink-0 lg:gap-8">
            <p className="text-base text-foreground sm:text-lg">
              Casas, apartamentos, lotes y locales con precios por debajo del
              mercado, saneamiento jurídico y acompañamiento en cada paso del
              proceso.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <LinkButton
                href="/remates"
                withArrow
                className="h-10 w-full px-5 font-medium sm:w-fit"
              >
                Ver Remates Disponibles
              </LinkButton>
              <LinkButton
                href="#valor"
                variant="outline"
                withArrow
                className="h-10 w-full border-foreground/60 px-5 font-medium sm:w-fit"
              >
                Conocer más
              </LinkButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
