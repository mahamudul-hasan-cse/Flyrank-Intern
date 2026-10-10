import type { ChangeEvent } from "react";

type FormFieldProps = {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: "text" | "email" | "url";
  multiline?: boolean;
  rows?: number;
  autoComplete?: string;
  placeholder?: string;
};

export function FormField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  type = "text",
  multiline = false,
  rows = 4,
  autoComplete,
  placeholder,
}: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  const inputClassName = `w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
    error
      ? "border-red-600 focus-visible:ring-red-600 dark:border-red-400 dark:focus-visible:ring-red-400"
      : "border-zinc-300 focus-visible:ring-zinc-900 dark:border-zinc-700 dark:focus-visible:ring-zinc-100"
  }`;

  const sharedProps = {
    id,
    name,
    value,
    required,
    placeholder,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    className: inputClassName,
    onChange: (
      event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => onChange(event.target.value),
    onBlur: () => onBlur?.(),
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required ? (
          <span aria-hidden="true" className="text-red-600 dark:text-red-400">
            {" "}
            *
          </span>
        ) : (
          <span className="font-normal text-zinc-500 dark:text-zinc-400">
            {" "}
            (optional)
          </span>
        )}
      </label>
      {multiline ? (
        <textarea rows={rows} {...sharedProps} />
      ) : (
        <input type={type} {...sharedProps} />
      )}
      {hint && (
        <p id={hintId} className="text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
