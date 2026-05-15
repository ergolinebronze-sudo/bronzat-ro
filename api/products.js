// api/products.js — Vercel Serverless Function
// Trage stocul SI preturile din SmartBill

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const email = process.env.SMARTBILL_EMAIL;
  const token = process.env.SMARTBILL_TOKEN;
  const cif   = process.env.SMARTBILL_CIF;

  if (!email || !token || !cif) {
    return res.status(500).json({ error: "Lipsesc variabilele de mediu SmartBill" });
  }

  const auth = Buffer.from(`${email}:${token}`).toString("base64");
  const headers = {
    "Authorization": `Basic ${auth}`,
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  try {
    const today = new Date().toISOString().split("T")[0];
    const warehouse = "ergolife";

    // 1. Stoc
    const stockResp = await fetch(
      `https://ws.smartbill.ro/SBORO/api/stocks?cif=${encodeURIComponent(cif)}&date=${today}&warehouseName=${encodeURIComponent(warehouse)}`,
      { headers }
    );

    let stockMap = {};
    if (stockResp.ok) {
      const stockData = await stockResp.json();
      const list = stockData.list || [];
      list.forEach(w => {
        (w.products || []).forEach(p => {
          const key = (p.productName || "").trim().toUpperCase();
          stockMap[key] = parseFloat(p.quantity ?? 0);
        });
      });
    }

    // 2. Preturi - incearca endpoint-ul de nomenclator
    let priceMap = {};
    const priceUrls = [
      `https://ws.smartbill.ro/SBORO/api/product-list?cif=${encodeURIComponent(cif)}`,
      `https://ws.smartbill.ro/SBORO/api/products?cif=${encodeURIComponent(cif)}`,
      `https://ws.smartbill.ro/SBORO/api/nomenclature/products?cif=${encodeURIComponent(cif)}`,
      `https://ws.smartbill.ro/SBORO/api/priceList?cif=${encodeURIComponent(cif)}`,
    ];

    let priceRaw = {};
    for (const url of priceUrls) {
      const r = await fetch(url, { headers });
      priceRaw[url] = { status: r.status };
      if (r.ok) {
        const d = await r.json();
        priceRaw[url].data = JSON.stringify(d).substring(0, 200);
        // Daca am gasit ceva, extragem preturile
        const items = d.list || d.products || d.items || [];
        if (Array.isArray(items) && items.length > 0) {
          items.forEach(p => {
            const key = (p.name || p.productName || "").trim().toUpperCase();
            priceMap[key] = parseFloat(p.price || p.unitPrice || p.standardPrice || 0);
          });
          break; // am gasit endpoint-ul corect
        }
      }
    }

    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).json({ 
      stocks: stockMap,
      prices: priceMap,
      priceEndpoints: priceRaw,
      stockCount: Object.keys(stockMap).length,
      priceCount: Object.keys(priceMap).length,
      updatedAt: new Date().toISOString() 
    });

  } catch (err) {
    return res.status(500).json({ error: "Eroare server", detail: err.message });
  }
}
