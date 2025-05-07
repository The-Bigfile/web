'use client'

import {
  Badge,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Tooltip,
} from '@siafoundation/design-system'
import { EntityList } from '../Entity/EntityList'
import { EntityListItemProps } from '../Entity/EntityListItem'
import { humanNumber } from '@siafoundation/units'
import { ExplorerDatum, DatumProps } from '../ExplorerDatum'
import { useMemo, useState } from 'react'
import { routes } from '../../config/routes'
import { EntityHeading } from '../EntityHeading'
import BigNumber from 'bignumber.js'
import { ContentLayout } from '../ContentLayout'
import {
  AddressBalance,
  ExplorerEvent,
  EventPayout,
  EventV1ContractResolution,
  EventV1Transaction,
  ExplorerBigFileOutput,
  ExplorerV2Transaction,
  EventV2ContractResolution,
} from '@siafoundation/explored-types'

type Tab = 'events' | 'evolution' | 'utxos'

type Props = {
  id: string
  addressInfo: {
    balance: AddressBalance
    events: ExplorerEvent[]
    unconfirmedEvents: ExplorerEvent[]
    unspentOutputs: ExplorerBigFileOutput[]
  }
}

export function Address({
  id,
  addressInfo: {
    balance: { unspentBigFiles, unspentBigfunds },
    events,
    unconfirmedEvents,
    unspentOutputs,
  },
}: Props) {
  const [tab, setTab] = useState<Tab>('events')

  const values = useMemo(() => {
    const list: DatumProps[] = [
      {
        label: 'BIG',
        big: new BigNumber(unspentBigFiles),
      },
    ]
    if (unspentBigfunds !== 0) {
      list.push({
        label: 'BF',
        bf: Number(unspentBigfunds),
      })
    }
    return list
  }, [unspentBigFiles, unspentBigfunds])

  const eventEntities = useMemo(() => {
    const list: EntityListItemProps[] = [
      ...unconfirmedEvents.map((uEvent) => formatEvent(id, uEvent, true)),
      ...events.map((event) => formatEvent(id, event)),
    ]

    return list.sort(
      (a, b) =>
        new Date(b.timestamp || 0).getTime() -
        new Date(a.timestamp || 0).getTime()
    )
  }, [id, events, unconfirmedEvents])

  const utxos = useMemo(() => {
    const list: EntityListItemProps[] = []
    if (unspentOutputs.length) {
      unspentOutputs.forEach((output) =>
        list.push(formatUnspentBigFileOutputEntity(output))
      )
    }
    return list
  }, [unspentOutputs])

  return (
    <ContentLayout
      panel={
        <div className="flex flex-col gap-10">
          <div className="flex flex-wrap gap-y-2 justify-between items-center">
            <EntityHeading
              label="address"
              type="address"
              value={id}
              href={routes.address.view.replace(':id', id)}
            />
            <div className="flex gap-2 items-center">
              <Tooltip content={`${humanNumber(events.length)} total events`}>
                <Badge variant="accent">
                  {`${humanNumber(events.length)}`} events
                </Badge>
              </Tooltip>
            </div>
          </div>
          <div className="flex flex-col gap-y-2 md:gap-y-4 max-w-sm">
            {values.map((item) => (
              <ExplorerDatum key={item.label} {...item} />
            ))}
          </div>
        </div>
      }
    >
      <Tabs
        defaultValue={tab}
        value={tab}
        onValueChange={(val) => setTab(val as Tab)}
      >
        <TabsList aria-label="Address tabs">
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="utxos">Unspent outputs</TabsTrigger>
        </TabsList>
        <TabsContent value="events">
          <EntityList dataset={eventEntities} />
        </TabsContent>
        <TabsContent value="utxos">
          <EntityList dataset={utxos} />
        </TabsContent>
      </Tabs>
    </ContentLayout>
  )
}

function getTotal({
  address,
  inputs,
  outputs,
}: {
  address: string
  inputs?: { value: string; address: string }[]
  outputs?: { value: string | number; address: string }[]
}) {
  return (outputs || [])
    .reduce(
      (acc, o) => (o.address === address ? acc.plus(o.value) : acc),
      new BigNumber(0)
    )
    .minus(
      (inputs || []).reduce(
        (acc, i) => (i.address === address ? acc.plus(i.value) : acc),
        new BigNumber(0)
      )
    )
}

