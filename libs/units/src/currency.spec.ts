import BigNumber from 'bignumber.js'
import { toHastings, toBigFiles, humanBigFile } from './currency'

const HASTINGS_PER_BIGFILE = '1000000000000000000000000'

describe('currency', () => {
  it('converts from bigfiles to hastings correctly', () => {
    const maxSC = new BigNumber('100000000000000000000000')
    for (let i = 0; i < 100; i++) {
      const sc = maxSC.times(Math.trunc(Math.random() * 10000) / 10000)
      const expectedHastings = sc.times(HASTINGS_PER_BIGFILE)
      expect(toHastings(sc).toString()).toBe(expectedHastings.toString())
    }
  })

  it('converts from hastings to bigfiles correctly', () => {
    const maxH = new BigNumber('10').pow(150)
    for (let i = 0; i < 100; i++) {
      const hastings = maxH.times(Math.trunc(Math.random() * 10000) / 10000)
      const expectedBigFiles = hastings.dividedBy(HASTINGS_PER_BIGFILE)
      expect(toBigFiles(hastings).toString()).toBe(expectedBigFiles.toString())
    }
  })

  it('converts hastings to human readable representation', () => {
    expect(humanBigFile('1', { hastingUnits: true })).toBe('1 H')
    expect(humanBigFile('1000', { hastingUnits: true })).toBe('1000 H')
    expect(humanBigFile('100000000000', { hastingUnits: true })).toBe(
      '100000000000 H'
    )
    expect(humanBigFile('1')).toBe('0 BIG')
    expect(humanBigFile('1000')).toBe('0 BIG')
    expect(humanBigFile('100000000000')).toBe('0 BIG')
    expect(humanBigFile('1000000000000')).toBe('1.000 pS')
    expect(humanBigFile('1234560000000')).toBe('1.235 pS')
    expect(humanBigFile('12345600000000')).toBe('12.346 pS')
    expect(humanBigFile('123456000000000')).toBe('123.456 pS')
    expect(humanBigFile('1000000000000000')).toBe('1.000 nS')
    expect(humanBigFile('1000000000000000000')).toBe('1.000 uS')
    expect(humanBigFile('1000000000000000000000')).toBe('1.000 mS')
    expect(
      humanBigFile(new BigNumber('1').multipliedBy(HASTINGS_PER_BIGFILE))
    ).toBe('1.000 BIG')
    expect(
      humanBigFile(new BigNumber('1000').multipliedBy(HASTINGS_PER_BIGFILE))
    ).toBe('1.000 KS')
    expect(
      humanBigFile(new BigNumber('1000000').multipliedBy(HASTINGS_PER_BIGFILE))
    ).toBe('1.000 MS')
    expect(
      humanBigFile(
        new BigNumber('1000000000').multipliedBy(HASTINGS_PER_BIGFILE)
      )
    ).toBe('1.000 GS')
    expect(
      humanBigFile(
        new BigNumber('1000000000000').multipliedBy(HASTINGS_PER_BIGFILE)
      )
    ).toBe('1.000 TS')
    expect(
      humanBigFile(
        new BigNumber('1234560000000').multipliedBy(HASTINGS_PER_BIGFILE)
      )
    ).toBe('1.235 TS')
    expect(
      humanBigFile(
        new BigNumber('1234560000000000').multipliedBy(HASTINGS_PER_BIGFILE)
      )
    ).toBe('1,234.560 TS')
  })
})
