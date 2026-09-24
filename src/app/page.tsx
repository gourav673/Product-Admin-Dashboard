import { redirect } from "next/navigation";

// The middleware normally redirects "/" already; this is a fallback.
export default function Home() {
  redirect("/products");
}
