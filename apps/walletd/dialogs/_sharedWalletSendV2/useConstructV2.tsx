import { useWalletConstructV2Transaction } from '@siafoundation/walletd-react'
import { useWallets } from '../../contexts/wallets'
import { useCallback } from 'react'
import { SendParamsV2 } from './typesV2'
import { WalletConstructV2TransactionPayload } from '@siafoundation/walletd-types'
import { BigFileOutput, BigfundOutput } from '@siafoundation/types'

export function useConstructV2() {
  const { wallet } = useWallets()
  const walletId = wallet?.id
  const construct = useWalletConstructV2Transaction()

  const fund = useCallback(
    async ({
      receiveAddress,
      changeAddress,
      bigfile,
      bigfund,
    }: SendParamsV2) => {
      if (!receiveAddress || !changeAddress) {
        return {
          error: 'No addresses',
        }
      }

      const bigfiles: BigFileOutput[] = []
      const bigfunds: BigfundOutput[] = []

      if (bigfile.gt(0)) {
        bigfiles.push({
          value: bigfile.toString(),
          address: receiveAddress,
        })
      }

      if (bigfund > 0) {
        bigfunds.push({
          value: bigfund,
          address: receiveAddress,
        })
      }

      const payload: WalletConstructV2TransactionPayload = {
        changeAddress,
        bigfiles,
        bigfunds,
      }

      // construct: funds txn, calculates and adds miner fees, determines utxo change.
      const response = await construct.post({
        params: {
          id: walletId,
        },
        payload,
      })
      if (response.error) {
        return {
          error: response.error,
        }
      }
      return {
        id: response.data.id,
        fundedTransaction: response.data.transaction,
        estimatedFee: response.data.estimatedFee,
        basis: response.data.basis,
      }
    },
    [walletId, construct]
  )

  return fund
}
