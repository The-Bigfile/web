'use client'

import { useMemo } from 'react'
import { ChartXY, Chart } from '../components/ChartXY'
import { humanBigFile } from '@siafoundation/units'
import {
  formatChartData,
  getDataIntervalLabelFormatter,
} from '../lib/chartData'
import { computeChartStats } from '../lib/chartStats'
import { useTheme } from 'next-themes'
import { colors } from '../lib/colors'

type BalanceEvolution = {
  big: number
  timestamp: number
}

type Props = {
  balances?: BalanceEvolution[]
  isLoading: boolean
  chartType?: 'area' | 'line'
}

type Key = 'big'

export function BalanceEvolution({
  balances,
  isLoading,
  chartType = 'area',
}: Props) {
  const { resolvedTheme } = useTheme()
  const chartConfigs = useMemo(
    () =>
      resolvedTheme === 'light'
        ? {
            big: {
              label: 'bigfile',
              color: colors.accent[800],
            },
          }
        : {
            big: {
              label: 'bigfile',
              color: colors.accentdark[800],
            },
          },
    [resolvedTheme]
  )

  const chart = useMemo<Chart<Key, never>>(() => {
    const data = formatChartData(balances, 'none')
    const stats = computeChartStats(balances)
    return {
      data,
      stats,
      config: {
        enabledGraph: ['big'],
        enabledTip: ['big'],
        data: {
          big: chartConfigs.big,
        },
        format: (v) => humanBigFile(v),
        formatTimestamp: getDataIntervalLabelFormatter('default'),
        formatTickY: (v) =>
          humanBigFile(v, {
            fixed: 0,
            dynamicUnits: true,
          }),
        disableAnimations: true,
        chartType,
      },
      isLoading,
    }
  }, [balances, isLoading, chartConfigs, chartType])

  return (
    <div className="relative">
      <ChartXY
        id="all/v0/wallet/balance"
        height={200}
        allowConfiguration={false}
        data={chart.data}
        config={chart.config}
      />
    </div>
  )
}
