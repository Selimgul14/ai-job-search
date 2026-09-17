import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  fullWidth?: boolean;
}

const styles: Record<Variant, string> = {
  primary:
    "bg-accent text-white shadow-[0_10px_24px_-8px_rgba(255,90,60,0.6)] active:scale-[0.99]",
  secondary: "bg-white text-ink border-[1.5px] border-[#ddd2c0]",
  danger: "bg-danger-soft text-danger",
};

// Shared button primitive used across forms and sheets.
export function Button({
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`rounded-[14px] px-4 py-3.5 text-[15px] font-extrabold transition disabled:opacity-50 ${
        styles[variant]
      } ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    />
  );
}
