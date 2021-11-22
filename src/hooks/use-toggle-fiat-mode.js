import { useCallback } from 'react'

export const getStateAfterFiatToggle = ({ btn, manualAmount, side, fiatMode, amounts }) => {
  const changes = {
    fiatMode: !fiatMode,
    btn: null,
  }
  try {
    if (btn) {
      const fromAmountFiat = ['all', 'max'].includes(btn)
        ? amounts.fromAmountFiat.toFixed(2, 'floor')
        : amounts.fromAmountFiat.toFixed(2, 'ceil')
      changes.manualAmount = fromAmountFiat.toDefaultString()
    } else if (manualAmount) {
      if (side === 'from') {
        changes.manualAmount = (changes.fiatMode
          ? amounts.fromAmountFiat.toFixed(2, 'ceil')
          : amounts.fromAmount.toFixed(8, 'ceil')
        ).toDefaultString()
      } else {
        changes.manualAmount = (changes.fiatMode
          ? amounts.toAmountFiat.toFixed(2, 'ceil')
          : amounts.toAmount.toFixed(8, 'ceil')
        ).toDefaultString()
      }
    }
  } catch (err) {
    console.warn('error during set amounts after fiat toggle', err)
  } // catch when amounts aren't set and ignore it

  return changes
}

const useToggleFiatMode = ({ btn, manualAmount, side, fiatMode, amounts }) =>
  useCallback(() => getStateAfterFiatToggle({ btn, manualAmount, side, fiatMode, amounts }), [
    amounts,
    btn,
    fiatMode,
    manualAmount,
    side,
  ])

export default useToggleFiatMode
