import {
  Text,
  ValueSc,
  ValueCopyable,
  ValueSf,
} from '@siafoundation/design-system'
import { SendParamsV2 } from './typesV2'

type Props = {
  params: SendParamsV2
  transactionId?: string
}

export function SendReceiptV2({
  params: { receiveAddress, changeAddress, bigfile, bigfund, fee },
  transactionId,
}: Props) {
  const totalBigFile = bigfile.plus(fee)
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-6 justify-between items-center">
        <Text color="verySubtle" noWrap id="recipientAddress">
          Recipient address
        </Text>
        <ValueCopyable
          value={receiveAddress}
          type="address"
          labeledBy="recipientAddress"
        />
      </div>
      <div className="flex gap-6 justify-between items-center">
        <Text color="verySubtle" noWrap id="changeAddress">
          Change address
        </Text>
        <ValueCopyable
          value={changeAddress}
          type="address"
          labeledBy="changeAddress"
        />
      </div>
      <div className="flex gap-2 justify-between items-center">
        <Text color="verySubtle" noWrap id="amount">
          Amount
        </Text>
        <div className="flex relative gap-1 top-[-0.5px]">
          {bigfile.gt(0) && (
            <ValueSc
              size="14"
              value={bigfile}
              variant="value"
              dynamicUnits={false}
              labeledBy="amount"
            />
          )}
          {bigfund > 0 && (
            <ValueSf
              size="14"
              value={bigfund}
              variant="value"
              labeledBy="amount"
            />
          )}
        </div>
      </div>
      <div className="flex gap-2 justify-between items-center">
        <Text color="verySubtle" noWrap id="networkFee">
          Network fee
        </Text>
        <div className="flex relative top-[-0.5px]">
          <ValueSc
            size="14"
            value={fee}
            variant="value"
            dynamicUnits={false}
            labeledBy="networkFee"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 justify-between">
        <Text color="verySubtle" noWrap id="total">
          Total
        </Text>
        <div className="flex relative gap-1 top-[-0.5px]">
          {bigfile.gt(0) && (
            <ValueSc
              size="14"
              value={totalBigFile}
              variant="value"
              dynamicUnits={false}
              labeledBy="total"
            />
          )}
          {bigfund > 0 && (
            <ValueSf
              size="14"
              value={bigfund}
              variant="value"
              labeledBy="total"
            />
          )}
        </div>
      </div>
      {transactionId && (
        <div className="flex gap-6 items-center justify-between">
          <Text color="verySubtle" noWrap id="transactionId">
            Transaction ID
          </Text>
          <ValueCopyable
            value={transactionId}
            type="transaction"
            labeledBy="transactionId"
          />
        </div>
      )}
    </div>
  )
}
