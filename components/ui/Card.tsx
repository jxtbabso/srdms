import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
};

export default function Card({
  children,
}: CardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-sm">
      {children}
    </div>
  );
}