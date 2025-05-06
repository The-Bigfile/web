import {
  ConsensusState,
  ConsensusNetwork,
  Currency,
  BlockHeight,
  ChainIndex,
  BigFileOutputID,
  BigfundOutputID,
  BigFileElement,
  BigfundElement,
  Transaction,
  V2Transaction,
  WalletEvent,
  BigFileOutput,
  Address,
  BigfundOutput,
  TransactionID,
} from '@siafoundation/types'
import { GatewayPeer, Wallet, WalletAddress, WalletMetadata } from './types'

export const stateRoute = '/state'
export const consensusTipRoute = '/consensus/tip'
export const consensusTipStateRoute = '/consensus/tipstate'
export const consensusNetworkRoute = '/consensus/network'
export const syncerPeersRoute = '/syncer/peers'
export const syncerConnectRoute = '/syncer/connect'
export const txPoolTransactionsRoute = '/txpool/transactions'
export const txPoolFeeRoute = '/txpool/fee'
export const txPoolBroadcastRoute = '/txpool/broadcast'
export const rescanRoute = '/rescan'
export const walletsRoute = '/wallets'
export const walletsIdRoute = '/wallets/:id'
export const walletsIdAddressesRoute = '/wallets/:id/addresses'
export const walletsIdAddressesAddrRoute = '/wallets/:id/addresses/:addr'
export const walletsIdBalanceRoute = '/wallets/:id/balance'
export const walletsIdEventsRoute = '/wallets/:id/events'
export const walletsIdEventsUnconfirmedRoute = '/wallets/:id/events/unconfirmed'
export const walletsIdOutputsBigFileRoute = '/wallets/:id/outputs/bigfile'
export const walletsIdOutputsBigfundRoute = '/wallets/:id/outputs/bigfund'
export const walletsIdFundRoute = '/wallets/:id/fund'
export const walletsIdFundSfRoute = '/wallets/:id/fundsf'
export const walletsIdReserveRoute = '/wallets/:id/reserve'
export const walletsIdReleaseRoute = '/wallets/:id/release'
export const walletsIdConstructTransactionRoute =
  '/wallets/:id/construct/transaction'
export const walletsIdConstructV2TransactionRoute =
  '/wallets/:id/construct/v2/transaction'

// state

export type StateParams = void
export type StatePayload = void
export type StateResponse = {
  version: string
  commit: string
  os: string
  buildTime: string
  startTime: string
}

// consensus

export type ConsensusTipParams = void
export type ConsensusTipPayload = void
export type ConsensusTipResponse = ChainIndex

export type ConsensusTipStateParams = void
export type ConsensusTipStatePayload = void
export type ConsensusTipStateResponse = ConsensusState

export type ConsensusNetworkParams = void
export type ConsensusNetworkPayload = void
export type ConsensusNetworkResponse = ConsensusNetwork

// syncer

export type SyncerPeersParams = void
export type SyncerPeersPayload = void
export type SyncerPeersResponse = GatewayPeer[]

export type SyncerConnectParams = void
export type SyncerConnectPayload = string
export type SyncerConnectResponse = never

// txpool

export type TxPoolTransactionsParams = void
export type TxPoolTransactionsPayload = void
export type TxPoolTransactionsResponse = {
  basis: ChainIndex
  transactions: Transaction[]
  v2transactions: V2Transaction[]
}

export type TxPoolFeeParams = void
export type TxPoolFeePayload = void
export type TxPoolFeeResponse = Currency

export type TxPoolBroadcastParams = void
export type TxPoolBroadcastPayload = {
  basis: ChainIndex
  transactions: Transaction[]
  v2transactions: V2Transaction[]
}
export type TxPoolBroadcastResponse = unknown

// rescan

export type RescanStartParams = void
export type RescanStartPayload = BlockHeight
export type RescanStartResponse = void

export type RescanParams = void
export type RescanPayload = void
export type RescanResponse = {
  startIndex: ChainIndex
  index: ChainIndex
  startTime: string
  error?: string
}

