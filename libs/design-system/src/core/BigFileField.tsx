'use client'

import { useAppSettings } from '@siafoundation/react-core'
import { useCallback, useEffect, useMemo, useState } from 'react'
import BigNumber from 'bignumber.js'
import { cx } from 'class-variance-authority'
import { toFixedMaxString } from '../lib/numbers'
import { BaseNumberField } from './BaseNumberField'
import { useExternalActiveExchangeRate } from '../hooks/useExternalExchangeRate'

type Props = Omit<
  React.ComponentProps<typeof BaseNumberField>,
  'onChange' | 'placeholder'
> & {
  big?: BigNumber
  onChange?: (big?: BigNumber) => void
  units?: string
  unitsFiatPostfix?: string
  decimalsLimitSc?: number
  decimalsLimitFiat?: number
  placeholder?: BigNumber
  showFiat?: boolean
  error?: boolean
  changed?: boolean
}

export function BigFileField({
  big: _externalSc,
  placeholder = new BigNumber(100),
  decimalsLimitFiat = 6,
  decimalsLimitSc = 6,
  onChange,
  size = 'medium',
  units = 'BIG',
  unitsFiatPostfix,
  showFiat = true,
  error,
  changed,
  prefix,
  onBlur,
  onFocus,
  name,
  ...props
}: Props) {
  const externalSc = useMemo(
    () => new BigNumber(_externalSc === undefined ? NaN : _externalSc),
    [_externalSc]
  )
  const { settings } = useAppSettings()
  const exchangeRate = useExternalActiveExchangeRate()
  const rate = exchangeRate ? exchangeRate.rate : undefined
  const [active, setActive] = useState<'big' | 'fiat'>()
  const [localSc, setLocalSc] = useState<string>('')
  const [localFiat, setLocalFiat] = useState<string>('')

  const updateExternalSc = useCallback(
    (big: string) => {
      if (onChange) {
        onChange(big && !isNaN(Number(big)) ? new BigNumber(big) : undefined)
      }
    },
    [onChange]
  )

  const updateFiat = useCallback(
    (fiat: BigNumber) => {
      const uf = toFixedMaxString(fiat, decimalsLimitFiat)
      setLocalFiat(uf)
    },
    [setLocalFiat, decimalsLimitFiat]
  )

  const updateSc = useCallback(
    (big: BigNumber) => {
      const usc = toFixedMaxString(big, decimalsLimitSc)
      setLocalSc(usc)
      updateExternalSc(usc)
      return usc
    },
    [setLocalSc, decimalsLimitSc, updateExternalSc]
  )

  const onScChange = useCallback(
    (big: string) => {
      setLocalSc(big)
      if (active) {
        updateExternalSc(big)
      }
    },
    [active, setLocalSc, updateExternalSc]
  )

  const syncFiatToSc = useCallback(
    (big: string) => {
      const fiat = new BigNumber(big).times(rate || 0)
      updateFiat(fiat)
    },
    [updateFiat, rate]
  )

  const syncScToFiat = useCallback(
    (fiat: string) => {
      const big = new BigNumber(fiat).dividedBy(rate || 0)
      updateSc(big)
    },
    [updateSc, rate]
  )

  const [hasInitializedSc, setHasInitializedSc] = useState(false)
  // sync externally controlled value
  useEffect(() => {
    if (!externalSc.isEqualTo(localSc)) {
      const fesc = toFixedMaxString(externalSc, decimalsLimitSc)
      setLocalSc(fesc)
      // sync fiat if its not active, syncing it when it is being changed
      // may change the decimals as the user is typing.
      if (active !== 'fiat') {
        syncFiatToSc(fesc)
      }
    }
    if (!hasInitializedSc) {
      setHasInitializedSc(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSc])

  // initialize fiat once rate has loaded,
  // but only if the bigfile value has initialized
  useEffect(() => {
    if (hasInitializedSc) {
      syncFiatToSc(localSc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rate])

  useEffect(() => {
    if (active === 'big') {
      syncFiatToSc(localSc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSc])

  useEffect(() => {
    if (active === 'fiat') {
      syncScToFiat(localFiat)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localFiat])

  return (
    <div
      className={cx(
        'flex flex-col',
        'focus-within:ring ring-blue-500 dark:ring-blue-200',
        'border',
        props.readOnly
          ? 'bg-gray-200 dark:bg-graydark-300'
          : 'bg-white dark:bg-graydark-50',
        props.readOnly ? 'pointer-events-none' : '',
        error
          ? 'border-red-500 dark:border-red-400'
          : changed
          ? 'border-green-500 dark:border-green-400'
          : 'border-gray-200 dark:border-graydark-200',
        'rounded'
      )}
    >
      <BaseNumberField
        {...props}
        name={name}
        data-testid="scInput"
        size={size}
        variant="ghost"
        focus="none"
        placeholder={toFixedMaxString(placeholder, decimalsLimitSc)}
        units={units}
        value={localSc !== 'NaN' ? localSc : ''}
        decimalScale={decimalsLimitSc}
        allowNegative={false}
        onValueChange={(value) => {
          onScChange(value.value || '')
        }}
        onBlur={(e) => {
          setActive(undefined)
          if (onBlur) {
            onBlur(e)
          }
        }}
        onFocus={(e) => {
          setActive('big')
          if (onFocus) {
            onFocus(e)
          }
        }}
      />
      {showFiat && rate && (
        <BaseNumberField
          {...props}
          data-testid="fiatInput"
          name={`${name}-fiat`}
          size={size}
          variant="ghost"
          focus="none"
          value={localFiat !== 'NaN' ? localFiat : ''}
          units={settings.currency.label + (unitsFiatPostfix || '')}
          decimalScale={decimalsLimitSc}
          allowNegative={false}
          onValueChange={(value) => {
            setLocalFiat(value.value || '')
          }}
          placeholder={`${settings.currency.prefix}${rate
            .times(placeholder)
            .toFixed(decimalsLimitFiat)}`}
          prefix={prefix || settings.currency.prefix}
          onFocus={(e) => {
            setActive('fiat')
            if (onFocus) {
              onFocus(e)
            }
          }}
          onBlur={(e) => {
            setActive(undefined)
            if (onBlur) {
              onBlur(e)
            }
          }}
        />
      )}
    </div>
  )
}
