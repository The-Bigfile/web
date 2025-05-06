import BigNumber from 'bignumber.js'

export type SendStep = 'compose' | 'send' | 'done'

export type SendParamsV2 = {
  mode: 'bigfile' | 'bigfund'
  receiveAddress: string
  changeAddress: string
  bigfund: number
  bigfile: BigNumber
  fee: BigNumber
}

export const emptySendParamsV2: SendParamsV2 = {
  mode: 'bigfile',
  receiveAddress: '',
  changeAddress: '',
  bigfile: new BigNumber(0),
  bigfund: 0,
  fee: new BigNumber(0),
}
