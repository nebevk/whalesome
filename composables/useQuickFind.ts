/**
 * Open state for the site-wide quick find dialog (components/QuickFind.vue,
 * mounted once by the default layout). The nav button, the "/" and Ctrl/Cmd+K
 * shortcuts, and the 404 page all open the same instance through this.
 */
export function useQuickFind() {
  const isOpen = useState('quickfind:open', () => false)

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, open, close }
}
