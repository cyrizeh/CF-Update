import CustomSelect from '@/components/Forms/Select/Select';
import { ViewTypes } from '@/types';
import { Label } from 'flowbite-react';
import useTranslation from 'next-translate/useTranslation';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import useUpdateCaneLocation from './useUpdateCaneLocation';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';

interface AddCaneLocationFormProps {
  isOpen: boolean;
}

const AddCaneLocationForm: React.FC<AddCaneLocationFormProps> = ({ isOpen }) => {
  const { t } = useTranslation('specimens');
  const {
    control,
    formState: { errors },
    watch,
    ...formProps
  } = useFormContext<ViewTypes.UpdateCaneLocationFormValues>();

  const {
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
  } = useUpdateCaneLocation(isOpen);

  useEffect(() => {
    changeFacilityId(watch('facilityId'));
    formProps.setValue('vaultId', '');
    formProps.setValue('tankId', '');
    formProps.setValue('pieId', '');
    formProps.setValue('canisterId', '');
    formProps.setValue('slotId', '');
  }, [watch('facilityId')]);

  return (
    <div className="flex max-h-[100vh] flex-col gap-5 ">
      <div className="flex flex-col gap-6">
        <Label>
          {t('table.vault')}
          <ErrorValidationMessage touched={errors?.vaultId} message={errors?.vaultId?.message}>
            <CustomSelect
              dataTestId="add-location-vault"
              control={control}
              name={'vaultId'}
              options={vaultList?.map(el => ({ value: el.id, label: el.name })) || []}
              placeholder={`${t('table.vault')} *`}
              value={watch('vaultId')}
              error={errors?.vaultId}
              disabled={!vaultList?.length}
              onChangeByName={() => changeVault(watch('vaultId'))}
            />
          </ErrorValidationMessage>
        </Label>

        <Label>
          {t('table.Tank')}
          <ErrorValidationMessage touched={errors?.tankId} message={errors?.tankId?.message}>
            <CustomSelect
              dataTestId="add-location-tank"
              control={control}
              name={'tankId'}
              options={tankList?.map(el => ({ value: el.id, label: el.name })) || []}
              placeholder={`${t('table.Tank')} *`}
              disabled={!tankList?.length}
              value={watch('tankId')}
              error={errors?.tankId}
              onChangeByName={() => changeTank(watch('tankId'))}
            />
          </ErrorValidationMessage>
        </Label>
        <div>
          <div className="my-1 grid grid-cols-3 gap-2">
            <Label>
              {t('table.Pie')}
              <ErrorValidationMessage touched={errors?.pieId} message={errors?.pieId?.message}>
                <CustomSelect
                  dataTestId="add-location-pie"
                  control={control}
                  name={'pieId'}
                  options={piesList?.map(el => ({ value: el.id, label: el.color })) || []}
                  placeholder={`${t('table.Pie')} *`}
                  disabled={!piesList?.length}
                  value={watch('pieId')}
                  error={errors?.pieId}
                  onChangeByName={() => changePies(watch('pieId'))}
                />
              </ErrorValidationMessage>
            </Label>
            <Label>
              {t('table.Canister')}
              <ErrorValidationMessage touched={errors?.canisterId} message={errors?.canisterId?.message}>
                <CustomSelect
                  dataTestId="add-location-canister"
                  control={control}
                  name={'canisterId'}
                  value={watch('canisterId')}
                  options={canisterList?.map(el => ({ value: el.id, label: el.name })) || []}
                  placeholder={`${t('table.Canister')} *`}
                  disabled={!canisterList?.length}
                  error={errors?.canisterId}
                  onChangeByName={() => changeCanister(watch('canisterId'))}
                />
              </ErrorValidationMessage>
            </Label>
            <Label>
              <ErrorValidationMessage touched={errors?.slotId} message={errors?.slotId?.message}>
                {t('table.CaneNum')}
                <CustomSelect
                  dataTestId="add-location-slot"
                  control={control}
                  name={'slotId'}
                  options={caneList?.map(el => ({ value: el.id, label: el.number })) || []}
                  placeholder={`${t('table.CaneNum')}`}
                  value={watch('slotId')}
                  error={errors?.slotId}
                  disabled={!caneList?.length}
                />
              </ErrorValidationMessage>
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCaneLocationForm;
