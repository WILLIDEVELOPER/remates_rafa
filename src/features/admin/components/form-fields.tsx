"use client";

import {
  FieldError,
  Input,
  Label,
  ListBox,
  NumberField,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";
import { Controller, type Control, type FieldPath } from "react-hook-form";
import type { RemateFormValues } from "../schemas/remate-form-schema";

type FieldName = FieldPath<RemateFormValues>;

interface BaseProps {
  control: Control<RemateFormValues>;
  name: FieldName;
  label: string;
}

export function FormText({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required,
  onValueChange,
  prefix,
}: BaseProps & {
  placeholder?: string;
  type?: string;
  required?: boolean;
  onValueChange?: (value: string) => void;
  prefix?: string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          name={field.name}
          type={type}
          value={String(field.value ?? "")}
          onChange={(value) => {
            field.onChange(value);
            onValueChange?.(value);
          }}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
          isRequired={required}
          validationBehavior="aria"
          className="w-full"
        >
          <Label>{label}</Label>
          <div className="relative">
            {prefix ? (
              <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-sm text-muted">
                {prefix}
              </span>
            ) : null}
            <Input
              placeholder={placeholder}
              className="w-full"
              style={prefix ? { paddingLeft: `${prefix.length * 0.5 + 1}rem` } : undefined}
            />
          </div>
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}

export function FormTextArea({
  control,
  name,
  label,
  placeholder,
  rows = 6,
}: BaseProps & { placeholder?: string; rows?: number }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <TextField
          name={field.name}
          value={String(field.value ?? "")}
          onChange={field.onChange}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
          isRequired
          validationBehavior="aria"
          className="w-full"
        >
          <Label>{label}</Label>
          <TextArea rows={rows} placeholder={placeholder} className="w-full" />
          <FieldError>{fieldState.error?.message}</FieldError>
        </TextField>
      )}
    />
  );
}

export function FormNumber({
  control,
  name,
  label,
  placeholder,
  currency,
  required,
  maxValue,
}: BaseProps & {
  placeholder?: string;
  currency?: boolean;
  required?: boolean;
  maxValue?: number;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <NumberField
          name={field.name}
          value={typeof field.value === "number" ? field.value : undefined}
          onChange={(value) => field.onChange(Number.isNaN(value) ? undefined : value)}
          onBlur={field.onBlur}
          isInvalid={fieldState.invalid}
          isRequired={required}
          minValue={0}
          maxValue={maxValue}
          validationBehavior="aria"
          formatOptions={
            currency
              ? { style: "currency", currency: "COP", maximumFractionDigits: 0 }
              : { maximumFractionDigits: 2 }
          }
          className="w-full"
        >
          <Label>{label}</Label>
          <NumberField.Group>
            <NumberField.Input placeholder={placeholder} className="w-full" />
          </NumberField.Group>
          <FieldError>{fieldState.error?.message}</FieldError>
        </NumberField>
      )}
    />
  );
}

export function FormSelect({
  control,
  name,
  label,
  options,
  placeholder,
  isDisabled,
  required,
  onValueChange,
}: BaseProps & {
  options: readonly { value: string; label: string }[];
  placeholder: string;
  isDisabled?: boolean;
  required?: boolean;
  onValueChange?: (value: string) => void;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <div className="flex w-full flex-col gap-1.5">
          <Select
            className="w-full"
            placeholder={placeholder}
            isDisabled={isDisabled}
            isRequired={required}
            isInvalid={fieldState.invalid}
            value={field.value ? String(field.value) : null}
            onChange={(key) => {
              const value = key === null ? "" : String(key);
              field.onChange(value);
              onValueChange?.(value);
            }}
          >
            <Label>{label}</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {options.map((option) => (
                  <ListBox.Item key={option.value} id={option.value} textValue={option.label}>
                    {option.label}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
          {fieldState.error ? (
            <p role="alert" className="text-xs text-danger">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      )}
    />
  );
}
