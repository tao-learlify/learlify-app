export const settingsES = {
  cancel: 'Cancelar',
  change: 'Cambiar examen',
  confirm: 'Confirmar:',
  edit: 'Editar',
  email: 'Correo',
  error: 'Hubo un error intentando actualizar',
  lastName: 'Apellido',
  model: 'Modelo',
  name: 'Nombre',
  password: 'Actualizar Contraseña',
  save: 'Guardar',
  title: 'Cuenta y Suscripción',
  update: 'Información Actualizada',
  validations: {
    mustMatch: 'Las contraseñas no coinciden',
    lengthRequired: 'La contraseña debe tener entre 8 y 16 caracteres'
  },
  SUBSCRIPTION: {
    title: 'Membresía',
    planLabel: 'Plan',
    billingCycleLabel: 'Ciclo de facturación',
    renewalLabel: 'Próxima renovación',
    discountLabel: 'Descuento activo',
    changePlan: 'Cambiar de plan',
    cancelSubscription: 'Cancelar suscripción',
    noRenewal: 'Sin renovación automática',
    cancelAtPeriodEndMessage:
      'Tu suscripción finalizará el {{date}} y no se renovará.',
    perMonth: ' / mes',
    STATUS: {
      active: 'Activo',
      canceled: 'Cancelado',
      past_due: 'Pago pendiente',
      expired: 'Expirado',
      trialing: 'Período de prueba',
      cancel_at_period_end: 'Cancela al vencer'
    },
    BILLING_CYCLE: {
      monthly: 'Mensual',
      quarterly: 'Trimestral',
      yearly: 'Anual'
    },
    cancelModal: {
      title: '¿Cancelar suscripción?',
      body: 'Seguirás teniendo acceso hasta el {{date}}. Después no se realizará ningún cobro.',
      confirm: 'Sí, cancelar',
      dismiss: 'No, continuar',
      canceling: 'Cancelando...'
    }
  },
  PAYMENT_METHOD: {
    title: 'Métodos de Pago',
    sectionDescription:
      'Los pagos de tu suscripción son seguros y fáciles de gestionar.',
    cardLabel: 'Tarjeta',
    expiryLabel: 'Vence',
    defaultBadge: 'Principal',
    update: 'Actualizar método de pago',
    noCard: 'No tienes un método de pago registrado.',
    // Añadir tarjeta
    addCard: 'Añadir método de pago',
    addCardTitle: 'Añadir una nueva tarjeta',
    addCardDescription:
      'Los datos de tu tarjeta son cifrados y procesados de forma segura por Stripe.',
    nameOnCard: 'Nombre en la tarjeta',
    nameOnCardPlaceholder: 'Nombre completo',
    cardDetails: 'Datos de la tarjeta',
    addCardSubmit: 'Guardar tarjeta',
    addCardCancel: 'Cancelar',
    addCardAdding: 'Guardando...',
    addCardSuccess: '¡Listo! Tarjeta guardada correctamente.',
    // Eliminar
    removeTitle: '¿Eliminar esta tarjeta?',
    removeBody:
      'Esta tarjeta será eliminada de tu cuenta. Asegúrate de tener otro método de pago si lo necesitas para mantener tu suscripción activa.',
    removeConfirm: 'Sí, eliminar',
    removeDismiss: 'Mantenerla',
    removeRemoving: 'Eliminando...',
    // Confianza
    trust1: 'Cifrado SSL',
    trust2: 'Cumple PCI',
    trust3: 'Protegido por Stripe',
    // Validación
    validNameRequired: 'Por favor, introduce el nombre de la tarjeta',
    // Estado vacío
    emptyTitle: 'Sin tarjetas aún',
    emptyDescription:
      'Añade tu primer método de pago para mantener tu aprendizaje sin interrupciones.',
    emptyAdd: 'Añadir tarjeta',
    // Acciones
    actionEdit: 'Actualizar',
    actionRemove: 'Eliminar'
  },
  PROFILE: {
    title: 'Perfil',
    editInfo: 'Editar información'
  },
  SECURITY: {
    title: 'Seguridad',
    newLabel: 'Nueva contraseña',
    confirmLabel: 'Confirmar nueva contraseña',
    updateButton: 'Actualizar contraseña'
  },
  BILLING_HISTORY: {
    title: 'Historial de Facturación',
    date: 'Fecha',
    amount: 'Importe',
    status: 'Estado',
    receipt: 'Recibo',
    download: 'Descargar',
    empty: 'Aún no tienes facturas registradas.',
    STATUS: {
      paid: 'Pagado',
      open: 'Pendiente',
      void: 'Anulado',
      uncollectible: 'No cobrable'
    }
  },
  EMPTY_MEMBERSHIP: {
    title: 'Sin suscripción activa',
    description: 'Elige un plan y empieza a preparar el Aptis hoy mismo.',
    cta: 'Ver planes'
  },
  LEGACY: {
    title: 'Acceso por paquete anterior',
    description:
      'Tu acceso actual proviene de un paquete anterior. Los nuevos planes de suscripción ofrecen más funciones y ciclos de facturación flexibles.',
    cta: 'Ver nuevos planes'
  }
}
