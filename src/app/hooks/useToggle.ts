import { useCallback, useState } from 'react'

/**
 *
 * @param {boolean} defaultState - accept a `boolean` to set as default state, will be ignore after initial render (same as `React.useState`)
 * @returns
 */
export function useToggle(defaultState?: boolean) {
  const [open, setOpen] = useState(defaultState ?? false)

  const toggle = useCallback(() => {
    setOpen(prevState => !prevState)
  }, [])
  const toggleOpen = useCallback(() => {
    setOpen(true)
  }, [])
  const toggleClose = useCallback(() => {
    setOpen(false)
  }, [])

  return { open, toggle, toggleOpen, toggleClose }
}
