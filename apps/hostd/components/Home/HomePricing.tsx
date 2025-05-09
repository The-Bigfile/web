import {
  ChartXY,
  Text,
  Heading,
  DatumCardConfigurable,
  DatumScrollArea,
} from '@siafoundation/design-system'
import {
  humanBaseRpcPriceSuffix,
  humanCollateralPriceSuffix,
  humanEgressPriceSuffix,
  humanIngressPriceSuffix,
  humanSectorAccessPriceSuffix,
  humanStoragePriceSuffix,
} from '../../lib/humanUnits'
import { useMetrics } from '../../contexts/metrics'

export function HomePricing() {
  const { pricing } = useMetrics()

  return (
    <div className="flex flex-col gap-3">
      <Heading>Pricing</Heading>
      <DatumScrollArea bleed>
        <DatumCardConfigurable
          category="pricing"
          label="storage"
          color={pricing.config.data['storage'].color}
          big={pricing.stats['storage']}
          extendedSuffix={humanStoragePriceSuffix}
          defaultMode="latest"
          isLoading={pricing.isLoading}
          enabledModes={['latest', 'average']}
        />
        <DatumCardConfigurable
          category="pricing"
          label="ingress"
          color={pricing.config.data['ingress'].color}
          big={pricing.stats['ingress']}
          defaultMode="latest"
          extendedSuffix={humanIngressPriceSuffix}
          isLoading={pricing.isLoading}
          enabledModes={['latest', 'average']}
        />
        <DatumCardConfigurable
          category="pricing"
          label="egress"
          color={pricing.config.data['egress'].color}
          big={pricing.stats['egress']}
          defaultMode="latest"
          extendedSuffix={humanEgressPriceSuffix}
          isLoading={pricing.isLoading}
          enabledModes={['latest', 'average']}
        />
        <DatumCardConfigurable
          category="pricing"
          label="collateral"
          color={pricing.config.data['collateral'].color}
          big={pricing.stats['collateral']}
          defaultMode="latest"
          extendedSuffix={humanCollateralPriceSuffix}
          isLoading={pricing.isLoading}
          enabledModes={['latest', 'average']}
        />
        <DatumCardConfigurable
          category="pricing"
          label="contract"
          color={pricing.config.data['contract'].color}
          big={pricing.stats['contract']}
          defaultMode="latest"
          isLoading={pricing.isLoading}
          enabledModes={['latest', 'average']}
        />
        <DatumCardConfigurable
          category="pricing"
          label="sector access"
          color={pricing.config.data['sectorAccess'].color}
          big={pricing.stats['sectorAccess']}
          extendedSuffix={humanSectorAccessPriceSuffix}
          defaultMode="latest"
          isLoading={pricing.isLoading}
          enabledModes={['latest', 'average']}
        />
        <DatumCardConfigurable
          category="pricing"
          label="base RPC"
          color={pricing.config.data['baseRPC'].color}
          big={pricing.stats['baseRPC']}
          extendedSuffix={humanBaseRpcPriceSuffix}
          defaultMode="latest"
          isLoading={pricing.isLoading}
          enabledModes={['latest', 'average']}
        />
      </DatumScrollArea>
      <ChartXY
        id="hostd/v0/metrics/graphs/pricing"
        height={300}
        data={pricing.data}
        config={pricing.config}
        isLoading={pricing.isLoading}
        actionsLeft={
          <>
            <Text font="mono" weight="semibold">
              Pricing
            </Text>
          </>
        }
      />
    </div>
  )
}
