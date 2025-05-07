import {
  Text,
  ValueSf,
  ValueSc,
  ValueCopyable,
} from '@siafoundation/design-system'
import BigNumber from 'bignumber.js'
import { upperFirst } from '@technically/lodash'
import { getHref } from '../lib/utils'
import { EntityType } from '@siafoundation/units'

// entityType&entityValue | value | values | big | sf
export type DatumProps = {
  label: string
  value?: React.ReactNode
  displayValue?: string
  entityType?: EntityType
  entityValue?: string
  big?: BigNumber
  sf?: number
  comment?: React.ReactNode
  copyable?: boolean
}

export function ExplorerDatum({
  label,
  entityType,
  entityValue,
  copyable = true,
  value,
  displayValue,
  big,
  sf,
  comment,
}: DatumProps) {
  return (
    <div className="flex flex-wrap gap-x-12 gap-y-4 items-baseline py-1.5">
      <Text color="subtle" scaleSize="14" ellipsis className="flex-1">
        {upperFirst(label)}
      </Text>
      <div className="flex flex-col gap-2 items-end md:items-end md:flex-[2]">
        {big !== undefined && (
          <ValueSc scaleSize="18" variant="value" value={big} />
        )}
        {sf !== undefined && (
          <ValueSf scaleSize="18" variant="value" value={sf} />
        )}
        {entityType &&
          (entityValue ? (
            <ValueCopyable
              scaleSize="18"
              href={getHref(entityType, entityValue)}
              value={entityValue}
              type={entityType}
              displayValue={displayValue}
              // className="relative top-0.5"
              data-testid="explorer-datum-value"
            />
          ) : (
            <Text font="mono" weight="semibold" scaleSize="18">
              -
            </Text>
          ))}
        {value !== undefined && copyable && (
          <ValueCopyable
            scaleSize="18"
            label={label}
            value={String(value)}
            data-testid="explorer-datum-value"
          />
        )}
        {value !== undefined && !copyable && (
          <Text
            font="mono"
            weight="semibold"
            scaleSize="18"
            ellipsis
            data-testid="explorer-datum-value"
          >
            {value}
          </Text>
        )}
        {comment && (
          <Text color="subtle" size="12" data-testid="explorer-datum-value">
            {comment}
          </Text>
        )}
      </div>
    </div>
  )
}
