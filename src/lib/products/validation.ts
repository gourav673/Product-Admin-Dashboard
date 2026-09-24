import type { Product, ProductInput } from "@/types/product";

/** The form keeps every value as a string (what the inputs give us). */
export type ProductFormValues = Record<keyof ProductInput, string>;
export type ProductFormErrors = Partial<Record<keyof ProductInput, string>>;

export const EMPTY_FORM: ProductFormValues = {
  title: "",
  description: "",
  category: "",
  price: "",
  stock: "",
  rating: "",
  brand: "",
  thumbnail: "",
};

export function productToFormValues(product: Product): ProductFormValues {
  return {
    title: product.title,
    description: product.description,
    category: product.category,
    price: String(product.price),
    stock: String(product.stock),
    rating: String(product.rating),
    brand: product.brand ?? "",
    thumbnail: product.thumbnail ?? "",
  };
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function validateProduct(values: ProductFormValues): ProductFormErrors {
  const errors: ProductFormErrors = {};
  const title = values.title.trim();
  const description = values.description.trim();

  if (!title) errors.title = "Title is required.";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.length > 100) errors.title = "Title must be 100 characters or less.";

  if (!description) errors.description = "Description is required.";
  else if (description.length < 10) errors.description = "Description must be at least 10 characters.";

  if (!values.category) errors.category = "Choose a category.";

  const price = Number(values.price);
  if (values.price.trim() === "") errors.price = "Price is required.";
  else if (!Number.isFinite(price) || price <= 0) errors.price = "Price must be a number greater than 0.";
  else if (price > 1_000_000) errors.price = "Price is too high.";

  const stock = Number(values.stock);
  if (values.stock.trim() === "") errors.stock = "Stock is required.";
  else if (!Number.isInteger(stock) || stock < 0) errors.stock = "Stock must be a whole number, 0 or more.";

  const rating = Number(values.rating);
  if (values.rating.trim() !== "" && (!Number.isFinite(rating) || rating < 0 || rating > 5)) {
    errors.rating = "Rating must be between 0 and 5.";
  }

  if (values.thumbnail.trim() && !isValidUrl(values.thumbnail.trim())) {
    errors.thumbnail = "Enter a valid image URL starting with http:// or https://";
  }

  return errors;
}

export function formValuesToInput(values: ProductFormValues): ProductInput {
  return {
    title: values.title.trim(),
    description: values.description.trim(),
    category: values.category,
    price: Number(values.price),
    stock: Number(values.stock),
    rating: values.rating.trim() === "" ? 0 : Number(values.rating),
    brand: values.brand.trim(),
    thumbnail: values.thumbnail.trim(),
  };
}
