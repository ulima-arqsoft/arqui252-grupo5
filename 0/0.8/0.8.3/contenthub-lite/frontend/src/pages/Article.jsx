import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchArticle } from "../api";

export default function Article() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetchArticle(id).then(setArticle);
  }, [id]);

  if (!article) return <p>Cargando...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
    </div>
  );
}
