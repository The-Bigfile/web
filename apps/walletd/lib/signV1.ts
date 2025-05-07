import {
  BigFileElement,
  BigFileInput,
  BigfundElement,
  BigfundInput,
  Transaction,
} from '@siafoundation/types'
import { stripPrefix } from '@siafoundation/design-system'
import { AddressData } from '../contexts/addresses/types'

export function addUnlockConditionsAndSignaturesV1({
  transaction,
  toSign,
  addresses,
  bigfileOutputs,
  bigfundOutputs,
}: {
  transaction: Transaction
  toSign: string[]
  addresses: AddressData[]
  bigfundOutputs: BigfundElement[]
  bigfileOutputs: BigFileElement[]
}): { transaction?: Transaction; error?: string } {
  if (!addresses) {
    return { error: 'No addresses' }
  }
  if (!bigfileOutputs) {
    return { error: 'No outputs' }
  }

  // for each toSign
  for (const toSignIdPrefixed of toSign) {
    const toSignId = stripPrefix(toSignIdPrefixed)

    // find the parent utxo funding element for each input
    const {
      address,
      bigfileUtxo,
      bigfundUtxo,
      bigfileInput,
      bigfundInput,
      error,
    } = getToSignMetadataV1({
      toSignId,
      addresses,
      bigfileOutputs,
      bigfundOutputs,
      transaction,
    })

    if (error) {
      return { error }
    }

    if (bigfileUtxo) {
      bigfileInput.unlockConditions = address.spendPolicy.policy
    }

    if (bigfundUtxo) {
      bigfundInput.unlockConditions = address.spendPolicy.policy
    }

    if (!transaction.signatures) {
      transaction.signatures = []
    }

    // push to signatures
    transaction.signatures.push({
      parentID: toSignId,
      publicKeyIndex: 0,
      timelock: 0,
      coveredFields: {
        wholeTransaction: true,
      },
    })
  }

  return {}
}

function getBigFileUtxoAndAddressV1({
  id: idPrefixed,
  addresses,
  bigfileOutputs,
}: {
  id: string
  addresses: AddressData[]
  bigfileOutputs: BigFileElement[]
}): { utxo?: BigFileElement; address?: AddressData; error?: string } {
  const id = stripPrefix(idPrefixed)

  // find the utxo by toSign ID
  const utxo = bigfileOutputs?.find((sco) => stripPrefix(sco.id) === id)
  if (!utxo) {
    return { error: 'Missing utxo' }
  }

  // find the utxo's address metadata which has the index and public key saved
  // the public key was computed and saved when the address was generated
  const addressData = addresses?.find(
    (a) => stripPrefix(a.address) === stripPrefix(utxo.bigfileOutput.address)
  )

  if (!addressData) {
    return { error: 'Missing address' }
  }
  if (!addressData.metadata) {
    return { error: 'Missing address metadata' }
  }
  if (addressData.metadata.index === undefined) {
    return { error: 'Missing address index' }
  }
  if (!addressData.spendPolicy) {
    return { error: 'Missing address spend policy' }
  }
  if (!addressData.spendPolicy.policy.publicKeys[0]) {
    return { error: 'Missing address public key' }
  }

  return {
    utxo,
    address: addressData,
  }
}

function getSiafundUtxoAndAddressV1({
  id: idPrefixed,
  addresses,
  bigfundOutputs,
}: {
  id: string
  addresses: AddressData[]
  bigfundOutputs: BigfundElement[]
}): { utxo?: BigfundElement; address?: AddressData; error?: string } {
  const id = stripPrefix(idPrefixed)

  // find the utxo by toSign ID
  const utxo = bigfundOutputs?.find((sfo) => stripPrefix(sfo.id) === id)
  if (!utxo) {
    return { error: 'Missing utxo' }
  }

  // find the utxo's address metadata which has the index and public key saved
  // the public key was computed and saved when the address was generated
  const addressData = addresses?.find(
    (a) => stripPrefix(a.address) === stripPrefix(utxo.bigfundOutput.address)
  )

  if (!addressData) {
    return { error: 'Missing address' }
  }
  if (!addressData.metadata) {
    return { error: 'Missing address metadata' }
  }
  if (addressData.metadata.index === undefined) {
    return { error: 'Missing address index' }
  }
  if (!addressData.spendPolicy) {
    return { error: 'Missing address spend policy' }
  }
  if (!addressData.spendPolicy.policy.publicKeys[0]) {
    return { error: 'Missing address public key' }
  }

  return {
    utxo,
    address: addressData,
  }
}

export function getToSignMetadataV1({
  toSignId: idPrefixed,
  transaction,
  addresses,
  bigfileOutputs,
  bigfundOutputs,
}: {
  toSignId: string
  transaction: Transaction
  addresses: AddressData[]
  bigfileOutputs: BigFileElement[]
  bigfundOutputs: BigfundElement[]
}): {
  address?: AddressData
  bigfileUtxo?: BigFileElement
  bigfundUtxo?: BigfundElement
  bigfileInput?: BigFileInput
  bigfundInput?: BigfundInput
  error?: string
} {
  const id = stripPrefix(idPrefixed)
  // find the parent utxo funding element for each input
  const scUtxoAddr = getBigFileUtxoAndAddressV1({
    id,
    addresses,
    bigfileOutputs,
  })

  if (!scUtxoAddr.error) {
    // find the bigfile input by matching the toSign ID to the bigfile input's parent ID
    const sci = transaction.bigfileInputs?.find(
      (sci) => stripPrefix(sci.parentID) === stripPrefix(scUtxoAddr.utxo.id)
    )

    if (!sci) {
      return { error: 'Missing input' }
    }

    return {
      address: scUtxoAddr.address,
      bigfileUtxo: scUtxoAddr.utxo,
      bigfileInput: sci,
    }
  }

  // find the parent utxo funding element for each input
  const sfUtxoAddr = getSiafundUtxoAndAddressV1({
    id,
    addresses,
    bigfundOutputs,
  })

  if (!sfUtxoAddr.error) {
    // find the bigfile input by matching the toSign ID to the saifund input's parent ID
    const sfi = transaction.bigfundInputs?.find(
      (sfi) => stripPrefix(sfi.parentID) === stripPrefix(sfUtxoAddr.utxo.id)
    )

    if (!sfi) {
      return { error: 'Missing input' }
    }

    return {
      address: sfUtxoAddr.address,
      bigfundUtxo: sfUtxoAddr.utxo,
      bigfundInput: sfi,
    }
  }

  // if it found a bigfund utxo then its a bigfund error
  if (sfUtxoAddr.error && sfUtxoAddr.error !== 'Missing utxo') {
    return {
      error: sfUtxoAddr.error,
    }
  }

  return { error: scUtxoAddr.error }
}
