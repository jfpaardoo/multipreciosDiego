import React from "react";

export const ProductListSection = (): JSX.Element => {
  return (
    <div className="w-full flex items-center justify-between py-4">
      <span className="[font-family:'Inter',Helvetica] font-normal text-black text-[32px] tracking-[0] leading-[38.4px]">
        Subtotal
      </span>
      <span className="[font-family:'Inter',Helvetica] font-normal text-black text-[32px] tracking-[0] leading-[38.4px]">
        144,91 €
      </span>
    </div>
  );
};
