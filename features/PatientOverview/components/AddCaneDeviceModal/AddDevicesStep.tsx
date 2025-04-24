import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import DateField from '@/components/Forms/DateField/DateField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { SpecimenTypeList } from '@/constants/specimens';
import { AddSpecimanModalFormValues, DeviceItem, RFIDType, RFIDTypeTitles } from '@/types/view/AddSpecimanModal.type';
import dayjs from 'dayjs';
import { Button } from 'flowbite-react';
import { HTMLInputTypeAttribute, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import AddRFIDModal from './AddRFIDModal/AddRFIDModal';

interface RenderCellWithIndexProps {
  index: number;
  fieldName: keyof DeviceItem;
  inputstyles?: string;
  onChange?: (newValue: string | number, index: number) => void;
  type?: HTMLInputTypeAttribute | undefined;
}

const RenderCellWithIndex: React.FC<RenderCellWithIndexProps> = ({ index, fieldName, inputstyles, onChange, type }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext<AddSpecimanModalFormValues>();
  return (
    <Controller
      control={control}
      name={`specimensData.${index}.${fieldName}` as const}
      render={({ field }) => (
        <div>
          <TextInput
            {...field}
            value={typeof field.value === 'boolean' ? String(field.value) : field.value ?? ''}
            inputstyles={inputstyles || 'min-w-[80px]'}
            error={errors.specimensData?.[index]?.[fieldName]}
            onChange={e => {
              const newValue = e.target.value;
              field.onChange(newValue);
              if (onChange) {
                onChange(newValue, index);
              }
            }}
            type={type}
            data-testid={`add-device-${fieldName}`}
          />
          <ErrorValidationMessage
            touched={!!errors.specimensData?.[index]?.[fieldName]}
            message={errors.specimensData?.[index]?.[fieldName]?.message}
            style={{
              container: {
                minHeight: '24px',
              },
            }}>
            {' '}
          </ErrorValidationMessage>
        </div>
      )}
    />
  );
};

const AddDevicesTable: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const {
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext<AddSpecimanModalFormValues>();
  const specimensData = getValues('specimensData');

  const [isRFIDModalOpen, setRFIDModalOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const openRFIDModal = (index: number) => {
    setSelectedIndex(index);
    setRFIDModalOpen(true);
  };

  const closeRFIDModal = () => {
    setRFIDModalOpen(false);
    setSelectedIndex(null);
  };

  const handleQtyChange = () => {
    // Create an array of paths for each qty field in specimensData
    const qtyPaths = specimensData.map((_, idx) => `specimensData.${idx}.qty` as const);
    trigger(qtyPaths);
  };

  const columns: ColDefType[] = [
    {
      headerName: 'Specimen Type',
      field: 'specimentype',
      renderCell: (row: DeviceItem) => (
        <div>
          <CustomSelect
            dataTestId="add-device-specimenType"
            control={control}
            name={`specimensData.${specimensData.indexOf(row)}.specimentype`}
            options={SpecimenTypeList}
            placeholder="Specimen Type"
            value={SpecimenTypeList.find(
              option => option.value === watch(`specimensData.${specimensData.indexOf(row)}.specimentype`)
            )}
            onChange={(option: any) => {
              setValue(`specimensData.${specimensData.indexOf(row)}.specimentype`, option?.value);
              // Automatically set Device Type based on Specimen Type
              const deviceType =
                option?.value?.includes('Oocyte') || option?.value?.includes('Embryo')
                  ? 'Straw'
                  : option?.value?.includes('Sperm') || option?.value?.includes('Testicular')
                  ? 'Vial'
                  : 'Straw';
              // Update deviceType field with the selected value
              setValue(`specimensData.${specimensData.indexOf(row)}.deviceType`, deviceType);
              trigger([`specimensData.${specimensData.indexOf(row)}.deviceType`]);
            }}
            stylesProps={{
              control: {
                minWidth: '150px',
              },
            }}
            error={errors.specimensData?.[specimensData.indexOf(row)]?.specimentype}
          />
          <ErrorValidationMessage
            touched={!!errors.specimensData?.[specimensData.indexOf(row)]?.specimentype}
            message={errors.specimensData?.[specimensData.indexOf(row)]?.specimentype?.message}
            style={{
              container: {
                minHeight: '24px',
              },
            }}>
            {' '}
          </ErrorValidationMessage>
        </div>
      ),
    },
    {
      headerName: 'Device Type',
      field: 'deviceType',
      renderCell: (row: DeviceItem) => (
        <Controller
          control={control}
          name={`specimensData.${specimensData.indexOf(row)}.deviceType`}
          render={() => (
            <div>
              <div className="flex flex-col">
                <div>{watch(`specimensData.${specimensData.indexOf(row)}.deviceType`) || '-'}</div>
              </div>
              <ErrorValidationMessage
                touched={!!errors.specimensData?.[specimensData.indexOf(row)]?.deviceType}
                message={errors.specimensData?.[specimensData.indexOf(row)]?.deviceType?.message}
                style={{
                  container: {
                    minHeight: '24px',
                  },
                }}></ErrorValidationMessage>
            </div>
          )}
        />
      ),
    },
    {
      headerName: 'Qty',
      field: 'qty',
      renderCell: (row: DeviceItem) => (
        <RenderCellWithIndex
          index={specimensData.indexOf(row)}
          fieldName="qty"
          inputstyles="min-w-[150px]"
          onChange={handleQtyChange}
          type="number"
        />
      ),
    },
    {
      headerName: 'Color',
      field: 'color',
      renderCell: (row: DeviceItem) => (
        <RenderCellWithIndex index={specimensData.indexOf(row)} fieldName="color" inputstyles="min-w-[200px]" />
      ),
    },
    {
      headerName: 'Notes',
      field: 'notes',
      renderCell: (row: DeviceItem) => (
        <RenderCellWithIndex index={specimensData.indexOf(row)} fieldName="notes" inputstyles="min-w-[200px]" />
      ),
    },
    {
      headerName: 'Device ID',
      field: 'description',
      renderCell: (row: DeviceItem) => (
        <RenderCellWithIndex index={specimensData.indexOf(row)} fieldName="description" inputstyles="min-w-[200px]" />
      ),
    },
    {
      headerName: 'Number of Specimens',
      renderHeader: () => (
        <div>
          <p>Expected number</p>
          <p>of Specimens</p>
        </div>
      ),
      field: 'numberOfSpecimens',
      renderCell: (row: DeviceItem) => (
        <RenderCellWithIndex index={specimensData.indexOf(row)} fieldName="numberOfSpecimens" type="number" />
      ),
    },
    {
      headerName: 'Freezing Date',
      field: 'freesedate',
      renderCell: (row: DeviceItem) => (
        <div className="min-w-[200px]">
          <DateField
            setError={setError}
            clearErrors={clearErrors}
            control={control}
            name={`specimensData.${specimensData.indexOf(row)}.freesedate`}
            error={errors?.specimensData?.[specimensData.indexOf(row)]?.freesedate}
            placeholder={'MM/DD/YYYY'}
            maxDate={dayjs()}
          />{' '}
          <ErrorValidationMessage
            touched={!!errors.specimensData?.[specimensData.indexOf(row)]?.freesedate}
            message={errors.specimensData?.[specimensData.indexOf(row)]?.freesedate?.message}
            style={{
              container: {
                minHeight: '24px',
              },
            }}>
            {' '}
          </ErrorValidationMessage>
        </div>
      ),
    },
    {
      headerName: 'RFID Type',
      field: 'rfidSettings',
      renderCell: (row: DeviceItem) => {
        const rowIndex = specimensData.indexOf(row);
        return (
          <div className="flex flex-col">
            <div>
              {!!watch(`specimensData.${rowIndex}.rfidType`)
                ? RFIDTypeTitles[watch(`specimensData.${rowIndex}.rfidType`) as RFIDType]
                : '-'}
            </div>
            <ErrorValidationMessage
              touched={!!errors.specimensData?.[rowIndex]?.rfidType}
              message={errors.specimensData?.[rowIndex]?.rfidType?.message}
              style={{ container: { minHeight: '24px' } }}
            />
          </div>
        );
      },
    },
    {
      headerName: 'RFID',
      field: 'rfidSettings',
      renderCell: (row: DeviceItem) => {
        const rowIndex = specimensData.indexOf(row);
        return (
          <div className="flex flex-col">
            <div>{watch(`specimensData.${rowIndex}.rfId`) || '-'}</div>
            <ErrorValidationMessage
              touched={!!errors.specimensData?.[rowIndex]?.rfId}
              message={errors.specimensData?.[rowIndex]?.rfId?.message}
              style={{ container: { minHeight: '24px' } }}
            />
          </div>
        );
      },
    },
    {
      headerName: 'Edit RFID',
      field: 'rfidSettings',
      renderCell: (row: DeviceItem) => {
        const rowIndex = specimensData.indexOf(row);
        return (
          <div className="flex flex-col">
            <Button data-testid="edit-rfid-btn" onClick={() => openRFIDModal(rowIndex)} gradientDuoTone="primary">
              Edit RFID
            </Button>
            <div className="min-h-[25px]"> </div>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const deviceNumber = getValues('caneData.deviceNumber');
    // to prevent memory leak
    // todo: find better solution
    if (deviceNumber > 0 && deviceNumber < 100) {
      const updatedSpecimensData = Array.from({ length: deviceNumber }, (_, index) => ({
        specimentype: '',
        donorOocyte: false,
        donorSperm: false,
        deviceType: '',
        qty: index + 1,
        color: '',
        notes: '',
        description: '',
        numberOfSpecimens: '1',
        freesedate: null,
        rfId: '',
        rfidType: null,
        rfidReader: null,
        rfidReaderId: '',
        rfidItemType: '',
      }));

      setValue('specimensData', updatedSpecimensData);
    }
  }, [watch('caneData.deviceNumber')]);

  return currentStep === 3 ? (
    <>
      {' '}
      <DataGridTable columns={columns} rows={specimensData} isLoading={false} />
      {selectedIndex !== null && (
        <AddRFIDModal isOpen={isRFIDModalOpen} onClose={closeRFIDModal} index={selectedIndex} />
      )}
    </>
  ) : null;
};

export default AddDevicesTable;
