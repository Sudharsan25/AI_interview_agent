"use client";

import React from "react";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui";
import { Control, Controller, FieldValues, Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "file" | "number";
}

export function FormField<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-neutral-300 font-medium">{label}</FormLabel>
          <FormControl>
            <Input
              type={type}
              className="h-12 rounded-xl bg-neutral-800 border-white/10 text-white placeholder:text-neutral-500 focus:border-blue-500/50 focus:ring-blue-500/20 transition-all"
              placeholder={placeholder}
              {...field}
            />
          </FormControl>
          <FormMessage className="text-red-400" />
        </FormItem>
      )}
    />
  );
}
