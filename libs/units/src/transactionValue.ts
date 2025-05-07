import BigNumber from 'bignumber.js'
import {
  WalletEvent,
  WalletEventTransactionV1,
  WalletEventTransactionV2,
} from '@siafoundation/types'

export function calculateScValue(e: WalletEvent) {
  if (e.type === 'v2Transaction') {
    return v2TxnCalculateScValue(e)
  }
  if (e.type === 'v1Transaction') {
    return v1TxnCalculateScValue(e)
  }
  return new BigNumber(e.data.bigfileElement.bigfileOutput.value)
}

export function calculateSfValue(e: WalletEvent) {
  if (e.type === 'v2Transaction') {
    return v2TxnCalculateSfValue(e)
  }
  if (e.type === 'v1Transaction') {
    return v1TxnCalculateSfValue(e)
  }
  return undefined
}

// v1 big

function v1TxnCalculateScValue(e: WalletEventTransactionV1) {
  return v1TxnCalculateScInflow(e).minus(v1TxnCalculateScOutflow(e))
}

function v1TxnCalculateScOutflow(e: WalletEventTransactionV1) {
  const bigfileElements = e.data.spentBigFileElements || []
  return bigfileElements.reduce((acc, ele) => {
    if (e.relevant.includes(ele.bigfileOutput.address)) {
      return acc.plus(ele.bigfileOutput.value)
    }
    return acc
  }, new BigNumber(0))
}

function v1TxnCalculateScInflow(e: WalletEventTransactionV1) {
  const bigfileOutputs = e.data.transaction.bigfileOutputs || []
  return bigfileOutputs.reduce((acc, o) => {
    if (e.relevant.includes(o.address)) {
      return acc.plus(o.value)
    }
    return acc
  }, new BigNumber(0))
}

// v2 big

function v2TxnCalculateScValue(e: WalletEventTransactionV2) {
  return v2TxnCalculateScInflow(e).minus(v2TxnCalculateScOutflow(e))
}

function v2TxnCalculateScOutflow(e: WalletEventTransactionV2) {
  const bigfileInputs = e.data.bigfileInputs || []
  return bigfileInputs.reduce((acc, ele) => {
    if (e.relevant.includes(ele.parent.bigfileOutput.address)) {
      return acc.plus(ele.parent.bigfileOutput.value)
    }
    return acc
  }, new BigNumber(0))
}

function v2TxnCalculateScInflow(e: WalletEventTransactionV2) {
  const bigfileOutputs = e.data.bigfileOutputs || []
  return bigfileOutputs.reduce((acc, o) => {
    if (e.relevant.includes(o.address)) {
      return acc.plus(o.value)
    }
    return acc
  }, new BigNumber(0))
}

// v1 sf

function v1TxnCalculateSfValue(e: WalletEventTransactionV1) {
  return v1TxnCalculateSfInflow(e) - v1TxnCalculateSfOutflow(e)
}

function v1TxnCalculateSfOutflow(e: WalletEventTransactionV1) {
  const siafundElements = e.data.spentBigfundElements || []
  return siafundElements.reduce((acc, ele) => {
    if (e.relevant.includes(ele.bigfundOutput.address)) {
      return acc + ele.bigfundOutput.value
    }
    return acc
  }, 0)
}

function v1TxnCalculateSfInflow(e: WalletEventTransactionV1) {
  const bigfundOutputs = e.data.transaction.bigfundOutputs || []
  return bigfundOutputs.reduce((acc, o) => {
    if (e.relevant.includes(o.address)) {
      return acc + o.value
    }
    return acc
  }, 0)
}

// v2 sf

function v2TxnCalculateSfValue(e: WalletEventTransactionV2) {
  return v2TxnCalculateSfInflow(e) - v2TxnCalculateSfOutflow(e)
}

function v2TxnCalculateSfOutflow(e: WalletEventTransactionV2) {
  const bigfundInputs = e.data.bigfundInputs || []
  return bigfundInputs.reduce((acc, ele) => {
    if (e.relevant.includes(ele.parent.bigfundOutput.address)) {
      return acc + ele.parent.bigfundOutput.value
    }
    return acc
  }, 0)
}

function v2TxnCalculateSfInflow(e: WalletEventTransactionV2) {
  const bigfundOutputs = e.data.bigfundOutputs || []
  return bigfundOutputs.reduce((acc, o) => {
    if (e.relevant.includes(o.address)) {
      return acc + o.value
    }
    return acc
  }, 0)
}
