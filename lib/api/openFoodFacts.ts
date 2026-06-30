// Cliente para a API pública do Open Food Facts (gratuita, sem necessidade de chave)
// Docs: https://wiki.openfoodfacts.org/API

export type OFFProduct = {
  id: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  macros: { kcal: number; protein: number; carbs: number; fat: number };
};

export async function searchOpenFoodFacts(query: string, signal?: AbortSignal): Promise<OFFProduct[]> {
  const term = query.trim();
  if (!term) return [];

  const url =
    `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(term)}` +
    `&search_simple=1&action=process&json=1&page_size=15` +
    `&fields=code,product_name,brands,nutriments,image_small_url`;

  const res = await fetch(url, { signal });
  if (!res.ok) {
    throw new Error(`Open Food Facts respondeu ${res.status}`);
  }
  const data = await res.json();
  const products = Array.isArray(data?.products) ? data.products : [];

  return products
    .filter((p: any) => p?.product_name && p?.nutriments?.["energy-kcal_100g"] != null)
    .map((p: any) => {
      const n = p.nutriments ?? {};
      return {
        id: `off-${p.code ?? Math.random().toString(36).slice(2)}`,
        name: p.product_name,
        brand: p.brands || undefined,
        imageUrl: p.image_small_url || undefined,
        macros: {
          kcal: Number(n["energy-kcal_100g"] ?? 0),
          protein: Number(n["proteins_100g"] ?? 0),
          carbs: Number(n["carbohydrates_100g"] ?? 0),
          fat: Number(n["fat_100g"] ?? 0),
        },
      } as OFFProduct;
    })
    .slice(0, 15);
}
