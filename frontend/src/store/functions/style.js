export function toggleSidenav(state) {
  return {
    ...state,
    footer: {
      ...state.footer,
      isOpen: !state.footer.isOpen
    }
  }
}

export function toggleNavbar (state) {
  return {
    ...state,
    navbar: {
      ...state.navbar,
      isOpen: !state.navbar.isOpen
    }
  }
}

export function switchDarkMode (state) {
  return {
    ...state,
    darkMode: {
      isActive: !state.darkMode.isActive
    }
  }
}