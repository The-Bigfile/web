import BigNumber from 'bignumber.js'
import { Button } from '../core/Button'
import { ArrowUpRight16, ArrowDownLeft16 } from '@siafoundation/react-icons'
import { WalletBalance } from './WalletBalance'

type Props = {
  isSynced: boolean
  isWalletSynced: boolean
  syncPercent: number
  walletScanPercent: number
  balanceSc?: {
    unconfirmed: BigNumber
    confirmed: BigNumber
    spendable: BigNumber
    immature: BigNumber
  }
  receiveBigFile?: () => void
  sendBigFile: () => void
}

export function WalletLayoutActions({
  isSynced,
  isWalletSynced,
  syncPercent,
  walletScanPercent,
  balanceSc,
  sendBigFile,
  receiveBigFile,
}: Props) {
  return (
    <>
      {balanceSc && (
        <WalletBalance
          isSynced={isSynced && isWalletSynced}
          syncingMessage={
            !isSynced
              ? `Blockchain is syncing (${syncPercent}%), balance may be incorrect.`
              : `Wallet is scanning (${walletScanPercent}%), balance may be incorrect.`
          }
          balanceSc={balanceSc}
        />
      )}
      {receiveBigFile && (
        <Button aria-label="receive" size="small" onClick={receiveBigFile}>
          <ArrowDownLeft16 />
          Receive
        </Button>
      )}
      <Button
        aria-label="send"
        size="small"
        variant="accent"
        onClick={sendBigFile}
      >
        <ArrowUpRight16 />
        Send
      </Button>
    </>
  )
}
