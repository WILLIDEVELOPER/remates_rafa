"use client";

import { ChevronDown, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { WhatsappIcon } from "@/components/ui/whatsapp-icon";
import { getWhatsappUrl, SITE } from "@/lib/site";
import { cn } from "@/lib/utils";

interface ContactListProps {
  message?: string;
  onSelect: () => void;
  className?: string;
}

/** Opciones de contacto: cada una abre el chat de WhatsApp del número elegido. */
function ContactList({ message, onSelect, className }: ContactListProps) {
  return (
    <ul className={cn("flex flex-col gap-1", className)}>
      {SITE.whatsappContacts.map((contact) => (
        <li key={contact.number}>
          <a
            href={getWhatsappUrl(contact.number, message)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onSelect}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-secondary focus-visible:bg-surface-secondary focus-visible:outline-none"
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white">
              <WhatsappIcon className="size-5" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium">{contact.label}</span>
              <span className="text-xs text-muted">{contact.display}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}

/** Cierra el menú al pulsar fuera o con Escape. */
function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, close]);

  return ref;
}

/** Botón flotante: abre una lista para elegir con qué número chatear. */
export function WhatsappButton() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div ref={ref} className="fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6">
      {open ? (
        <div
          id={panelId}
          role="dialog"
          aria-label="Elige con quién hablar por WhatsApp"
          className="w-64 rounded-2xl border border-border bg-background p-2 shadow-xl shadow-black/20"
        >
          <p className="px-3 pt-2 pb-1 text-sm font-medium">¿Con quién quieres hablar?</p>
          <ContactList onSelect={() => setOpen(false)} />
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={open ? "Cerrar opciones de WhatsApp" : "Escríbenos por WhatsApp"}
        className="flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] motion-reduce:transition-none"
      >
        {open ? <X className="size-7" /> : <WhatsappIcon className="size-8" />}
      </button>
    </div>
  );
}

interface WhatsappInlineButtonProps {
  /** Mensaje que llega ya escrito al chat. */
  message: string;
}

/** Botón de ancho completo para fichas y formularios; la lista se despliega debajo. */
export function WhatsappInlineButton({ message }: WhatsappInlineButtonProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const ref = useDismiss(open, () => setOpen(false));

  return (
    <div ref={ref} className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        className="flex h-11 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-medium text-white transition-colors hover:bg-[#1ebe5a]"
      >
        <WhatsappIcon className="size-5" />
        Consultar por WhatsApp
        <ChevronDown
          className={cn("size-4 transition-transform motion-reduce:transition-none", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div id={panelId} className="rounded-2xl border border-border p-1">
          <ContactList message={message} onSelect={() => setOpen(false)} />
        </div>
      ) : null}
    </div>
  );
}
