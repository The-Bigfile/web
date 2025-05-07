import BigNumber from 'bignumber.js'

export type SendStep = 'compose' | 'send' | 'done'

export type SendParamsV1 = {
  mode: 'bigfile' | 'bigfund'
  receiveAddress: string
  changeAddress: string
  claimAddress: string
  bigfund: number
  bigfile: BigNumber
  fee: BigNumber
}

export const emptySendParamsV1: SendParamsV1 = {
  mode: 'bigfile',
  receiveAddress: '',
  changeAddress: '',
  claimAddress: '',
  bigfile: new BigNumber(0),
  bigfund: 0,
  fee: new BigNumber(0),
}
