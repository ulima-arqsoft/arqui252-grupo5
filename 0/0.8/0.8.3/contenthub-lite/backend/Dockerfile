FROM node:20

# Necesario para compilar better-sqlite3
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiamos solo package.json para usar la cache
COPY package.json package-lock.json* ./

# Instalamos dentro del contenedor (NUNCA afuera)
RUN npm install

# Luego copiamos el resto del proyecto
COPY . .

# Carpeta donde Strapi guardará la base sqlite
RUN mkdir -p /app/data

ENV NODE_ENV=development
ENV DATABASE_CLIENT=sqlite
ENV DATABASE_FILENAME=/app/data/data.db

EXPOSE 1338

CMD ["npm", "run", "develop"]
