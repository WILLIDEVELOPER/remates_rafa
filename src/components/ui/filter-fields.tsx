"use client";

import {
  Input,
  Label,
  ListBox,
  Select,
  TextField,
  type Key,
} from "@heroui/react";
import { Search } from "lucide-react";
import { useRef, useState } from "react";

const ALL = "__all__";

interface FilterSelectProps {
  label: string;
  placeholder: string;
  value: string | undefined;
  options: readonly { value: string; label: string }[];
  onChange: (value: string | undefined) => void;
  isDisabled?: boolean;
}

export function FilterSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
  isDisabled,
}: FilterSelectProps) {
  return (
    <Select
      className="w-full"
      placeholder={placeholder}
      isDisabled={isDisabled}
      value={value ?? ALL}
      onChange={(key) => {
        const next = key === null ? ALL : String(key);
        onChange(next === ALL ? undefined : next);
      }}
    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox>
          <ListBox.Item id={ALL} textValue={placeholder}>
            {placeholder}
            <ListBox.ItemIndicator />
          </ListBox.Item>
          {options.map((option) => (
            <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

interface FilterMultiSelectProps {
  label: string;
  placeholder: string;
  value: string[];
  options: readonly { value: string; label: string }[];
  onChange: (value: string[]) => void;
}

export function FilterMultiSelect({
  label,
  placeholder,
  value,
  options,
  onChange,
}: FilterMultiSelectProps) {
  return (
    <Select
      className="w-full"
      placeholder={placeholder}
      selectionMode="multiple"
      value={value}
      onChange={(keys) => onChange((keys as Key[]).map(String))}
    >
      <Label>{label}</Label>
      <Select.Trigger>
        <Select.Value />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox selectionMode="multiple">
          {options.map((option) => (
            <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
              {option.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}

interface DebouncedTextFieldProps {
  label: string;
  placeholder?: string;
  /** Valor actual en la URL; si cambia desde fuera (p. ej. al limpiar) el campo se actualiza. */
  value: string;
  onCommit: (value: string | undefined) => void;
  inputMode?: "text" | "numeric";
  withSearchIcon?: boolean;
  delay?: number;
}

/** Campo de texto que aplica el filtro tras una breve pausa al escribir. */
export function DebouncedTextField({
  label,
  placeholder,
  value: urlValue,
  onCommit,
  inputMode = "text",
  withSearchIcon,
  delay = 500,
}: DebouncedTextFieldProps) {
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [text, setText] = useState(urlValue);
  const [seenUrlValue, setSeenUrlValue] = useState(urlValue);
  const [committed, setCommitted] = useState(urlValue);

  // Si la URL cambia por otra vía (limpiar filtros, atrás/adelante), se refleja en el campo.
  if (urlValue !== seenUrlValue) {
    setSeenUrlValue(urlValue);
    if (urlValue !== committed) {
      setText(urlValue);
      setCommitted(urlValue);
    }
  }

  const handleChange = (next: string) => {
    setText(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const cleaned = inputMode === "numeric" ? next.replace(/\D/g, "") : next.trim();
      setCommitted(cleaned);
      onCommit(cleaned || undefined);
    }, delay);
  };

  return (
    <TextField className="w-full" value={text} onChange={handleChange}>
      <Label>{label}</Label>
      <div className="relative">
        {withSearchIcon ? (
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
        ) : null}
        <Input
          placeholder={placeholder}
          inputMode={inputMode}
          className={withSearchIcon ? "w-full pl-9" : "w-full"}
        />
      </div>
    </TextField>
  );
}
