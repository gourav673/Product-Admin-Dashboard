export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  thumbnail: string;
  images: string[];
  reviews?: Review[];
  /** true for products created in this browser (the API does not really save them). */
  isLocal?: boolean;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
}

/** The fields the add/edit form can change. */
export interface ProductInput {
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  rating: number;
  brand: string;
  thumbnail: string;
}

export type SortField = "price" | "rating" | "title";
export type SortOrder = "asc" | "desc";

/** Everything that decides which products the list shows. Mirrors the URL. */
export interface ProductQuery {
  page: number;
  limit: number;
  q: string;
  category: string;
  sortBy: SortField | "";
  order: SortOrder;
  /** Optional artificial API delay (ms), only used to test slow responses. */
  delay: number;
}
