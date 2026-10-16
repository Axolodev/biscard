"use client";

import { useId, useState } from "react";
import type { ChangeEvent, FocusEventHandler, ReactNode, Ref } from "react";

export interface PropertyGroupProps {
  /** Label shown next to the toggle and used as the fieldset's legend. */
  label: string;
  /** The input fields rendered inside the fieldset. */
  children?: ReactNode;
  /**
   * Called with the toggle's new value (`true` when switched on, `false`
   * when switched off) every time it changes.
   */
  onToggleChange?: (checked: boolean) => void;
  /**
   * Native change handler for the toggle's checkbox. This is the shape React
   * Hook Form's `register()` returns, so `{...register("name")}` can be
   * spread onto this component. Called in addition to `onToggleChange`.
   */
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  /** Blur handler for the toggle's checkbox (React Hook Form `onBlur`). */
  onBlur?: FocusEventHandler<HTMLInputElement>;
  /** Field name of the toggle's checkbox (React Hook Form `name`). */
  name?: string;
  /** Ref to the toggle's checkbox (React Hook Form `ref`). */
  ref?: Ref<HTMLInputElement>;
  /** Controlled value of the toggle (use with `Controller` in React Hook Form). */
  checked?: boolean;
  /** Initial value of the toggle when uncontrolled. Defaults to off. */
  defaultChecked?: boolean;
  /** Extra classes for the outer wrapper. */
  className?: string;
}

/**
 * A DaisyUI toggle with a label, controlling a fieldset of input fields.
 * While the toggle is on the fieldset is enabled and visible; while it is
 * off the fieldset is disabled and hidden. Matches Figma node 176:15901.
 *
 * React Hook Form: either spread `register(name)` onto it, or use
 * `<Controller render={({ field }) => <PropertyGroup name={field.name}
 * checked={field.value} onChange={field.onChange} onBlur={field.onBlur}
 * ref={field.ref} ... />} />`. `Controller` is preferred, since the
 * fieldset's visibility follows the toggle's value and must stay in sync
 * with `reset()` / `setValue()`.
 */
export function PropertyGroup({
  label,
  children,
  onToggleChange,
  onChange,
  onBlur,
  name,
  ref,
  checked,
  defaultChecked = false,
  className,
}: PropertyGroupProps) {
  const toggleId = useId();
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isChecked = checked ?? internalChecked;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setInternalChecked(event.target.checked);
    onChange?.(event);
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
          ref={ref}
          type="checkbox"
          role="switch"
          name={name}
          className="toggle"
          checked={isChecked}
          onChange={handleChange}
          onBlur={onBlur}
        />
        <span>{label}</span>
      </label>
      <fieldset
        disabled={!isChecked}
        hidden={!isChecked}
        className="fieldset bg-base-300 border-base-300 rounded-box border p-4"
      >
        <legend className="fieldset-legend">{label}</legend>
        {children}
      </fieldset>
    </div>
  );
}
