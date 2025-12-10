import { cn } from "@/lib/utils";

export default function SelectField({
  label,
  icon,
  inline = false,
  value,
  onChange,
  options = [],
  error,
  className,
  ...props
}) {
  return (
    <div
      className={cn(
        inline ? "flex items-center gap-2 w-full" : "flex flex-col gap-1 w-full",
        className
      )}
    >
      {label && (
        <label
          className={cn(
            "text-sm font-medium text-gray-700 flex items-center gap-1",
            inline ? "mb-0" : "mb-1"
          )}
        >
          {icon && <span className="flex items-center">{icon}</span>}
          {label}
        </label>
      )}

      <select
        value={value}
        onChange={onChange}
        className={cn(
          "h-9 w-full rounded-md border bg-white px-3 text-sm shadow-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500",
          error && "border-red-500 focus-visible:ring-red-500",
          "disabled:cursor-not-allowed disabled:opacity-50"
        )}
        {...props}
      >
        <option value="">Selecciona…</option>
        {options.map((o) => (
          <option key={o.id || o.value} value={o.id || o.value}>
            {o.nombre || o.label}
          </option>
        ))}
      </select>

      {!inline && error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
}
