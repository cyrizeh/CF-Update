import DataGridTable, { ColDefType } from '@/components/DataGrid/DataGridTable';
import DateField from '@/components/Forms/DateField/DateField';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import CustomSelect from '@/components/Forms/Select/Select';
import TextInput from '@/components/Forms/TextInput/TextInput';
import { SpecimenTypeList } from '@/constants/specimens';
import { AddDevicesModalFormValues, DeviceItem, RFIDType, RFIDTypeTitles } from '@/types/view/AddSpecimanModal.type';
import dayjs from 'dayjs';
import { Button } from 'flowbite-react';
import { HTMLInputTypeAttribute, useState } from 'react';
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
  } = useFormContext<AddDevicesModalFormValues>();
  return (
    <Controller
      control={control}
      name={`devices.${index}.${fieldName}` as const}
      render={({ field }) => (
        <div>
          <TextInput
            {...field}
            value={typeof field.value === 'boolean' ? String(field.value) : field.value ?? ''}
            inputstyles={inputstyles || 'min-w-[80px]'}
            onChange={e => {
              const newValue = e.target.value;
              field.onChange(newValue);
              if (onChange) {
                onChange(newValue, index);
              }
            }}
            error={errors.devices?.[index]?.[fieldName]}
            type={type}
          />
          <ErrorValidationMessage
            touched={!!errors.devices?.[index]?.[fieldName]}
            message={errors.devices?.[index]?.[fieldName]?.message}
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

const AddDevicesSeparateForm: React.FC = () => {
  const {
    control,
    getValues,
    setError,
    clearErrors,
    formState: { errors },
    setValue,
    watch,
    trigger,
  } = useFormContext<AddDevicesModalFormValues>();
  const devices = getValues('devices');

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
    const qtyPaths = devices.map((_, idx) => `devices.${idx}.qty` as const);
    trigger(qtyPaths);
  };

  const columns: ColDefType[] = [
    {
      headerName: 'Specimen Type',
      field: 'specimentype',
      renderCell: (row: DeviceItem) => (
        <div>
          <CustomSelect
            options={SpecimenTypeList}
            placeholder="Specimen Type"
            onChange={(option: any) => {
              // Automatically set Device Type based on Specimen Type
              const deviceType =
                option?.value?.includes('Oocyte') || option?.value?.includes('Embryo')
                  ? 'Straw'
                  : option?.value?.includes('Sperm') || option?.value?.includes('Testicular')
                  ? 'Vial'
                  : 'Straw';
              // Update deviceType field with the selected value
              setValue(`devices.${devices.indexOf(row)}.specimentype`, option?.value);
              setValue(`devices.${devices.indexOf(row)}.deviceType`, deviceType);
              trigger([`devices.${devices.indexOf(row)}.deviceType`]);
            }}
            name={`devices.${devices.indexOf(row)}.specimentype`}
            control={control}
            stylesProps={{
              control: {
                minWidth: '150px',
              },
            }}
            error={errors.devices?.[devices.indexOf(row)]?.specimentype}
          />
          <ErrorValidationMessage
            touched={!!errors.devices?.[devices.indexOf(row)]?.specimentype}
            message={errors.devices?.[devices.indexOf(row)]?.specimentype?.message}
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
          name={`devices.${devices.indexOf(row)}.deviceType`}
          render={() => (
            <div>
              <div className="flex flex-col">
                <div>{watch(`devices.${devices.indexOf(row)}.deviceType`) || '-'}</div>
              </div>
              <ErrorValidationMessage
                touched={!!errors.devices?.[devices.indexOf(row)]?.deviceType}
                message={errors.devices?.[devices.indexOf(row)]?.deviceType?.message}
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
        <RenderCellWithIndex index={devices.indexOf(row)} fieldName="qty" onChange={handleQtyChange} type="number"/>
      ),
    },
    {
      headerName: 'Color',
      field: 'color',
      renderCell: (row: DeviceItem) => (
        <RenderCellWithIndex index={devices.indexOf(row)} fieldName="color" inputstyles="min-w-[200px]" />
      ),
    },
    {
      headerName: 'Notes',
      field: 'notes',
      renderCell: (row: DeviceItem) => (
        <RenderCellWithIndex index={devices.indexOf(row)} fieldName="notes" inputstyles="min-w-[200px]" />
      ),
    },
    {
      headerName: 'Device ID',
      field: 'description',
      renderCell: (row: DeviceItem) => (
        <RenderCellWithIndex index={devices.indexOf(row)} fieldName="description" inputstyles="min-w-[200px]" />
      ),
    },
    {
      headerName: 'Number of Specimens',
      renderHeader: () => (
        <div>
          <p>Number of</p>
          <p>Specimens</p>
        </div>
      ),
      field: 'numberOfSpecimens',
      renderCell: (row: DeviceItem) => (
        <RenderCellWithIndex index={devices.indexOf(row)} fieldName="numberOfSpecimens" type="number"/>
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
            name={`devices.${devices.indexOf(row)}.freesedate`}
            error={errors?.devices?.[devices.indexOf(row)]?.freesedate}
            placeholder={'MM/DD/YYYY'}
            maxDate={dayjs()}
          />{' '}
          <ErrorValidationMessage
            touched={!!errors.devices?.[devices.indexOf(row)]?.freesedate}
            message={errors.devices?.[devices.indexOf(row)]?.freesedate?.message}
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
        const rowIndex = devices.indexOf(row);
        return (
          <div className="flex flex-col">
            <div>
              {!!watch(`devices.${rowIndex}.rfidType`)
                ? RFIDTypeTitles[watch(`devices.${rowIndex}.rfidType`) as RFIDType]
                : '-'}
            </div>
            <ErrorValidationMessage
              touched={!!errors.devices?.[rowIndex]?.rfidType}
              message={errors.devices?.[rowIndex]?.rfidType?.message}
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
        const rowIndex = devices.indexOf(row);
        return (
          <div className="flex flex-col">
            <div>{watch(`devices.${rowIndex}.rfId`) || '-'}</div>
            <ErrorValidationMessage
              touched={!!errors.devices?.[rowIndex]?.rfId}
              message={errors.devices?.[rowIndex]?.rfId?.message}
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
        const rowIndex = devices.indexOf(row);
        return (
          <div className="flex flex-col">
            <Button onClick={() => openRFIDModal(rowIndex)} gradientDuoTone="primary">
              Edit RFID
            </Button>
            <div className="min-h-[25px]"> </div>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <DataGridTable columns={columns} rows={devices} isLoading={false} />
      {selectedIndex !== null && (
        <AddRFIDModal isOpen={isRFIDModalOpen} onClose={closeRFIDModal} index={selectedIndex} />
      )}
    </>
  );
};

export default AddDevicesSeparateForm;
