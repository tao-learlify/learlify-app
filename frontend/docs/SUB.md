# Arquitectura de Suscripciones y Ciclos de Facturación

## Visión general

La nueva arquitectura reemplaza el flujo de **pago único → paquete** por un sistema de **suscripciones** con ciclos de facturación recurrentes. Los paquetes legacy se mantienen intactos para retrocompatibilidad con las compuertas de acceso existentes.

---

## Tablas involucradas

```
plans
  └── plan_prices   (1:N — precios por ciclo/moneda)
  └── access        (1:N — features habilitadas)
  └── packages      (legacy, retrocompat)

subscriptions
  ├── → plans        (plan contratado)
  ├── → plan_prices  (precio y ciclo elegido)
  └── → users

packages             (espejo automático por cada subscription)
```

### `plans` — cambios nuevos

| Columna | Tipo | Descripción |
|---|---|---|
| `code` | `VARCHAR(50) UNIQUE` | Slug estable del plan (e.g. `aptis_pro`) |
| `includes_course` | `BOOLEAN` | Si el plan incluye acceso a cursos |
| `included_exams` | `INT NULL` | Número de exámenes incluidos (`NULL` = ilimitado) |
| `included_speaking_reviews` | `INT` | Reviews de speaking incluidas |
| `included_writing_reviews` | `INT` | Reviews de writing incluidas |
| `sort_order` | `INT` | Orden de presentación en el frontend |

### `plan_prices`

| Columna | Tipo | Descripción |
|---|---|---|
| `plan_id` | FK → plans | Plan al que pertenece |
| `billing_cycle` | `ENUM(monthly, quarterly, yearly)` | Ciclo de facturación |
| `currency` | `CHAR(3)` | Moneda (default `EUR`) |
| `base_price` | `INT` | Precio base en centavos |
| `discount_percentage` | `DECIMAL(5,2)` | Descuento aplicado |
| `final_price` | `INT` | Precio final en centavos |
| `active` | `BOOLEAN` | Si este precio está activo |

Clave única: `(plan_id, billing_cycle, currency)`.

### `subscriptions`

| Columna | Tipo | Descripción |
|---|---|---|
| `user_id` | FK → users | Usuario suscrito |
| `plan_id` | FK → plans | Plan contratado |
| `plan_price_id` | FK → plan_prices | Precio y ciclo elegido |
| `status` | `ENUM(active, canceled, expired, past_due)` | Estado actual |
| `billing_cycle` | `ENUM(monthly, quarterly, yearly)` | Ciclo de facturación |
| `started_at` | `TIMESTAMP` | Inicio de la suscripción |
| `current_period_start` | `TIMESTAMP` | Inicio del período actual |
| `current_period_end` | `TIMESTAMP` | Fin del período actual |
| `cancel_at_period_end` | `BOOLEAN` | Cancelar al término del período |
| `canceled_at` | `TIMESTAMP NULL` | Fecha de cancelación efectiva |
| `stripe_charge_id` | `VARCHAR` | ID del PaymentIntent de Stripe |
| `stripe_customer_id` | `VARCHAR` | ID del Customer en Stripe |
| `payment_method_id` | `VARCHAR` | Método de pago usado |
| `idempotency_key` | `VARCHAR UNIQUE` | Evita suscripciones duplicadas |

Índices: `(user_id, status)`, `(current_period_end, status)`.

---

## Planes actuales

| Código | Nombre | Precio mensual | Trimestral (-10%) | Anual (-35%) | Features |
|---|---|---|---|---|---|
| `exam_essentials` | Exam Essentials | €12.00 | €32.40 | €93.60 | EXAMS |
| `aptis_pro` | Aptis Pro | €22.00 | €59.40 | €171.60 | EXAMS, COURSES, EVALUATIONS |
| `ielts_pro` | IELTS Pro | €22.00 | €59.40 | €171.60 | EXAMS, COURSES, EVALUATIONS |
| `pro_max` | Pro Max | €39.00 | €105.30 | €304.20 | EXAMS, COURSES, EVALUATIONS |

> Precios almacenados en centavos. Descuentos aplicados sobre precio mensual × número de meses.

---

## Lifecycle de una suscripción

