"use client";
import { useState, useEffect, useCallback, useRef } from "react";

// ============================================================
// SMART CART - Intelligent Shopping List & Price Comparison App
// ============================================================

const SUPERMARKETS = [
  { id: "mercadona", name: "Mercadona", color: "#00A650", logo: "🟢", url: "https://www.mercadona.es" },
  { id: "carrefour", name: "Carrefour", color: "#004E9A", logo: "🔵", url: "https://www.carrefour.es" },
  { id: "lidl", name: "Lidl", color: "#FFF000", logo: "🟡", url: "https://www.lidl.es" },
  { id: "aldi", name: "Aldi", color: "#00599C", logo: "🔷", url: "https://www.aldi.es" },
  { id: "dia", name: "DIA", color: "#E30613", logo: "🔴", url: "https://www.dia.es" },
  { id: "consum", name: "Consum", color: "#FF6600", logo: "🟠", url: "https://www.consum.es" },
];

const CATEGORIES = [
  { id: "frutas", name: "Frutas y Verduras", icon: "🥬", color: "#4CAF50" },
  { id: "carnes", name: "Carnes y Pescados", icon: "🥩", color: "#E53935" },
  { id: "lacteos", name: "Lácteos", icon: "🥛", color: "#42A5F5" },
  { id: "panaderia", name: "Panadería", icon: "🍞", color: "#FF8F00" },
  { id: "bebidas", name: "Bebidas", icon: "🥤", color: "#7E57C2" },
  { id: "limpieza", name: "Limpieza", icon: "🧹", color: "#26C6DA" },
  { id: "higiene", name: "Higiene Personal", icon: "🧴", color: "#EC407A" },
  { id: "congelados", name: "Congelados", icon: "🧊", color: "#5C6BC0" },
  { id: "snacks", name: "Snacks y Dulces", icon: "🍪", color: "#FFA726" },
  { id: "otros", name: "Otros", icon: "📦", color: "#78909C" },
];

const SAMPLE_PRODUCTS = [
  { id: 1, name: "Leche entera 1L", category: "lacteos", prices: { mercadona: 0.89, carrefour: 0.95, lidl: 0.79, aldi: 0.82, dia: 0.92, consum: 0.90 }, unit: "ud" },
  { id: 2, name: "Pan de molde integral", category: "panaderia", prices: { mercadona: 1.25, carrefour: 1.45, lidl: 1.09, aldi: 1.15, dia: 1.35, consum: 1.30 }, unit: "ud" },
  { id: 3, name: "Pechuga de pollo 1kg", category: "carnes", prices: { mercadona: 6.90, carrefour: 7.50, lidl: 6.49, aldi: 6.75, dia: 7.20, consum: 7.10 }, unit: "kg" },
  { id: 4, name: "Plátanos 1kg", category: "frutas", prices: { mercadona: 1.65, carrefour: 1.79, lidl: 1.49, aldi: 1.55, dia: 1.69, consum: 1.60 }, unit: "kg" },
  { id: 5, name: "Yogur natural pack 4", category: "lacteos", prices: { mercadona: 1.10, carrefour: 1.25, lidl: 0.99, aldi: 1.05, dia: 1.20, consum: 1.15 }, unit: "pack" },
  { id: 6, name: "Aceite oliva virgen extra 1L", category: "otros", prices: { mercadona: 8.50, carrefour: 9.20, lidl: 7.99, aldi: 8.30, dia: 8.90, consum: 8.60 }, unit: "L" },
  { id: 7, name: "Tomates 1kg", category: "frutas", prices: { mercadona: 2.10, carrefour: 2.35, lidl: 1.89, aldi: 2.00, dia: 2.25, consum: 2.15 }, unit: "kg" },
  { id: 8, name: "Papel higiénico 12 rollos", category: "higiene", prices: { mercadona: 3.50, carrefour: 4.10, lidl: 3.29, aldi: 3.40, dia: 3.85, consum: 3.60 }, unit: "pack" },
  { id: 9, name: "Detergente líquido 3L", category: "limpieza", prices: { mercadona: 5.90, carrefour: 6.50, lidl: 5.49, aldi: 5.70, dia: 6.20, consum: 5.95 }, unit: "ud" },
  { id: 10, name: "Coca-Cola pack 6", category: "bebidas", prices: { mercadona: 3.78, carrefour: 4.20, lidl: 3.50, aldi: 3.60, dia: 3.90, consum: 3.80 }, unit: "pack" },
  { id: 11, name: "Arroz largo 1kg", category: "otros", prices: { mercadona: 1.15, carrefour: 1.30, lidl: 0.99, aldi: 1.10, dia: 1.25, consum: 1.20 }, unit: "kg" },
  { id: 12, name: "Huevos docena L", category: "otros", prices: { mercadona: 2.30, carrefour: 2.55, lidl: 2.09, aldi: 2.20, dia: 2.45, consum: 2.35 }, unit: "docena" },
  { id: 13, name: "Agua mineral 6x1.5L", category: "bebidas", prices: { mercadona: 1.44, carrefour: 1.80, lidl: 1.20, aldi: 1.38, dia: 1.62, consum: 1.50 }, unit: "pack" },
  { id: 14, name: "Manzanas 1kg", category: "frutas", prices: { mercadona: 2.29, carrefour: 2.50, lidl: 1.99, aldi: 2.15, dia: 2.39, consum: 2.30 }, unit: "kg" },
  { id: 15, name: "Gel de ducha 750ml", category: "higiene", prices: { mercadona: 2.10, carrefour: 2.80, lidl: 1.89, aldi: 2.00, dia: 2.50, consum: 2.20 }, unit: "ud" },
  { id: 16, name: "Pizza congelada", category: "congelados", prices: { mercadona: 2.50, carrefour: 3.10, lidl: 2.29, aldi: 2.40, dia: 2.85, consum: 2.60 }, unit: "ud" },
  { id: 17, name: "Patatas fritas 150g", category: "snacks", prices: { mercadona: 1.30, carrefour: 1.55, lidl: 1.19, aldi: 1.25, dia: 1.45, consum: 1.35 }, unit: "ud" },
  { id: 18, name: "Café molido 250g", category: "bebidas", prices: { mercadona: 2.85, carrefour: 3.20, lidl: 2.49, aldi: 2.70, dia: 3.05, consum: 2.90 }, unit: "ud" },
  { id: 19, name: "Lechuga iceberg", category: "frutas", prices: { mercadona: 0.99, carrefour: 1.15, lidl: 0.89, aldi: 0.95, dia: 1.09, consum: 1.00 }, unit: "ud" },
  { id: 20, name: "Queso tierno 250g", category: "lacteos", prices: { mercadona: 2.75, carrefour: 3.10, lidl: 2.49, aldi: 2.60, dia: 2.95, consum: 2.80 }, unit: "ud" },
];

