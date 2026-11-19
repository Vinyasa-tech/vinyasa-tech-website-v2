import type { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Button as ShadcnButton } from "@/components/ui/button";

interface ButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  type?: "button" | "submit" | "reset";

  variant?:
    | "default"
    | "secondary"
    | "outline"
    | "ghost"
    | "link";

  size?: "default" | "sm" | "lg" | "icon";

  className?: string;
}

function Button({
  children,
  to,
  href,
  type = "button",
  variant = "default",
  size = "default",
  className = "",
}: ButtonProps) {
  /* =====================================================
     INTERNAL REACT ROUTER LINK
  ===================================================== */

  if (to) {
    return (
      <ShadcnButton
        render={<Link to={to} />}
        variant={variant}
        size={size}
        className={className}
      >
        {children}
      </ShadcnButton>
    );
  }

  /* =====================================================
     EXTERNAL LINK
  ===================================================== */

  if (href) {
    return (
      <ShadcnButton
        render={
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          />
        }
        variant={variant}
        size={size}
        className={className}
      >
        {children}
      </ShadcnButton>
    );
  }

  /* =====================================================
     NORMAL BUTTON
  ===================================================== */

  return (
    <ShadcnButton
      type={type}
      variant={variant}
      size={size}
      className={className}
    >
      {children}
    </ShadcnButton>
  );
}

export default Button;