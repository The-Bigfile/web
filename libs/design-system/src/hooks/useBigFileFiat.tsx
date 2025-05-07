import { CurrencyOption, useAppSettings } from '@siafoundation/react-core'
import { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { useExternalExchangeRate } from './useExternalExchangeRate'

type Props = {
  big?: BigNumber
}

export function useBigFileFiat({ big }: Props):
  | {
      fiat: BigNumber
      currency: CurrencyOption
    }
  | Record<string, never> {
  const { settings } = useAppSettings()
  const exchangeRate = useExternalExchangeRate({
    currency: settings.currency.id,
  })
  const fiat = useMemo(
    () => new BigNumber(big || 0).times(exchangeRate.rate || 1),
    [big, exchangeRate]
  )

  if (!big || !exchangeRate.rate || exchangeRate.rate.isZero()) {
    return {}
  }

  return {
    fiat,
    currency: settings.currency,
  }
}
