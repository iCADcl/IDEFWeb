# Cómo Deshabilitar Stripe Link Completamente

## Problema Actual

Stripe Link está interceptando el flujo de pago mostrando el modal "Guardar con link", lo que impide completar pagos de forma tradicional con tarjeta.

## Solución: Deshabilitar Link desde el Dashboard de Stripe

### Opción 1: Deshabilitar Link Globalmente (Recomendado)

1. Ve a tu Dashboard de Stripe: https://dashboard.stripe.com
2. En el menú lateral, ve a **Settings** (Configuración)
3. Busca la sección **Payment methods** (Métodos de pago)
4. Encuentra **Link** en la lista
5. Click en **Manage** (Administrar) o el toggle al lado de Link
6. **Desactiva Link** completamente
7. Guarda los cambios

### Opción 2: Deshabilitar Link Solo para Este Sitio

Si quieres mantener Link activo en otros proyectos pero no en este:

1. Dashboard de Stripe → **Settings** → **Branding**
2. En "Link settings":
   - Desactiva "Enable Link for all payment forms"
   - O crea una excepción para este dominio específico

### Opción 3: Usar Modo Test con Tarjetas de Prueba

Si el objetivo es solo probar el flujo sin usar dinero real:

1. Dashboard de Stripe → Activa **Test mode** (toggle arriba a la derecha)
2. Ve a **Developers** → **API keys**
3. Copia las Test keys:
   ```
   Publishable key: pk_test_...
   Secret key: sk_test_...
   ```
4. Reemplaza en `/app/backend/.env`:
   ```
   STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_SECRET_KEY="sk_test_..."
   ```
5. Reemplaza en `/app/frontend/.env`:
   ```
   REACT_APP_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   ```
6. Reinicia servicios:
   ```bash
   sudo supervisorctl restart all
   ```

**Tarjetas de prueba que funcionan en TEST mode:**
```
Tarjeta exitosa:
4242 4242 4242 4242
CVV: 123
Fecha: 12/25

Tarjeta rechazada (sin fondos):
4000 0000 0000 9995
CVV: 123
Fecha: 12/25
```

## Cambios Ya Implementados en el Código

✅ Código postal removido (opcional)
✅ `payment_method_types` solo permite "card"
✅ `payment_method_options` configurado
✅ CardElement con `hidePostalCode: true`

## Por Qué Link Sigue Apareciendo

Stripe Link es una **configuración a nivel de cuenta**, no solo de código. Aunque configuramos el código para evitarlo, si Link está habilitado en tu cuenta de Stripe, el SDK de Stripe lo mostrará automáticamente cuando detecte un email.

## Verificación Después de Deshabilitar

1. Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
2. Abre una ventana de incógnito
3. Ve a http://localhost:3000/tienda
4. Agrega un producto al carrito
5. Procede al checkout
6. El formulario de tarjeta debería aparecer **sin** el botón "Autofill link"

## Alternativa Temporal

Si no puedes/quieres deshabilitar Link ahora, puedes:

1. **Simplemente cerrar el modal de Link** haciendo click en la X o fuera del modal
2. **Llenar la tarjeta manualmente** en el campo que aparece debajo
3. El pago se procesará normalmente sin guardar en Link

## Estado Actual de tu Cuenta

- ✅ Cuenta verificada y activa
- ✅ Pagos habilitados (LIVE mode)
- ⚠️ Stripe Link habilitado (causando el problema)
- ✅ API Keys válidas y funcionales

## Soporte

Si tienes problemas para encontrar estas configuraciones:
- Contacta a Stripe Support: https://support.stripe.com
- O usa Test mode como workaround inmediato
