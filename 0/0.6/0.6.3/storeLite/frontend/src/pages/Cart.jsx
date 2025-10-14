import React, { useState } from "react";

export default function Cart() {
  const [explode, setExplode] = useState(false);

  if (explode) {
    throw new Error("Error manual en el render del carrito 🧨");
  }

  return (
    <section style={{ marginTop: "2em" }}>
      <h2>Carrito</h2>
      <button onClick={() => setExplode(true)}>Probar error</button>
    </section>
  );
}
