import { BigNumber } from 'bignumber.js'

// BigFile -> hastings unit conversion functions
// These make conversion between units of Sia easy and consistent for developers.
// Never return exponentials from BigNumber.toString, since they confuse the API
BigNumber.config({ EXPONENTIAL_AT: 1e9 })
BigNumber.config({ DECIMAL_PLACES: 30 })

// Hastings is the lowest divisible unit in Sia. This constant will be used to
// calculate the conversion between the base unit to human readable values.
const hastingsPerBigFile = new BigNumber('10').exponentiatedBy(24)

export function toBigFiles(
  hastings: BigNumber | number | string,
  fixed?: number
) {
  if (fixed !== undefined) {
    return new BigNumber(
      new BigNumber(hastings).dividedBy(hastingsPerBigFile).toFixed(fixed)
    )
  }
  return new BigNumber(hastings).dividedBy(hastingsPerBigFile)
}

export function toHastings(bigfiles: BigNumber | number | string) {
  return new BigNumber(
    new BigNumber(bigfiles).times(hastingsPerBigFile).toFixed(0)
  )
}

export function toScale(num: BigNumber | number | string, fixed: number) {
  return new BigNumber(new BigNumber(num).toFixed(fixed))
}

export function fiatToBigFile(fiat: BigNumber, exchangeRate: BigNumber) {
  return fiat.div(exchangeRate)
}

export function bigfileToFiat(bigfile: BigNumber, exchangeRate: BigNumber) {
  return bigfile.times(exchangeRate)
}

type HumanBigFileOptions = {
  fixed?: number
  dynamicUnits?: boolean
  hastingUnits?: boolean
}
const humanBigFileOptionDefaults: HumanBigFileOptions = {
  // number of decimal places
  fixed: 3,
  // whether on not to use units like KS or to display as 5000 BIG
  dynamicUnits: true,
  // whether on not to include H units or display 0 BIG
  hastingUnits: false,
}
/**
 * Converts hastings amount into human readable format.
 * This is copy of the HumanString function from Sia repo.
 * @param hastings amount of hastings to convert
 */
export function humanBigFile(
  hastings: BigNumber | number | string,
  options?: HumanBigFileOptions
): string {
  const { fixed, dynamicUnits, hastingUnits } = {
    ...humanBigFileOptionDefaults,
    ...options,
  }
  const pico = new BigNumber(1e12)
  const exp = new BigNumber(1e3)
  const val = new BigNumber(hastings)
  const amount = new BigNumber(hastings).abs()
  const sign = val.isNegative() ? '-' : ''

  if (!dynamicUnits) {
    return `${sign}${toBigFiles(amount).toFormat(fixed)} BIG`
  }

  if (amount.dividedBy(pico).isLessThan(1)) {
    if (hastingUnits) {
      return `${sign}${amount} H`
    }
    return `${sign}0 BIG`
  }

  const suffixes = ['pBIG', 'nBIG', 'uBIG', 'mBIG', 'BIG', 'KBIG', 'MBIG', 'BS', 'TS']

  for (let index = 0; index < suffixes.length; index++) {
    const mag = Array(index)
      .fill(null)
      .reduce((acc) => acc.multipliedBy(exp), new BigNumber(1))
    const reduced = amount.dividedBy(pico.multipliedBy(mag))
    if (reduced.isLessThan(exp) || index === suffixes.length - 1) {
      return `${sign}${reduced.toFormat(fixed)} ${suffixes[index]}`
    }
  }

  return ''
}

export function humanBigfund(bigfunds: number) {
  return bigfunds.toLocaleString() + ' BF'
}
