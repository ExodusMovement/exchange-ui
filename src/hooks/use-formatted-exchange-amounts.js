import { useMemo } from 'react'

export const formatExchangeAmounts = ({
  fromAmount,
  toAmount,
  fromAmountFiat,
  toAmountFiat,
  btn,
  manualAmount,
  side,
  fiatMode,
  formatAssetAmount,
}) => {
  fromAmount = fromAmount.isZero ? '' : formatAssetAmount(fromAmount)
  toAmount = toAmount.isZero ? '' : formatAssetAmount(toAmount)
  fromAmountFiat = fromAmountFiat.isZero ? '' : fromAmountFiat.toFixed(2, 'ceil').toDefaultString()
  toAmountFiat = toAmountFiat.isZero ? '' : toAmountFiat.toFixed(2, 'ceil').toDefaultString()

  if (manualAmount && !btn) {
    if (side === 'from') {
      if (fiatMode) {
        fromAmountFiat = manualAmount
      } else {
        fromAmount = manualAmount
      }
    } else {
      if (fiatMode) {
        toAmountFiat = manualAmount
      } else {
        toAmount = manualAmount
      }
    }
  }

  return {
    fromAmount,
    fromAmountFiat,
    toAmount,
    toAmountFiat,
  }
}

const useFormattedExchangeAmounts = ({
  fromAmount,
  toAmount,
  fromAmountFiat,
  toAmountFiat,
  btn,
  manualAmount,
  side,
  fiatMode,
  formatAssetAmount,
}) => {
  return useMemo(
    () =>
      formatExchangeAmounts({
        fromAmount,
        toAmount,
        fromAmountFiat,
        toAmountFiat,
        btn,
        manualAmount,
        side,
        fiatMode,
        formatAssetAmount,
      }),
    [
      fromAmount,
      toAmount,
      fromAmountFiat,
      toAmountFiat,
      btn,
      manualAmount,
      side,
      fiatMode,
      formatAssetAmount,
    ]
  )
}

export default useFormattedExchangeAmounts
