"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useCategories } from "@/hooks/useCategories";
import { useSingleFlight } from "@/hooks/useSingleFlight";
import { getErrorMessage } from "@/lib/api/client";
import {
  EMPTY_FORM,
  formValuesToInput,
  validateProduct,
  type ProductFormErrors,
  type ProductFormValues,
} from "@/lib/products/validation";
import { formatCategory } from "@/lib/format";
import type { ProductInput } from "@/types/product";
import { Button } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/TextField";

interface ProductFormProps {
  initialValues?: ProductFormValues;
  submitLabel: string;
  cancelHref: string;
  onSubmit: (input: ProductInput) => Promise<void>;
}

export function ProductForm({ initialValues = EMPTY_FORM, submitLabel, cancelHref, onSubmit }: ProductFormProps) {
  const { categories } = useCategories();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Stays true after a successful save so the button cannot be used again
  // while the page is navigating away.
  const [saved, setSaved] = useState(false);

  const { run: save, pending } = useSingleFlight(async (input: ProductInput) => {
    setSubmitError(null);
    try {
      await onSubmit(input);
      setSaved(true);
    } catch (err) {
      setSubmitError(getErrorMessage(err));
    }
  });

  const setField = (name: keyof ProductFormValues, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the user edits it.
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const found = validateProduct(values);
    setErrors(found);
    if (Object.keys(found).length > 0 || saved) return;
    save(formValuesToInput(values));
  };

  // Keep the current category selectable even if it is not in the API list.
  const categoryOptions = categories.some((c) => c.slug === values.category) || !values.category
    ? categories
    : [{ slug: values.category, name: formatCategory(values.category) }, ...categories];

  const field = (name: keyof ProductFormValues) => ({
    name,
    value: values[name],
    error: errors[name],
    onChange: (e: { target: { value: string } }) => setField(name, e.target.value),
  });

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5 rounded-lg border border-slate-200 bg-white p-6">
      {submitError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {submitError}
        </p>
      )}

      <TextField label="Title *" maxLength={100} {...field("title")} />
      <TextAreaField label="Description *" {...field("description")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={values.category}
            onChange={(e) => setField("category", e.target.value)}
            aria-invalid={Boolean(errors.category)}
            className={`mt-1 block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.category ? "border-red-400" : "border-slate-300"
            }`}
          >
            <option value="">Select a category</option>
            {categoryOptions.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
        </div>
        <TextField label="Brand" {...field("brand")} />
        <TextField label="Price (USD) *" type="number" inputMode="decimal" min={0} step="0.01" {...field("price")} />
        <TextField label="Stock *" type="number" inputMode="numeric" min={0} step="1" {...field("stock")} />
        <TextField label="Rating (0–5)" type="number" inputMode="decimal" min={0} max={5} step="0.1" {...field("rating")} />
        <TextField label="Image URL" type="url" placeholder="https://…" {...field("thumbnail")} />
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Link
          href={cancelHref}
          className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </Link>
        <Button type="submit" loading={pending || saved}>
          {pending || saved ? "Saving…" : submitLabel}
        </Button>
      </div>
    </form>
  );
}
