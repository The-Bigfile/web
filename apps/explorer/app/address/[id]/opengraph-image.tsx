import { humanBigFile, humanBigfund } from '@siafoundation/units'
import { getOGImage } from '../../../components/OGImageEntity'
import { truncate } from '@siafoundation/design-system'
import { getExplored } from '../../../lib/explored'

export const revalidate = 0

export const alt = 'Address'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function Image({ params }) {
  const address = params?.id as string

  try {
    const { data: balance } = await getExplored().addressBalance({
      params: { address },
    })

    const values = [
      {
        label: 'bigfile balance',
        value: humanBigFile(balance.unspentBigFiles || 0),
      },
    ]

    if (balance.unspentBigfunds !== 0) {
      values.push({
        label: 'bigfund balance',
        value: humanBigfund(balance.unspentBigfunds || 0),
      })
    }

    return getOGImage(
      {
        id: address,
        title: truncate(address, 44),
        subtitle: 'address',
        initials: 'A',
        values,
      },
      size
    )
  } catch (e) {
    return getOGImage(
      {
        id: address,
        title: truncate(address, 30),
        subtitle: 'address',
        initials: 'A',
      },
      size
    )
  }
}
