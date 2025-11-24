import { useEffect, useState } from "react";
import { fetchArticles } from "../api";
import ArticleCard from "../components/ArticleCard";

export default function Home() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchArticles().then((data) => {
      // data.data es el array que Strapi te devuelve
      setArticles(data.data || []);
    });
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Contenido del CMS</h1>
      <p>Este frontend consume contenido desde Strapi.</p>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "1rem"
      }}>
        {articles.map(a => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </div>
  );
}