```
                   ┌─────────────────────────────────────┐
                   │           POST /subscriptions        │
                   │  { planPriceId, paymentMethodId,     │
                   │    idempotencyKey }                   │
                   └────────────────┬────────────────────┘
                                    │
                    1. Idempotency check
                    (¿ya existe idempotency_key?)
                           │ NO
                    2. Obtener PlanPrice + Plan
                    3. Obtener/crear Stripe Customer
                    4. Crear PaymentIntent (Stripe)
                           │
                    5. Transacción DB:
                       a. INSERT subscriptions (status=active)
                       b. INSERT packages (espejo, isActive=true)
                           │
                    6. Respuesta al cliente
                           │
                           ▼
                    ┌─────────────┐
                    │   active    │◄──────── payment_intent.succeeded
                    └──────┬──────┘          (webhook activa past_due)
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   cancel_at_period_end   expira        cancelación
   = true (soft cancel)   (cron/webhook)  inmediata
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────────┐
    │  active   │    │ expired  │    │  canceled    │
    │(hasta end)│    └──────────┘    └──────────────┘
    └──────────┘
```

### Estados y transiciones

| Estado | Descripción | Cómo se llega |
|---|---|---|
| `active` | Suscripción vigente | Creación exitosa / webhook `payment_intent.succeeded` |
| `past_due` | Pago pendiente de confirmación | Requiere acción 3DS (reservado para futuro) |
| `canceled` | Cancelada por el usuario | `DELETE /subscriptions/:id` (inmediato o `cancel_at_period_end`) |
| `expired` | Período terminado sin renovación | Cron cada 12h / webhook |

---

## Ciclos de facturación y períodos

| Ciclo | Duración período | Descuento |
|---|---|---|
| `monthly` | 1 mes (30 días en packages mirror) | 0% |
| `quarterly` | 3 meses (90 días) | 10% |
| `yearly` | 12 meses (365 días) | 35% |

---

## Endpoints HTTP

### Subscriptions (`/subscriptions`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/subscriptions` | Usuario | Lista suscripciones activas del usuario |
| `POST` | `/subscriptions` | Usuario | Crea suscripción + cobra via Stripe |
| `DELETE` | `/subscriptions/:id` | Usuario | Cancela suscripción (inmediato o al fin del período) |

#### `POST /subscriptions` — body

```json
{
  "planPriceId": 2,
  "paymentMethodId": "pm_xxx",
  "stripeToken": "tok_xxx",
  "idempotencyKey": "user-123-planprice-2-1741824000"
}
```

#### `DELETE /subscriptions/:id` — body

```json
{
  "immediately": false
}
```

- `immediately: false` → marca `cancel_at_period_end = true`, acceso hasta fin del período
- `immediately: true` → cancela ahora, desactiva el paquete espejo

### Plans (`/plans`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/plans/catalog` | Planes nuevos con todos sus precios por ciclo |

---

## Webhook Stripe

El handler de `payment_intent.succeeded` llama a `SubscriptionsService.activateByChargeId(intentId)` para marcar como `active` las suscripciones en estado `past_due`.

Los eventos se deduplican usando la tabla `stripe_events` (`event_id` como PK).

---

## Cron tasks

| Tarea | Frecuencia | Acción |
|---|---|---|
| `SubscriptionsTasks.expireOverdue` | cada 12h | Marca `expired` las suscripciones cuyo `current_period_end <= NOW()` y desactiva sus paquetes espejo |

---

## Retrocompatibilidad con packages

Cada vez que se crea una suscripción nueva, se inserta automáticamente una fila en `packages` con:
- `isActive = true`
- `expirationDate` calculado según el ciclo (30/90/365 días)
- `stripeChargeId` del PaymentIntent (usado como FK entre ambas tablas)

Al expirar o cancelar una suscripción, el paquete espejo se desactiva (`isActive = false`). Los paquetes legacy de usuarios anteriores **no se tocan**.

---

## Planes legacy

Los planes anteriores al rediseño (`Silver`, `Gold`, `Platinum`, etc.) se marcaron con `available = false` y se les asignó un `code` prefix `legacy_*`. No se han borrado — todos los `packages` existentes mantienen su `planId` válido.

```
legacy_silver, legacy_gold, legacy_green, legacy_master, legacy_grandmaster,
legacy_ruby, legacy_aptis, legacy_blue, legacy_diamond, legacy_platinum,
legacy_go, legacy_ielts
```

---

## Migraciones ejecutadas

| Archivo | Descripción |
|---|---|
| `20260313000001` | Nuevas columnas en `plans` |
| `20260313000002` | Crea tabla `plan_prices` |
| `20260313000003` | Crea tabla `subscriptions` |
| `20260313000004` | Inserta los 3 planes base (exam_essentials, aptis_pro, pro_max) con sus 9 precios |
| `20260313000005` | Inserta accesos (`access`) para los 3 planes nuevos |
| `20260313000006` | Archiva planes legacy (`available=false`) |
| `20260313000007` | Backfill de `code` en planes legacy |
| `20260313000008` | Inserta plan IELTS Pro con sus 3 precios y accesos |
# Arquitectura de Suscripciones y Ciclos de Facturación

