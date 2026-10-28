import { WhatsappIcon } from "@/components/ui/whatsapp-icon";
import { getWhatsappUrl } from "@/lib/site";

/** Botón flotante que abre un chat de WhatsApp con un mensaje de saludo. */
export function WhatsappButton() {
  return (
    <a
      href={getWhatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className="fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/30 transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] motion-reduce:transition-none sm:right-6 sm:bottom-6"
    >
      <WhatsappIcon className="size-8" />
    </a>
  );
}
