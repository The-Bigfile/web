import { Page } from 'playwright'
import {
  fillSelectInputByName,
  fillTextInputByName,
  step,
} from '@siafoundation/e2e'

export const fillComposeTransactionBigfund = step(
  'fill compose transaction bigfile',
  async ({
    page,
    receiveAddress,
    changeAddress,
    amount,
  }: {
    page: Page
    receiveAddress: string
    changeAddress: string
    amount: number
  }) => {
    await fillTextInputByName(page, 'receiveAddress', receiveAddress)
    await fillSelectInputByName(page, 'mode', 'bigfund')
    await page.getByLabel('customChangeAddress').click()
    await fillTextInputByName(page, 'changeAddress', changeAddress)
    await fillTextInputByName(page, 'bigfund', String(amount))
    await page.getByRole('button', { name: 'Generate transaction' }).click()
  }
)
