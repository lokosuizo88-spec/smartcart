// services/openfoodfacts.ts

export async function searchOpenFoodFacts(query: string) {
  const response = await fetch(
    `https://world.openfoodfacts.org/cgi/search.pl?` +
      `search_terms=${encodeURIComponent(query)}` +
      `&search_simple=1&action=process&json=1` +
      `&tagtype_0=countries&tag_contains_0=contains&tag_0=spain` +
      `&page_size=10` +
      `&fields=code,product_name,brands,nutrition_grades,image_small_url,quantity`,
    {
      headers: {
        "User-Agent": "SmartCart/1.0 (smartcart@app.com)",
      },
    }
  );

  const data = await response.json();

  return (data.products || []).map((p: any) => ({
    barcode: p.code,
    name: p.product_name || "Sin nombre",
    brand: p.brands || "",
    nutriScore: p.nutrition_grades || "",
    image: p.image_small_url || "",
    quantity: p.quantity || "",
  }));
}

export async function getProductByBarcode(barcode: string) {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v2/product/${barcode}.json` +
      `?fields=product_name,brands,nutrition_grades,ecoscore_grade,` +
      `image_url,ingredients_text_es,allergens_tags,nova_group`,
    {
      headers: {
        "User-Agent": "SmartCart/1.0 (smartcart@app.com)",
      },
    }
  );

  const data = await response.json();
  if (data.status !== 1) return null;

  return {
    name: data.product.product_name,
    brand: data.product.brands,
    nutriScore: data.product.nutrition_grades,
    ecoScore: data.product.ecoscore_grade,
    novaGroup: data.product.nova_group,
    image: data.product.image_url,
    ingredients: data.product.ingredients_text_es,
    allergens: data.product.allergens_tags,
  };
}