function formatV1TransactionEntity(
  id: string,
  v1Transaction: ExplorerEvent
): EntityListItemProps {
  const { transaction } = v1Transaction.data as EventV1Transaction
  return {
    hash: v1Transaction.id,
    big: getTotal({
      address: id,
      inputs: transaction.bigfileInputs,
      outputs: transaction.bigfileOutputs?.map((o) => o.bigfileOutput),
    }),
    sf: getTotal({
      address: id,
      inputs: transaction.bigfundInputs,
      outputs: transaction.bigfundOutputs?.map((o) => o.bigfundOutput),
    }).toNumber(),
    label: 'Transaction',
    initials: 'TX',
    href: routes.transaction.view.replace(':id', transaction.id),
    height: v1Transaction.index.height,
    timestamp: new Date(v1Transaction.timestamp).getTime(),
  }
}

function formatV2TransactionEntity(
  id: string,
  v2Transaction: ExplorerEvent
): EntityListItemProps {
  const transaction = v2Transaction.data as ExplorerV2Transaction
  return {
    hash: v2Transaction.id,
    big: getTotal({
      address: id,
      inputs: transaction.bigfileInputs?.map((o) => o.parent.bigfileOutput),
      outputs: transaction.bigfileOutputs,
    }),
    sf: getTotal({
      address: id,
      inputs: transaction.bigfundInputs?.map((o) => ({
        address: o.parent.bigfundOutput.address,
        value: String(o.parent.bigfundOutput.value),
      })),
      outputs: transaction.bigfundOutputs,
    }).toNumber(),
    label: 'Transaction',
    initials: 'TX',
    href: routes.transaction.view.replace(':id', transaction.id),
    height: v2Transaction.index.height,
    timestamp: new Date(v2Transaction.timestamp).getTime(),
  }
}

function formatV1ContractResolutionEntity(
  v1ContractResolution: ExplorerEvent
): EntityListItemProps {
  const { parent, bigfileElement } =
    v1ContractResolution.data as EventV1ContractResolution
  return {
    hash: v1ContractResolution.id,
    label: 'Contract Resolution',
    initials: 'CR',
    href: routes.contract.view.replace(':id', parent.id),
    big: new BigNumber(bigfileElement.bigfileOutput.value),
    timestamp: new Date(v1ContractResolution.timestamp).getTime(),
  }
}

function formatV2ContractResolutionEntity(
  v1ContractResolution: ExplorerEvent
): EntityListItemProps {
  const { resolution, bigfileElement } =
    v1ContractResolution.data as EventV2ContractResolution
  return {
    hash: v1ContractResolution.id,
    label: 'Contract Resolution',
    initials: 'CR',
    href: routes.contract.view.replace(':id', resolution.parent.id),
    big: new BigNumber(bigfileElement.bigfileOutput.value),
    timestamp: new Date(v1ContractResolution.timestamp).getTime(),
  }
}

function formatPayoutEntity(payout: ExplorerEvent): EntityListItemProps {
  const { bigfileElement } = payout.data as EventPayout
  const capitalizedType =
    payout.type.slice(0, 1).toUpperCase() + payout.type.slice(1)
  return {
    hash: payout.id,
    label: `${capitalizedType} Payout`,
    initials: `${capitalizedType.slice(0, 1)}P`,
    href: routes.address.view.replace(':id', bigfileElement.source),
    height: payout.index.height,
    big: new BigNumber(bigfileElement.bigfileOutput.value),
    timestamp: new Date(payout.timestamp).getTime(),
  }
}

function formatUnspentBigFileOutputEntity(
  bigfileOutput: ExplorerBigFileOutput
): EntityListItemProps {
  return {
    hash: bigfileOutput.id,
    big: new BigNumber(bigfileOutput.bigfileOutput.value),
    label: 'bigfile output',
    initials: 'SO',
    scVariant: 'value' as const,
  }
}

const formatEvent = (
  id: string,
  event: ExplorerEvent,
  isUnconfirmed = false
): EntityListItemProps => {
  let baseEntity: EntityListItemProps

  switch (event.type) {
    case 'v1Transaction':
      baseEntity = formatV1TransactionEntity(id, event)
      break
    case 'v2Transaction':
      baseEntity = formatV2TransactionEntity(id, event)
      break
    case 'v1ContractResolution':
      baseEntity = formatV1ContractResolutionEntity(event)
      break
    case 'v2ContractResolution':
      baseEntity = formatV2ContractResolutionEntity(event)
      break
    case 'miner':
    case 'foundation':
    case 'bigfundClaim':
      baseEntity = formatPayoutEntity(event)
      break
  }

  return isUnconfirmed ? { ...baseEntity, unconfirmed: true } : baseEntity
}
