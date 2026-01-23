interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
}

export default function Button({
  label,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const base = "px-4 py-2 rounded font-medium transition";

  const styles =
    variant === "primary"
      ? `${base} bg-blue-600 text-white hover:bg-blue-700`
      : `${base} bg-gray-200 text-gray-700 hover:bg-gray-300`;

  return (
    <button onClick={onClick} className={styles}>
      {label}
    </button>
  );
}
