import { Transaction } from '@siafoundation/types'
import {
  useWalletOutputsBigFile,
  useWalletOutputsBigfund,
} from '@siafoundation/walletd-react'
import { useWallets } from '../../../contexts/wallets'
import { useCallback } from 'react'
import { useWalletAddresses } from '../../../hooks/useWalletAddresses'
import { signTransactionLedgerV1 } from '../../../lib/signLedgerV1'
import { useLedger } from '../../../contexts/ledger'

export function useSignV1({ cancel }: { cancel: (t: Transaction) => void }) {
  const { wallet } = useWallets()
  const walletId = wallet?.id
  const bigfileOutputs = useWalletOutputsBigFile({
    disabled: !walletId,
    params: {
      id: walletId,
    },
  })
  const bigfundOutputs = useWalletOutputsBigfund({
    disabled: !walletId,
    params: {
      id: walletId,
    },
  })
  const { dataset: addresses } = useWalletAddresses({ id: walletId })

  const { device } = useLedger()
  const sign = useCallback(
    async ({
      fundedTransaction,
      toSign,
    }: {
      fundedTransaction: Transaction
      toSign: string[]
    }) => {
      if (!device || !fundedTransaction) {
        return
      }
      // sign
      const signResponse = await signTransactionLedgerV1({
        device,
        transaction: fundedTransaction,
        toSign,
        addresses,
        bigfileOutputs: bigfileOutputs.data?.outputs,
        bigfundOutputs: bigfundOutputs.data?.outputs,
      })
      if (signResponse.error) {
        cancel(fundedTransaction)
        return {
          error: signResponse.error,
        }
      }
      return {
        signedTransaction: signResponse.transaction,
      }
    },
    [device, addresses, bigfileOutputs.data, bigfundOutputs.data, cancel]
  )

  return sign
}
