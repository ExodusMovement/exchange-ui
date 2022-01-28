import assets from '@exodus/assets'
import { useMemo } from 'react'
import useFormattedExchangeAmounts from './use-formatted-exchange-amounts'
import useMemoCompare from './use-memo-compare'
import { isEqual } from 'lodash'

export const calculateAmounts = ({
  maxAmount,
  minAmount,
  fromAssetName,
  toAssetName,
  fiat,
  exchangeConversion,
  getFiatConversion,
  manualAmount,
  btn,
  side,
  fiatMode,
  noDecimalAssetNames,
}) => {
  // NOTE: memoize this if performance is an issue

  let fromAmount
  let fromAmountFiat
  let toAmount
  let toAmountFiat

  switch (btn) {
    case 'all':
    case 'max':
      fromAmount = maxAmount
      break

    case 'half':
      fromAmount = maxAmount.mul(0.5).toFixed(8)
      break

    case 'min':
      fromAmount = minAmount
      break

    default:
      try {
        if (manualAmount) {
          if (side === 'from') {
            if (fiatMode) {
              fromAmountFiat = fiat.defaultUnit(manualAmount)
            } else {
              fromAmount = assets[fromAssetName].currency.defaultUnit(manualAmount)
            }
          } else {
            if (fiatMode) {
              toAmountFiat = fiat.defaultUnit(manualAmount)
            } else {
              toAmount = assets[toAssetName].currency.defaultUnit(manualAmount)
            }
          }
        }
      } catch (e) {
        console.warn('error while during calculating exchange amounts', e)
      }
  }

  if (!!btn && noDecimalAssetNames.includes(toAssetName)) {
    let nonDecimalAmount = exchangeConversion(fromAmount)
    if (btn === 'min') {
      nonDecimalAmount = nonDecimalAmount.add(assets[toAssetName].currency.defaultUnit(1))
    }
    fromAmount = exchangeConversion(nonDecimalAmount)
  }

  if (fiatMode) {
    if (fromAmountFiat) {
      fromAmount = getFiatConversion(fromAssetName)(fromAmountFiat)
      toAmount = exchangeConversion(fromAmount)
      toAmountFiat = getFiatConversion(toAssetName)(toAmount)
    } else if (toAmountFiat) {
      toAmount = getFiatConversion(toAssetName)(toAmountFiat)
      fromAmount = exchangeConversion(toAmount)
      fromAmountFiat = getFiatConversion(fromAssetName)(fromAmount)
    }
  } else {
    if (fromAmount) {
      fromAmountFiat = getFiatConversion(fromAssetName)(fromAmount)
      toAmount = exchangeConversion(fromAmount)
      toAmountFiat = getFiatConversion(toAssetName)(toAmount)
    } else if (toAmount) {
      fromAmount = exchangeConversion(toAmount)
      fromAmountFiat = getFiatConversion(fromAssetName)(fromAmount)
      toAmountFiat = getFiatConversion(toAssetName)(toAmount)
    }
  }

  return {
    fromAmount: fromAmount || assets[fromAssetName].currency.ZERO,
    toAmount: toAmount || assets[toAssetName].currency.ZERO,
    fromAmountFiat: fromAmountFiat || fiat.ZERO,
    toAmountFiat: toAmountFiat || fiat.ZERO,
  }
}

const useExchangeAmounts = ({
  maxAmount,
  minAmount,
  fromAssetName,
  toAssetName,
  fiat,
  exchangeConversion,
  getFiatConversion,
  manualAmount,
  btn,
  side,
  fiatMode,
  noDecimalAssetNames,
  formatAssetAmount,
}) => {
  const _amounts = useMemo(
    () =>
      calculateAmounts({
        maxAmount,
        minAmount,
        fromAssetName,
        toAssetName,
        fiat,
        exchangeConversion,
        getFiatConversion,
        manualAmount,
        btn,
        side,
        fiatMode,
        noDecimalAssetNames,
      }),
    [
      maxAmount,
      minAmount,
      fromAssetName,
      toAssetName,
      fiat,
      exchangeConversion,
      getFiatConversion,
      manualAmount,
      btn,
      side,
      fiatMode,
      noDecimalAssetNames,
    ]
  )

  const amounts = useMemoCompare(_amounts, isEqual)

  const formattedAmounts = useFormattedExchangeAmounts({
    ...amounts,
    btn,
    manualAmount,
    side,
    fiatMode,
    formatAssetAmount,
  })

  return useMemo(
    () => ({
      amounts,
      formattedAmounts,
    }),
    [amounts, formattedAmounts]
  )
}

export default useExchangeAmounts
