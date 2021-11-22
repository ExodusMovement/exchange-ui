import { useCallback } from 'react'
import assets from '@exodus/assets'

const useSelectFromAsset = ({ toAssetName, handleSwap, handleChangePair }) =>
  useCallback(
    (assetName) => {
      if (assetName === toAssetName) return handleSwap()
      return handleChangePair({
        fromAssetName: assetName,
        toAssetName,
        fromAssetAmount: assets[assetName].currency.ZERO,
        toAssetAmount: assets[toAssetName].currency.ZERO,
      })
    },
    [handleChangePair, toAssetName, handleSwap]
  )

export default useSelectFromAsset
