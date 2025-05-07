import {
  ChainIndex,
  Transaction,
  BigFileElement,
  BigfundElement,
  FileContractElement,
  Hash256,
  Address,
} from './core'
import { V2Transaction, V2FileContractResolutionType } from './v2'

export type UnconfirmedChainIndex = {
  height: number
}

export type WalletEventBase = {
  id: Hash256
  timestamp: string
  index: ChainIndex | UnconfirmedChainIndex
  maturityHeight: number
  relevant: Address[]
}

export type WalletEventTransactionV1 = WalletEventBase & {
  type: 'v1Transaction'
  data: {
    transaction: Transaction
    spentBigFileElements?: BigFileElement[]
    spentBigfundElements?: BigfundElement[]
  }
}

export type WalletEventTransactionV2 = WalletEventBase & {
  type: 'v2Transaction'
  data: V2Transaction
}

export type WalletEventContractResolutionV1 = WalletEventBase & {
  type: 'v1ContractResolution'
  data: {
    parent: FileContractElement
    bigfileElement: BigFileElement
    missed: boolean
  }
}

export type WalletEventContractResolutionV2 = WalletEventBase & {
  type: 'v2ContractResolution'
  data: {
    resolution: V2FileContractResolutionType
    bigfileElement: BigFileElement
    missed: boolean
  }
}

export type WalletEventMinerPayout = WalletEventBase & {
  type: 'miner'
  data: {
    bigfileElement: BigFileElement
  }
}

export type WalletEventBigfundClaim = WalletEventBase & {
  type: 'bigfundClaim'
  data: {
    bigfileElement: BigFileElement
  }
}

export type WalletEventFoundationSubsidy = WalletEventBase & {
  type: 'foundation'
  data: {
    bigfileElement: BigFileElement
  }
}

export type WalletEvent =
  | WalletEventTransactionV1
  | WalletEventTransactionV2
  | WalletEventContractResolutionV1
  | WalletEventContractResolutionV2
  | WalletEventMinerPayout
  | WalletEventFoundationSubsidy
  | WalletEventBigfundClaim

export type WalletEventType = WalletEvent['type']
