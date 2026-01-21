export const useMobileMenu = () => {
  const mobileMenuOpen = useState<boolean>('mobileMenu.open', () => false)

  const openMenu = () => {
    mobileMenuOpen.value = true
  }

  const closeMenu = () => {
    mobileMenuOpen.value = false
  }

  const toggleMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value
  }

  return {
    mobileMenuOpen,
    openMenu,
    closeMenu,
    toggleMenu,
  }
}
