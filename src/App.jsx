import { useState, useMemo } from "react";

const AG_LOGO = "https://www.australiangold.net/themes/australian-gold/assets/img/australiangold-logo.svg";
const BR = "https://bronzare.ro/wp-content/uploads/";
const AGN = "https://www.australiangold.net/";

// Poze: { large: url 250ml/flacon, small: url 15ml/plic }
// Daca lipseste "small", se foloseste "large" si pentru plicuri
// Daca lipseste complet, se afiseaza logo-ul AG
const IMAGES = {
  "Accelerator Extreme": {
    large: BR + "2017/03/AustralianGold-Accelerator-Extreme-w-bronzers-250ml.jpg",
    small: BR + "2017/03/AustralianGold-Accelerator-Extreme-w-bronzers-15ml.jpg",
  },
  "Accelerator Lotion": {
    large: BR + "2015/04/Australian_Gold_Accelerator_250ml.png",
    small: BR + "2015/04/Australian_Gold_Accelerator_15ml.png",
  },
  "Accelerator Lot. Aniversare 40": {
    large: BR + "2015/04/Australian_Gold_Accelerator_250ml.png",
    small: BR + "2015/04/Australian_Gold_Accelerator_15ml.png",
  },
  "Accelerator K": {
    large: BR + "2020/12/AG-Accelerator-K-250ml.jpg",
    small: BR + "2020/12/AG-Accelerator-K-15ml.jpg",
  },
  "Accelerator Spray": {
    large: AGN + "1098-medium_default/accelerator-spray-gel-con-bronzer.jpg",
  },
  "Adorably Bronze": {
    large: BR + "2018/02/Adorably-Black-250ml.jpg",
    small: BR + "2018/02/Adorably-Black-15ml.jpg",
  },
  "Daringly Dark": {
    large: BR + "2020/12/AG-Daringly-Dark-250ml.jpg",
    small: BR + "2020/12/AG-Daringly-Dark-15ml.jpg",
  },
  "Deviously Bronze": {
    large: AGN + "1301-medium_default/deviously-bronze.jpg",
  },
  "Hardcore Bronze": {
    large: AGN + "1300-medium_default/hardcore-bronze.jpg",
  },
};

