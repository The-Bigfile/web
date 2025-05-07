import { Warning16 } from '@siafoundation/react-icons'
import { Panel, Separator, Text, Tooltip } from '@siafoundation/design-system'
import { humanBigFile, humanBigfund } from '@siafoundation/units'
import BigNumber from 'bignumber.js'
import { cx } from 'class-variance-authority'

export function WalletBalanceWithSf({
  big,
  sf,
  isSynced,
  syncingMessage,
}: {
  big: BigNumber
  sf: number
  isSynced: boolean
  syncingMessage?: string
}) {
  const el = (
    <>
      <Tooltip
        side="bottom"
        content={humanBigFile(big, {
          dynamicUnits: false,
        })}
      >
        <Text size="12" weight="semibold" className="flex items-center h-full">
          {humanBigFile(big)}
        </Text>
      </Tooltip>
      {!!sf && (
        <>
          <Separator variant="vertical" className="h-full" />
          <Tooltip side="bottom" content={humanBigfund(sf)}>
            <Text
              size="12"
              weight="semibold"
              className="flex items-center h-full"
            >
              {humanBigfund(sf)}
            </Text>
          </Tooltip>
        </>
      )}
    </>
  )

  return (
    <Panel
      className={cx(
        'hidden sm:flex h-7 items-center gap-2',
        !isSynced ? 'pl-2 pr-3' : 'px-3'
      )}
    >
      {!isSynced && (
        <Tooltip
          side="bottom"
          content={
            syncingMessage || 'Blockchain is syncing, balance may be incorrect.'
          }
        >
          <Text color="amber" className="flex items-center h-full">
            <Warning16 />
          </Text>
        </Tooltip>
      )}
      {el}
    </Panel>
  )
}
