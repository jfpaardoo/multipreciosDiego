import { FacebookIcon, InstagramIcon, ShoppingCartIcon } from "lucide-react";
import React from "react";
import { Button } from "../../../../components/ui/button";

export const NavigationBarSection = (): JSX.Element => {
  return (
    <nav className="w-full bg-white">
      <div className="flex items-center justify-between px-[75px] py-[57px] h-[164px]">
        <div className="flex items-center gap-3.5">
          <img
            className="w-12 h-12"
            alt="Shopping bag"
            src="/shopping-bag.svg"
          />
          <h1 className="font-m3-headline-large-emphasized font-[number:var(--m3-headline-large-emphasized-font-weight)] text-black text-[length:var(--m3-headline-large-emphasized-font-size)] tracking-[var(--m3-headline-large-emphasized-letter-spacing)] leading-[var(--m3-headline-large-emphasized-line-height)] [font-style:var(--m3-headline-large-emphasized-font-style)]">
            Multiprecios Diego
          </h1>
        </div>

        <div className="flex items-center gap-[26px]">
          <InstagramIcon className="w-8 h-8 text-black" />
          <FacebookIcon className="w-8 h-8 text-black" />
        </div>

        <div className="flex items-center gap-[92px]">
          <span className="font-body-text font-[number:var(--body-text-font-weight)] text-black text-[length:var(--body-text-font-size)] tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] whitespace-nowrap [font-style:var(--body-text-font-style)]">
            FAQ
          </span>

          <ShoppingCartIcon className="w-12 h-12 text-black" />

          <Button className="flex items-center justify-center gap-2 px-3 py-3 h-[62px] w-[116px] bg-[#2c2c2c] rounded-lg border border-solid hover:bg-[#3c3c3c]">
            <span className="font-body-text font-[number:var(--body-text-font-weight)] text-white text-[length:var(--body-text-font-size)] tracking-[var(--body-text-letter-spacing)] leading-[var(--body-text-line-height)] whitespace-nowrap [font-style:var(--body-text-font-style)]">
              Diego
            </span>
          </Button>
        </div>
      </div>
    </nav>
  );
};