// =============================================
// PRETURI — modifica valorile "eur" dupa nevoie
// =============================================
const ALL_PRODUCTS = [
  { id: 1,  name: "Accelerator Extreme",             size: "250 mL", type: "Bronzant DHA",           eur: 16.40 },
  { id: 2,  name: "Accelerator Extreme",             size: "15 mL",  type: "Bronzant DHA",           eur: 2.54  },
  { id: 3,  name: "Accelerator K",                   size: "250 mL", type: "Intensificator",         eur: 15.02 },
  { id: 4,  name: "Accelerator K",                   size: "15 mL",  type: "Intensificator",         eur: 2.19  },
  { id: 5,  name: "Accelerator Lotion",              size: "250 mL", type: "Intensificator",         eur: 13.80 },
  { id: 6,  name: "Accelerator Lotion",              size: "15 mL",  type: "Intensificator",         eur: 2.25  },
  { id: 7,  name: "Accelerator Lot. Aniversare 40",  size: "250 mL", type: "Intensificator",         eur: 16.29 },
  { id: 8,  name: "Accelerator Lot. Aniversare 40",  size: "15 mL",  type: "Intensificator",         eur: 2.31  },
  { id: 9,  name: "Accelerator Spray",               size: "250 mL", type: "Intensificator",         eur: 13.80 },
  { id: 10, name: "Adorably Bronze",                 size: "250 mL", type: "DHA / Bronzant natural", eur: 22.75 },
  { id: 11, name: "Adorably Bronze",                 size: "15 mL",  type: "DHA / Bronzant natural", eur: 3.12  },
  { id: 12, name: "Bold by G Gentlemen",             size: "250 mL", type: "Bronzant DHA",           eur: 34.53 },
  { id: 13, name: "Bold by G Gentlemen",             size: "15 mL",  type: "Bronzant DHA",           eur: 5.14  },
  { id: 14, name: "Bronze Accelerator",              size: "250 mL", type: "Bronzant natural",       eur: 15.71 },
  { id: 15, name: "Bronze Accelerator",              size: "15 mL",  type: "Bronzant natural",       eur: 2.31  },
  { id: 16, name: "Charmingly Bronze",               size: "250 mL", type: "Bronzant natural",       eur: 22.18 },
  { id: 17, name: "Charmingly Bronze",               size: "15 mL",  type: "Bronzant natural",       eur: 3.41  },
  { id: 18, name: "Cheeky Brown",                    size: "250 mL", type: "Bronzant natural",       eur: 18.94 },
  { id: 19, name: "Cheeky Brown",                    size: "15 mL",  type: "Bronzant natural",       eur: 2.83  },
  { id: 20, name: "Chiseled by G Gentlemen",         size: "250 mL", type: "Intensificator",         eur: 36.32 },
  { id: 21, name: "Chiseled by G Gentlemen",         size: "15 mL",  type: "Intensificator",         eur: 5.14  },
  { id: 22, name: "Color Crush",                     size: "250 mL", type: "Bronzant natural",       eur: 20.21 },
  { id: 23, name: "Color Crush",                     size: "15 mL",  type: "Bronzant natural",       eur: 3.00  },
  { id: 24, name: "Confident by G Gentlemen",        size: "250 mL", type: "Bronzant natural",       eur: 28.82 },
  { id: 25, name: "Confident by G Gentlemen",        size: "15 mL",  type: "Bronzant natural",       eur: 3.98  },
  { id: 26, name: "Daringly Dark",                   size: "250 mL", type: "Intensificator",         eur: 18.42 },
  { id: 27, name: "Daringly Dark",                   size: "15 mL",  type: "Intensificator",         eur: 2.77  },
  { id: 28, name: "Dark Legs",                       size: "250 mL", type: "Bronzant picioare",      eur: 15.53 },
  { id: 29, name: "Dark Legs",                       size: "15 mL",  type: "Bronzant picioare",      eur: 2.25  },
  { id: 30, name: "Deviously Bronze",                size: "250 mL", type: "Bronzant DHA",           eur: 25.35 },
  { id: 31, name: "Deviously Bronze",                size: "15 mL",  type: "Bronzant DHA",           eur: 3.98  },
  { id: 32, name: "Fearlessly Bronze",               size: "250 mL", type: "DHA / Bronzant natural", eur: 21.60 },
  { id: 33, name: "Fearlessly Bronze",               size: "15 mL",  type: "DHA / Bronzant natural", eur: 3.18  },
  { id: 34, name: "Feelin Beachy",                   size: "250 mL", type: "Bronzant DHA",           eur: 27.66 },
  { id: 35, name: "Feelin Beachy",                   size: "15 mL",  type: "Bronzant DHA",           eur: 4.16  },
  { id: 36, name: "Gelee Accelerator",               size: "250 mL", type: "Intensificator",         eur: 13.80 },
  { id: 37, name: "Gelee Accelerator",               size: "15 mL",  type: "Intensificator",         eur: 2.31  },
  { id: 38, name: "Hardcore Bronze",                 size: "250 mL", type: "Bronzant natural",       eur: 23.04 },
  { id: 39, name: "Hardcore Bronze",                 size: "15 mL",  type: "Bronzant natural",       eur: 3.41  },
  { id: 40, name: "Hot! Bronze",                     size: "250 mL", type: "Bronzant natural",       eur: 44.47 },
  { id: 41, name: "Hot! Bronze",                     size: "15 mL",  type: "Bronzant natural",       eur: 3.73  },
  { id: 42, name: "Hot! DHA Bronzer",                size: "250 mL", type: "Bronzant DHA",           eur: 49.43 },
  { id: 43, name: "Hot! DHA Bronzer",                size: "15 mL",  type: "Bronzant DHA",           eur: 7.62  },
  { id: 44, name: "Hot! Hybrid",                     size: "250 mL", type: "Intensificator hibrid",  eur: 40.43 },
  { id: 45, name: "Hot! Hybrid",                     size: "15 mL",  type: "Intensificator hibrid",  eur: 6.29  },
  { id: 46, name: "Hot! Intensifier",                size: "250 mL", type: "Intensificator",         eur: 36.96 },
  { id: 47, name: "Hot! Intensifier",                size: "15 mL",  type: "Intensificator",         eur: 4.56  },
  { id: 48, name: "Magnetize",                       size: "300 mL", type: "Hibrid + Bronzant DHA",  eur: 66.99 },
  { id: 49, name: "Magnetize",                       size: "15 mL",  type: "Hibrid + Bronzant DHA",  eur: 10.05 },
  { id: 50, name: "Mineral Haze",                    size: "300 mL", type: "Bronzant DHA",           eur: 57.63 },
  { id: 51, name: "Mineral Haze",                    size: "15 mL",  type: "Bronzant DHA",           eur: 9.01  },
  { id: 52, name: "Nothing But Bronze Charcoal",     size: "250 mL", type: "Bronzant DHA",           eur: 31.07 },
  { id: 53, name: "Nothing But Bronze Charcoal",     size: "15 mL",  type: "Bronzant DHA",           eur: 4.85  },
  { id: 54, name: "Nothing But Bronze Coconut",      size: "250 mL", type: "Bronzant natural",       eur: 29.11 },
  { id: 55, name: "Nothing But Bronze Coconut",      size: "15 mL",  type: "Bronzant natural",       eur: 4.56  },
  { id: 56, name: "Oasis Heat",                      size: "250 mL", type: "Bronzant Tingle",        eur: 43.89 },
  { id: 57, name: "Oasis Heat",                      size: "15 mL",  type: "Bronzant Tingle",        eur: 6.58  },
  { id: 58, name: "Ocean Views",                     size: "250 mL", type: "Intensificator",         eur: 42.39 },
  { id: 59, name: "Ocean Views",                     size: "15 mL",  type: "Intensificator",         eur: 6.12  },
  { id: 60, name: "Party Animal",                    size: "250 mL", type: "Intensificator",         eur: 29.91 },
  { id: 61, name: "Party Animal",                    size: "15 mL",  type: "Intensificator",         eur: 3.98  },
  { id: 62, name: "Peptide Pro",                     size: "250 mL", type: "Intensificator Hibrid",  eur: 22.52 },
  { id: 63, name: "Peptide Pro",                     size: "15 mL",  type: "Intensificator Hibrid",  eur: 3.35  },
  { id: 64, name: "Peptide Pro Hybrid Facial",       size: "90 mL",  type: "Intensificator fata",    eur: 16.52 },
  { id: 65, name: "Peptide Pro Hybrid Facial",       size: "3 mL",   type: "Intensificator fata",    eur: 2.54  },
  { id: 66, name: "Pure Heat",                       size: "250 mL", type: "Tingle Hot Citrus",      eur: 21.89 },
  { id: 67, name: "Pure Heat",                       size: "15 mL",  type: "Tingle Hot Citrus",      eur: 3.41  },
  { id: 68, name: "Rooftop Nights",                  size: "250 mL", type: "Bronzant Instant+DHA",   eur: 45.85 },
  { id: 69, name: "Rooftop Nights",                  size: "15 mL",  type: "Bronzant Instant+DHA",   eur: 6.70  },
  { id: 70, name: "Rugged by G Gentlemen",           size: "250 mL", type: "Bronzant DHA",           eur: 34.59 },
  { id: 71, name: "Rugged by G Gentlemen",           size: "15 mL",  type: "Bronzant DHA",           eur: 5.14  },
  { id: 72, name: "Sinfully Bronze",                 size: "250 mL", type: "Intensificator fata",    eur: 18.25 },
  { id: 73, name: "Sinfully Bronze",                 size: "15 mL",  type: "Intensificator fata",    eur: 2.60  },
  { id: 74, name: "Smooth Faces",                    size: "118 mL", type: "Intensificator fata",    eur: 14.90 },
  { id: 75, name: "Smooth Faces",                    size: "15 mL",  type: "Intensificator fata",    eur: 2.08  },
  { id: 76, name: "Tropical Retreat DHA Bronzer",    size: "300 mL", type: "Bronzant DHA",           eur: 29.57 },
  { id: 77, name: "Tropical Retreat DHA Bronzer",    size: "15 mL",  type: "Bronzant DHA",           eur: 4.50  },
  { id: 78, name: "Tropical Retreat Intensifier",    size: "300 mL", type: "Intensificator",         eur: 27.84 },
  { id: 79, name: "Tropical Retreat Intensifier",    size: "15 mL",  type: "Intensificator",         eur: 4.04  },
  { id: 80, name: "Wild Obsession",                  size: "250 mL", type: "Bronzant Instant+DHA",   eur: 30.95 },
  { id: 81, name: "Wild Obsession",                  size: "15 mL",  type: "Bronzant Instant+DHA",   eur: 4.62  },
];

