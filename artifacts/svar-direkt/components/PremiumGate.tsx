import React from "react";

interface Props {
  featureName: string;
  children: React.ReactNode;
}

export function PremiumGate({ children }: Props) {
  return <>{children}</>;
}
