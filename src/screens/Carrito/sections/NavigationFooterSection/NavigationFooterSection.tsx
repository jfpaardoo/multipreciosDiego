import React from "react";
import { Separator } from "../../../../components/ui/separator";

const contactData = [
  {
    label: "Dirección",
    value: "Calle Ronda 67, Puerto Serrano (Cádiz)",
  },
  {
    label: "Correo",
    value: "multipreciosdiego@gmail.com",
  },
  {
    label: "Teléfono",
    value: "635 40 59 43",
  },
];

export const NavigationFooterSection = (): JSX.Element => {
  return (
    <footer className="w-full bg-white">
      <Separator className="w-full" />

      <div className="w-full py-10 px-20">
        <h2 className="text-center font-subheading font-[number:var(--subheading-font-weight)] text-black text-[length:var(--subheading-font-size)] tracking-[var(--subheading-letter-spacing)] leading-[var(--subheading-line-height)] [font-style:var(--subheading-font-style)] mb-8">
          Datos de contacto
        </h2>

        <div className="flex flex-col gap-4">
          {contactData.map((item, index) => (
            <div key={index} className="flex items-center gap-16">
              <div className="w-[187px] font-small-text font-[number:var(--small-text-font-weight)] text-black text-[length:var(--small-text-font-size)] tracking-[var(--small-text-letter-spacing)] leading-[var(--small-text-line-height)] [font-style:var(--small-text-font-style)]">
                {item.label}
              </div>
              <div className="font-small-text font-[number:var(--small-text-font-weight)] text-black text-[length:var(--small-text-font-size)] tracking-[var(--small-text-letter-spacing)] leading-[var(--small-text-line-height)] [font-style:var(--small-text-font-style)]">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};