const TYPE_COLORS = {
  "Bronzant DHA":           { color: "#c4520a", dot: "#f97316", bg: "#fff0e6" },
  "DHA / Bronzant natural": { color: "#c4520a", dot: "#f97316", bg: "#fff0e6" },
  "Bronzant Instant+DHA":   { color: "#c4520a", dot: "#f97316", bg: "#fff0e6" },
  "Hibrid + Bronzant DHA":  { color: "#c4520a", dot: "#f97316", bg: "#fff0e6" },
  "Bronzant natural":       { color: "#92700a", dot: "#eab308", bg: "#fef9ec" },
  "Intensificator":         { color: "#166534", dot: "#22c55e", bg: "#f0fdf4" },
  "Intensificator Hibrid":  { color: "#166534", dot: "#22c55e", bg: "#f0fdf4" },
  "Intensificator hibrid":  { color: "#166534", dot: "#22c55e", bg: "#f0fdf4" },
  "Intensificator fata":    { color: "#1d4ed8", dot: "#3b82f6", bg: "#eff6ff" },
  "Bronzant Tingle":        { color: "#be123c", dot: "#f43f5e", bg: "#fff1f2" },
  "Tingle Hot Citrus":      { color: "#be123c", dot: "#f43f5e", bg: "#fff1f2" },
  "Bronzant picioare":      { color: "#6d28d9", dot: "#8b5cf6", bg: "#f5f3ff" },
};
const getTS = (t) => TYPE_COLORS[t] || { color: "#374151", dot: "#6b7280", bg: "#f3f4f6" };
const ALL_TYPES = ["Toate", ...Array.from(new Set(ALL_PRODUCTS.map(p => p.type))).sort()];
const ALL_SIZES = ["Toate", "250 mL", "300 mL", "118 mL", "90 mL", "15 mL", "3 mL"];
const isLarge = (s) => ["250 mL","300 mL","118 mL","90 mL"].includes(s);