## Visión general

La nueva arquitectura reemplaza el flujo de **pago único → paquete** por un sistema de **suscripciones** con ciclos de facturación recurrentes. Los paquetes legacy se mantienen intactos para retrocompatibilidad con las compuertas de acceso existentes.

---

## Tablas involucradas

```
plans
  └── plan_prices   (1:N — precios por ciclo/moneda)
  └── access        (1:N — features habilitadas)
  └── packages      (legacy, retrocompat)

subscriptions
  ├── → plans        (plan contratado)
  ├── → plan_prices  (precio y ciclo elegido)
  └── → users

packages             (espejo automático por cada subscription)
```

### `plans` — cambios nuevos

| Columna | Tipo | Descripción |
|---|---|---|
| `code` | `VARCHAR(50) UNIQUE` | Slug estable del plan (e.g. `aptis_pro`) |
| `includes_course` | `BOOLEAN` | Si el plan incluye acceso a cursos |
| `included_exams` | `INT NULL` | Número de exámenes incluidos (`NULL` = ilimitado) |
| `included_speaking_reviews` | `INT` | Reviews de speaking incluidas |
| `included_writing_reviews` | `INT` | Reviews de writing incluidas |
| `sort_order` | `INT` | Orden de presentación en el frontend |

### `plan_prices`

| Columna | Tipo | Descripción |
|---|---|---|
| `plan_id` | FK → plans | Plan al que pertenece |
| `billing_cycle` | `ENUM(monthly, quarterly, yearly)` | Ciclo de facturación |
| `currency` | `CHAR(3)` | Moneda (default `EUR`) |
| `base_price` | `INT` | Precio base en centavos |
| `discount_percentage` | `DECIMAL(5,2)` | Descuento aplicado |
| `final_price` | `INT` | Precio final en centavos |
| `active` | `BOOLEAN` | Si este precio está activo |

Clave única: `(plan_id, billing_cycle, currency)`.

### `subscriptions`

| Columna | Tipo | Descripción |
|---|---|---|
| `user_id` | FK → users | Usuario suscrito |
| `plan_id` | FK → plans | Plan contratado |
| `plan_price_id` | FK → plan_prices | Precio y ciclo elegido |
| `status` | `ENUM(active, canceled, expired, past_due)` | Estado actual |
| `billing_cycle` | `ENUM(monthly, quarterly, yearly)` | Ciclo de facturación |
| `started_at` | `TIMESTAMP` | Inicio de la suscripción |
| `current_period_start` | `TIMESTAMP` | Inicio del período actual |
| `current_period_end` | `TIMESTAMP` | Fin del período actual |
| `cancel_at_period_end` | `BOOLEAN` | Cancelar al término del período |
| `canceled_at` | `TIMESTAMP NULL` | Fecha de cancelación efectiva |
| `stripe_charge_id` | `VARCHAR` | ID del PaymentIntent de Stripe |
| `stripe_customer_id` | `VARCHAR` | ID del Customer en Stripe |
| `payment_method_id` | `VARCHAR` | Método de pago usado |
| `idempotency_key` | `VARCHAR UNIQUE` | Evita suscripciones duplicadas |

Índices: `(user_id, status)`, `(current_period_end, status)`.

---

## Planes actuales

| Código | Nombre | Precio mensual | Trimestral (-10%) | Anual (-35%) | Features |
|---|---|---|---|---|---|
| `exam_essentials` | Exam Essentials | €12.00 | €32.40 | €93.60 | EXAMS |
| `aptis_pro` | Aptis Pro | €22.00 | €59.40 | €171.60 | EXAMS, COURSES, EVALUATIONS |
| `ielts_pro` | IELTS Pro | €22.00 | €59.40 | €171.60 | EXAMS, COURSES, EVALUATIONS |
| `pro_max` | Pro Max | €39.00 | €105.30 | €304.20 | EXAMS, COURSES, EVALUATIONS |

> Precios almacenados en centavos. Descuentos aplicados sobre precio mensual × número de meses.

---

## Lifecycle de una suscripción

