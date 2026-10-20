import type { Ref } from 'vue'

/**
 * Open state for a click-to-open panel in the site chrome (the mobile menu and
 * the ambience panel). Pair it with DaisyUI's `dropdown-open` / `dropdown-close`
 * classes so the panel follows this state instead of CSS focus-within.
 *
 * The panel closes when the user clicks or tabs away from `root`, presses
 * Escape (focus goes back to `trigger`), or navigates to another page.
 */
export function useDisclosure(root: Ref<HTMLElement | null>, trigger: Ref<HTMLElement | null>) {
  const open = ref(false)
  const route = useRoute()

  function close({ restoreFocus = false } = {}) {
    if (!open.value) return
    open.value = false
    if (restoreFocus) trigger.value?.focus()
  }

  function toggle() {
    open.value = !open.value
  }

  /** Bind to the root element's keydown so Escape only acts from inside it. */
  function onKeydown(e: KeyboardEvent) {
    if (e.key !== 'Escape' || !open.value) return
    e.stopPropagation()
    close({ restoreFocus: true })
  }

  onClickOutside(root, () => close())
  useEventListener(import.meta.client ? document : null, 'focusin', (e: FocusEvent) => {
    if (open.value && root.value && !root.value.contains(e.target as Node)) close()
  })
  watch(() => route.fullPath, () => close())

  return { open, toggle, close, onKeydown }
}
