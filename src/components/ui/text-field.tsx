type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  hint?: string;
  required?: boolean;
  type?: "text" | "email";
  multiline?: boolean;
  autoComplete?: string;
};

export function TextField({
  id,
  label,
  value,
  onChange,
  onBlur,
  error,
  hint,
  required = false,
  type = "text",
  multiline = false,
  autoComplete,
}: TextFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;

  const controlProps = {
    id,
    name: id,
    value,
    required,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": describedBy,
    onBlur,
    className: `w-full rounded-md border bg-transparent px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 ${
      error
        ? "border-red-600 focus-visible:outline-red-600 dark:border-red-400 dark:focus-visible:outline-red-400"
        : "border-zinc-300 dark:border-zinc-700"
    }`,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && (
          <span className="text-red-600 dark:text-red-400" aria-hidden="true">
            {" *"}
          </span>
        )}
      </label>
      {multiline ? (
        <textarea
          {...controlProps}
          rows={4}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          {...controlProps}
          type={type}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </p>
      )}
    </div>
  );
}
