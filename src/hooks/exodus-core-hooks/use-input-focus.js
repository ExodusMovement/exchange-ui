import { useCallback, useMemo, useState } from 'react'

const useInputFocus = ({ initialState } = {}) => {
  const [focused, setFocused] = useState(initialState || false)
  const onFocus = useCallback((e) => {
    setFocused(true)
  }, [])
  const onBlur = useCallback((e) => {
    setFocused(false)
  }, [])

  return useMemo(
    () => ({
      onBlur,
      onFocus,
      focused,
      setFocused,
    }),
    [focused, onBlur, onFocus]
  )
}

export default useInputFocus
