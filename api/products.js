// api/products.js — Vercel Serverless Function
// Trage stocul produselor din SmartBill

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

    // Endpoint corect SmartBill pentru stoc
    const stockResp = await fetch(
      `https://ws.smartbill.ro/SBORO/api/stock?cif=${encodeURIComponent(cif)}&date=${today}`,
      { headers }
    );

    if (!stockResp.ok) {
      const err = await stockResp.text();
      return res.status(stockResp.status).json({ 
        error: "Eroare SmartBill stoc", 
        status: stockResp.status,
        url: `https://ws.smartbill.ro/SBORO/api/stock?cif=${cif}&date=${today}`,
        detail: err.substring(0, 300)
      });
    }

    const stockData = await stockResp.json();
    
    // Construieste un map { NUME_PRODUS: stoc }
    const stocks = stockData.list || stockData.stocks || stockData || [];
    const stockMap = {};
    if (Array.isArray(stocks)) {
      stocks.forEach(s => {
        const name = (s.productName || s.name || "").trim();
        stockMap[name] = {
          stock: s.quantity ?? s.stock ?? null,
          price: parseFloat(s.price || s.unitPrice || 0),
          um: s.measuringUnitName || s.um || "buc",
        };
      });
    }

    res.setHeader("Cache-Control", "s-maxage=300");
    return res.status(200).json({ 
      stocks: stockMap,
      count: Object.keys(stockMap).length,
      raw: stockData,
      updatedAt: new Date().toISOString() 
    });

  } catch (err) {
    return res.status(500).json({ error: "Eroare server", detail: err.message });
  }
}
