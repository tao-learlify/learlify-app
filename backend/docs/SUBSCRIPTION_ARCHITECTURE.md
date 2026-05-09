# Arquitectura de Suscripciones y Ciclos de Facturacion

## Vision general

La nueva arquitectura reemplaza el flujo de pago unico a paquete por un sistema de suscripciones con ciclos de facturacion recurrentes. Los paquetes legacy se mantienen intactos para retrocompatibilidad con las compuertas de acceso existentes.

---

## Tablas involucradas

```text
plans
  -> plan_prices   (1:N, precios por ciclo/moneda)
  -> access        (1:N, features habilitadas)
  -> packages      (legacy, retrocompat)

subscriptions
  -> plans         (plan contratado)
  -> plan_prices   (precio y ciclo elegido)
  -> users

packages           (espejo automatico por cada subscription)
```

### `plans` - cambios nuevos

| Columna                     | Tipo                 | Descripcion                                              |
| --------------------------- | -------------------- | -------------------------------------------------------- |
| `code`                      | `VARCHAR(50) UNIQUE` | Slug estable del plan, por ejemplo `aptis_pro`           |
| `includes_course`           | `BOOLEAN`            | Si el plan incluye acceso a cursos                       |
| `included_exams`            | `INT NULL`           | Numero de examenes incluidos, `NULL` significa ilimitado |
| `included_speaking_reviews` | `INT`                | Reviews de speaking incluidas                            |
| `included_writing_reviews`  | `INT`                | Reviews de writing incluidas                             |
| `sort_order`                | `INT`                | Orden de presentacion en el frontend                     |

### `plan_prices`

| Columna               | Tipo                               | Descripcion                |
| --------------------- | ---------------------------------- | -------------------------- |
| `plan_id`             | FK a `plans`                       | Plan al que pertenece      |
| `billing_cycle`       | `ENUM(monthly, quarterly, yearly)` | Ciclo de facturacion       |
| `currency`            | `CHAR(3)`                          | Moneda, default `EUR`      |
| `base_price`          | `INT`                              | Precio base en centavos    |
| `discount_percentage` | `DECIMAL(5,2)`                     | Descuento aplicado         |
| `final_price`         | `INT`                              | Precio final en centavos   |
| `active`              | `BOOLEAN`                          | Si este precio esta activo |

Clave unica: `(plan_id, billing_cycle, currency)`.

### `subscriptions`

| Columna                | Tipo                                        | Descripcion                     |
| ---------------------- | ------------------------------------------- | ------------------------------- |
| `user_id`              | FK a `users`                                | Usuario suscrito                |
| `plan_id`              | FK a `plans`                                | Plan contratado                 |
| `plan_price_id`        | FK a `plan_prices`                          | Precio y ciclo elegido          |
| `status`               | `ENUM(active, canceled, expired, past_due)` | Estado actual                   |
| `billing_cycle`        | `ENUM(monthly, quarterly, yearly)`          | Ciclo de facturacion            |
| `started_at`           | `TIMESTAMP`                                 | Inicio de la suscripcion        |
| `current_period_start` | `TIMESTAMP`                                 | Inicio del periodo actual       |
| `current_period_end`   | `TIMESTAMP`                                 | Fin del periodo actual          |
| `cancel_at_period_end` | `BOOLEAN`                                   | Cancelar al termino del periodo |
| `canceled_at`          | `TIMESTAMP NULL`                            | Fecha de cancelacion efectiva   |
| `stripe_charge_id`     | `VARCHAR`                                   | ID del PaymentIntent de Stripe  |
| `stripe_customer_id`   | `VARCHAR`                                   | ID del Customer en Stripe       |
| `payment_method_id`    | `VARCHAR`                                   | Metodo de pago usado            |
| `idempotency_key`      | `VARCHAR UNIQUE`                            | Evita suscripciones duplicadas  |

Indices: `(user_id, status)` y `(current_period_end, status)`.

---

## Planes actuales

| Codigo            | Nombre          | Precio mensual | Trimestral (-10%) | Anual (-35%) | Features                    |
| ----------------- | --------------- | -------------- | ----------------- | ------------ | --------------------------- |
| `exam_essentials` | Exam Essentials | EUR 12.00      | EUR 32.40         | EUR 93.60    | EXAMS                       |
| `aptis_pro`       | Aptis Pro       | EUR 22.00      | EUR 59.40         | EUR 171.60   | EXAMS, COURSES, EVALUATIONS |
| `ielts_pro`       | IELTS Pro       | EUR 22.00      | EUR 59.40         | EUR 171.60   | EXAMS, COURSES, EVALUATIONS |
| `pro_max`         | Pro Max         | EUR 39.00      | EUR 105.30        | EUR 304.20   | EXAMS, COURSES, EVALUATIONS |

Los precios se almacenan en centavos. Los descuentos se aplican sobre precio mensual por numero de meses.

---

## Lifecycle de una suscripcion

