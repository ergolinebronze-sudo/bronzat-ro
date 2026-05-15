// api/products.js — Vercel Serverless Function
export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const email = process.env.SMARTBILL_EMAIL;
  const token = process.env.SMARTBILL_TOKEN;
  const cif   = process.env.SMARTBILL_CIF;

  if (!email || !token || !cif) {
    return res.status(500).json({ error: "Lipsesc variabilele de mediu SmartBill", email: !!email, token: !!token, cif: !!cif });
  }

  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const headers = {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  try {
    const prodResp = await fetch(
      `https://ws.smartbill.ro/SBORO/api/products?cif=${encodeURIComponent(cif)}`,
      { headers }
    );

    if (!prodResp.ok) {
      const err = await prodResp.text();
      return res.status(prodResp.status).json({ 
        error: "Eroare SmartBill", 
        status: prodResp.status,
        detail: err.substring(0, 500)
      });
    }

    const prodData = await prodResp.json();
    const products = prodData.list || prodData.products || prodData || [];

    let stockMap = {};
    try {
      const today = new Date().toISOString().split("T")[0];
      const stockResp = await fetch(
        `https://ws.smartbill.ro/SBORO/api/stock?cif=${encodeURIComponent(cif)}&date=${today}`,
        { headers }
      );
      if (stockResp.ok) {
        const stockData = await stockResp.json();
        const stocks = stockData.list || stockData.stocks || [];
        if (Array.isArray(stocks)) {
          stocks.forEach(s => {
            const key = (s.productName || s.name || "").trim().toUpperCase();
            stockMap[key] = s.quantity ?? s.stock ?? null;
          });
        }
      }
    } catch (e) {}

    const result = Array.isArray(products) ? products.map(p => {
      const name = (p.name || p.productName || "").trim();
      return {
        name,
        code:     p.code || p.productCode || "",
        price:    parseFloat(p.price || p.unitPrice || p.standardPrice || 0),
        currency: p.currency || "RON",
        vatRate:  parseFloat(p.vatRate || p.taxRate || 21),
        stock:    stockMap[name.toUpperCase()] ?? null,
        um:       p.measuringUnitName || p.um || "buc",
      };
    }) : [];

    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).json({ products: result, count: result.length, updatedAt: new Date().toISOString() });

  } catch (err) {
    return res.status(500).json({ error: "Eroare server", detail: err.message });
  }
}
