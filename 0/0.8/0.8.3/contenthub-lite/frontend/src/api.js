export const API_URL = "http://localhost:1338/api";
const API_TOKEN = "PONER API TOKEN";

export async function fetchArticles() {
  const res = await fetch(`${API_URL}/articles?populate=*`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
  });
  const data = await res.json();
  return data; 
}


export async function fetchArticle(id) {
  const res = await fetch(`${API_URL}/articles?filters[id][$eq]=${id}`, {
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });
  const data = await res.json();

  return data.data[0] || null;
}
