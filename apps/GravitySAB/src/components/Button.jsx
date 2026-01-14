/**
 * Button - SAB Brand Button Component
 * Matches design system Button with SAB red styling
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  type = "button",
  className = "",
  fullWidth = false,
}) {
  const baseStyles = `
    font-semibold border-none rounded-lg cursor-pointer
    transition-all duration-200 inline-flex items-center justify-center
    active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variants = {
    primary: "text-white",
    secondary: "bg-teal-500 hover:bg-teal-600 text-white",
    outline: "bg-transparent border-2 border-red-600 text-red-600 hover:bg-red-50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[2rem]",
    md: "px-6 py-3 text-base min-h-[2.5rem]",
    lg: "px-8 py-4 text-base min-h-[3rem]",
  };

  const primaryStyle =
    variant === "primary"
      ? { background: disabled ? "#9ca3af" : "linear-gradient(135deg, #d33131 0%, #b82a2a 100%)" }
      : {};

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      style={primaryStyle}
      type={type}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