const OFFERS = [
  { id: 1, productId: 3, supermarket: "lidl", discount: 30, originalPrice: 6.49, offerPrice: 4.54, validUntil: "2026-02-28", description: "¡30% en pechuga de pollo!", url: "https://www.lidl.es/ofertas" },
  { id: 2, productId: 6, supermarket: "mercadona", discount: 15, originalPrice: 8.50, offerPrice: 7.23, validUntil: "2026-03-05", description: "15% dto. aceite oliva virgen extra", url: "https://www.mercadona.es/ofertas" },
  { id: 3, productId: 10, supermarket: "carrefour", discount: 25, originalPrice: 4.20, offerPrice: 3.15, validUntil: "2026-02-25", description: "3x2 en Coca-Cola packs", url: "https://www.carrefour.es/ofertas" },
  { id: 4, productId: 8, supermarket: "dia", discount: 40, originalPrice: 3.85, offerPrice: 2.31, validUntil: "2026-02-22", description: "¡40% en papel higiénico!", url: "https://www.dia.es/ofertas" },
  { id: 5, productId: 9, supermarket: "aldi", discount: 20, originalPrice: 5.70, offerPrice: 4.56, validUntil: "2026-03-01", description: "20% en detergentes", url: "https://www.aldi.es/ofertas" },
  { id: 6, productId: 12, supermarket: "lidl", discount: 15, originalPrice: 2.09, offerPrice: 1.78, validUntil: "2026-02-27", description: "Huevos camperos -15%", url: "https://www.lidl.es/ofertas" },
  { id: 7, productId: 18, supermarket: "mercadona", discount: 10, originalPrice: 2.85, offerPrice: 2.57, validUntil: "2026-03-10", description: "Café molido -10%", url: "https://www.mercadona.es/ofertas" },
  { id: 8, productId: 16, supermarket: "consum", discount: 35, originalPrice: 2.60, offerPrice: 1.69, validUntil: "2026-02-24", description: "¡Pizzas al -35%!", url: "https://www.consum.es/ofertas" },
];

const AI_SUGGESTIONS = {
  lacteos: [
    { original: "Leche entera 1L", suggestion: "Leche semidesnatada 1L", reason: "Mismo sabor con 50% menos grasa. Ideal si buscas mantener el perfil nutricional sin sacrificar gusto.", savings: "Mismo precio aprox." },
    { original: "Yogur natural pack 4", suggestion: "Yogur natural Skyr pack 4", reason: "Mayor contenido proteico (10g vs 4g) y menos azúcar. Mejor relación calidad-precio nutricional.", savings: "+0.30€ pero el doble de proteína" },
  ],
  carnes: [
    { original: "Pechuga de pollo 1kg", suggestion: "Contramuslo de pollo deshuesado 1kg", reason: "30% más barato, más jugoso al cocinar y excelente para guisos, wok y plancha.", savings: "Ahorras ~2€/kg" },
  ],
  bebidas: [
    { original: "Coca-Cola pack 6", suggestion: "Agua con gas + limón natural", reason: "Alternativa saludable sin azúcar añadido. Si buscas el efecto refrescante, el agua con gas con un toque de cítrico es una gran opción.", savings: "Ahorras ~2.50€" },
  ],
  limpieza: [
    { original: "Detergente líquido 3L", suggestion: "Detergente en cápsulas ecológico", reason: "Dosificación precisa (sin desperdiciar), más concentrado y menos plástico. Igual de efectivo.", savings: "Similar precio, menos desperdicio" },
  ],
  frutas: [
    { original: "Plátanos 1kg", suggestion: "Plátano de Canarias 1kg", reason: "Producto local, mayor contenido en potasio y magnesio, y apoyas la agricultura nacional.", savings: "+0.20€ pero mejor calidad" },
  ],
};

// ============================================================
// Utility Functions
// ============================================================

const formatPrice = (price) => `${price.toFixed(2)}€`;

const getCheapestSupermarket = (prices) => {
  let cheapest = null;
  let minPrice = Infinity;
  Object.entries(prices).forEach(([store, price]) => {
    if (price < minPrice) {
      minPrice = price;
      cheapest = store;
    }
  });
  return { store: cheapest, price: minPrice };
};

const getListTotal = (items, storeId) => {
  return items.reduce((total, item) => {
    const product = SAMPLE_PRODUCTS.find(p => p.id === item.productId);
    if (product) {
      return total + (product.prices[storeId] || 0) * item.quantity;
    }
    return total;
  }, 0);
};

// ============================================================
// Components
// ============================================================

const TabBar = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "lists", label: "Listas", icon: "📋" },
    { id: "compare", label: "Comparar", icon: "⚖️" },
    { id: "offers", label: "Ofertas", icon: "🏷️" },
    { id: "ai", label: "IA Smart", icon: "🧠" },
    { id: "search", label: "Buscar", icon: "🔍" },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: "rgba(15, 15, 20, 0.95)",
      backdropFilter: "blur(20px)",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      display: "flex", justifyContent: "space-around",
      padding: "6px 0 env(safe-area-inset-bottom, 12px)",
      zIndex: 1000,
    }}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "2px",
            padding: "6px 12px", borderRadius: "12px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: activeTab === tab.id ? "translateY(-2px)" : "none",
          }}
        >
          <span style={{
            fontSize: "22px",
            filter: activeTab === tab.id ? "none" : "grayscale(0.8)",
            transition: "filter 0.3s",
          }}>{tab.icon}</span>
          <span style={{
            fontSize: "10px", fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            color: activeTab === tab.id ? "#7BF1A8" : "rgba(255,255,255,0.35)",
            letterSpacing: "0.5px",
            transition: "color 0.3s",
          }}>{tab.label}</span>
          {activeTab === tab.id && (
            <div style={{
              width: "4px", height: "4px", borderRadius: "50%",
              background: "#7BF1A8",
              boxShadow: "0 0 8px #7BF1A8",
              marginTop: "1px",
            }} />
          )}
        </button>
      ))}
    </div>
  );
};

const Header = ({ title, subtitle }) => (
  <div style={{
    padding: "20px 20px 16px",
    background: "linear-gradient(180deg, rgba(123,241,168,0.08) 0%, transparent 100%)",
  }}>
    <h1 style={{
      fontSize: "28px", fontWeight: 800,
      fontFamily: "'Clash Display', 'DM Sans', sans-serif",
      color: "#fff", margin: 0,
      letterSpacing: "-0.5px",
    }}>
      <span style={{ color: "#7BF1A8" }}>●</span> {title}
    </h1>
    {subtitle && (
      <p style={{
        fontSize: "13px", color: "rgba(255,255,255,0.45)",
        margin: "4px 0 0", fontFamily: "'DM Sans', sans-serif",
      }}>{subtitle}</p>
    )}
  </div>
);

