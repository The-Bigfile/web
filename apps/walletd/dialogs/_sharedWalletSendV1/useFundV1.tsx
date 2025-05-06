import {
  useWalletFundBigFile,
  useWalletFundBigfund,
} from '@siafoundation/walletd-react'
import { useWallets } from '../../contexts/wallets'
import { useCallback } from 'react'
import { SendParamsV1 } from './typesV1'

export function useFundV1() {
  const { wallet } = useWallets()
  const walletId = wallet?.id
  const walletFundSc = useWalletFundBigFile()
  const walletFundSf = useWalletFundBigfund()

  const fund = useCallback(
    async ({
      receiveAddress,
      changeAddress,
      claimAddress,
      mode,
      bigfile,
      bigfund,
      fee,
    }: SendParamsV1) => {
      if (!receiveAddress || !changeAddress || !claimAddress) {
        return {
          error: 'No addresses',
        }
      }

      // fund
      if (mode === 'bigfile') {
        const fundResponse = await walletFundSc.post({
          params: {
            id: walletId,
          },
          payload: {
            amount: bigfile.plus(fee).toString(),
            changeAddress,
            transaction: {
              minerFees: [fee.toString()],
              bigfileOutputs: [
                {
                  value: bigfile.toString(),
                  address: receiveAddress,
                },
              ],
            },
          },
        })
        if (fundResponse.error) {
          return {
            error: fundResponse.error,
          }
        }
        return {
          basis: fundResponse.data.basis,
          fundedTransaction: fundResponse.data.transaction,
          toSign: fundResponse.data.toSign,
        }
      }

      if (mode === 'bigfund') {
        const toSign = []
        let fundResponse = await walletFundSf.post({
          params: {
            id: walletId,
          },
          payload: {
            amount: bigfund,
            changeAddress,
            claimAddress,
            transaction: {
              minerFees: [fee.toString()],
              bigfundOutputs: [
                {
                  value: bigfund,
                  address: receiveAddress,
                },
              ],
            },
          },
        })
        if (fundResponse.error) {
          return {
            error: fundResponse.error,
          }
        }
        toSign.push(...fundResponse.data.toSign)
        fundResponse = await walletFundSc.post({
          params: {
            id: walletId,
          },
          payload: {
            amount: fee.toString(),
            changeAddress,
            transaction: fundResponse.data.transaction,
          },
        })
        if (fundResponse.error) {
          return {
            error: fundResponse.error,
          }
        }
        toSign.push(...fundResponse.data.toSign)
        return {
          basis: fundResponse.data.basis,
          fundedTransaction: fundResponse.data.transaction,
          toSign,
        }
      }
    },
    [walletFundSc, walletFundSf, walletId]
  )

  return fund
}
