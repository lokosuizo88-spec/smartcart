// services/mercadona.ts

const ALGOLIA_URL =
  "https://7uzjkl1dj0-dsn.algolia.net/1/indexes/products_prod_vlc1_es/query";

export async function searchMercadona(query: string) {
  const response = await fetch(ALGOLIA_URL, {
    method: "POST",
    headers: {
      "X-Algolia-Application-Id": "7UZJKL1DJ0",
      "X-Algolia-API-Key": "9d8f2e39e90df472b4f2e559a116fe17",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      params: `query=${encodeURIComponent(query)}&hitsPerPage=10`,
    }),
  });

  const data = await response.json();

  return (data.hits || []).map((hit: any) => ({
    id: hit.id,
    name: hit.display_name || "Sin nombre",
    price: parseFloat(hit.price_instructions?.unit_price || "0"),
    referencePrice: parseFloat(hit.price_instructions?.reference_price || "0"),
    referenceUnit: hit.price_instructions?.reference_format || "",
    image: hit.thumbnail || "",
    packaging: hit.packaging || "",
    isOffer: hit.price_instructions?.price_decreased || false,
    supermarket: "mercadona",
  }));
}