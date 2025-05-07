import { V2Transaction } from '@siafoundation/types'
import {
  useWalletOutputsBigFile,
  useWalletOutputsBigfund,
} from '@siafoundation/walletd-react'
import { useWallets } from '../../../contexts/wallets'
import { useCallback } from 'react'
import { useWalletAddresses } from '../../../hooks/useWalletAddresses'
import { signTransactionLedgerV2 } from '../../../lib/signLedgerV2'
import { useLedger } from '../../../contexts/ledger'

export function useSignV2() {
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
    async ({ fundedTransaction }: { fundedTransaction: V2Transaction }) => {
      if (!device || !fundedTransaction) {
        return
      }
      // sign
      const signResponse = await signTransactionLedgerV2({
        device,
        transaction: fundedTransaction,
        addresses,
        bigfileOutputs: bigfileOutputs.data?.outputs,
        bigfundOutputs: bigfundOutputs.data?.outputs,
      })
      if ('error' in signResponse) {
        return {
          error: signResponse.error,
        }
      }
      return {
        signedTransaction: signResponse.transaction,
      }
    },
    [device, addresses, bigfileOutputs.data, bigfundOutputs.data]
  )

  return sign
}
