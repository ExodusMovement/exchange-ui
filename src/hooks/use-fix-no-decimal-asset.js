export const getFixedNoDecimalAssetAmount = ({
  amounts,
  getFiatConversion,
  exchangeConversion,
  fromAsset,
  toAsset,
  side,
  fiatMode,
  noDecimalAssetNames,
}) => {
  const otherSide = side === 'from' ? 'to' : 'from'
  const inputAsset = side === 'from' ? fromAsset : toAsset
  const isNoDecimaSideActive = noDecimalAssetNames.includes(inputAsset)
  const noDecimalSide = isNoDecimaSideActive ? side : otherSide
  const noDecimalSideAmount = amounts[`${noDecimalSide}Amount`]

  // Type something and click flip button immediately, it resets manualAmount to ''
  if (noDecimalSideAmount.isZero) return

  let newManualAmount, newAmountFiat, newAmount
  if (isNoDecimaSideActive) {
    if (fiatMode) {
      newAmountFiat = getFiatConversion(inputAsset)(noDecimalSideAmount)
      newManualAmount = newAmountFiat.toFixed(2, 'ceil').toDefaultString()
    } else {
    }
  } else {
    newAmount = exchangeConversion(noDecimalSideAmount)
    if (fiatMode) {
      newAmountFiat = getFiatConversion(inputAsset)(newAmount)
      newManualAmount = newAmountFiat.toFixed(2, 'ceil').toDefaultString()
    } else {
      newManualAmount = newAmount.toDefaultString()
    }
  }

  return newManualAmount
}
