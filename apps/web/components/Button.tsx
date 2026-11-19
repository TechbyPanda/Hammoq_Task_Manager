import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import styles from "./Button.module.css";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonStyleProps = {
  variant?: ButtonVariant;
  className?: string;
};

type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;
type ButtonLinkProps = ButtonStyleProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

function getButtonClassName(variant: ButtonVariant, className = "") {
  return `${styles.button} ${styles[variant]} ${className}`;
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button className={getButtonClassName(variant, className)} {...props} />
  );
}

export function ButtonLink({
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={getButtonClassName(variant, className)}
      {...props}
    />
  );
}