function Img({ name, size }) {
  const [err, setErr] = useState(false);
  const imgs = IMAGES[name];
  const large = isLarge(size);

  // Alege poza corecta in functie de marime
  let src = null;
  if (imgs) {
    if (large) {
      src = imgs.large || null;
    } else {
      // plic: foloseste "small" daca exista, altfel "large"
      src = imgs.small || imgs.large || null;
    }
  }

  const show = src && !err;
  return (
    <div style={{ width: 72, height: 72, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <img
        src={show ? src : AG_LOGO}
        alt={name}
        style={{ width: "100%", height: "100%", objectFit: "contain", opacity: show ? 1 : 0.35 }}
        onError={() => setErr(true)}
      />
    </div>
  );
}

const GOLD = "#c8922a";
const DARK = "#1a1208";

export default function App() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [filterType, setFilterType] = useState("Toate");
  const [filterSize, setFilterSize] = useState("Toate");
  const [sortBy, setSortBy] = useState("name");
  const [quantities, setQuantities] = useState({});
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [addedIds, setAddedIds] = useState({});
  const [orderSent, setOrderSent] = useState(false);

  const filtered = useMemo(() => {
    let list = ALL_PRODUCTS.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterType === "Toate" || p.type === filterType) &&
      (filterSize === "Toate" || p.size === filterSize)
    );
    if (sortBy === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "pret_asc") list = [...list].sort((a, b) => a.eur - b.eur);
    else if (sortBy === "pret_desc") list = [...list].sort((a, b) => b.eur - a.eur);
    return list;
  }, [search, filterType, filterSize, sortBy]);

  const setQty = (id, val) => setQuantities(q => ({ ...q, [id]: Math.max(0, parseInt(val) || 0) }));

  const addToCart = (product) => {
    const qty = quantities[product.id] || 1;
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      return ex ? c.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i) : [...c, { ...product, qty }];
    });
    setQuantities(q => ({ ...q, [product.id]: 0 }));
    setAddedIds(a => ({ ...a, [product.id]: true }));
    setTimeout(() => setAddedIds(a => ({ ...a, [product.id]: false })), 1500);
  };

  const removeFromCart = (id) => setCart(c => c.filter(i => i.id !== id));
  const updateCartQty = (id, val) => {
    const v = Math.max(0, parseInt(val) || 0);
    if (v === 0) removeFromCart(id);
    else setCart(c => c.map(i => i.id === id ? { ...i, qty: v } : i));
  };
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = cart.reduce((s, i) => s + i.eur * i.qty, 0);

  const handleSend = () => {
    const lines = cart.map(i => "- " + i.name + " " + i.size + " x" + i.qty + " = " + (i.qty * i.eur).toFixed(2) + " EUR").join("\n");
    const msg = "Buna ziua! Comanda Australian Gold:\n\n" + lines + "\n\nTotal: " + cartTotal.toFixed(2) + " EUR (fara TVA)";
    window.open("https://wa.me/40721534321?text=" + encodeURIComponent(msg), "_blank");
    setOrderSent(true);
    setCartOpen(false);
    setCart([]);
    setTimeout(() => setOrderSent(false), 3500);
  };

  // ── CART SCREEN ──
  if (cartOpen) return (
    <div style={{ fontFamily: "system-ui,sans-serif", background: "#f8f7f4", minHeight: "100vh", maxWidth: 480, margin: "0 auto", display: "flex", flexDirection: "column" }}>
      <div style={{ background: "#fff", padding: "14px 16px", borderBottom: "1px solid #eee", display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10 }}>
        <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: DARK, padding: 0 }}>←</button>
        <div style={{ fontSize: 18, fontWeight: 800, flex: 1 }}>Cosul meu</div>
        {cartCount > 0 && <div style={{ fontSize: 13, color: "#888" }}>{cartCount} produse</div>}
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "8px 16px 120px" }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#bbb", fontSize: 15 }}>Cosul este gol.</div>
        ) : cart.map(item => {
          const ts = getTS(item.type);
          return (
            <div key={item.id} style={{ background: "#fff", borderRadius: 14, marginBottom: 10, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)", display: "flex", gap: 12, alignItems: "center" }}>
              <Img name={item.name} size={item.size} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{item.name}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{item.size}</div>
                <span style={{ background: ts.bg, color: ts.color, fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 3, marginTop: 4 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: ts.dot }}></span>{item.type}
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
                  <div style={{ display: "flex", border: "1.5px solid #e0d5c5", borderRadius: 8, overflow: "hidden" }}>
                    <button onClick={() => updateCartQty(item.id, item.qty - 1)} style={{ width: 32, height: 32, background: "#f9f4ec", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, color: "#555" }}>-</button>
                    <input type="number" value={item.qty} onChange={e => updateCartQty(item.id, e.target.value)} style={{ width: 40, textAlign: "center", fontSize: 14, fontWeight: 700, border: "none", outline: "none", background: "#fff", fontFamily: "inherit" }} />
                    <button onClick={() => updateCartQty(item.id, item.qty + 1)} style={{ width: 32, height: 32, background: "#f9f4ec", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, color: "#555" }}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item.id)} style={{ background: "none", border: "none", color: "#d94f2b", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Sterge</button>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 900, fontSize: 17 }}>€{(item.qty * item.eur).toFixed(2)}</div>
                <div style={{ fontSize: 11, color: "#aaa", marginTop: 2 }}>fara TVA</div>
              </div>
            </div>
          );
        })}
      </div>

      {cart.length > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: DARK, padding: "14px 16px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 13 }}>Total estimativ</div>
            <div style={{ color: "#f5c842", fontWeight: 900, fontSize: 20 }}>€{cartTotal.toFixed(2)}</div>
          </div>
          <button onClick={handleSend} style={{ width: "100%", background: "#25D366", color: "#fff", border: "none", borderRadius: 14, padding: 16, fontSize: 17, fontWeight: 800, cursor: "pointer" }}>
            Trimite pe WhatsApp
          </button>
        </div>
      )}
    </div>
  );

  // ── MAIN SCREEN ──
  return (
    <div style={{ fontFamily: "system-ui,sans-serif", background: "#f8f7f4", minHeight: "100vh", maxWidth: 480, margin: "0 auto" }}>

      {/* HEADER */}
      <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #f0ece4", position: "sticky", top: 0, zIndex: 50 }}>
        {showSearch ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <input autoFocus value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Cauta produs..."
              style={{ flex: 1, border: "1.5px solid #e0d5c5", borderRadius: 10, padding: "10px 14px", fontSize: 15, outline: "none", fontFamily: "inherit" }} />
            <button onClick={() => { setShowSearch(false); setSearch(""); }} style={{ background: "none", border: "none", color: GOLD, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Anuleaza</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>
                <span style={{ color: GOLD }}>bronzat</span><span style={{ color: DARK }}>.ro</span>
              </div>
              <div style={{ fontSize: 9, color: "#aaa", letterSpacing: 2, textTransform: "uppercase", marginTop: 2 }}>Comanda Lotiuni Australian Gold 2026</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button onClick={() => setShowSearch(true)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: DARK, padding: 0 }}>🔍</button>
              <button onClick={() => setCartOpen(true)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, position: "relative" }}>
                <span style={{ fontSize: 24 }}>🛒</span>
                {cartCount > 0 && (
                  <span style={{ position: "absolute", top: -4, right: -6, background: GOLD, color: "#fff", borderRadius: "50%", width: 18, height: 18, fontSize: 10, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* INFO BAR */}
      <div style={{ background: "#fffbf0", padding: "10px 16px", borderBottom: "1px solid #f0e8d0", display: "flex", alignItems: "flex-start", gap: 8 }}>
        <span style={{ fontSize: 16 }}>💡</span>
        <div style={{ fontSize: 12, color: "#7a5c1e", lineHeight: 1.5 }}>
          Preturi de salon in EUR, fara TVA · Curs BNR + 1% din ziua facturarii<br />
          Valabile din 01.02.2026
        </div>
      </div>

      {/* FILTERS */}
      <div style={{ background: "#fff", padding: "12px 16px", borderBottom: "1px solid #eee" }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[
            { label: "Tip", value: filterType, options: ALL_TYPES, set: setFilterType },
            { label: "Format", value: filterSize, options: ALL_SIZES, set: setFilterSize },
          ].map(({ label, value, options, set }) => (
            <div key={label} style={{ flex: 1, position: "relative" }}>
              <select value={value} onChange={e => set(e.target.value)}
                style={{ width: "100%", border: "1.5px solid #e0d5c5", borderRadius: 10, padding: "10px 12px", fontSize: 13, outline: "none", background: "#fff", fontFamily: "inherit", appearance: "none", WebkitAppearance: "none", cursor: "pointer" }}>
                {options.map(o => <option key={o}>{o}</option>)}
              </select>
              <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", fontSize: 10, color: "#888" }}>▼</div>
              <div style={{ position: "absolute", left: 12, top: -8, background: "#fff", fontSize: 10, color: "#888", padding: "0 3px" }}>{label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 13, color: "#666", fontWeight: 500 }}>{filtered.length} produse gasite</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: GOLD, fontWeight: 600, cursor: "pointer" }}>
            <span>⇅</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}
              style={{ border: "none", outline: "none", background: "transparent", color: GOLD, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>
              <option value="name">Nume A-Z</option>
              <option value="pret_asc">Pret crescator</option>
              <option value="pret_desc">Pret descrescator</option>
            </select>
          </div>
        </div>
      </div>

      {/* PRODUCT LIST */}
      <div style={{ padding: "8px 12px 100px" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#bbb", fontSize: 15 }}>Niciun produs gasit.</div>
        )}
        {filtered.map(p => {
          const ts = getTS(p.type);
          const qty = quantities[p.id] || 0;
          const added = addedIds[p.id];
          return (
            <div key={p.id} style={{ background: "#fff", borderRadius: 14, marginBottom: 10, padding: "14px 14px", boxShadow: "0 1px 5px rgba(0,0,0,0.07)", display: "flex", alignItems: "center", gap: 12 }}>
              <Img name={p.name} size={p.size} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{p.size}</div>
                <span style={{ background: ts.bg, color: ts.color, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 20, display: "inline-flex", alignItems: "center", gap: 3, marginTop: 5 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: ts.dot }}></span>{p.type}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: 900, fontSize: 18, color: DARK }}>€{p.eur.toFixed(2)}</div>
                  <div style={{ fontSize: 11, color: "#aaa" }}>fara TVA</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ display: "flex", border: "1.5px solid #e0d5c5", borderRadius: 8, overflow: "hidden" }}>
                    <button onClick={() => setQty(p.id, qty - 1)} style={{ width: 30, height: 36, background: "#f9f4ec", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, color: "#555" }}>-</button>
                    <input type="number" min="0" value={qty} onChange={e => setQty(p.id, e.target.value)}
                      style={{ width: 36, textAlign: "center", fontSize: 14, fontWeight: 700, border: "none", outline: "none", background: "#fff", fontFamily: "inherit", padding: 0 }} />
                    <button onClick={() => setQty(p.id, qty + 1)} style={{ width: 30, height: 36, background: "#f9f4ec", border: "none", cursor: "pointer", fontSize: 18, fontWeight: 700, color: "#555" }}>+</button>
                  </div>
                  <button onClick={() => addToCart(p)}
                    style={{ height: 36, padding: "0 10px", background: added ? "#2e7d4f" : qty > 0 ? GOLD : "#e8e0d0", color: qty > 0 || added ? "#fff" : "#bbb", border: "none", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: qty > 0 ? "pointer" : "default", whiteSpace: "nowrap", transition: "background 0.2s", display: "flex", alignItems: "center", gap: 4 }}>
                    {added ? "✓" : "🛒"} {added ? "OK!" : qty > 0 ? "Adauga" : "Adauga"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* BOTTOM BAR */}
      {cartCount > 0 && (
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, padding: "10px 12px 16px", background: "transparent", pointerEvents: "none" }}>
          <button onClick={() => setCartOpen(true)} pointerEvents="all"
            style={{ width: "100%", background: DARK, color: "#fff", border: "none", borderRadius: 16, padding: "14px 20px", fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.25)", pointerEvents: "all" }}>
            <span style={{ background: GOLD, borderRadius: "50%", width: 28, height: 28, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 800 }}>{cartCount}</span>
            <span style={{ flex: 1, textAlign: "left" }}>{cartCount} {cartCount === 1 ? "produs" : "produse"} in cos</span>
            <span style={{ color: "#f5c842", fontWeight: 900, fontSize: 16 }}>€{cartTotal.toFixed(2)} fara TVA</span>
            <span style={{ fontSize: 18 }}>›</span>
          </button>
        </div>
      )}

      {/* ORDER SENT */}
      {orderSent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "40px 30px", textAlign: "center", width: "100%" }}>
            <div style={{ fontSize: 56, marginBottom: 12 }}>✅</div>
            <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Comanda trimisa!</div>
            <div style={{ fontSize: 14, color: "#666" }}>Echipa bronzat.ro te va contacta in scurt timp.</div>
          </div>
        </div>
      )}
    </div>
  );
}
