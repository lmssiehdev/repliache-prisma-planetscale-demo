import { styled } from "react-tailwind-variants";

export const Button = styled("button", {
  base: "inline border-[1.5px] rounded-[0_0_125px_3px/3px_85px_5px_55px] transition-all ease-in cursor-pointer hover:bg-opacity-50 relative",
  variants: {
    color: {
      red: "text-red-700 bg-red-200",
      blue: "text-blue-700 bg-blue-200",
      green: "text-green-700 bg-green-200",
    },
    size: {
      sm: "text-sm px-2 py-1",
      md: "text-md px-4 py-2",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});
