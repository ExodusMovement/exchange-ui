import { useCallback, useEffect, useMemo, useRef } from 'react'
import cleanInput from '@exodus/clean-input'
import assets from '@exodus/assets'
import useSetState from './exodus-core-hooks/use-set-state'

import useExchangeAmounts from './use-exchange-amounts'
import { getFixedNoDecimalAssetAmount } from './use-fix-no-decimal-asset'
import useToggleFiatMode from './use-toggle-fiat-mode'
import useSelectFromAsset from './use-select-from-asset'
import useSelectToAsset from './use-select-to-asset'
import useInputFocus from './exodus-core-hooks/use-input-focus'

const initialState = {
  fiatMode: false,
  flipped: false,
  btn: null,
  manualAmount: '',
  side: 'from',
  needsDecimalFix: false,
}

const useExchange = ({
  maxAmount,
  minAmount,
  fromAssetName,
  toAssetName,
  fiat,
  exchangeConversion,
  getFiatConversion,
  onPairChange,
  initialFromInputFocused,
  initialToInputFocused,
  noDecimalAssetNames,
  formatAssetAmount,
}) => {
  const [state, updateState] = useSetState(initialState)
  const fromInputRef = useRef()
  const toInputRef = useRef()
  const noDecimalFixTimeoutRef = useRef()
  const { fiatMode, flipped, btn, manualAmount, side, needsDecimalFix } = state

  const resetState = useCallback(() => updateState(initialState), [updateState])

  const { amounts, formattedAmounts } = useExchangeAmounts({
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
  })
  const {
    fromAmount: formattedFromAmount,
    fromAmountFiat: formattedFromAmountFiat,
    toAmount: formattedToAmount,
    toAmountFiat: formattedToAmountFiat,
  } = formattedAmounts

  const handleFlip = useCallback(() => {
    const newPair = {
      fromAssetName: toAssetName,
      fromAmount: assets[toAssetName].currency.ZERO,
      toAssetName: fromAssetName,
      toAmount: assets[fromAssetName].currency.ZERO,
    }

    onPairChange(newPair)

    updateState({
      ...initialState,
      fiatMode,
      flipped: !state.flipped,
      btn: null,
    })
  }, [toAssetName, fromAssetName, onPairChange, updateState, fiatMode, state.flipped])
  const setBtn = useCallback(
    (btn) => updateState({ btn, fiatMode: false, side: 'from', manualAmount: '' }),
    [updateState]
  )

  const _fromInputProps = useInputFocus({ initialState: initialFromInputFocused })
  const _toInputProps = useInputFocus({ initialState: initialToInputFocused })

  const fixNoDecimalAssets = useCallback(() => {
    /**
     * isNoDecimaSideActive
     * - input NEO in crypto: NEO
     * - input NEO in fiat: USD -> NEO -> NEW_USD
     *
     * !isNoDecimaSideActive
     * - input OTHER in crypto: OTHER -> NEO -> NEW_OTHER
     * - input OTHER in fiat: USD -> OTHER -> NEO -> NEW_OTHER -> NEW_USD
     */

    const newManualAmount = getFixedNoDecimalAssetAmount({
      amounts,
      getFiatConversion,
      exchangeConversion,
      fromAsset: fromAssetName,
      toAsset: toAssetName,
      side,
      fiatMode,
      noDecimalAssetNames,
    })

    // Skip update when newManualAmount is zero, e.g. 1USD -> 0NEO -> 0USD
    if (newManualAmount === '0') return
    if (newManualAmount === manualAmount) return

    updateState({ manualAmount: newManualAmount, needsDecimalFix: false })
  }, [
    amounts,
    exchangeConversion,
    fiatMode,
    fromAssetName,
    getFiatConversion,
    manualAmount,
    noDecimalAssetNames,
    side,
    toAssetName,
    updateState,
  ])

  const handleNoDecimalAssets = useCallback(
    (manualAmount, { needsTimeout = false } = {}) => {
      if (!manualAmount) return
      if (
        !(noDecimalAssetNames.includes(fromAssetName) || noDecimalAssetNames.includes(toAssetName))
      )
        return

      // always clearTimeout. For example the blur event needs it
      clearTimeout(noDecimalFixTimeoutRef.current)
      const setNeedsDecimalFix = () => updateState({ needsDecimalFix: true })
      if (needsTimeout) {
        noDecimalFixTimeoutRef.current = setTimeout(setNeedsDecimalFix, 800)
      } else {
        setNeedsDecimalFix()
      }
    },
    [fromAssetName, noDecimalAssetNames, toAssetName, updateState]
  )

  const handleChangeValue = useCallback(
    ({ value, side, assetName }) => {
      try {
        let decimals = null
        if (!fiatMode) {
          const assetFull = assets[assetName]
          decimals = assetFull.currency.defaultUnit.power
        }
        const cleaned = cleanInput(value, decimals)
        updateState({
          side,
          manualAmount: cleaned,
          btn: null,
        })
        handleNoDecimalAssets(cleaned, { needsTimeout: true })
      } catch (err) {
        console.warn('error during typing in input', { err, value, side, assetName })
      }
    },
    [fiatMode, handleNoDecimalAssets, updateState]
  )
  const handleChangeFromInput = useCallback(
    (value) => handleChangeValue({ value, assetName: fromAssetName, side: 'from' }),
    [fromAssetName, handleChangeValue]
  )
  const handleChangeToInput = useCallback(
    (value) => handleChangeValue({ value, assetName: toAssetName, side: 'to' }),
    [handleChangeValue, toAssetName]
  )

  const fromInputProps = {
    ..._fromInputProps,
    onChange: handleChangeFromInput,
    inputRef: fromInputRef,
  }
  const toInputProps = {
    ..._toInputProps,
    onChange: handleChangeToInput,
    inputRef: toInputRef,
  }

  useEffect(() => {
    return () => {
      clearTimeout(noDecimalFixTimeoutRef.current)
    }
  })

  useEffect(() => {
    if (needsDecimalFix) {
      fixNoDecimalAssets()
    }
  }, [fixNoDecimalAssets, needsDecimalFix])
  const getStateAfterToggleFiatMode = useToggleFiatMode({
    btn,
    manualAmount,
    side,
    fiatMode,
    amounts,
  })

  const toggleFiatMode = useCallback(() => {
    const changes = getStateAfterToggleFiatMode()
    updateState(changes)
  }, [getStateAfterToggleFiatMode, updateState])

  const selectFromAsset = useSelectFromAsset({
    toAssetName,
    handleSwap: handleFlip,
    handleChangePair: onPairChange,
  })
  const selectToAsset = useSelectToAsset({
    fromAssetName,
    handleSwap: handleFlip,
    handleChangePair: onPairChange,
  })

  return useMemo(
    () => ({
      amounts,
      formattedToAmountFiat,
      formattedFromAmount,
      formattedFromAmountFiat,
      formattedToAmount,
      fiatMode,
      fromInputProps,
      toInputProps,
      flipped,
      btn,
      manualAmount,
      side,
      resetState,
      setBtn,
      handleFlip,
      toggleFiatMode,
      selectFromAsset,
      selectToAsset,
    }),
    [
      amounts,
      btn,
      fiatMode,
      flipped,
      formattedFromAmount,
      formattedFromAmountFiat,
      formattedToAmount,
      formattedToAmountFiat,
      fromInputProps,
      handleFlip,
      manualAmount,
      resetState,
      selectFromAsset,
      selectToAsset,
      setBtn,
      side,
      toInputProps,
      toggleFiatMode,
    ]
  )
}

export default useExchange
