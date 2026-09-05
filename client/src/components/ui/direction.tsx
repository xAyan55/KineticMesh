import * as React from "react";
import { DirectionProvider as RadixDirectionProvider } from "@radix-ui/react-direction";

export interface DirectionProviderProps {
  dir?: "ltr" | "rtl";
  children: React.ReactNode;
}

export function DirectionProvider({ dir = "ltr", children }: DirectionProviderProps) {
  return <RadixDirectionProvider dir={dir}>{children}</RadixDirectionProvider>;
}
