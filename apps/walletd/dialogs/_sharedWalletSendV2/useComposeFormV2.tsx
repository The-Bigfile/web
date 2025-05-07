/* eslint-disable react/no-unescaped-entities */
import BigNumber from 'bignumber.js'
import { isValidAddress, toHastings } from '@siafoundation/units'
import {
  Text,
  InfoTip,
  ValueSc,
  FieldSwitch,
  ConfigFields,
  FieldBigFile,
  FieldText,
  FieldNumber,
  FieldSelect,
  Tooltip,
} from '@siafoundation/design-system'
import { useForm } from 'react-hook-form'
import { useCallback, useEffect, useMemo } from 'react'
import { SendParamsV2 } from './typesV2'
import { Information16 } from '@siafoundation/react-icons'
import { Maybe } from '@siafoundation/types'

const exampleAddr =
  'e3b1050aef388438668b52983cf78f40925af8f0aa8b9de80c18eadcefce8388d168a313e3f2'

const defaultValues = {
  receiveAddress: '',
  changeAddress: '',
  customChangeAddress: false,
  mode: 'bigfile' as 'bigfile' | 'bigfund',
  bigfile: undefined as BigNumber,
  bigfund: undefined as BigNumber,
  includeFee: false,
}

function getFields({
  balanceSc,
  balanceSf,
  fee,
}: {
  balanceSc: BigNumber
  balanceSf: BigNumber
  fee: BigNumber
}): ConfigFields<typeof defaultValues, never> {
  return {
    receiveAddress: {
      type: 'text',
      title: 'Recipient address',
      placeholder: exampleAddr,
      validation: {
        validate: {
          required: (value: string) => {
            return !!value || 'required'
          },
          valid: (value: string) => {
            return isValidAddress(value) || 'invalid address'
          },
        },
      },
    },
    mode: {
      type: 'select',
      title: 'Action',
      options: [
        { value: 'bigfile', label: 'Send bigfiles' },
        { value: 'bigfund', label: 'Send bigfunds' },
      ],
      validation: {
        required: 'required',
      },
    },
    bigfile: {
      type: 'bigfile',
      title: 'BigFile',
      placeholder: '100',
      validation: {
        validate: {
          required: (value: Maybe<BigNumber>, values) =>
            values.mode !== 'bigfile' || !!value || 'required',
          gtz: (value: Maybe<BigNumber>, values) =>
            values.mode !== 'bigfile' ||
            !new BigNumber(value || 0).isZero() ||
            'must be greater than zero',
          balance: (value: Maybe<BigNumber>, values) =>
            values.mode !== 'bigfile' ||
            balanceSc.gte(toHastings(value || 0).plus(fee)) ||
            'not enough funds in wallet',
        },
      },
    },
    bigfund: {
      type: 'number',
      title: 'Siafunds',
      decimalsLimit: 0,
      placeholder: '100',
      validation: {
        validate: {
          required: (value, values) =>
            values.mode !== 'bigfund' || !!value || 'required',
          gtz: (value: Maybe<BigNumber>, values) =>
            values.mode !== 'bigfund' ||
            value?.gt(0) ||
            'must be greater than zero',
          balance: (value: Maybe<BigNumber>, values) =>
            values.mode !== 'bigfund' ||
            (balanceSc?.gte(fee) && balanceSf?.gte(value)) ||
            'not enough funds in wallet',
        },
      },
    },
    customChangeAddress: {
      type: 'boolean',
      title: 'Custom change address',
      validation: {},
    },
    changeAddress: {
      type: 'text',
      title: 'Change address',
      placeholder: exampleAddr,
      actions: (
        <Tooltip
          content={
            <>
              The address where any change or claims from the transaction will
              be sent. If a custom change address is not specified it is
              automatically set to the wallet's address 0.
            </>
          }
        >
          <Text color="subtle" className="cursor-pointer">
            <Information16 className="scale-75" />
          </Text>
        </Tooltip>
      ),
      validation: {
        validate: {
          required: (value: string, values) => {
            const customChangeAddressNotEnabled = !values.customChangeAddress
            return customChangeAddressNotEnabled || !!value || 'required'
          },
          valid: (value: string, values) => {
            const customChangeAddressNotEnabled = !values.customChangeAddress
            return (
              customChangeAddressNotEnabled ||
              isValidAddress(value) ||
              'invalid address'
            )
          },
        },
      },
    },
    includeFee: {
      type: 'boolean',
      title: '',
      validation: {},
    },
  }
}

