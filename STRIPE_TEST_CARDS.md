# Tarjetas de Prueba de Stripe

## ⚠️ IMPORTANTE: Cuenta en Modo LIVE

Tu cuenta de Stripe está configurada en **modo LIVE** (producción). Esto significa que:

- ✅ **Ventaja**: Puedes recibir pagos reales inmediatamente
- ⚠️ **Limitación**: Las tarjetas de prueba NO funcionarán

## Opciones para Pruebas

### Opción 1: Usar Modo Test (Recomendado para Desarrollo)

Para usar tarjetas de prueba, necesitas cambiar a las **Test API Keys**:

1. Ve a https://dashboard.stripe.com
2. Activa el toggle "**Test mode**" en la esquina superior derecha
3. Ve a "Developers" → "API keys"
4. Copia las keys que empiezan con:
   - `pk_test_...` (Publishable key)
   - `sk_test_...` (Secret key)
5. Reemplaza en `.env` las keys actuales

**Tarjetas de prueba válidas en TEST mode:**

```
Visa exitosa:
Número: 4242 4242 4242 4242
CVV: Cualquier 3 dígitos
Fecha: Cualquier fecha futura

Mastercard exitosa:
Número: 5555 5555 5555 4444
CVV: Cualquier 3 dígitos
Fecha: Cualquier fecha futura

Tarjeta rechazada (fondos insuficientes):
Número: 4000 0000 0000 9995
CVV: Cualquier 3 dígitos
Fecha: Cualquier fecha futura

Requiere autenticación 3D Secure:
Número: 4000 0025 0000 3155
CVV: Cualquier 3 dígitos
Fecha: Cualquier fecha futura
```

### Opción 2: Usar Pagos Reales (Modo LIVE Actual)

Tu configuración actual permite pagos reales:

- ✅ Puedes usar tu propia tarjeta para probar
- ✅ Los fondos llegarán a tu cuenta Stripe
- ⚠️ Ten en cuenta las comisiones de Stripe (~2.9% + $0.30 USD)

**Para probar sin gastar dinero:**
1. Haz una compra con tu tarjeta
2. Inmediatamente ve a Stripe Dashboard → Payments
3. Reembolsa el pago completo (sin costo)

## Cambios Implementados

✅ **Stripe Link Deshabilitado**: Ya no te obligará a guardar datos
✅ **Código Postal Opcional**: Removido el campo obligatorio
✅ **Solo Pagos con Tarjeta**: Link y otros métodos deshabilitados

## Estado Actual

- **API Keys**: LIVE mode (producción)
- **Pagos**: Habilitados y funcionales
- **Cuenta**: Verificada y activa
- **País**: Estados Unidos
- **Comisiones Stripe**: 2.9% + $0.30 USD por transacción exitosa

## Recomendación

Si solo quieres **probar la funcionalidad** sin cargos reales:
→ Cambia a **Test mode** y usa las tarjetas de prueba de arriba

Si estás listo para **recibir pagos reales**:
→ Deja la configuración actual (LIVE mode)
