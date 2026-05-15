// api/products.js — Vercel Serverless Function
// Trage stocul produselor din SmartBill gestiune ergolife

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

    const url = `https://ws.smartbill.ro/SBORO/api/stocks?cif=${encodeURIComponent(cif)}&date=${today}&warehouseName=${encodeURIComponent(warehouse)}`;
    const stockResp = await fetch(url, { headers });

    if (!stockResp.ok) {
      const err = await stockResp.text();
      return res.status(stockResp.status).json({ error: "Eroare SmartBill", detail: err.substring(0, 300) });
    }

    const stockData = await stockResp.json();
    const list = stockData.list || [];

    // Construieste map { NUME_PRODUS_UPPERCASE: quantity }
    const stockMap = {};
    list.forEach(warehouse => {
      const products = warehouse.products || [];
      products.forEach(p => {
        const key = (p.productName || "").trim().toUpperCase();
        stockMap[key] = parseFloat(p.quantity ?? 0);
      });
    });

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    return res.status(200).json({ 
      stocks: stockMap,
      count: Object.keys(stockMap).length,
      updatedAt: new Date().toISOString() 
    });

  } catch (err) {
    return res.status(500).json({ error: "Eroare server", detail: err.message });
  }
}
