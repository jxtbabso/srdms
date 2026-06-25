import Link from "next/link";
import { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  href,
  type = "button",
  onClick,
  disabled,
}: ButtonProps) {
  const classes =
    "inline-flex items-center justify-center rounded-lg border border-purple-600 bg-purple-700 px-5 py-2.5 text-white font-medium hover:bg-purple-600 transition disabled:opacity-50";

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}