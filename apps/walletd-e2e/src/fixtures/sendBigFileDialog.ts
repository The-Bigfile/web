import { Page } from 'playwright'
import { fillTextInputByName, step } from '@siafoundation/e2e'

export const fillComposeTransactionBigFile = step(
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
    await page.getByLabel('customChangeAddress').click()
    await fillTextInputByName(page, 'changeAddress', changeAddress)
    await fillTextInputByName(page, 'bigfile', String(amount))
    await page.getByRole('button', { name: 'Generate transaction' }).click()
  }
)