// wallet

export type WalletsParams = void
export type WalletsPayload = void
export type WalletsResponse = Wallet[]

export type WalletAddParams = void
export type WalletAddPayload = {
  name: string
  description: string
  metadata: WalletMetadata
}
export type WalletAddResponse = Wallet

export type WalletUpdateParams = { id: string }
export type WalletUpdatePayload = {
  name: string
  description: string
  metadata: WalletMetadata
}
export type WalletUpdateResponse = Wallet

export type WalletDeleteParams = { id: string }
export type WalletDeletePayload = void
export type WalletDeleteResponse = never

// addresses

export type WalletAddressesParams = { id: string }
export type WalletAddressesPayload = void
export type WalletAddressesResponse = WalletAddress[]

export type WalletAddressAddParams = { id: string }
export type WalletAddressAddPayload = WalletAddress
export type WalletAddressAddResponse = void

export type WalletAddressDeleteParams = { id: string; addr: string }
export type WalletAddressDeletePayload = void
export type WalletAddressDeleteResponse = never

export type WalletBalanceParams = { id: string }
export type WalletBalancePayload = void
export type WalletBalanceResponse = {
  bigfiles: Currency
  immatureBigFiles: Currency
  bigfunds: number
}

export type WalletEventsParams = { id: string; offset: number; limit: number }
export type WalletEventsPayload = void
export type WalletEventsResponse = WalletEvent[]

export type WalletEventsUnconfirmedParams = { id: string }
export type WalletEventsUnconfirmedPayload = void
export type WalletEventsUnconfirmedResponse = WalletEvent[]

export type WalletOutputsBigFileParams = { id: string }
export type WalletOutputsBigFilePayload = void
export type WalletOutputsBigFileResponse = {
  basis: ChainIndex
  outputs: BigFileElement[]
}

export type WalletOutputsBigfundParams = { id: string }
export type WalletOutputsBigfundPayload = void
export type WalletOutputsBigfundResponse = {
  basis: ChainIndex
  outputs: BigfundElement[]
}

export type WalletFundBigFileParams = {
  id: string
}
export type WalletFundBigFilePayload = {
  transaction: Transaction
  amount: Currency
  changeAddress: string
}
export type WalletFundBigFileResponse = {
  basis: ChainIndex
  transaction: Transaction
  toSign: string[]
  dependsOn: Transaction[] | null
}

export type WalletFundBigfundParams = {
  id: string
}
export type WalletFundBigfundPayload = {
  transaction: Transaction
  amount: number
  changeAddress: string
  claimAddress: string
}
export type WalletFundSiafundResponse = {
  basis: ChainIndex
  transaction: Transaction
  toSign: string[]
  dependsOn: Transaction[] | null
}

export type WalletReserveParams = {
  id: string
}
export type WalletReservePayload = {
  bigfileOutputs?: BigFileOutputID[]
  bigfundOutputs?: BigfundOutputID[]
  duration: number
}
export type WalletReserveResponse = void

export type WalletReleaseParams = {
  id: string
}
export type WalletReleasePayload = {
  bigfileOutputs?: BigFileOutputID[]
  bigfundOutputs?: BigfundOutputID[]
}
export type WalletReleaseResponse = void

export type WalletConstructV1TransactionParams = {
  id: string
}
export type WalletConstructV1TransactionPayload = {
  bigfiles?: BigFileOutput[]
  bigfunds?: BigfundOutput[]
  changeAddress: Address
}

export type WalletConstructV1TransactionResponse = {
  basis: ChainIndex
  id: TransactionID
  transaction: Transaction
  estimatedFee: Currency
}

export type WalletConstructV2TransactionParams = {
  id: string
}
export type WalletConstructV2TransactionPayload = {
  bigfiles?: BigFileOutput[]
  bigfunds?: BigfundOutput[]
  changeAddress: Address
}
export type WalletConstructV2TransactionResponse = {
  basis: ChainIndex
  id: TransactionID
  transaction: V2Transaction
  estimatedFee: Currency
}
