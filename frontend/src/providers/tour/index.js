  import { mapSelector } from './selector'

  export const authenticationTourProvider = mapSelector([
    "Acceso rápido sin cuenta. ¡Empieza a practicar!",
    'Accede con tu cuenta de Gmail, es lo más rápido. ¡Comienza a practicar!',
    'Rellena este sencillo formulario para poder darte de alta en la App y empezar a practicar',
    'Presiona el botón de ingresar para acceder a la aplicación'
  ])
  
  export const dashboardTourProvider = mapSelector([
    '¡Bienvenido a AptisGo! Para comenzar a practicar los exámenes solo tienes que acceder aquí y seleccionar la competencia que prefieras',
    'Está es la sección principal, la casita, podrás acceder a los exámenes, evaluaciones y estadísticas',
    'Aquí encontrarás el curso interactivo, un curso completo de Aptis con todo el temario incluido. Es autocorregible y divertido',
    'Aquí encontrarás los paquetes que más se ajusten a lo que quieres practicar. Nos adaptamos a ti.',
    'Aquí podrás reservar una clase particular con un profesor nativo experto en exámenes, online y cuando te venga bien. No olvides echarle un vistazo!',
    'Aquí podrás cambiar tu correo o contraseña, contactarnos por WhatsApp, canjear/enviar regalos y cerrar sesión',
    'En esta sección encontrarás las últimas novedades sobre la aplicación',
    'Aquí podrás ver las evaluaciones de Speakings/Writings de tu profesor',
    'En esta sección podrás ver tus estadísticas sobre tu desempeño en la aplicación',
    'En esta sección podrás ver tus estadísticas sobre tu desempeño por categoría',
    'No olvides que la practica hace al maestro. ¡Buena suerte!'
  ])
  
  export const classesTourProvider = mapSelector([
    'Aquí podrás revisar el horario de una clase que ya has reservado. ¡Si está vacío no te alarmes!',
    'Entra aquí para revisar si hay algún horario que te venga bien. ¡Sin compromiso!'
  ])