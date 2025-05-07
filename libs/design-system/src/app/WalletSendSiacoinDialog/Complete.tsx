import BigNumber from 'bignumber.js'
import { Text } from '../../core/Text'
import { CheckmarkFilled32 } from '@siafoundation/react-icons'
import { WalletSendBigFileReceipt } from './Receipt'
import { SendBigFileParams } from './types'

type Props = {
  data: SendBigFileParams
  fee: BigNumber
  transactionId?: string
}

export function WalletSendBigFileComplete({
  data: { address, hastings },
  fee,
  transactionId,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <WalletSendBigFileReceipt
        address={address}
        hastings={hastings}
        fee={fee}
        transactionId={transactionId}
      />
      <div className="flex flex-col items-center justify-center gap-2 my-4">
        <Text>
          <CheckmarkFilled32 />
        </Text>
        <Text>Transaction successfully broadcasted.</Text>
      </div>
    </div>
  )
}