```
                   ┌─────────────────────────────────────┐
                   │           POST /subscriptions        │
                   │  { planPriceId, paymentMethodId,     │
                   │    idempotencyKey }                   │
                   └────────────────┬────────────────────┘
                                    │
                    1. Idempotency check
                    (¿ya existe idempotency_key?)
                           │ NO
                    2. Obtener PlanPrice + Plan
                    3. Obtener/crear Stripe Customer
                    4. Crear PaymentIntent (Stripe)
                           │
                    5. Transacción DB:
                       a. INSERT subscriptions (status=active)
                       b. INSERT packages (espejo, isActive=true)
                           │
                    6. Respuesta al cliente
                           │
                           ▼
                    ┌─────────────┐
                    │   active    │◄──────── payment_intent.succeeded
                    └──────┬──────┘          (webhook activa past_due)
                           │
          ┌────────────────┼────────────────┐
          │                │                │
   cancel_at_period_end   expira        cancelación
   = true (soft cancel)   (cron/webhook)  inmediata
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐    ┌──────────┐    ┌──────────────┐
    │  active   │    │ expired  │    │  canceled    │
    │(hasta end)│    └──────────┘    └──────────────┘
    └──────────┘
```

### Estados y transiciones

| Estado | Descripción | Cómo se llega |
|---|---|---|
| `active` | Suscripción vigente | Creación exitosa / webhook `payment_intent.succeeded` |
| `past_due` | Pago pendiente de confirmación | Requiere acción 3DS (reservado para futuro) |
| `canceled` | Cancelada por el usuario | `DELETE /subscriptions/:id` (inmediato o `cancel_at_period_end`) |
| `expired` | Período terminado sin renovación | Cron cada 12h / webhook |

---

## Ciclos de facturación y períodos

| Ciclo | Duración período | Descuento |
|---|---|---|
| `monthly` | 1 mes (30 días en packages mirror) | 0% |
| `quarterly` | 3 meses (90 días) | 10% |
| `yearly` | 12 meses (365 días) | 35% |

---

## Endpoints HTTP

### Subscriptions (`/subscriptions`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/subscriptions` | Usuario | Lista suscripciones activas del usuario |
| `POST` | `/subscriptions` | Usuario | Crea suscripción + cobra via Stripe |
| `DELETE` | `/subscriptions/:id` | Usuario | Cancela suscripción (inmediato o al fin del período) |

#### `POST /subscriptions` — body

```json
{
  "planPriceId": 2,
  "paymentMethodId": "pm_xxx",
  "stripeToken": "tok_xxx",
  "idempotencyKey": "user-123-planprice-2-1741824000"
}
```

#### `DELETE /subscriptions/:id` — body

```json
{
  "immediately": false
}
```

- `immediately: false` → marca `cancel_at_period_end = true`, acceso hasta fin del período
- `immediately: true` → cancela ahora, desactiva el paquete espejo

### Plans (`/plans`)

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/plans/catalog` | Planes nuevos con todos sus precios por ciclo |

---

## Webhook Stripe

El handler de `payment_intent.succeeded` llama a `SubscriptionsService.activateByChargeId(intentId)` para marcar como `active` las suscripciones en estado `past_due`.

Los eventos se deduplican usando la tabla `stripe_events` (`event_id` como PK).

---

## Cron tasks

| Tarea | Frecuencia | Acción |
|---|---|---|
| `SubscriptionsTasks.expireOverdue` | cada 12h | Marca `expired` las suscripciones cuyo `current_period_end <= NOW()` y desactiva sus paquetes espejo |

---

## Retrocompatibilidad con packages

Cada vez que se crea una suscripción nueva, se inserta automáticamente una fila en `packages` con:
- `isActive = true`
- `expirationDate` calculado según el ciclo (30/90/365 días)
- `stripeChargeId` del PaymentIntent (usado como FK entre ambas tablas)

Al expirar o cancelar una suscripción, el paquete espejo se desactiva (`isActive = false`). Los paquetes legacy de usuarios anteriores **no se tocan**.

---

## Planes legacy

Los planes anteriores al rediseño (`Silver`, `Gold`, `Platinum`, etc.) se marcaron con `available = false` y se les asignó un `code` prefix `legacy_*`. No se han borrado — todos los `packages` existentes mantienen su `planId` válido.

```
legacy_silver, legacy_gold, legacy_green, legacy_master, legacy_grandmaster,
legacy_ruby, legacy_aptis, legacy_blue, legacy_diamond, legacy_platinum,
legacy_go, legacy_ielts
```

---

## Migraciones ejecutadas

| Archivo | Descripción |
|---|---|
| `20260313000001` | Nuevas columnas en `plans` |
| `20260313000002` | Crea tabla `plan_prices` |
| `20260313000003` | Crea tabla `subscriptions` |
| `20260313000004` | Inserta los 3 planes base (exam_essentials, aptis_pro, pro_max) con sus 9 precios |
| `20260313000005` | Inserta accesos (`access`) para los 3 planes nuevos |
| `20260313000006` | Archiva planes legacy (`available=false`) |
| `20260313000007` | Backfill de `code` en planes legacy |
| `20260313000008` | Inserta plan IELTS Pro con sus 3 precios y accesos |
