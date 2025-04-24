import CustomSelect from '@/components/Forms/Select/Select';
import { ViewTypes } from '@/types';
import { Label } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import { useEffect, useState } from 'react';
import useUpdateCaneLocation from './useUpdateCaneLocation';
import { Cane } from '@/types/view/Specimen.interface';

interface UpdateCaneLocationFormProps {
  isOpen: boolean;
  caneDetails: Cane;
  withSlotId?: boolean;
}

const UpdateCaneLocationForm: React.FC<UpdateCaneLocationFormProps> = ({ isOpen, caneDetails, withSlotId = true }) => {
  const { t } = useTranslation('specimens');
  const {
    control,
    formState: { errors },
    watch,
    ...formProps
  } = useFormContext<ViewTypes.UpdateCaneLocationFormValues>();

  const {
    facilitiesList,
    vaultList,
    tankList,
    piesList,
    canisterList,
    caneList,
    changeFacilityId,
    changeVault,
    changeTank,
    changePies,
    changeCanister,
    fetchInitData,
    setCaneList,
  } = useUpdateCaneLocation(isOpen);
  useEffect(() => {
    if (caneDetails && isOpen && caneDetails?.facilityId) {
      // to prevent redundant request if location not exists
      fetchInitData(
        caneDetails?.facilityId,
        caneDetails?.tankId,
        caneDetails?.vaultId,
        caneDetails?.canisterId,
        caneDetails?.pieId
      );

      formProps.setValue('facilityId', caneDetails?.facilityId);
      formProps.setValue('vaultId', caneDetails?.vaultId);
      formProps.setValue('tankId', caneDetails?.tankId);
      formProps.setValue('pieId', caneDetails?.pieId);
      formProps.setValue('canisterId', caneDetails?.canisterId);
      formProps.setValue('slotId', caneDetails?.slotId);
    }
  }, [caneDetails, isOpen]);

  useEffect(() => {
    if (
      watch('facilityId') === caneDetails?.facilityId &&
      watch('vaultId') === caneDetails?.vaultId &&
      watch('tankId') === caneDetails?.tankId &&
      watch('pieId') === caneDetails?.pieId &&
      watch('canisterId') === caneDetails?.canisterId
    ) {
      setCaneList(prev => [...prev, { id: caneDetails?.slotId, number: caneDetails?.number }]);
      formProps.setValue('slotId', caneDetails?.slotId);
    }
  }, [watch('canisterId'), watch('pieId'), watch('tankId'), watch('vaultId'), watch('facilityId'), canisterList]);

  return (
    <div className="flex max-h-[100vh] flex-col gap-5 ">
      <div className="flex flex-col gap-6">
        <Label>
          {t('table.facility')}
          <ErrorValidationMessage touched={errors?.facilityId} message={errors?.facilityId?.message}>
            <CustomSelect
              dataTestId="update-location-facility"
              control={control}
              name={'facilityId'}
              options={facilitiesList?.map(el => ({ value: el.id, label: el.name })) || []}
              placeholder={`${t('table.facility')} *`}
              value={watch('facilityId')}
              onChangeByName={() => {
                changeFacilityId(watch('facilityId'));
                formProps.setValue('vaultId', '');
                formProps.setValue('tankId', '');
                formProps.setValue('pieId', '');
                formProps.setValue('canisterId', '');
                formProps.setValue('slotId', '');
              }}
            />
          </ErrorValidationMessage>
        </Label>

        <Label>
          {t('table.vault')}
          <CustomSelect
            dataTestId="update-location-vault"
            control={control}
            name={'vaultId'}
            options={vaultList?.map(el => ({ value: el.id, label: el.name })) || []}
            placeholder={`${t('table.vault')} *`}
            value={watch('vaultId')}
            error={errors?.vaultId}
            disabled={!vaultList?.length}
            onChangeByName={() => changeVault(watch('vaultId'))}
          />
        </Label>

        <Label>
          {t('table.Tank')}
          <CustomSelect
            dataTestId="update-location-tank"
            control={control}
            name={'tankId'}
            options={tankList?.map(el => ({ value: el.id, label: el.name })) || []}
            placeholder={`${t('table.Tank')} *`}
            disabled={!tankList?.length}
            value={watch('tankId')}
            error={errors?.tankId}
            onChangeByName={() => changeTank(watch('tankId'))}
          />
        </Label>
        <div>
          <div className="my-1 grid grid-cols-3 gap-2">
            <Label>
              {t('table.Pie')}
              <CustomSelect
                dataTestId="update-location-pie"
                control={control}
                name={'pieId'}
                options={piesList?.map(el => ({ value: el.id, label: el.color })) || []}
                placeholder={`${t('table.Pie')} *`}
                disabled={!piesList?.length}
                value={watch('pieId')}
                error={errors?.pieId}
                onChangeByName={() => changePies(watch('pieId'))}
              />
            </Label>
            <Label>
              {t('table.Canister')}
              <CustomSelect
                dataTestId="update-location-canister"
                control={control}
                name={'canisterId'}
                value={watch('canisterId')}
                options={canisterList?.map(el => ({ value: el.id, label: el.name })) || []}
                placeholder={`${t('table.Canister')} *`}
                disabled={!canisterList?.length}
                error={errors?.canisterId}
                onChangeByName={() => changeCanister(watch('canisterId'))}
              />
            </Label>
            <Label>
              {t('table.CaneNum')}
              <CustomSelect
                dataTestId="update-location-slot"
                control={control}
                name={'slotId'}
                options={caneList?.map(el => ({ value: el.id, label: el.number })) || []}
                placeholder={`${t('table.CaneNum')}`}
                value={watch('slotId')}
                error={errors?.slotId}
                disabled={!caneList?.length}
              />
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateCaneLocationForm;
