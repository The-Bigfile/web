import { Transaction } from '@siafoundation/types'
import { useWalletRelease } from '@siafoundation/walletd-react'
import { useWallets } from '../../contexts/wallets'
import { useCallback } from 'react'
import { triggerErrorToast } from '@siafoundation/design-system'

export function useCancelV1() {
  const { wallet } = useWallets()
  const walletId = wallet?.id
  const walletRelease = useWalletRelease()

  const cancel = useCallback(
    async (transaction: Transaction) => {
      const bigfileOutputs =
        transaction.bigfileInputs?.map((i) => i.parentID) || []
      const bigfundOutputs =
        transaction.bigfundInputs?.map((i) => i.parentID) || []
      const response = await walletRelease.post({
        params: {
          id: walletId,
        },
        payload: {
          bigfileOutputs,
          bigfundOutputs,
        },
      })
      if (response.error) {
        triggerErrorToast({
          title: 'Error canceling transaction',
          body: response.error,
        })
      }
    },
    [walletId, walletRelease]
  )

  return cancel
}
