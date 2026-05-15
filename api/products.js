// api/products.js — Vercel Serverless Function
// Testeaza mai multe endpoint-uri SmartBill ca sa gasim cel corect

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

  const today = new Date().toISOString().split("T")[0];
  const warehouse = "ergolife";

  // Testam mai multe variante de URL
  const urls = [
    `https://ws.smartbill.ro/SBORO/api/stock?cif=${encodeURIComponent(cif)}&date=${today}&warehouseName=${encodeURIComponent(warehouse)}`,
    `https://ws.smartbill.ro/SBORO/api/stocks?cif=${encodeURIComponent(cif)}&date=${today}&warehouseName=${encodeURIComponent(warehouse)}`,
    `https://ws.smartbill.ro/SBORO/api/inventory?cif=${encodeURIComponent(cif)}&date=${today}`,
    `https://ws.smartbill.ro/SBORO/api/warehouse/stock?cif=${encodeURIComponent(cif)}&date=${today}`,
    `https://ws.smartbill.ro/SBORO/api/product?cif=${encodeURIComponent(cif)}`,
  ];

  const results = {};
  for (const url of urls) {
    try {
      const r = await fetch(url, { headers });
      results[url] = { status: r.status, ok: r.ok };
      if (r.ok) {
        const data = await r.json();
        results[url].data = data;
      }
    } catch (e) {
      results[url] = { error: e.message };
    }
  }

  return res.status(200).json({ results });
}
