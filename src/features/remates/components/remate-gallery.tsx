"use client";

import { Button, Modal, useOverlayState } from "@heroui/react";
import { ChevronLeft, ChevronRight, Expand } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface RemateGalleryProps {
  images: string[];
  nombre: string;
}

export function RemateGallery({ images, nombre }: RemateGalleryProps) {
  const [index, setIndex] = useState(0);
  const lightbox = useOverlayState();

  const total = images.length;
  const isOpen = lightbox.isOpen;

  // Navegación con flechas mientras el lightbox está abierto.
  useEffect(() => {
    if (!isOpen || total < 2) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % total);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, total]);

  if (images.length === 0) {
    return <div className="aspect-[16/10] w-full rounded-2xl bg-surface-secondary" />;
  }

  const go = (delta: number) => setIndex((current) => (current + delta + total) % total);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={lightbox.open}
        aria-label="Ampliar imagen"
        className="group relative aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-2xl bg-surface-secondary outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2"
      >
        <Image
          src={images[index]}
          alt={`${nombre} - imagen ${index + 1} de ${total}`}
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white backdrop-blur">
          <Expand className="size-3.5" />
          {index + 1} / {total}
        </span>
      </button>

      {total > 1 ? (
        <ul className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((src, thumbIndex) => (
            <li key={src}>
              <button
                type="button"
                onClick={() => setIndex(thumbIndex)}
                aria-label={`Ver imagen ${thumbIndex + 1}`}
                aria-current={thumbIndex === index}
                className={cn(
                  "relative aspect-[4/3] w-full overflow-hidden rounded-xl border-2 transition-all duration-300",
                  thumbIndex === index
                    ? "border-foreground"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Image src={src} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <Modal.Backdrop variant="blur" isOpen={lightbox.isOpen} onOpenChange={lightbox.setOpen}>
        <Modal.Container size="cover">
          <Modal.Dialog
            aria-label={`Galería de ${nombre}`}
            className="dark bg-black/90 text-white"
          >
            <Modal.CloseTrigger />
            <div className="relative h-[80dvh] w-full">
              <Image
                src={images[index]}
                alt={`${nombre} - imagen ${index + 1} de ${total}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
              {total > 1 ? (
                <>
                  <Button
                    isIconOnly
                    aria-label="Imagen anterior"
                    variant="secondary"
                    onPress={() => go(-1)}
                    className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full"
                  >
                    <ChevronLeft className="size-5" />
                  </Button>
                  <Button
                    isIconOnly
                    aria-label="Imagen siguiente"
                    variant="secondary"
                    onPress={() => go(1)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full"
                  >
                    <ChevronRight className="size-5" />
                  </Button>
                </>
              ) : null}
            </div>
            <p className="py-3 text-center text-sm text-white/70">
              {index + 1} / {total}
            </p>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