const ProductCard = ({ product, quantity, onAdd, onRemove, onQuantityChange, isInList, compact }) => {
  const cheapest = getCheapestSupermarket(product.prices);
  const store = SUPERMARKETS.find(s => s.id === cheapest.store);
  const maxPrice = Math.max(...Object.values(product.prices));
  const savings = ((maxPrice - cheapest.price) / maxPrice * 100).toFixed(0);
  const cat = CATEGORIES.find(c => c.id === product.category);

  return (
    <div style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: "16px",
      padding: compact ? "12px 14px" : "16px",
      display: "flex", alignItems: "center", gap: "12px",
      transition: "all 0.2s ease",
      position: "relative",
      overflow: "hidden",
    }}>
      {isInList && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: "3px", height: "100%",
          background: "#7BF1A8", borderRadius: "0 4px 4px 0",
        }} />
      )}
      <div style={{
        width: "42px", height: "42px", borderRadius: "12px",
        background: `${cat?.color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px", flexShrink: 0,
      }}>
        {cat?.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: "14px", fontWeight: 600, color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{product.name}</div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "3px" }}>
          <span style={{
            fontSize: "15px", fontWeight: 700, color: "#7BF1A8",
            fontFamily: "'DM Mono', monospace",
          }}>{formatPrice(cheapest.price)}</span>
          <span style={{
            fontSize: "10px", color: "rgba(255,255,255,0.35)",
            fontFamily: "'DM Sans', sans-serif",
          }}>en {store?.name}</span>
          {parseInt(savings) > 5 && (
            <span style={{
              fontSize: "9px", fontWeight: 700, color: "#0f0f14",
              background: "#7BF1A8", padding: "1px 6px", borderRadius: "6px",
              fontFamily: "'DM Sans', sans-serif",
            }}>-{savings}%</span>
          )}
        </div>
      </div>
      {onAdd && !isInList && (
        <button onClick={() => onAdd(product)} style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "rgba(123,241,168,0.15)", border: "1px solid rgba(123,241,168,0.3)",
          color: "#7BF1A8", fontSize: "20px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}>+</button>
      )}
      {isInList && (
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button onClick={() => onRemove(product.id)} style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "rgba(229,57,53,0.15)", border: "1px solid rgba(229,57,53,0.3)",
            color: "#E53935", fontSize: "16px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>−</button>
          <span style={{
            fontSize: "16px", fontWeight: 700, color: "#fff",
            fontFamily: "'DM Mono', monospace",
            minWidth: "24px", textAlign: "center",
          }}>{quantity}</span>
          <button onClick={() => onQuantityChange(product.id, quantity + 1)} style={{
            width: "30px", height: "30px", borderRadius: "8px",
            background: "rgba(123,241,168,0.15)", border: "1px solid rgba(123,241,168,0.3)",
            color: "#7BF1A8", fontSize: "16px", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>+</button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// Lists Tab
// ============================================================
const ListsTab = ({ lists, setLists, activeList, setActiveList, setActiveTab }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListType, setNewListType] = useState("rapida");
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const currentList = lists.find(l => l.id === activeList);

  const createList = () => {
    if (!newListName.trim()) return;
    const newList = {
      id: Date.now(),
      name: newListName,
      type: newListType,
      items: [],
      createdAt: new Date().toISOString(),
    };
    setLists([...lists, newList]);
    setActiveList(newList.id);
    setNewListName("");
    setShowCreate(false);
  };

  const addProductToList = (product) => {
    if (!currentList) return;
    const exists = currentList.items.find(i => i.productId === product.id);
    if (exists) {
      updateQuantity(product.id, exists.quantity + 1);
    } else {
      const updated = lists.map(l => {
        if (l.id === activeList) {
          return { ...l, items: [...l.items, { productId: product.id, quantity: 1 }] };
        }
        return l;
      });
      setLists(updated);
    }
  };

  const removeProduct = (productId) => {
    const updated = lists.map(l => {
      if (l.id === activeList) {
        const item = l.items.find(i => i.productId === productId);
        if (item && item.quantity > 1) {
          return { ...l, items: l.items.map(i => i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i) };
        }
        return { ...l, items: l.items.filter(i => i.productId !== productId) };
      }
      return l;
    });
    setLists(updated);
  };

  const updateQuantity = (productId, newQty) => {
    const updated = lists.map(l => {
      if (l.id === activeList) {
        return { ...l, items: l.items.map(i => i.productId === productId ? { ...i, quantity: newQty } : i) };
      }
      return l;
    });
    setLists(updated);
  };

  const deleteList = (listId) => {
    setLists(lists.filter(l => l.id !== listId));
    if (activeList === listId) setActiveList(null);
  };

  const filteredProducts = SAMPLE_PRODUCTS.filter(p => {
    const matchSearch = !searchTerm || p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = !selectedCategory || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  const typeLabels = { rapida: "⚡ Rápida", semanal: "📅 Semanal", mensual: "📆 Mensual" };
  const typeColors = { rapida: "#7BF1A8", semanal: "#42A5F5", mensual: "#FFA726" };

  // List selection view
  if (!activeList) {
    return (
      <div style={{ paddingBottom: "100px" }}>
        <Header title="Mis Listas" subtitle="Organiza tus compras de forma inteligente" />

        <div style={{ padding: "0 20px" }}>
          {lists.length === 0 && !showCreate && (
            <div style={{
              textAlign: "center", padding: "60px 20px",
              color: "rgba(255,255,255,0.3)",
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🛒</div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px" }}>
                No tienes listas aún. ¡Crea tu primera lista!
              </p>
            </div>
          )}

          {lists.map(list => (
            <div
              key={list.id}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                padding: "16px", marginBottom: "10px",
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: "14px",
              }}
              onClick={() => setActiveList(list.id)}
            >
              <div style={{
                width: "48px", height: "48px", borderRadius: "14px",
                background: `${typeColors[list.type]}15`,
                border: `1px solid ${typeColors[list.type]}30`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px",
              }}>
                {list.type === "rapida" ? "⚡" : list.type === "semanal" ? "📅" : "📆"}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "15px", fontWeight: 600, color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                }}>{list.name}</div>
                <div style={{
                  fontSize: "12px", color: "rgba(255,255,255,0.35)",
                  fontFamily: "'DM Sans', sans-serif", marginTop: "2px",
                }}>
                  {list.items.length} productos · {typeLabels[list.type]}
                </div>
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); deleteList(list.id); }}
                style={{
                  background: "rgba(229,57,53,0.1)", border: "none",
                  width: "32px", height: "32px", borderRadius: "8px",
                  color: "#E53935", fontSize: "14px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>✕</button>
              <div style={{
                color: "rgba(255,255,255,0.2)", fontSize: "18px",
              }}>›</div>
            </div>
          ))}

          {showCreate ? (
            <div style={{
              background: "rgba(123,241,168,0.05)",
              border: "1px solid rgba(123,241,168,0.15)",
              borderRadius: "16px", padding: "20px", marginTop: "16px",
            }}>
              <input
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="Nombre de la lista..."
                style={{
                  width: "100%", background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", padding: "12px 16px",
                  color: "#fff", fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              <div style={{
                display: "flex", gap: "8px", marginTop: "12px",
                flexWrap: "wrap",
              }}>
                {["rapida", "semanal", "mensual"].map(type => (
                  <button
                    key={type}
                    onClick={() => setNewListType(type)}
                    style={{
                      padding: "8px 16px", borderRadius: "10px",
                      border: `1px solid ${newListType === type ? typeColors[type] : "rgba(255,255,255,0.1)"}`,
                      background: newListType === type ? `${typeColors[type]}20` : "transparent",
                      color: newListType === type ? typeColors[type] : "rgba(255,255,255,0.5)",
                      fontSize: "12px", fontWeight: 600, cursor: "pointer",
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {typeLabels[type]}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
                <button onClick={createList} style={{
                  flex: 1, padding: "12px", borderRadius: "12px",
                  background: "#7BF1A8", border: "none",
                  color: "#0f0f14", fontSize: "14px", fontWeight: 700,
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                }}>Crear Lista</button>
                <button onClick={() => setShowCreate(false)} style={{
                  padding: "12px 20px", borderRadius: "12px",
                  background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.5)", fontSize: "14px", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                }}>Cancelar</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowCreate(true)}
              style={{
                width: "100%", padding: "16px", marginTop: "16px",
                borderRadius: "14px", border: "2px dashed rgba(123,241,168,0.25)",
                background: "transparent", color: "#7BF1A8",
                fontSize: "14px", fontWeight: 600, cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                transition: "all 0.2s",
              }}
            >
              + Nueva Lista
            </button>
          )}
        </div>
      </div>
    );
  }

  // Active list view
  return (
    <div style={{ paddingBottom: "100px" }}>
      <div style={{
        padding: "16px 20px", display: "flex", alignItems: "center", gap: "12px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <button onClick={() => setActiveList(null)} style={{
          background: "rgba(255,255,255,0.06)", border: "none",
          width: "36px", height: "36px", borderRadius: "10px",
          color: "#fff", fontSize: "16px", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: "18px", fontWeight: 700, color: "#fff",
            fontFamily: "'DM Sans', sans-serif",
          }}>{currentList.name}</div>
          <div style={{
            fontSize: "11px", color: typeColors[currentList.type],
            fontFamily: "'DM Sans', sans-serif",
          }}>{typeLabels[currentList.type]} · {currentList.items.length} productos</div>
        </div>
        <button onClick={() => { setActiveTab("compare"); }} style={{
          padding: "8px 14px", borderRadius: "10px",
          background: "rgba(123,241,168,0.12)", border: "1px solid rgba(123,241,168,0.25)",
          color: "#7BF1A8", fontSize: "12px", fontWeight: 600, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
        }}>⚖️ Comparar</button>
      </div>

      <div style={{ padding: "16px 20px" }}>
        {currentList.items.length === 0 && !showAddProduct && (
          <div style={{
            textAlign: "center", padding: "40px 20px",
            color: "rgba(255,255,255,0.3)",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📝</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
              Lista vacía. Añade productos para empezar.
            </p>
          </div>
        )}

        {/* List items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {currentList.items.map(item => {
            const product = SAMPLE_PRODUCTS.find(p => p.id === item.productId);
            if (!product) return null;
            return (
              <ProductCard
                key={item.productId}
                product={product}
                quantity={item.quantity}
                isInList={true}
                onRemove={removeProduct}
                onQuantityChange={updateQuantity}
              />
            );
          })}
        </div>

        {/* Estimated total */}
        {currentList.items.length > 0 && (
          <div style={{
            background: "rgba(123,241,168,0.06)",
            border: "1px solid rgba(123,241,168,0.12)",
            borderRadius: "14px", padding: "14px 16px",
            marginTop: "16px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{
              fontSize: "13px", color: "rgba(255,255,255,0.6)",
              fontFamily: "'DM Sans', sans-serif",
            }}>Estimado (mejor precio):</span>
            <span style={{
              fontSize: "20px", fontWeight: 800, color: "#7BF1A8",
              fontFamily: "'DM Mono', monospace",
            }}>
              {formatPrice(currentList.items.reduce((total, item) => {
                const product = SAMPLE_PRODUCTS.find(p => p.id === item.productId);
                if (!product) return total;
                const cheapest = getCheapestSupermarket(product.prices);
                return total + cheapest.price * item.quantity;
              }, 0))}
            </span>
          </div>
        )}

        {/* Add product section */}
        {showAddProduct ? (
          <div style={{ marginTop: "16px" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px",
            }}>
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar producto..."
                autoFocus
                style={{
                  flex: 1, background: "rgba(0,0,0,0.3)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", padding: "12px 16px",
                  color: "#fff", fontSize: "14px",
                  fontFamily: "'DM Sans', sans-serif",
                  outline: "none",
                }}
              />
              <button onClick={() => { setShowAddProduct(false); setSearchTerm(""); setSelectedCategory(null); }} style={{
                background: "rgba(255,255,255,0.06)", border: "none",
                padding: "12px", borderRadius: "12px",
                color: "rgba(255,255,255,0.5)", fontSize: "14px", cursor: "pointer",
              }}>✕</button>
            </div>

            {/* Category filter chips */}
            <div style={{
              display: "flex", gap: "6px", overflowX: "auto",
              paddingBottom: "10px", marginBottom: "10px",
              scrollbarWidth: "none",
            }}>
              <button
                onClick={() => setSelectedCategory(null)}
                style={{
                  padding: "6px 14px", borderRadius: "20px",
                  border: `1px solid ${!selectedCategory ? "#7BF1A8" : "rgba(255,255,255,0.1)"}`,
                  background: !selectedCategory ? "rgba(123,241,168,0.15)" : "transparent",
                  color: !selectedCategory ? "#7BF1A8" : "rgba(255,255,255,0.4)",
                  fontSize: "11px", fontWeight: 600, cursor: "pointer",
                  whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
                }}
              >Todo</button>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: "6px 14px", borderRadius: "20px",
                    border: `1px solid ${selectedCategory === cat.id ? cat.color : "rgba(255,255,255,0.1)"}`,
                    background: selectedCategory === cat.id ? `${cat.color}20` : "transparent",
                    color: selectedCategory === cat.id ? cat.color : "rgba(255,255,255,0.4)",
                    fontSize: "11px", fontWeight: 600, cursor: "pointer",
                    whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
                  }}
                >{cat.icon} {cat.name}</button>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "350px", overflowY: "auto" }}>
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  compact
                  isInList={currentList.items.some(i => i.productId === product.id)}
                  onAdd={addProductToList}
                  quantity={currentList.items.find(i => i.productId === product.id)?.quantity}
                  onRemove={removeProduct}
                  onQuantityChange={updateQuantity}
                />
              ))}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowAddProduct(true)}
            style={{
              width: "100%", padding: "14px", marginTop: "12px",
              borderRadius: "12px", border: "2px dashed rgba(123,241,168,0.2)",
              background: "transparent", color: "#7BF1A8",
              fontSize: "14px", fontWeight: 600, cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            + Añadir Productos
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Compare Tab
// ============================================================
const CompareTab = ({ lists, activeList }) => {
  const [selectedListId, setSelectedListId] = useState(activeList);
  const currentList = lists.find(l => l.id === selectedListId);

  const storeTotals = SUPERMARKETS.map(store => ({
    ...store,
    total: currentList ? getListTotal(currentList.items, store.id) : 0,
  })).sort((a, b) => a.total - b.total);

  const cheapestTotal = storeTotals[0]?.total || 0;
  const mostExpensiveTotal = storeTotals[storeTotals.length - 1]?.total || 0;

  return (
    <div style={{ paddingBottom: "100px" }}>
      <Header title="Comparar Precios" subtitle="Encuentra el supermercado más barato para tu lista" />

      <div style={{ padding: "0 20px" }}>
        {/* List selector */}
        {lists.length > 0 ? (
          <div style={{
            display: "flex", gap: "8px", overflowX: "auto",
            paddingBottom: "12px", marginBottom: "16px",
            scrollbarWidth: "none",
          }}>
            {lists.map(list => (
              <button
                key={list.id}
                onClick={() => setSelectedListId(list.id)}
                style={{
                  padding: "8px 16px", borderRadius: "10px",
                  border: `1px solid ${selectedListId === list.id ? "#7BF1A8" : "rgba(255,255,255,0.1)"}`,
                  background: selectedListId === list.id ? "rgba(123,241,168,0.12)" : "transparent",
                  color: selectedListId === list.id ? "#7BF1A8" : "rgba(255,255,255,0.4)",
                  fontSize: "12px", fontWeight: 600, cursor: "pointer",
                  whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
                }}
              >{list.name}</button>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "rgba(255,255,255,0.3)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚖️</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
              Crea una lista primero para comparar precios.
            </p>
          </div>
        )}

        {currentList && currentList.items.length > 0 && (
          <>
            {/* Winner card */}
            <div style={{
              background: "linear-gradient(135deg, rgba(123,241,168,0.12) 0%, rgba(123,241,168,0.04) 100%)",
              border: "1px solid rgba(123,241,168,0.2)",
              borderRadius: "20px", padding: "24px",
              textAlign: "center", marginBottom: "16px",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "-30px", right: "-30px",
                fontSize: "100px", opacity: 0.06,
              }}>🏆</div>
              <div style={{
                fontSize: "13px", color: "rgba(255,255,255,0.5)",
                fontFamily: "'DM Sans', sans-serif", marginBottom: "8px",
                textTransform: "uppercase", letterSpacing: "2px", fontWeight: 600,
              }}>Mejor precio</div>
              <div style={{
                fontSize: "24px", fontWeight: 800, color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
              }}>{storeTotals[0]?.logo} {storeTotals[0]?.name}</div>
              <div style={{
                fontSize: "36px", fontWeight: 900, color: "#7BF1A8",
                fontFamily: "'DM Mono', monospace", marginTop: "4px",
              }}>{formatPrice(cheapestTotal)}</div>
              <div style={{
                fontSize: "12px", color: "rgba(255,255,255,0.4)",
                fontFamily: "'DM Sans', sans-serif", marginTop: "4px",
              }}>
                Ahorras hasta {formatPrice(mostExpensiveTotal - cheapestTotal)} vs el más caro
              </div>
            </div>

            {/* All stores comparison */}
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {storeTotals.map((store, index) => {
                const diff = store.total - cheapestTotal;
                const barWidth = cheapestTotal > 0 ? (store.total / mostExpensiveTotal * 100) : 0;
                return (
                  <div key={store.id} style={{
                    background: "rgba(255,255,255,0.04)",
                    border: `1px solid ${index === 0 ? "rgba(123,241,168,0.2)" : "rgba(255,255,255,0.06)"}`,
                    borderRadius: "14px", padding: "14px 16px",
                    position: "relative", overflow: "hidden",
                  }}>
                    <div style={{
                      position: "absolute", bottom: 0, left: 0,
                      height: "3px", width: `${barWidth}%`,
                      background: index === 0 ? "#7BF1A8" : `${store.color}40`,
                      borderRadius: "0 3px 0 0",
                      transition: "width 0.5s ease",
                    }} />
                    <div style={{
                      display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{
                          fontSize: "12px", fontWeight: 800, color: index === 0 ? "#7BF1A8" : "rgba(255,255,255,0.3)",
                          fontFamily: "'DM Mono', monospace",
                          width: "20px",
                        }}>#{index + 1}</span>
                        <span style={{ fontSize: "18px" }}>{store.logo}</span>
                        <span style={{
                          fontSize: "14px", fontWeight: 600, color: "#fff",
                          fontFamily: "'DM Sans', sans-serif",
                        }}>{store.name}</span>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{
                          fontSize: "16px", fontWeight: 700,
                          color: index === 0 ? "#7BF1A8" : "#fff",
                          fontFamily: "'DM Mono', monospace",
                        }}>{formatPrice(store.total)}</div>
                        {diff > 0 && (
                          <div style={{
                            fontSize: "10px", color: "#E53935",
                            fontFamily: "'DM Sans', sans-serif",
                          }}>+{formatPrice(diff)}</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Product breakdown */}
            <div style={{ marginTop: "24px" }}>
              <h3 style={{
                fontSize: "16px", fontWeight: 700, color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: "12px",
              }}>Desglose por producto</h3>
              {currentList.items.map(item => {
                const product = SAMPLE_PRODUCTS.find(p => p.id === item.productId);
                if (!product) return null;
                const cheapest = getCheapestSupermarket(product.prices);
                const store = SUPERMARKETS.find(s => s.id === cheapest.store);
                return (
                  <div key={item.productId} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                  }}>
                    <div>
                      <div style={{
                        fontSize: "13px", color: "#fff",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>{product.name} × {item.quantity}</div>
                      <div style={{
                        fontSize: "11px", color: "rgba(255,255,255,0.35)",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>Mejor en {store?.name}</div>
                    </div>
                    <span style={{
                      fontSize: "14px", fontWeight: 700, color: "#7BF1A8",
                      fontFamily: "'DM Mono', monospace",
                    }}>{formatPrice(cheapest.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {currentList && currentList.items.length === 0 && (
          <div style={{
            textAlign: "center", padding: "40px 20px",
            color: "rgba(255,255,255,0.3)",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>📊</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
              Añade productos a tu lista para ver la comparación.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Offers Tab
// ============================================================
const OffersTab = () => {
  const [filterStore, setFilterStore] = useState(null);

  const filteredOffers = OFFERS.filter(offer => {
    if (!filterStore) return true;
    return offer.supermarket === filterStore;
  }).sort((a, b) => b.discount - a.discount);

  return (
    <div style={{ paddingBottom: "100px" }}>
      <Header title="Ofertas" subtitle="Las mejores ofertas de tus supermercados" />

      <div style={{ padding: "0 20px" }}>
        {/* Store filter */}
        <div style={{
          display: "flex", gap: "6px", overflowX: "auto",
          paddingBottom: "12px", marginBottom: "16px",
          scrollbarWidth: "none",
        }}>
          <button
            onClick={() => setFilterStore(null)}
            style={{
              padding: "8px 14px", borderRadius: "20px",
              border: `1px solid ${!filterStore ? "#7BF1A8" : "rgba(255,255,255,0.1)"}`,
              background: !filterStore ? "rgba(123,241,168,0.12)" : "transparent",
              color: !filterStore ? "#7BF1A8" : "rgba(255,255,255,0.4)",
              fontSize: "11px", fontWeight: 600, cursor: "pointer",
              whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
            }}
          >Todas</button>
          {SUPERMARKETS.map(store => (
            <button
              key={store.id}
              onClick={() => setFilterStore(store.id)}
              style={{
                padding: "8px 14px", borderRadius: "20px",
                border: `1px solid ${filterStore === store.id ? store.color : "rgba(255,255,255,0.1)"}`,
                background: filterStore === store.id ? `${store.color}20` : "transparent",
                color: filterStore === store.id ? store.color : "rgba(255,255,255,0.4)",
                fontSize: "11px", fontWeight: 600, cursor: "pointer",
                whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
              }}
            >{store.logo} {store.name}</button>
          ))}
        </div>

        {/* Active offers count */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          marginBottom: "14px",
        }}>
          <div style={{
            width: "8px", height: "8px", borderRadius: "50%",
            background: "#7BF1A8",
            boxShadow: "0 0 8px rgba(123,241,168,0.5)",
            animation: "pulse 2s infinite",
          }} />
          <span style={{
            fontSize: "12px", color: "rgba(255,255,255,0.5)",
            fontFamily: "'DM Sans', sans-serif",
          }}>{filteredOffers.length} ofertas activas</span>
        </div>

        {/* Offers list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredOffers.map(offer => {
            const product = SAMPLE_PRODUCTS.find(p => p.id === offer.productId);
            const store = SUPERMARKETS.find(s => s.id === offer.supermarket);
            const cat = CATEGORIES.find(c => c.id === product?.category);
            const daysLeft = Math.ceil((new Date(offer.validUntil) - new Date()) / (1000 * 60 * 60 * 24));

            return (
              <div key={offer.id} style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "16px",
                overflow: "hidden",
                position: "relative",
              }}>
                {/* Discount badge */}
                <div style={{
                  position: "absolute", top: "12px", right: "12px",
                  background: "#E53935", color: "#fff",
                  padding: "4px 10px", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 800,
                  fontFamily: "'DM Mono', monospace",
                }}>-{offer.discount}%</div>

                <div style={{ padding: "16px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div style={{
                      width: "48px", height: "48px", borderRadius: "14px",
                      background: `${cat?.color}15`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "22px", flexShrink: 0,
                    }}>{cat?.icon}</div>
                    <div style={{ flex: 1, paddingRight: "50px" }}>
                      <div style={{
                        fontSize: "14px", fontWeight: 600, color: "#fff",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>{product?.name}</div>
                      <div style={{
                        fontSize: "12px", color: "rgba(255,255,255,0.4)",
                        fontFamily: "'DM Sans', sans-serif", marginTop: "2px",
                      }}>{store?.logo} {store?.name}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                        <span style={{
                          fontSize: "13px", color: "rgba(255,255,255,0.3)",
                          textDecoration: "line-through",
                          fontFamily: "'DM Mono', monospace",
                        }}>{formatPrice(offer.originalPrice)}</span>
                        <span style={{
                          fontSize: "18px", fontWeight: 800, color: "#7BF1A8",
                          fontFamily: "'DM Mono', monospace",
                        }}>{formatPrice(offer.offerPrice)}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    marginTop: "12px", paddingTop: "12px",
                    borderTop: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <span style={{
                      fontSize: "11px",
                      color: daysLeft <= 3 ? "#FFA726" : "rgba(255,255,255,0.35)",
                      fontFamily: "'DM Sans', sans-serif",
                      fontWeight: daysLeft <= 3 ? 600 : 400,
                    }}>
                      {daysLeft <= 0 ? "⚠️ Expira hoy" : daysLeft <= 3 ? `⏰ ${daysLeft} días restantes` : `Válida hasta ${new Date(offer.validUntil).toLocaleDateString("es-ES")}`}
                    </span>
                    <a
                      href={offer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "8px 16px", borderRadius: "10px",
                        background: `${store?.color}20`,
                        border: `1px solid ${store?.color}40`,
                        color: store?.color === "#FFF000" ? "#FFD600" : store?.color,
                        fontSize: "11px", fontWeight: 700, cursor: "pointer",
                        textDecoration: "none",
                        fontFamily: "'DM Sans', sans-serif",
                        display: "flex", alignItems: "center", gap: "4px",
                      }}
                    >
                      Ver oferta ↗
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// AI Tab
// ============================================================
const AITab = ({ lists, activeList }) => {
  const [selectedListId, setSelectedListId] = useState(activeList);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const currentList = lists.find(l => l.id === selectedListId);

  const startAnalysis = () => {
    setAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
    }, 2500);
  };

  const getSuggestions = () => {
    if (!currentList) return [];
    const suggestions = [];
    currentList.items.forEach(item => {
      const product = SAMPLE_PRODUCTS.find(p => p.id === item.productId);
      if (product && AI_SUGGESTIONS[product.category]) {
        AI_SUGGESTIONS[product.category].forEach(s => {
          if (s.original === product.name) {
            suggestions.push({ ...s, productId: product.id });
          }
        });
      }
    });
    return suggestions;
  };

  const suggestions = getSuggestions();

  // Smart insights
  const getInsights = () => {
    if (!currentList || currentList.items.length === 0) return [];
    const insights = [];
    const categories = {};
    currentList.items.forEach(item => {
      const p = SAMPLE_PRODUCTS.find(x => x.id === item.productId);
      if (p) categories[p.category] = (categories[p.category] || 0) + 1;
    });

    if (!categories.frutas) {
      insights.push({ icon: "🥗", text: "Tu lista no incluye frutas ni verduras. Considera añadir opciones frescas para una dieta equilibrada.", type: "warning" });
    }
    if (categories.snacks > 2) {
      insights.push({ icon: "🍪", text: "Tienes bastantes snacks. ¿Quizás sustituir alguno por frutos secos o fruta deshidratada?", type: "suggestion" });
    }
    if (categories.bebidas > 1) {
      insights.push({ icon: "💧", text: "Varias bebidas en tu lista. El agua del grifo con filtro puede ahorrarte dinero a largo plazo.", type: "tip" });
    }

    const totalOptimal = currentList.items.reduce((t, item) => {
      const p = SAMPLE_PRODUCTS.find(x => x.id === item.productId);
      return t + (p ? getCheapestSupermarket(p.prices).price * item.quantity : 0);
    }, 0);

    const storeBreakdown = {};
    currentList.items.forEach(item => {
      const p = SAMPLE_PRODUCTS.find(x => x.id === item.productId);
      if (p) {
        const { store } = getCheapestSupermarket(p.prices);
        storeBreakdown[store] = (storeBreakdown[store] || 0) + 1;
      }
    });
    const dominantStore = Object.entries(storeBreakdown).sort((a, b) => b[1] - a[1])[0];
    if (dominantStore) {
      const storeName = SUPERMARKETS.find(s => s.id === dominantStore[0])?.name;
      insights.push({
        icon: "🏪",
        text: `La mayoría de tus productos están más baratos en ${storeName}. Podrías comprar casi todo allí para ahorrar tiempo y gasolina.`,
        type: "smart"
      });
    }

    insights.push({
      icon: "💰",
      text: `Comprando cada producto en el supermercado más barato, tu cesta costaría ${formatPrice(totalOptimal)}. Esto es la compra óptima.`,
      type: "savings"
    });

    return insights;
  };

  const insights = getInsights();

  return (
    <div style={{ paddingBottom: "100px" }}>
      <Header title="IA Smart" subtitle="Análisis inteligente de tu cesta de la compra" />

      <div style={{ padding: "0 20px" }}>
        {/* List selector */}
        {lists.length > 0 ? (
          <>
            <div style={{
              display: "flex", gap: "8px", overflowX: "auto",
              paddingBottom: "12px", marginBottom: "16px",
              scrollbarWidth: "none",
            }}>
              {lists.map(list => (
                <button
                  key={list.id}
                  onClick={() => { setSelectedListId(list.id); setShowResults(false); }}
                  style={{
                    padding: "8px 16px", borderRadius: "10px",
                    border: `1px solid ${selectedListId === list.id ? "#7BF1A8" : "rgba(255,255,255,0.1)"}`,
                    background: selectedListId === list.id ? "rgba(123,241,168,0.12)" : "transparent",
                    color: selectedListId === list.id ? "#7BF1A8" : "rgba(255,255,255,0.4)",
                    fontSize: "12px", fontWeight: 600, cursor: "pointer",
                    whiteSpace: "nowrap", fontFamily: "'DM Sans', sans-serif",
                  }}
                >{list.name}</button>
              ))}
            </div>

            {currentList && currentList.items.length > 0 && (
              <button
                onClick={startAnalysis}
                disabled={analyzing}
                style={{
                  width: "100%", padding: "18px",
                  borderRadius: "16px",
                  background: analyzing
                    ? "rgba(123,241,168,0.08)"
                    : "linear-gradient(135deg, rgba(123,241,168,0.2) 0%, rgba(123,241,168,0.08) 100%)",
                  border: "1px solid rgba(123,241,168,0.25)",
                  color: "#7BF1A8",
                  fontSize: "15px", fontWeight: 700, cursor: analyzing ? "default" : "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
                  transition: "all 0.3s",
                }}
              >
                {analyzing ? (
                  <>
                    <span style={{
                      animation: "spin 1s linear infinite",
                      display: "inline-block",
                    }}>🧠</span>
                    Analizando tu lista...
                  </>
                ) : (
                  <>🧠 Analizar mi lista con IA</>
                )}
              </button>
            )}

            {/* Analysis Results */}
            {showResults && (
              <div style={{ marginTop: "20px" }}>
                {/* Insights */}
                {insights.length > 0 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h3 style={{
                      fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.6)",
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: "uppercase", letterSpacing: "1.5px",
                      marginBottom: "12px",
                    }}>📊 Insights</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      {insights.map((insight, i) => (
                        <div key={i} style={{
                          background: insight.type === "savings" ? "rgba(123,241,168,0.06)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${insight.type === "savings" ? "rgba(123,241,168,0.15)" : insight.type === "warning" ? "rgba(255,167,38,0.15)" : "rgba(255,255,255,0.06)"}`,
                          borderRadius: "14px", padding: "14px 16px",
                          display: "flex", gap: "10px", alignItems: "flex-start",
                        }}>
                          <span style={{ fontSize: "20px", flexShrink: 0 }}>{insight.icon}</span>
                          <p style={{
                            fontSize: "13px", color: "rgba(255,255,255,0.7)",
                            fontFamily: "'DM Sans', sans-serif",
                            margin: 0, lineHeight: "1.5",
                          }}>{insight.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggestions */}
                {suggestions.length > 0 && (
                  <div>
                    <h3 style={{
                      fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.6)",
                      fontFamily: "'DM Sans', sans-serif",
                      textTransform: "uppercase", letterSpacing: "1.5px",
                      marginBottom: "12px",
                    }}>💡 Sugerencias de producto</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {suggestions.map((sug, i) => (
                        <div key={i} style={{
                          background: "rgba(126,87,194,0.06)",
                          border: "1px solid rgba(126,87,194,0.15)",
                          borderRadius: "16px", padding: "16px",
                        }}>
                          <div style={{
                            display: "flex", alignItems: "center", gap: "8px",
                            marginBottom: "10px",
                          }}>
                            <span style={{
                              fontSize: "12px", color: "rgba(255,255,255,0.35)",
                              fontFamily: "'DM Sans', sans-serif",
                              textDecoration: "line-through",
                            }}>{sug.original}</span>
                            <span style={{ color: "rgba(255,255,255,0.3)" }}>→</span>
                            <span style={{
                              fontSize: "13px", fontWeight: 700, color: "#CE93D8",
                              fontFamily: "'DM Sans', sans-serif",
                            }}>{sug.suggestion}</span>
                          </div>
                          <p style={{
                            fontSize: "12px", color: "rgba(255,255,255,0.55)",
                            fontFamily: "'DM Sans', sans-serif",
                            margin: "0 0 8px", lineHeight: "1.5",
                          }}>{sug.reason}</p>
                          <div style={{
                            display: "inline-flex", alignItems: "center", gap: "4px",
                            background: "rgba(123,241,168,0.1)",
                            padding: "4px 10px", borderRadius: "8px",
                          }}>
                            <span style={{ fontSize: "12px" }}>💰</span>
                            <span style={{
                              fontSize: "11px", color: "#7BF1A8",
                              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
                            }}>{sug.savings}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {suggestions.length === 0 && (
                  <div style={{
                    background: "rgba(123,241,168,0.06)",
                    border: "1px solid rgba(123,241,168,0.12)",
                    borderRadius: "14px", padding: "20px",
                    textAlign: "center",
                  }}>
                    <span style={{ fontSize: "28px" }}>✅</span>
                    <p style={{
                      fontSize: "13px", color: "rgba(255,255,255,0.6)",
                      fontFamily: "'DM Sans', sans-serif", marginTop: "8px",
                    }}>¡Tu lista se ve genial! No hay sugerencias de mejora en este momento.</p>
                  </div>
                )}
              </div>
            )}

            {currentList && currentList.items.length === 0 && (
              <div style={{
                textAlign: "center", padding: "40px 20px",
                color: "rgba(255,255,255,0.3)",
              }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧠</div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
                  Añade productos a tu lista para que la IA pueda analizarla.
                </p>
              </div>
            )}
          </>
        ) : (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            color: "rgba(255,255,255,0.3)",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🧠</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
              Crea una lista primero para activar el análisis IA.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ============================================================
// Search Tab (Individual product search)
// ============================================================
const SearchTab = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const results = searchTerm.length > 0
    ? SAMPLE_PRODUCTS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  return (
    <div style={{ paddingBottom: "100px" }}>
      <Header title="Buscar Producto" subtitle="Compara el precio de un producto en todos los supermercados" />

      <div style={{ padding: "0 20px" }}>
        <input
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setSelectedProduct(null); }}
          placeholder="Busca leche, pan, pollo..."
          style={{
            width: "100%", background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "14px", padding: "14px 18px",
            color: "#fff", fontSize: "15px",
            fontFamily: "'DM Sans', sans-serif",
            outline: "none", boxSizing: "border-box",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => e.target.style.borderColor = "rgba(123,241,168,0.4)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
        />

        {/* Search results */}
        {results.length > 0 && !selectedProduct && (
          <div style={{
            marginTop: "12px",
            display: "flex", flexDirection: "column", gap: "6px",
          }}>
            {results.map(product => {
              const cat = CATEGORIES.find(c => c.id === product.category);
              const cheapest = getCheapestSupermarket(product.prices);
              return (
                <div
                  key={product.id}
                  onClick={() => setSelectedProduct(product)}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: "12px", padding: "12px 14px",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "10px",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "18px" }}>{cat?.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "14px", fontWeight: 600, color: "#fff",
                      fontFamily: "'DM Sans', sans-serif",
                    }}>{product.name}</div>
                  </div>
                  <span style={{
                    fontSize: "14px", fontWeight: 700, color: "#7BF1A8",
                    fontFamily: "'DM Mono', monospace",
                  }}>desde {formatPrice(cheapest.price)}</span>
                  <span style={{ color: "rgba(255,255,255,0.2)" }}>›</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Product detail comparison */}
        {selectedProduct && (
          <div style={{ marginTop: "16px" }}>
            <button onClick={() => setSelectedProduct(null)} style={{
              background: "none", border: "none",
              color: "#7BF1A8", fontSize: "13px", cursor: "pointer",
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
              marginBottom: "12px", padding: 0,
            }}>← Volver a resultados</button>

            <div style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "18px", padding: "20px",
            }}>
              <div style={{
                fontSize: "18px", fontWeight: 700, color: "#fff",
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: "4px",
              }}>{selectedProduct.name}</div>
              <div style={{
                fontSize: "12px", color: "rgba(255,255,255,0.35)",
                fontFamily: "'DM Sans', sans-serif",
                marginBottom: "16px",
              }}>Precio por {selectedProduct.unit} en cada supermercado</div>

              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {Object.entries(selectedProduct.prices)
                  .sort((a, b) => a[1] - b[1])
                  .map(([storeId, price], index) => {
                    const store = SUPERMARKETS.find(s => s.id === storeId);
                    const cheapest = Math.min(...Object.values(selectedProduct.prices));
                    const maxPrice = Math.max(...Object.values(selectedProduct.prices));
                    const barWidth = maxPrice > 0 ? (price / maxPrice * 100) : 0;
                    const isOffer = OFFERS.some(o => o.productId === selectedProduct.id && o.supermarket === storeId);

                    return (
                      <div key={storeId} style={{
                        display: "flex", alignItems: "center", gap: "10px",
                        padding: "10px 12px", borderRadius: "12px",
                        background: index === 0 ? "rgba(123,241,168,0.06)" : "transparent",
                        border: index === 0 ? "1px solid rgba(123,241,168,0.15)" : "1px solid transparent",
                        position: "relative",
                      }}>
                        <span style={{ fontSize: "16px", width: "24px", textAlign: "center" }}>{store?.logo}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                            <span style={{
                              fontSize: "13px", fontWeight: 600, color: "#fff",
                              fontFamily: "'DM Sans', sans-serif",
                            }}>
                              {store?.name}
                              {isOffer && <span style={{
                                marginLeft: "6px", fontSize: "9px",
                                background: "#E53935", color: "#fff",
                                padding: "1px 6px", borderRadius: "4px",
                                fontWeight: 700,
                              }}>OFERTA</span>}
                            </span>
                            <span style={{
                              fontSize: "15px", fontWeight: 700,
                              color: index === 0 ? "#7BF1A8" : "#fff",
                              fontFamily: "'DM Mono', monospace",
                            }}>{formatPrice(price)}</span>
                          </div>
                          <div style={{
                            height: "4px", borderRadius: "2px",
                            background: "rgba(255,255,255,0.06)",
                            overflow: "hidden",
                          }}>
                            <div style={{
                              height: "100%",
                              width: `${barWidth}%`,
                              background: index === 0 ? "#7BF1A8" : (store?.color || "#666"),
                              borderRadius: "2px",
                              transition: "width 0.5s ease",
                              opacity: index === 0 ? 1 : 0.4,
                            }} />
                          </div>
                        </div>
                        {price > cheapest && (
                          <span style={{
                            fontSize: "10px", color: "#E53935",
                            fontFamily: "'DM Mono', monospace", fontWeight: 600,
                            minWidth: "42px", textAlign: "right",
                          }}>+{formatPrice(price - cheapest)}</span>
                        )}
                        {index === 0 && (
                          <span style={{
                            fontSize: "9px", fontWeight: 700,
                            color: "#0f0f14", background: "#7BF1A8",
                            padding: "2px 6px", borderRadius: "4px",
                          }}>BEST</span>
                        )}
                      </div>
                    );
                  })}
              </div>

              {/* Related offers */}
              {OFFERS.filter(o => o.productId === selectedProduct.id).map(offer => {
                const store = SUPERMARKETS.find(s => s.id === offer.supermarket);
                return (
                  <div key={offer.id} style={{
                    marginTop: "16px", padding: "12px 14px",
                    background: "rgba(229,57,53,0.08)",
                    border: "1px solid rgba(229,57,53,0.15)",
                    borderRadius: "12px",
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                  }}>
                    <div>
                      <div style={{
                        fontSize: "12px", fontWeight: 600, color: "#FFA726",
                        fontFamily: "'DM Sans', sans-serif",
                      }}>🏷️ {offer.description}</div>
                      <div style={{
                        fontSize: "11px", color: "rgba(255,255,255,0.35)",
                        fontFamily: "'DM Sans', sans-serif", marginTop: "2px",
                      }}>Hasta {new Date(offer.validUntil).toLocaleDateString("es-ES")}</div>
                    </div>
                    <a
                      href={offer.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        padding: "6px 14px", borderRadius: "8px",
                        background: "rgba(123,241,168,0.12)",
                        border: "1px solid rgba(123,241,168,0.2)",
                        color: "#7BF1A8", fontSize: "11px", fontWeight: 700,
                        textDecoration: "none", fontFamily: "'DM Sans', sans-serif",
                      }}
                    >Ver ↗</a>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {searchTerm.length > 0 && results.length === 0 && (
          <div style={{
            textAlign: "center", padding: "40px 20px",
            color: "rgba(255,255,255,0.3)",
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔍</div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}>
              No se encontraron productos para "{searchTerm}"
            </p>
          </div>
        )}

        {searchTerm.length === 0 && (
          <div style={{ marginTop: "24px" }}>
            <h3 style={{
              fontSize: "13px", fontWeight: 700, color: "rgba(255,255,255,0.4)",
              fontFamily: "'DM Sans', sans-serif",
              textTransform: "uppercase", letterSpacing: "1.5px",
              marginBottom: "12px",
            }}>Categorías populares</h3>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px",
            }}>
              {CATEGORIES.slice(0, 8).map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSearchTerm(cat.name.split(" ")[0].toLowerCase())}
                  style={{
                    background: `${cat.color}08`,
                    border: `1px solid ${cat.color}20`,
                    borderRadius: "12px", padding: "14px",
                    cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "8px",
                    transition: "all 0.2s",
                  }}
                >
                  <span style={{ fontSize: "20px" }}>{cat.icon}</span>
                  <span style={{
                    fontSize: "12px", fontWeight: 600,
                    color: "rgba(255,255,255,0.6)",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Main App
// ============================================================
export default function SmartCartApp() {
  const [activeTab, setActiveTab] = useState("lists");
  const [lists, setLists] = useState([
    {
      id: 1, name: "Compra semanal", type: "semanal",
      items: [
        { productId: 1, quantity: 3 },
        { productId: 3, quantity: 1 },
        { productId: 4, quantity: 2 },
        { productId: 5, quantity: 2 },
        { productId: 7, quantity: 1 },
        { productId: 10, quantity: 1 },
        { productId: 12, quantity: 1 },
      ],
      createdAt: "2026-02-17T10:00:00Z",
    },
  ]);
  const [activeList, setActiveList] = useState(null);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f14",
      color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: "480px",
      margin: "0 auto",
      position: "relative",
      overflowX: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Clash+Display:wght@600;700;800&display=swap" rel="stylesheet" />

      {activeTab === "lists" && (
        <ListsTab
          lists={lists}
          setLists={setLists}
          activeList={activeList}
          setActiveList={setActiveList}
          setActiveTab={setActiveTab}
        />
      )}
      {activeTab === "compare" && (
        <CompareTab lists={lists} activeList={activeList} />
      )}
      {activeTab === "offers" && <OffersTab />}
      {activeTab === "ai" && (
        <AITab lists={lists} activeList={activeList} />
      )}
      {activeTab === "search" && <SearchTab />}

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}