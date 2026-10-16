"use client";

import { useId, useState } from "react";
import type { ChangeEvent, ReactNode } from "react";

export interface PropertyGroupProps {
  /** Label shown next to the toggle and used as the fieldset's legend. */
  label: string;
  /** Legend of the fieldset. Defaults to `label`. */
  legend?: string;
  /** The input fields rendered inside the fieldset. */
  children?: ReactNode;
  /**
   * Called with the toggle's new value (`true` when switched on, `false`
   * when switched off) every time it changes.
   */
  onToggleChange?: (checked: boolean) => void;
  /** Controlled value of the toggle (use with `Controller` in React Hook Form). */
  checked?: boolean;
  /** Initial value of the toggle when uncontrolled. Defaults to off. */
  defaultChecked?: boolean;
  /** Extra classes for the outer wrapper. */
  className?: string;
  /** Extra classes for the fieldset wrapper. */
  fieldsetClassName?: string;
}

/**
 * A DaisyUI toggle with a label, controlling a fieldset of input fields.
 * While the toggle is on the fieldset is enabled and visible; while it is
 * off the fieldset is disabled and hidden. Matches Figma node 176:15901.
 * */
export function PropertyGroup({
  label,
  legend,
  children,
  onToggleChange,
  checked,
  defaultChecked = false,
  className,
  fieldsetClassName,
}: PropertyGroupProps) {
  const toggleId = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInternalChecked(event.target.checked);
    onToggleChange?.(event.target.checked);
  }

  return (
    <div className={`flex flex-col gap-3 ${className ?? ""}`}>
      <label
        htmlFor={toggleId}
        className="flex cursor-pointer items-center gap-2 text-sm"
      >
        <input
          id={toggleId}
          type="checkbox"
          role="switch"
          className="toggle"
          checked={isChecked}
          onChange={handleChange}
        />
        <span>{label}</span>
      </label>
      <fieldset
        disabled={!isChecked}
        hidden={!isChecked}
        className={`fieldset bg-base-300 border-base-300 rounded-box border ${fieldsetClassName ?? "p-4"}`}
      >
        <legend className="fieldset-legend">{legend ?? label}</legend>
        {children}
      </fieldset>
    </div>
  );
}
