"use client";

import { useId } from "react";
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
}

/** Controlled number input with a trailing unit (Figma "Input" with suffix). */
export function NumberField({
  label,
  value,
  onValueChange,
  unit = "mm",
  className,
}: NumberFieldProps) {
  const id = useId();
  return (
    <FieldShell label={label} htmlFor={id} className={className}>
      <label className="input w-full">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          step="any"
          min={0}
          value={value}
          onChange={(e) => {
            const next = e.target.valueAsNumber;
            onValueChange(Number.isNaN(next) ? 0 : next);
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
