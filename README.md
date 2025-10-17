# IDEF Internacional - Sitio Web Institucional + Tienda E-commerce

Instituto Forense especializado en análisis forense, peritaje criminalístico y formación profesional con certificación internacional.

## 🌐 Descripción del Proyecto

Sitio web completo que incluye:
- **Landing Page Corporativa**: Presentación institucional, servicios, formación, innovación y contacto
- **Tienda E-commerce**: Venta de diplomados especializados con integración Stripe
- **Sistema de Pagos**: Checkout seguro con SSL y procesamiento de pagos en tiempo real

## 🛠️ Stack Tecnológico

### Frontend
- **React 19** - Framework UI
- **React Router Dom** - Navegación
- **Shadcn/UI** - Componentes UI
- **Tailwind CSS** - Estilos
- **Axios** - Cliente HTTP
- **Stripe.js** - Integración de pagos

### Backend
- **FastAPI** - Framework Python
- **MongoDB** - Base de datos NoSQL
- **Motor** - Driver async de MongoDB
- **Stripe Python SDK** - Procesamiento de pagos
- **Pydantic** - Validación de datos

## 🚀 Deployment

### Opción 1: Deployment Nativo en Emergent (Recomendado)

**Costo**: 50 créditos/mes por aplicación

**Pasos**:
1. Click en botón "Deploy" en Emergent
2. Esperar ~10 minutos
3. Recibir URL pública

**Configurar Dominio Personalizado**:
- Deployments → Custom Domain → Ingresar `www.idef.institute`
- Configurar registro A en DNS con IP proporcionada
- Esperar verificación (5-15 minutos)

### Opción 2: Hosting Externo
- "Save to GitHub" en Emergent
- Desplegar en Vercel, Railway, AWS, etc.

## 🔐 Variables de Entorno

### Frontend (.env)
```
REACT_APP_BACKEND_URL=https://tu-dominio.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Backend (.env)
```
MONGO_URL=mongodb://localhost:27017
DB_NAME=idef_db
STRIPE_SECRET_KEY=sk_live_...
```

## 💳 Stripe Configuración

- **Account ID**: acct_1MdphqCO7bGI1yRm
- **Modo**: LIVE (producción)
- **Comisiones**: 2.9% + $0.30 USD

**Para pruebas**: Ver `/app/STRIPE_TEST_CARDS.md`

## 🛍️ Productos

10 diplomados a $540 USD c/u:
1. Abuso Sexual 2025
2. Autopsia Psicológica 2025
3. Criminal Profiling 2025
4. Y 7 más...

## 📝 API Endpoints

### Productos
- GET `/api/products` - Listar
- GET `/api/products/slug/{slug}` - Por slug
- POST `/api/products` - Crear (admin)

### Checkout
- POST `/api/checkout/create-payment-intent`
- POST `/api/checkout/confirm-payment/{order_id}`

### Contacto
- POST `/api/contact` - Enviar consulta
- GET `/api/contact` - Listar (admin)

## 🔧 Comandos Útiles

```bash
# Reiniciar servicios
sudo supervisorctl restart all

# Ver logs
tail -f /var/log/supervisor/frontend.*.log
tail -f /var/log/supervisor/backend.*.log

# Importar productos
cd /app/backend && python seed_products.py
```

## 🎨 Diseño

- **Colores**: Slate 950 (fondo) + Cyan 500 (acento)
- **Responsive**: Mobile-first
- **Componentes**: Shadcn/UI

## 📱 Características

### Landing Page
✅ Hero + Servicios + Formación + Innovación + Testimonios + Contacto

### E-commerce
✅ Catálogo + Detalle + Carrito + Checkout Stripe + Confirmación

## 🐛 Problema Conocido

**Stripe Link**: Modal intercepta pago
- **Solución**: Deshabilitar en Stripe Dashboard
- **Detalle**: Ver `/app/DESHABILITAR_STRIPE_LINK.md`

---

**Desarrollado con [Emergent](https://emergent.sh)**
