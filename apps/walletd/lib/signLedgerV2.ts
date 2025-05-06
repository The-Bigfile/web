import {
  Result,
  BigfundElement,
  BigFileElement,
  V2Transaction,
} from '@siafoundation/types'
import { LedgerDevice } from '../contexts/ledger/types'
import { AddressData } from '../contexts/addresses/types'

export async function signTransactionLedgerV2({
  device,
  transaction,
  addresses,
  bigfileOutputs,
  bigfundOutputs,
}: {
  device: LedgerDevice
  transaction: V2Transaction
  addresses: AddressData[]
  bigfileOutputs: BigFileElement[]
  bigfundOutputs: BigfundElement[]
}): Promise<
  Result<{
    transaction: V2Transaction
  }>
> {
  throw new Error('Not implemented')
}
