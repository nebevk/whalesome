export const useTheme = () => {
  const theme = useState<'classic' | 'spirit'>('theme', () => 'classic')

  const setTheme = (newTheme: 'classic' | 'spirit') => {
    theme.value = newTheme
    if (process.client) {
      document.documentElement.setAttribute('data-theme', newTheme)
      localStorage.setItem('whalesome-theme', newTheme)
    }
  }

  const toggleTheme = () => {
    setTheme(theme.value === 'classic' ? 'spirit' : 'classic')
  }

  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('whalesome-theme') as 'classic' | 'spirit' | null
      if (savedTheme) {
        setTheme(savedTheme)
      } else {
        document.documentElement.setAttribute('data-theme', theme.value)
      }
    }
  }

  return {
    theme: readonly(theme),
    setTheme,
    toggleTheme,
    initTheme,
  }
}
