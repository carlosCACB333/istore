import { tv } from "tailwind-variants";

export const text = tv({
  base: "tracking-tight max-w-full",
  variants: {
    color: {
      violet: "from-[#FF1CF7] to-[#b249f8] text-transparent",
      yellow: "from-[#FF705B] to-[#FFB457] text-transparent",
      blue: "from-[#5EA2EF] to-[#0072F5] text-transparent",
      cyan: "from-[#00b7fa] to-[#01cfea] text-transparent",
      green: "from-[#6FEE8D] to-[#17c964] text-transparent",
      pink: "from-[#FF72E1] to-[#F54C7A] text-transparent",
      foreground: "text-foreground",
      disabled: "text-default-500",
      black : "text-black",
    },
    size: {
      xs: "text-xs lg:text-sm",
      sm: "text-sm lg:text-base",
      base: "text-base lg:text-lg",
      md: "text-lg lg:text-xl",
      lg: "text-2xl lg:text-3xl font-bold",
      xl: "text-[2.3rem] lg:text-5xl leading-9 font-bold",
      "2xl": "text-[3.5rem] lg:text-6xl leading-10 font-bold",
    },
    font: {
      normal: "font-normal",
      semibold: "font-semibold",
      bold: "font-bold",
    },
  },
  defaultVariants: {
    size: "base",
    color: "foreground",
  },
  compoundVariants: [
    {
      color: [
        "violet",
        "yellow",
        "blue",
        "cyan",
        "green",
        "pink",
        "foreground",
        "disabled",
      ],
      class: "bg-clip-text bg-gradient-to-b",
    },
  ],
});

export const gradient = tv({
  base: "bg-gradient-to-r",
  variants: {
    bg: {
      violet: "from-[#FF1CF7] to-[#b249f8]",
      yellow: "from-[#FF705B] to-[#FFB457]",
      blue: "from-[#5EA2EF] to-[#0072F5]",
      cyan: "from-[#00b7fa] to-[#01cfea]",
      green: "from-[#6FEE8D] to-[#17c964]",
      pink: "from-[#FF72E1] to-[#F54C7A]",
    },
  },
  defaultVariants: {
    bg: "violet",
  },
});
