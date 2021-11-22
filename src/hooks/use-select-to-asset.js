import { useCallback } from 'react'
import assets from '@exodus/assets'

const useSelectToAsset = ({ fromAssetName, handleSwap, handleChangePair }) =>
  useCallback(
    (assetName) => {
      if (assetName === fromAssetName) return handleSwap()
      return handleChangePair({
        toAssetName: assetName,
        fromAssetName,
        fromAssetAmount: assets[fromAssetName].currency.ZERO,
        toAssetAmount: assets[assetName].currency.ZERO,
      })
    },
    [fromAssetName, handleSwap, handleChangePair]
  )

export default useSelectToAsset
