import React from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import * as Sentry from "@sentry/react";

export default function App() {
  return (
    <div>
      <Header />
      <Home />
      <Sentry.ErrorBoundary fallback={<p>Ups 😢 el carrito falló.</p>}>
        <Cart />
      </Sentry.ErrorBoundary>
    </div>
  );
}
