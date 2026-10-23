"use client";

import { useId, useState } from "react";
import type { ReactNode } from "react";

interface FieldShellProps {
  label: string;
  htmlFor: string;
  className?: string;
  children: ReactNode;
}

function FieldShell({ label, htmlFor, className, children }: FieldShellProps) {
  return (
    <div className={`fieldset min-w-0 ${className ?? ""}`}>
      <label htmlFor={htmlFor} className="label">
        {label}
      </label>
      {children}
    </div>
  );
}

export interface NumberFieldProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  /** Unit shown at the end of the input. Defaults to "mm"; pass "" for none. */
  unit?: string;
  className?: string;
  allowDecimals?: boolean;
}

/** Parses the text being typed; an empty or sign-only draft counts as 0. */
function parseDraft(draft: string): number {
  return /^-?\.?$/.test(draft) ? 0 : Number(draft);
}

/**
 * Controlled number input with a trailing unit (Figma "Input" with suffix).
 *
 * Keeps the text being typed in a local draft: a controlled `type="number"`
 * input would re-render "1." as "1" and drop the decimal point before the
 * user can type the fractional digits. Both "." and "," work as the decimal
 * separator; the parsed number is reported through `onValueChange`.
 */
export function NumberField({
  label,
  value,
  onValueChange,
  unit = "mm",
  className,
  allowDecimals = true,
}: NumberFieldProps) {
  const id = useId();
  const [draft, setDraft] = useState(String(value));

  // The value changed from outside (e.g. restored form state): show it.
  if (parseDraft(draft) !== value) {
    setDraft(String(value));
  }

  const allowed = allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d*$/;

  return (
    <FieldShell label={label} htmlFor={id} className={className}>
      <label className="input w-full">
        <input
          id={id}
          type="text"
          inputMode={allowDecimals ? "decimal" : "numeric"}
          value={draft}
          onChange={(e) => {
            const next = e.target.value.replace(",", ".");
            if (!allowed.test(next)) return;

            setDraft(next);
            onValueChange(parseDraft(next));
          }}
        />
        {unit && <span className="label">{unit}</span>}
      </label>
    </FieldShell>
  );
}

export interface TextFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function TextField({
  label,
  value,
  onValueChange,
  placeholder,
  className,
}: TextFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} className={className}>
      <input
        id={id}
        type="text"
        className="input w-full"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </FieldShell>
  );
}

export interface TextAreaFieldProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function TextAreaField({
  label,
  value,
  onValueChange,
  className,
}: TextAreaFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} className={className}>
      <textarea
        id={id}
        className="textarea h-24 w-full"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      />
    </FieldShell>
  );
}

export interface SelectFieldProps<T extends string> {
  label: string;
  value: T;
  options: readonly { value: T; label: string }[];
  onValueChange: (value: T) => void;
  className?: string;
}

export function SelectField<T extends string>({
  label,
  value,
  options,
  onValueChange,
  className,
}: SelectFieldProps<T>) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} className={className}>
      <select
        id={id}
        className="select w-full"
        value={value}
        onChange={(e) => onValueChange(e.target.value as T)}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}
