# Etapa 1: build
FROM node:20-alpine AS builder
WORKDIR /app

# Copiar archivos y dependencias
COPY package*.json ./
RUN npm install
COPY . .

# Construir el frontend con Vite
RUN npm run build

# Etapa 2: servir archivos estáticos
FROM node:20-alpine
WORKDIR /app

# Instalar un servidor simple para archivos estáticos
RUN npm install -g serve

# Copiar la build del builder
COPY --from=builder /app/dist ./dist

# Exponer el puerto (el mismo que se usa en docker-compose.yml)
EXPOSE 5173

# Comando final: servir el contenido de /dist
CMD ["serve", "-s", "dist", "-l", "5173"]
