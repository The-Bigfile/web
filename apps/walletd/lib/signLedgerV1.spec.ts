import { initSDK } from '@siafoundation/sdk'
import { signTransactionLedgerV1 } from './signLedgerV1'
import { getMockAddresses, getMockDevice } from './testMocks'
import { getMockScenarioSeedWallet } from './mocks/mockSeedWallet'

beforeEach(async () => {
  await initSDK()
})

describe('signLedgerV1', () => {
  describe('bigfile', () => {
    it('builds and signs valid transaction', async () => {
      const device = getMockDevice()
      const mocks = getMockScenarioSeedWallet()
      expect(
        await signTransactionLedgerV1({
          device,
          transaction: mocks.walletFundResponse.transaction,
          toSign: mocks.walletFundResponse.toSign,
          bigfileOutputs: mocks.walletOutputsBigFileResponse.outputs,
          bigfundOutputs: mocks.walletOutputsBigfundResponse.outputs,
          addresses: getMockAddresses(mocks),
        })
      ).toMatchSnapshot()
    })

    it('errors when a toSign utxo is missing', async () => {
      const device = getMockDevice()
      const mocks = getMockScenarioSeedWallet()
      expect(
        await signTransactionLedgerV1({
          device,
          transaction: mocks.walletFundResponse.transaction,
          bigfileOutputs: mocks.walletOutputsBigFileResponse.outputs,
          bigfundOutputs: mocks.walletOutputsBigfundResponse.outputs,
          addresses: getMockAddresses(mocks),
          toSign: [mocks.walletFundResponse.toSign[0], 'not in bigfileOutputs'],
        })
      ).toEqual({
        error: 'Missing utxo',
      })
    })

    it('errors when a public keys address is missing', async () => {
      const device = getMockDevice()
      const mocks = getMockScenarioSeedWallet()
      expect(
        await signTransactionLedgerV1({
          device,
          transaction: mocks.walletFundResponse.transaction,
          toSign: mocks.walletFundResponse.toSign,
          bigfileOutputs: mocks.walletOutputsBigFileResponse.outputs,
          bigfundOutputs: mocks.walletOutputsBigfundResponse.outputs,
          addresses: [
            {
              id: 'id',
              walletId: 'id',
              address: 'address not in addresses',
              metadata: {
                index: 5,
              },
            },
          ],
        })
      ).toEqual({
        error: 'Missing address',
      })
    })

    it('errors when an address is missing its index', async () => {
      const device = getMockDevice()
      const mocks = getMockScenarioSeedWallet()
      expect(
        await signTransactionLedgerV1({
          device,
          transaction: mocks.walletFundResponse.transaction,
          toSign: mocks.walletFundResponse.toSign,
          bigfileOutputs: mocks.walletOutputsBigFileResponse.outputs,
          bigfundOutputs: mocks.walletOutputsBigfundResponse.outputs,
          addresses: [
            {
              id: 'id',
              walletId: 'id',
              address:
                mocks.walletOutputsBigFileResponse.outputs[1].bigfileOutput
                  .address,
              metadata: {},
            },
          ],
        })
      ).toEqual({
        error: 'Missing address index',
      })
    })

    it('errors when an address is missing its public key', async () => {
      const device = getMockDevice()
      const mocks = getMockScenarioSeedWallet()
      const addresses = getMockAddresses(mocks)
      addresses[0].spendPolicy.policy.publicKeys[0] = undefined
      expect(
        await signTransactionLedgerV1({
          device,
          transaction: mocks.walletFundResponse.transaction,
          toSign: mocks.walletFundResponse.toSign,
          bigfileOutputs: mocks.walletOutputsBigFileResponse.outputs,
          bigfundOutputs: mocks.walletOutputsBigfundResponse.outputs,
          addresses,
        })
      ).toEqual({
        error: 'Missing address public key',
      })
    })
  })
})
