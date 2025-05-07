import { useForm } from 'react-hook-form'
import BigNumber from 'bignumber.js'
import { WalletSendBigFileReceipt } from './Receipt'
import { SendBigFileParams } from './types'
import { triggerErrorToast } from '../../lib/toast'
import { useCallback, useMemo } from 'react'

type Props = {
  send: (
    params: SendBigFileParams & { includeFee: boolean }
  ) => Promise<{ transactionId?: string; error?: string }>
  params: SendBigFileParams
  fee: BigNumber
  onConfirm: (params: { transactionId?: string }) => void
}

export function useSendBigFileConfirmForm({
  send,
  params,
  fee,
  onConfirm,
}: Props) {
  const { address, hastings } = params || {}
  const form = useForm({
    defaultValues: {},
  })

  const onValid = useCallback(async () => {
    const { transactionId, error } = await send({
      address,
      hastings,
      includeFee: false,
    })

    if (error) {
      triggerErrorToast({
        title: 'Error sending bigfile',
        body: error,
      })
      return
    }

    onConfirm({
      transactionId,
    })
  }, [onConfirm, address, hastings, send])

  const submit = useMemo(() => form.handleSubmit(onValid), [form, onValid])

  const el = (
    <div className="flex flex-col gap-4">
      <WalletSendBigFileReceipt
        address={address}
        hastings={hastings}
        fee={fee}
      />
    </div>
  )

  return {
    el,
    form,
    reset: form.reset,
    submit,
  }
}
