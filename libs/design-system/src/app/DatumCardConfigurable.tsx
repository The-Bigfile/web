'use client'

import { Option, Select } from '../core/Select'
import { Text } from '../core/Text'
import { DatumCard } from '../components/DatumCard'
import { ValueNum } from '../components/ValueNum'
import { DataLabel } from './DataLabel'
import BigNumber from 'bignumber.js'
import { Tooltip } from '../core/Tooltip'
import useLocalStorageState from 'use-local-storage-state'
import { ValueScFiat } from '../components/ValueScFiat'

type Mode = 'total' | 'average' | 'latest'

type Props = {
  category: string
  label: string
  color?: string
  big?: {
    total: number
    average: number
    latest: number
    diff: number
    change: number
  }
  scFixed?: number
  value?: {
    total: number
    average: number
    latest: number
    diff: number
    change: number
  }
  valueFormat?: (val: number) => string
  extendedSuffix?: string
  defaultMode: Mode
  enabledModes?: Mode[]
  showChange?: boolean
  isLoading: boolean
}

const modeMap = {
  total: 'total',
  average: 'average',
  latest: 'latest',
}

export function DatumCardConfigurable({
  category,
  label,
  color,
  big,
  scFixed = 2,
  value,
  extendedSuffix,
  valueFormat = (val) => val.toFixed(2),
  defaultMode,
  enabledModes = ['total', 'average', 'latest'],
  isLoading,
  showChange = true,
}: Props) {
  const [mode, setMode] = useLocalStorageState<Mode>(
    `v0/datum/${category}/${label}`,
    {
      defaultValue: defaultMode,
    }
  )
  return (
    <DatumCard
      isLoading={isLoading}
      label={<DataLabel label={label} color={color} />}
      actions={
        <Select
          onChange={(e) => setMode(e.currentTarget.value as Mode)}
          defaultValue={mode}
        >
          {enabledModes.map((m) => (
            <Option key={m} value={m}>
              {modeMap[m]}
            </Option>
          ))}
        </Select>
      }
      big={big?.[mode] !== undefined ? new BigNumber(big[mode]) : undefined}
      scFixed={scFixed}
      extendedSuffix={extendedSuffix}
      value={
        value?.[mode] !== undefined && valueFormat
          ? valueFormat(value[mode])
          : undefined
      }
      comment={
        big ? (
          <div className="flex items-center gap-4">
            <ValueScFiat
              tooltip="Net change over time range:"
              fixedTipFiat={10}
              value={new BigNumber(big.diff)}
            />
            {showChange && big.change !== undefined && (
              <Tooltip content="Percent change over time range">
                <Text
                  size="14"
                  weight="semibold"
                  font="mono"
                  ellipsis
                  color="verySubtle"
                >
                  {big.change.toFixed(2)}%
                </Text>
              </Tooltip>
            )}
          </div>
        ) : (
          value && (
            <div className="flex items-center gap-4">
              <ValueNum
                tooltip="Net change over time range:"
                format={(val) => valueFormat(val.toNumber())}
                value={new BigNumber(value.diff)}
              />
              {showChange && value.change !== undefined && (
                <Tooltip content="Percent change over time range">
                  <Text
                    size="14"
                    weight="semibold"
                    font="mono"
                    ellipsis
                    color="verySubtle"
                  >
                    {value.change.toFixed(2)}%
                  </Text>
                </Tooltip>
              )}
            </div>
          )
        )
      }
    />
  )
}
