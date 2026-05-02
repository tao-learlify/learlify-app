# 🐳 Docker - APTIS Client

## 📋 Archivos creados

- `Dockerfile` - Dockerfile multi-stage con 3 targets (builder, production, development)
- `.dockerignore` - Archivos y carpetas a ignorar en el build
- `nginx.conf` - Configuración de Nginx para producción
- `docker-compose.yml` - Orquestación de servicios
- `.env.docker` - Ejemplo de variables de entorno

## 🚀 Uso

### Opción 1: Docker Compose (Recomendado)

#### Modo Desarrollo
```bash
# Levantar en modo desarrollo con hot-reload
docker-compose up client-dev

# Acceder en: http://localhost:3000
```

#### Modo Producción
```bash
# Levantar en modo producción con Nginx
docker-compose up client-prod

# Acceder en: http://localhost:80
```

### Opción 2: Docker CLI

#### Construir imagen de desarrollo
```bash
docker build -t aptis-client:dev --target development .
```

#### Ejecutar contenedor de desarrollo
```bash
docker run -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/public:/app/public \
  -e REACT_APP_API_URL=http://localhost:3100 \
  -e REACT_APP_WEBSOCKET=http://localhost:3100 \
  -e REACT_APP_FALLBACK_LANGUAGE=en \
  -e SKIP_PREFLIGHT_CHECK=true \
  aptis-client:dev
```

#### Construir imagen de producción
```bash
docker build -t aptis-client:prod --target production .
```

#### Ejecutar contenedor de producción
```bash
docker run -p 80:80 \
  -e REACT_APP_API_URL=http://localhost:3100 \
  -e REACT_APP_WEBSOCKET=http://localhost:3100 \
  aptis-client:prod
```

## 🔧 Configuración

### Variables de Entorno

Copia `.env.docker` a `.env` y configura tus valores:

```bash
cp .env.docker .env
```

Variables requeridas:
- `REACT_APP_API_URL` - URL del API backend
- `REACT_APP_WEBSOCKET` - URL del websocket
- `REACT_APP_CLOUDFRONT` - CDN/CloudFront URL (opcional)
- `REACT_APP_FALLBACK_LANGUAGE` - Idioma por defecto
- `REACT_APP_STRIPE_PUBLIC_API_KEY` - Clave pública de Stripe
- `REACT_APP_GOOGLE_CLIENT_ID` - Client ID de Google OAuth

### Configuración de Nginx

El archivo `nginx.conf` incluye:
- ✅ Compresión Gzip
- ✅ Headers de seguridad
- ✅ Cache de assets estáticos
- ✅ Soporte para SPA (Single Page Application)
- ✅ Proxy para API (configurar según necesidad)
- ✅ Soporte WebSocket

## 📦 Multi-stage Build

El Dockerfile usa 3 stages:

1. **builder** - Compila la aplicación React
2. **production** - Sirve archivos estáticos con Nginx (optimizado)
3. **development** - Modo desarrollo con hot-reload

## 🎯 Puertos

- **Desarrollo**: 3000
- **Producción**: 80

## 🔍 Troubleshooting

### Error con node-sass
Si tienes problemas con node-sass, el Dockerfile ya incluye las dependencias necesarias (`python2`, `make`, `g++`).

### Problemas con variables de entorno
Las variables `REACT_APP_*` deben estar disponibles en **build time**. Si necesitas cambiarlas después del build, considera usar una solución de runtime configuration.

### Hot-reload no funciona en desarrollo
Asegúrate de montar los volúmenes correctamente:
```yaml
volumes:
  - ./src:/app/src
  - ./public:/app/public
  - /app/node_modules
```

## 🌐 Integración con el servidor

El archivo `nginx.conf` incluye configuración para proxy al servidor backend:
- API requests: `/api` → `http://server:3100`
- WebSocket: `/socket.io` → `http://server:3100`

Ajusta según tu configuración en el backend.

## 📊 Optimizaciones

- ✅ Multi-stage build para reducir tamaño de imagen
- ✅ `.dockerignore` para excluir archivos innecesarios
- ✅ Cache de layers de Docker optimizado
- ✅ Nginx con compresión y cache configurados
- ✅ Volúmenes para desarrollo sin rebuilds

## 🚢 Deployment

### Build de producción optimizado
```bash
docker build --no-cache -t aptis-client:prod --target production .
```

### Push a registry
```bash
docker tag aptis-client:prod your-registry/aptis-client:prod
docker push your-registry/aptis-client:prod
```

## 📝 Notas

- La imagen de producción es muy ligera (Nginx Alpine)
- Modo desarrollo incluye todas las dev dependencies
- El proxy API en nginx puede necesitar ajustes según tu backend
- Considera usar variables de entorno específicas para cada ambiente
