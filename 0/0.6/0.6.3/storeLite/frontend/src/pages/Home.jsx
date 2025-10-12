import React, { useEffect, useState } from "react";
import client from "../api/client";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    client.get("/products/").then((res) => setProducts(res.data));
  }, []);

  return (
    <section>
      <h2>Productos</h2>
      <div style={{ display: "flex", gap: "1em" }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
