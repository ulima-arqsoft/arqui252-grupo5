import React from "react";
import client from "../api/client";
import * as Sentry from "@sentry/react";

export default function ProductCard({ product }) {
  const handleBuy = async () => {
    try {
      const res = await client.post("/orders/", { product_id: product.id });
      alert(`✅ ${res.data.message} - ${product.name}`);
    } catch (error) {
      Sentry.captureException(error);
      alert("❌ Error al crear la orden. Revisa Sentry para más detalles.");
      console.error(error);
    }
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: "1em", borderRadius: "8px" }}>
      <h3>{product.name}</h3>
      <p>💲{product.price}</p>
      <button onClick={handleBuy}>Buy</button>
    </div>
  );
}
