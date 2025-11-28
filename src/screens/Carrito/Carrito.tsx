import { TagIcon } from "lucide-react";
import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { NavigationFooterSection } from "./sections/NavigationFooterSection";
import { ProductListSection } from "./sections/ProductListSection";

const cartItems = [
  {
    id: 1,
    image: "/image-1.svg",
    name: "Árbol de navidad",
    description:
      "Elegante árbol de navidad blanco excelente para una decoración moderna. Altura de 180 cm con 8kg de peso.",
    reference: "336411-573258",
    price: 50,
    quantity: 2,
  },
  {
    id: 2,
    image: "/image.svg",
    name: "Guirnalda de cinta",
    description: "Cintas de decoración navideña",
    reference: "445563-867354",
    price: 4.99,
    quantity: 9,
  },
];

export const Carrito = (): JSX.Element => {
  const calculateItemTotal = (price: number, quantity: number) => {
    return (price * quantity).toFixed(2);
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="bg-white w-full min-h-screen flex flex-col">
      <NavigationBarSection />

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-11">
        <h1 className="text-center text-[32px] font-normal [font-family:'Inter',Helvetica] text-black leading-[48px] mt-[100px] mb-[62px]">
          Carrito
        </h1>

        <div className="space-y-[41px]">
          {cartItems.map((item) => (
            <Card key={item.id} className="border-0 shadow-none">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    className="w-full h-[255px]"
                    alt="Rectangle"
                    src="/rectangle-5.svg"
                  />

                  <div className="absolute top-0 left-0 w-full h-full flex gap-6 p-6">
                    <div
                      className="w-[228px] h-[255px] rounded-xl bg-cover bg-center flex-shrink-0"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />

                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-3">
                        <h2 className="text-[40px] font-normal [font-family:'Inter',Helvetica] text-black leading-[48px]">
                          {item.name}
                        </h2>
                        <div className="opacity-70 font-m3-title-large-emphasized font-[number:var(--m3-title-large-emphasized-font-weight)] text-black text-[length:var(--m3-title-large-emphasized-font-size)] tracking-[var(--m3-title-large-emphasized-letter-spacing)] leading-[var(--m3-title-large-emphasized-line-height)] whitespace-nowrap [font-style:var(--m3-title-large-emphasized-font-style)]">
                          Referencia: {item.reference}
                        </div>
                      </div>

                      <p className="font-subheading font-[number:var(--subheading-font-weight)] text-[#828282] text-[length:var(--subheading-font-size)] tracking-[var(--subheading-letter-spacing)] leading-[var(--subheading-line-height)] [font-style:var(--subheading-font-style)] mb-6">
                        {item.description}
                      </p>

                      <div className="flex justify-between items-center mt-auto">
                        <p className="[font-family:'Inter',Helvetica] font-medium text-black text-2xl leading-9">
                          Precio: {item.price.toFixed(2)} €
                        </p>

                        <div className="flex items-center gap-5">
                          <div className="flex items-center gap-[18px]">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-12 h-12 p-0"
                            >
                              <img
                                className="w-9 h-9"
                                alt="Icon"
                                src="/icon-1.svg"
                              />
                            </Button>

                            <span className="font-m3-display-medium font-[number:var(--m3-display-medium-font-weight)] text-black text-[length:var(--m3-display-medium-font-size)] tracking-[var(--m3-display-medium-letter-spacing)] leading-[var(--m3-display-medium-line-height)] [font-style:var(--m3-display-medium-font-style)] w-[26px] text-center">
                              {item.quantity}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-12 h-12 p-0"
                          >
                            <img
                              className="w-12 h-12"
                              alt="MinusIcon square"
                              src="/minus-square.svg"
                            />
                          </Button>
                        </div>

                        <p className="[font-family:'Inter',Helvetica] font-medium text-black text-2xl leading-9">
                          Total: {calculateItemTotal(item.price, item.quantity)}{" "}
                          €
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-[127px]">
          <Button
            variant="outline"
            className="w-[228px] bg-[#2c2c2c] text-white border-black rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-[#2c2c2c]/90"
          >
            <TagIcon className="w-4 h-4" />
            <span className="font-single-line-body-base font-[number:var(--single-line-body-base-font-weight)] text-[length:var(--single-line-body-base-font-size)] tracking-[var(--single-line-body-base-letter-spacing)] leading-[var(--single-line-body-base-line-height)] [font-style:var(--single-line-body-base-font-style)]">
              Aplicar descuento
            </span>
          </Button>
        </div>

        <div className="mt-[83px] mb-[180px]">
          <Card className="border-0 shadow-none">
            <CardContent className="p-0">
              <div className="relative">
                <img
                  className="w-full h-[156px]"
                  alt="Rectangle"
                  src="/rectangle-5.svg"
                />

                <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center px-0">
                  <p className="font-subheading font-[number:var(--subheading-font-weight)] text-[#828282] text-[length:var(--subheading-font-size)] tracking-[var(--subheading-letter-spacing)] leading-[var(--subheading-line-height)] [font-style:var(--subheading-font-style)] mb-8">
                    Envío&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Gratis
                  </p>

                  <p className="text-[40px] font-normal [font-family:'Inter',Helvetica] text-black leading-[48px]">
                    TOTAL&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    {calculateTotal()} €
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-[51px] space-y-[51px]">
            <Button className="w-full bg-[#009951] text-white border border-[#b3b3b3] rounded-lg p-3 flex items-center justify-center gap-2 hover:bg-[#009951]/90">
              <TagIcon className="w-4 h-4" />
              <span className="font-single-line-body-base font-[number:var(--single-line-body-base-font-weight)] text-[length:var(--single-line-body-base-font-size)] tracking-[var(--single-line-body-base-letter-spacing)] leading-[var(--single-line-body-base-line-height)] [font-style:var(--single-line-body-base-font-style)]">
                Reservar
              </span>
            </Button>

            <Button className="w-full bg-[#2c2c2c] text-white border border-black rounded-lg p-3 flex items-center justify-center hover:bg-[#2c2c2c]/90">
              <span className="font-single-line-body-base font-[number:var(--single-line-body-base-font-weight)] text-[length:var(--single-line-body-base-font-size)] tracking-[var(--single-line-body-base-letter-spacing)] leading-[var(--single-line-body-base-line-height)] [font-style:var(--single-line-body-base-font-style)]">
                Confirmar
              </span>
            </Button>
          </div>
        </div>

        <ProductListSection />
      </main>

      <NavigationFooterSection />
    </div>
  );
};
