// api/products.js — Vercel Serverless Function
// Trage produsele si stocul din SmartBill API

export default async function handler(req, res) {
  // CORS — permite accesul din browser
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");

  const email = process.env.SMARTBILL_EMAIL;
  const token = process.env.SMARTBILL_TOKEN;
  const cif   = process.env.SMARTBILL_CIF;

  if (!email || !token || !cif) {
    return res.status(500).json({ error: "Lipsesc variabilele de mediu SmartBill" });
  }

  // Autentificare SmartBill: Basic Auth cu email:token in base64
  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const headers = {
    "Authorization": `Basic ${auth}`, 
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  try {
    // 1. Trage lista de produse
    const prodResp = await fetch(
      `https://ws.smartbill.ro/SBORO/api/product/list?cif=${cif}`,
      { headers }
    );

    if (!prodResp.ok) {
      const err = await prodResp.text();
      return res.status(prodResp.status).json({ error: "Eroare SmartBill produse", detail: err });
    }

    const prodData = await prodResp.json();
    const products = prodData.list || prodData.products || prodData || [];

    // 2. Trage stocul (daca exista endpoint)
    let stockMap = {};
    try {
      const today = new Date().toISOString().split("T")[0];
      const stockResp = await fetch(
        `https://ws.smartbill.ro/SBORO/api/stock?cif=${cif}&date=${today}`,
        { headers }
      );
      if (stockResp.ok) {
        const stockData = await stockResp.json();
        const stocks = stockData.list || stockData.stocks || stockData || [];
        stocks.forEach(s => {
          const key = (s.productName || s.name || "").trim().toUpperCase();
          stockMap[key] = s.quantity ?? s.stock ?? null;
        });
      }
    } catch (e) {
      // Stocul e optional — continuam fara el
      console.log("Stoc indisponibil:", e.message);
    }

    // 3. Formateaza raspunsul
    const result = products.map(p => {
      const name = (p.name || p.productName || "").trim();
      const key = name.toUpperCase();
      return {
        name,
        code:      p.code || p.productCode || "",
        price:     parseFloat(p.price || p.unitPrice || 0),
        currency:  p.currency || "RON",
        vatRate:   parseFloat(p.vatRate || p.taxRate || 21),
        stock:     stockMap[key] ?? null,
        um:        p.measuringUnitName || p.um || "buc",
      };
    });

    // Cache 5 minute
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ products: result, updatedAt: new Date().toISOString() });

  } catch (err) {
    console.error("Eroare API SmartBill:", err);
    return res.status(500).json({ error: "Eroare server", detail: err.message });
  }
}
