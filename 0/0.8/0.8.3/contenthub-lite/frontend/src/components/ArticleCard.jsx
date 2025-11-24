import { Link } from "react-router-dom";

export default function ArticleCard({ article }) {
  return (
    <Link 
      to={`/article/${article.id}`}
      style={{
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
        textDecoration: "none",
        color: "black"
      }}
    >
      <h2>{article.title}</h2>
      <p>{article.description}</p>
    </Link>
  );
}
