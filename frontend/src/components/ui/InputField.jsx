import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function InputField({
  label,
  icon,
  inline = false,
  value,
  onChange,
  readOnly = false,
  type = "text",
  error = null,
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

      <Input
        type={type}
        value={value || ""}
        onChange={onChange}
        readOnly={readOnly}
        className={cn(
          readOnly && "bg-gray-100 cursor-not-allowed",
          error && "border-red-500 focus-visible:ring-red-500"
        )}
        {...props}
      />

      {!inline && error && (
        <p className="text-red-500 text-xs">{error}</p>
      )}
    </div>
  );
}