type Props = {
  onComplete: (data: SendParamsV2) => void
  balanceSc: BigNumber | undefined
  balanceSf: BigNumber | undefined
  fee: BigNumber | undefined
  defaultChangeAddress: string
}

export function useComposeFormV2({
  balanceSc,
  balanceSf,
  fee,
  onComplete,
  defaultChangeAddress,
}: Props) {
  const form = useForm({
    mode: 'all',
    defaultValues,
  })

  const fields = getFields({
    balanceSc,
    balanceSf,
    fee,
  })

  const onValid = useCallback(
    async (values: typeof defaultValues) => {
      const big = new BigNumber(values.bigfile || 0)
      const sf = new BigNumber(values.bigfund || 0)

      const bigfile = values.includeFee
        ? toHastings(big).minus(fee)
        : toHastings(big)

      const bigfund = sf.toNumber()

      onComplete({
        receiveAddress: values.receiveAddress,
        changeAddress: values.customChangeAddress
          ? values.changeAddress
          : defaultChangeAddress,
        bigfile,
        bigfund,
        mode: values.mode,
        fee,
      })
    },
    [onComplete, defaultChangeAddress, fee]
  )

  const handleSubmit = useMemo(
    () => form.handleSubmit(onValid),
    [form, onValid]
  )

  const bigfile = form.watch('bigfile')
  const mode = form.watch('mode')
  const customChangeAddress = form.watch('customChangeAddress')
  const includeFee = form.watch('includeFee')
  const big = toHastings(bigfile || 0)

  // Reset the bigfile or bigfund field when the mode changes.
  useEffect(() => {
    if (mode === 'bigfund') {
      form.resetField('bigfile')
    }
    if (mode === 'bigfile') {
      form.resetField('bigfund')
    }
  }, [mode, form])

  const el = (
    <div className="flex flex-col gap-4">
      {balanceSf.gt(0) && (
        <FieldSelect size="medium" form={form} fields={fields} name="mode" />
      )}
      <FieldText
        size="medium"
        form={form}
        fields={fields}
        name="receiveAddress"
        autoComplete="off"
      />
      <div className="flex gap-2">
        <FieldSwitch
          size="small"
          form={form}
          fields={fields}
          name="customChangeAddress"
          group={false}
        >
          <div className="flex items-center gap-px">
            <Text color="verySubtle" weight="medium" size="14" ellipsis>
              custom change address
            </Text>
            {fields.changeAddress.actions}
          </div>
        </FieldSwitch>
      </div>
      {customChangeAddress && (
        <FieldText
          size="medium"
          form={form}
          fields={fields}
          name="changeAddress"
          autoComplete="off"
        />
      )}
      {mode === 'bigfile' ? (
        <>
          <FieldBigFile
            size="medium"
            form={form}
            fields={fields}
            name="bigfile"
          />
          <div className="flex items-center">
            <FieldSwitch
              size="small"
              form={form}
              fields={fields}
              name="includeFee"
            >
              <Text>Include fee</Text>
              <InfoTip>
                Include or exclude the network fee from the above transaction
                value.
              </InfoTip>
            </FieldSwitch>
            <div className="flex flex-1" />
          </div>
        </>
      ) : (
        <FieldNumber size="medium" form={form} fields={fields} name="bigfund" />
      )}
      <div className="flex flex-col gap-2 my-1">
        <div className="flex gap-2 justify-between items-center">
          <Text color="verySubtle">Network fee</Text>
          <div className="flex relative top-[-0.5px]">
            <ValueSc
              size="14"
              value={fee || new BigNumber(0)}
              variant="value"
              dynamicUnits={false}
            />
          </div>
        </div>
        {mode === 'bigfile' && fee && (
          <div className="flex justify-between gap-2 items-center">
            <Text color="verySubtle">Total</Text>
            <div className="flex relative top-[-0.5px]">
              <ValueSc
                size="14"
                value={includeFee ? big : big.plus(fee)}
                variant="value"
                dynamicUnits={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return {
    form,
    el,
    handleSubmit,
    reset: () => form.reset(defaultValues),
  }
}
