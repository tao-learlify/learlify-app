# ================================
# Stage 1: Build
# ================================
FROM node:24-alpine AS builder

# Instalar dependencias necesarias para node-sass y otras compilaciones nativas
RUN apk add --no-cache python3 make g++

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci --only=production=false --legacy-peer-deps

# Copiar el resto del código fuente
COPY . .

# Crear archivo .env vacío si no existe (las variables se pasarán en runtime)
RUN touch .env

# Build de la aplicación para producción
RUN npm run build

# ================================
# Stage 2: Production con Nginx
# ================================
FROM nginx:alpine AS production

# Copiar archivos estáticos desde el stage de build
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

# ================================
# Stage 3: Development (opcional)
# ================================
FROM node:24-alpine AS development

# Instalar dependencias necesarias para node-sass
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo dev)
RUN npm install --legacy-peer-deps

# Copiar el resto del código
COPY . .

# Exponer puerto 3000
EXPOSE 3000

# Comando para modo desarrollo con hot-reload
CMD ["npm", "start"]
