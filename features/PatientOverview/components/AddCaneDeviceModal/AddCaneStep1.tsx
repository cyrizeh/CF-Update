import Autocomplete2 from '@/components/Forms/Autocomplete2/Autocomplete2';
import DateField from '@/components/Forms/DateField/DateField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { ViewTypes } from '@/types';
import { RFIDDictionary } from '@/types/api/Responses/RFIDDictionary.interface';
import { RFIDType } from '@/types/view/AddSpecimanModal.type';
import classNames from 'classnames';
import { Button, Label, Radio } from 'flowbite-react';
import _ from 'lodash';
import useTranslation from 'next-translate/useTranslation';
import { useFormContext } from 'react-hook-form';
import useAddSpecimensModal from './useAddCaneDeviceModalFirstStep';
import { handleInputToUpperCase } from '@/utils/toUpperCase';
import dayjs from 'dayjs';

interface Step1Props {
  currentStep: number;
  isOpen: boolean;
  dictionaryRFID: RFIDDictionary;
  readersList: any[];
}

const AddCaneStep1: React.FC<Step1Props> = ({ currentStep, isOpen, dictionaryRFID, readersList }) => {
  // Utils
  const { t } = useTranslation('specimens');
  // Form
  const {
    control,
    register,
    formState: { errors },
    watch,
    setValue,
    trigger,
    clearErrors,
    setError,
  } = useFormContext<ViewTypes.AddSpecimanModalFormValues>();
  // Custom Hook
  const { handleReaderRFID, isReaderRFIDLoading, isZeroTagsLoading } = useAddSpecimensModal(isOpen);

  return currentStep === 1 ? (
    <div className="flex max-h-[100vh] flex-col gap-5 ">
      <div className="flex flex-col gap-3">
        <Label>
          {t('modal.dateOfFreezing')}
          <ErrorValidationMessage
            touched={errors?.caneData?.receiptDate}
            message={errors?.caneData?.receiptDate?.message}>
            <DateField
              setError={setError}
              clearErrors={clearErrors}
              control={control}
              name="caneData.receiptDate"
              error={errors?.caneData?.receiptDate}
              placeholder={'MM/DD/YYYY'}
              maxDate={dayjs()}
            />
          </ErrorValidationMessage>
        </Label>
        <Label>
          {t('table.clinic')}
          <div className={classNames({ 'pointer-events-none opacity-40': !!watch('caneData.id') })}>
            <ErrorValidationMessage touched={errors?.caneData?.clinic} message={errors?.caneData?.clinic?.message}>
              <Autocomplete2
                dataTestId="add-cane-clinic"
                defaultValue={watch('caneData.clinic')}
                url="/clinics"
                params={{
                  // Add Canes only to Completed Clinics
                  Status: 'Created',
                }}
                control={control}
                name="caneData.clinic"
                placeholder={`${t('table.clinic')} *`}
                isPrefilled
                error={errors?.caneData?.clinic}
                disabled={!!watch('caneData.id')}
              />
            </ErrorValidationMessage>
          </div>
        </Label>
        <Label>
          {t('table.facility')}
          <div className={classNames({ 'pointer-events-none opacity-40': !!watch('caneData.id') })}>
            <ErrorValidationMessage
              touched={errors?.caneData?.facilityId}
              message={errors?.caneData?.facilityId?.message}>
              <Autocomplete2
                dataTestId="add-cane-facility"
                defaultValue={watch('caneData.facilityId')}
                url="/Facilities"
                control={control}
                name="caneData.facilityId"
                placeholder={`${t('table.facility')} *`}
                isPrefilled
                error={errors?.caneData?.facilityId}
                disabled={!!watch('caneData.id')}
              />
            </ErrorValidationMessage>
          </div>
        </Label>
        <Label>
          {t('modal.primaryIdentifier')}
          <ErrorValidationMessage
            touched={errors?.caneData?.primaryIdentifier}
            message={errors?.caneData?.primaryIdentifier?.message}>
            <Autocomplete2
              dataTestId="add-cane-primaryIdentifier"
              defaultValue={watch('caneData.primaryIdentifier')}
              url="/specimenIdentifiers"
              control={control}
              name="caneData.primaryIdentifier"
              placeholder={`${t('modal.primaryIdentifier')} *`}
              isPrefilled
              error={errors?.caneData?.primaryIdentifier}
              customOptionField="email"
            />
          </ErrorValidationMessage>
        </Label>

        <Label>
          {t('modal.secondaryIdentifier')}
          <ErrorValidationMessage
            touched={errors?.caneData?.secondaryIdentifier}
            message={errors?.caneData?.secondaryIdentifier?.message}>
            <TextInput
              data-testid="add-cane-secondaryIdentifier"
              required
              type="text"
              placeholder={`${t('modal.secondaryIdentifier')}`}
              register={register('caneData.secondaryIdentifier.name')}
              error={errors?.caneData?.secondaryIdentifier}
              disabled
              inputstyles="cursor-not-allowed !pl-4"
            />
          </ErrorValidationMessage>
        </Label>
        <Label>
          {t('table.caneLabel')}
          <ErrorValidationMessage touched={errors?.caneData?.caneLabel} message={errors?.caneData?.caneLabel?.message}>
            <TextInput
              data-testid="add-cane-caneLabel"
              required
              type="text"
              placeholder={`${t('table.caneLabel')}`}
              register={register('caneData.caneLabel')}
              error={errors?.caneData?.caneLabel}
              inputstyles="!pl-4"
            />
          </ErrorValidationMessage>
        </Label>
        <Label>
          {t('table.cane_description')}
          <ErrorValidationMessage touched={errors?.caneData?.caneColor} message={errors?.caneData?.caneColor?.message}>
            <TextInput
              data-testid="add-cane-caneColor"
              required
              type="text"
              placeholder={`${t('table.cane_description')}`}
              register={register('caneData.caneColor')}
              error={errors?.caneData?.caneColor}
              inputstyles="!pl-4"
            />
          </ErrorValidationMessage>
        </Label>
        <Label>
          {'Device Quantity'}
          <ErrorValidationMessage
            touched={errors?.caneData?.deviceNumber}
            message={errors?.caneData?.deviceNumber?.message}>
            <TextInput
              data-testid="add-cane-deviceNumber"
              required
              type="number"
              max={99}
              min={1}
              placeholder={`Device Quantity *`}
              register={register('caneData.deviceNumber')}
              error={errors?.caneData?.deviceNumber}
              inputstyles="!pl-4"
            />
          </ErrorValidationMessage>
        </Label>
        {/* RFID LOGIC */}
        <div
          className={classNames(
            'grid gap-4 md:grid-cols-3',
            { 'items-center': !readersList?.length },
            { 'pointer-events-none opacity-40': !!watch('caneData.id') }
          )}>
          <div className="flex flex-col gap-1">
            <Label htmlFor="rfidType-auto" className="flex items-center gap-2 pl-1">
              <Radio
                data-testid="add-cane-rfidType-AutoGenerated"
                id="rfidType-auto"
                checked={watch('caneData.rfidType') === RFIDType.AutoGenerated}
                onChange={() => {
                  setValue('caneData.rfidType', RFIDType.AutoGenerated);
                  setValue('caneData.rfId', '');
                  setValue('caneData.rfidReader', '');
                  setValue('caneData.rfidReaderId', '');
                  setValue('caneData.rfidItemType', '');
                  trigger(['caneData.rfidType', 'caneData.rfidReader', 'caneData.rfidReaderId', 'caneData.rfId']);
                }}
              />
              {t('modal.autoGenerated')}
            </Label>
            <Label htmlFor="rfidType-manual" className="flex items-center gap-2 pl-1">
              <Radio
                data-testid="add-cane-rfidType-Manual"
                id="rfidType-manual"
                checked={watch('caneData.rfidType') === RFIDType.Manual}
                onChange={() => {
                  setValue('caneData.rfidType', RFIDType.Manual);
                  setValue('caneData.rfId', '');
                  setValue('caneData.rfidReader', '');
                  setValue('caneData.rfidItemType', '');
                  trigger(['caneData.rfidType', 'caneData.rfidReader', 'caneData.rfidReaderId']);
                }}
              />
              {t('modal.manual')}
            </Label>
            {readersList?.length > 0 && (
              <Label htmlFor="rfidType-reader" className="flex items-center gap-2 pl-1">
                <Radio
                  data-testid="add-cane-rfidType-Reader"
                  id="rfidType-reader"
                  checked={watch('caneData.rfidType') === RFIDType.Reader}
                  onChange={() => {
                    setValue('caneData.rfidType', RFIDType.Reader);
                    setValue('caneData.rfId', '');
                    setValue('caneData.rfidReaderId', '');
                    setValue('caneData.rfidItemType', '');
                    trigger(['caneData.rfidType']);
                    clearErrors(['caneData.rfId']);
                  }}
                />
                {t('modal.reader')}
              </Label>
            )}
            <ErrorValidationMessage
              touched={errors?.caneData?.rfidType}
              message={errors?.caneData?.rfidType?.message}
            />
          </div>
          <div className="flex flex-col">
            <Label>
              {t('table.RFID')}
              <div className={classNames({ 'opacity-40': watch('caneData.rfidType') != RFIDType.Manual })}>
                <TextInput
                  data-testid="add-cane-RFID"
                  required
                  type="text"
                  placeholder={`${t('table.RFID')}`}
                  register={register('caneData.rfId')}
                  disabled={watch('caneData.rfidType') != RFIDType.Manual}
                  onInput={handleInputToUpperCase}
                  error={errors?.caneData?.rfId}
                />
              </div>
            </Label>
            <ErrorValidationMessage touched={errors?.caneData?.rfId} message={errors?.caneData?.rfId?.message} />
            {!_.isEmpty(dictionaryRFID) && watch('caneData.rfidItemType') && (
              <ErrorValidationMessage
                touched={!!watch('caneData.rfidItemType')}
                message={
                  !!dictionaryRFID[watch('caneData.rfidItemType')]
                    ? `${dictionaryRFID[watch('caneData.rfidItemType')]} ${t('scannedType')}`
                    : 'Item was scanned'
                }
                style={{
                  label: {
                    color: '#BCF0DA',
                  },
                }}
              />
            )}
          </div>
          {readersList?.length > 0 && (
            <div className="flex flex-col">
              <Label>
                {t('modal.reader')}
                <CustomSelect
                  dataTestId="add-cane-rfidReader"
                  control={control}
                  name={'caneData.rfidReader'}
                  options={readersList || []}
                  placeholder={`${t('modal.reader')}`}
                  value={watch('caneData.rfidReader')}
                  disabled={watch('caneData.rfidType') != RFIDType.Reader}
                  onChange={val => {
                    if (val?.value) {
                      //reset rfid
                      clearErrors(`caneData.rfidReaderId`);
                      trigger('caneData.rfId');
                      setValue('caneData.rfId', '');
                      setValue('caneData.rfidItemType', '');
                      handleReaderRFID(val?.value || '');
                      trigger('caneData.rfId');
                    }
                  }}
                />
              </Label>
              <ErrorValidationMessage
                touched={
                  errors?.caneData?.rfidReader ||
                  (errors?.caneData?.rfidReaderId && errors?.caneData?.rfidReaderId.type !== 'custom')
                }
                message={errors?.caneData?.rfidReader?.message || errors?.caneData?.rfidReaderId?.message}
              />
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2">
          {errors?.caneData?.rfidReaderId && errors?.caneData?.rfidReaderId.type === 'custom' && (
            <ErrorValidationMessage
              touched={errors?.caneData?.rfidReaderId}
              message={errors?.caneData?.rfidReaderId?.message}
              style={{
                label: {
                  fontSize: '14px',
                },
              }}
            />
          )}
          {
            // can rescan if there is error or if RFID was created by scanner
          }
          {((errors?.caneData?.rfidReaderId && errors?.caneData?.rfidReaderId.type === 'custom') ||
            (!watch('caneData.id') && // hide rescan if it is edit
              !!watch('caneData.rfidReader') &&
              watch('caneData.rfidType') === RFIDType.Reader)) && (
            <Button
              data-testid="add-cane-rfidType-rescan"
              gradientDuoTone="primary"
              onClick={() => {
                if (watch('caneData.rfidReader')) {
                  clearErrors('caneData.rfId');
                  clearErrors(`caneData.rfidReaderId`);
                  //reset rfid
                  setValue('caneData.rfId', '');
                  setValue('caneData.rfidItemType', '');
                  handleReaderRFID(watch('caneData.rfidReader') || '');
                }
              }}
              disabled={isReaderRFIDLoading || isZeroTagsLoading}>
              {'Rescan'}
            </Button>
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default AddCaneStep1;
