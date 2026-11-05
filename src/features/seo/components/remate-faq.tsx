import { ChevronDown } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "¿Qué es un remate judicial de un inmueble?",
    answer:
      "Es la venta pública de un inmueble ordenada por un juez dentro de un proceso, normalmente para pagar una deuda. El inmueble se adjudica a quien presente la mejor postura en la fecha del remate.",
  },
  {
    question: "¿Desde qué precio parte el remate?",
    answer:
      "La postura parte del precio base, que corresponde al 70 % del avalúo comercial del inmueble. En cada remate publicado te mostramos el precio base, el valor comercial y el valor para participar.",
  },
  {
    question: "¿Cuánto debo consignar para participar?",
    answer:
      "Para tener derecho a participar se consigna el 40 % del avalúo; en cada remate lo mostramos como «Derecho a participar (40 %)». Las condiciones exactas pueden variar según el proceso y el despacho, y te las confirmamos antes de que participes.",
  },
  {
    question: "¿Qué cambia en los remates de la DIAN?",
    answer:
      "Además del presupuesto, debes tener el RUT actualizado en calidad de postor y tu firma electrónica vigente. Si lo necesitas, ofrecemos el servicio de gestión y actualización del RUT.",
  },
  {
    question: "¿Me acompañan en Bucaramanga y el resto del país?",
    answer:
      "Sí. Te asesoramos desde la elección del inmueble hasta la adjudicación y el traspaso, en remates de Bucaramanga, Floridablanca, Girón, Piedecuesta y el resto de Colombia.",
  },
] as const;

export function RemateFaq({ headingId = "preguntas-frecuentes" }: { headingId?: string }) {
  return (
    <section aria-labelledby={headingId} className="flex flex-col gap-5">
      <h2 id={headingId} className="text-2xl font-medium tracking-tight">
        Preguntas frecuentes sobre los remates judiciales
      </h2>
      <div className="flex flex-col divide-y divide-border rounded-2xl border border-border">
        {FAQ_ITEMS.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronDown
                aria-hidden
                className="size-4 shrink-0 transition-transform group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