```text
POST /subscriptions
  { planPriceId, paymentMethodId, idempotencyKey }
        |
        v
1. Idempotency check
2. Obtener PlanPrice + Plan
3. Obtener/crear Stripe Customer
4. Crear PaymentIntent en Stripe
5. Transaccion DB:
   a. INSERT subscriptions (status=active)
   b. INSERT packages espejo (isActive=true)
6. Respuesta al cliente
```

### Estados y transiciones

| Estado     | Descripcion                      | Como se llega                                                |
| ---------- | -------------------------------- | ------------------------------------------------------------ |
| `active`   | Suscripcion vigente              | Creacion exitosa o webhook `payment_intent.succeeded`        |
| `past_due` | Pago pendiente de confirmacion   | Requiere accion 3DS, reservado para futuro                   |
| `canceled` | Cancelada por el usuario         | `DELETE /subscriptions/:id` inmediato o al final del periodo |
| `expired`  | Periodo terminado sin renovacion | Cron cada 12h o webhook                                      |

---

## Ciclos de facturacion y periodos

| Ciclo       | Duracion periodo                      | Descuento |
| ----------- | ------------------------------------- | --------- |
| `monthly`   | 1 mes, 30 dias en packages mirror     | 0%        |
| `quarterly` | 3 meses, 90 dias en packages mirror   | 10%       |
| `yearly`    | 12 meses, 365 dias en packages mirror | 35%       |

---

## Endpoints HTTP

### Subscriptions (`/subscriptions`)

| Metodo   | Ruta                 | Auth    | Descripcion                                        |
| -------- | -------------------- | ------- | -------------------------------------------------- |
| `GET`    | `/subscriptions`     | Usuario | Lista suscripciones activas del usuario            |
| `POST`   | `/subscriptions`     | Usuario | Crea suscripcion y cobra via Stripe                |
| `DELETE` | `/subscriptions/:id` | Usuario | Cancela suscripcion inmediata o al fin del periodo |

#### `POST /subscriptions` - body

```json
{
  "planPriceId": 2,
  "paymentMethodId": "pm_xxx",
  "stripeToken": "tok_xxx",
  "idempotencyKey": "user-123-planprice-2-1741824000"
}
```

#### `DELETE /subscriptions/:id` - body

```json
{
  "immediately": false
}
```

- `immediately: false` marca `cancel_at_period_end = true`, con acceso hasta fin del periodo.
- `immediately: true` cancela ahora y desactiva el paquete espejo.

### Plans (`/plans`)

| Metodo | Ruta             | Descripcion                                   |
| ------ | ---------------- | --------------------------------------------- |
| `GET`  | `/plans/catalog` | Planes nuevos con todos sus precios por ciclo |

---

## Webhook Stripe

El handler de `payment_intent.succeeded` llama a `SubscriptionsService.activateByChargeId(intentId)` para marcar como `active` las suscripciones en estado `past_due`.

Los eventos se deduplican usando la tabla `stripe_events` con `event_id` como PK.

---

## Cron tasks

| Tarea                              | Frecuencia | Accion                                                                                               |
| ---------------------------------- | ---------- | ---------------------------------------------------------------------------------------------------- |
| `SubscriptionsTasks.expireOverdue` | cada 12h   | Marca `expired` las suscripciones cuyo `current_period_end <= NOW()` y desactiva sus paquetes espejo |

---

## Retrocompatibilidad con packages

Cada vez que se crea una suscripcion nueva, se inserta automaticamente una fila en `packages` con:

- `isActive = true`
- `expirationDate` calculado segun el ciclo, 30/90/365 dias
- `stripeChargeId` del PaymentIntent, usado como enlace entre ambas tablas

Al expirar o cancelar una suscripcion, el paquete espejo se desactiva (`isActive = false`). Los paquetes legacy de usuarios anteriores no se tocan.

---

## Planes legacy

Los planes anteriores al redisenyo (`Silver`, `Gold`, `Platinum`, etc.) se marcan con `available = false` y se les asigna un prefijo `legacy_*` en `code`. No se borran; todos los `packages` existentes mantienen su `planId` valido.

```text
legacy_silver, legacy_gold, legacy_green, legacy_master, legacy_grandmaster,
legacy_ruby, legacy_aptis, legacy_blue, legacy_diamond, legacy_platinum,
legacy_go, legacy_ielts
```

---

## Migraciones

| Archivo          | Descripcion                                                                 |
| ---------------- | --------------------------------------------------------------------------- |
| `20260313000001` | Nuevas columnas en `plans`                                                  |
| `20260313000002` | Crea tabla `plan_prices`                                                    |
| `20260313000003` | Crea tabla `subscriptions`                                                  |
| `20260313000004` | Inserta planes base `exam_essentials`, `aptis_pro`, `pro_max` y sus precios |
| `20260313000005` | Inserta accesos (`access`) para los planes nuevos                           |
| `20260313000006` | Archiva planes legacy (`available=false`)                                   |
| `20260313000007` | Backfill de `code` en planes legacy                                         |
| `20260313000008` | Inserta plan `ielts_pro` con precios y accesos                              |
