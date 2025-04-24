import { ApiTypes, ViewTypes } from '@/types';
import { SpecimanDetailsByCane } from '@/types/view/Specimen.interface';
import { formatDateDayJS } from '@/utils/formatDate';

export const mapUpdateDeviceData = (data: ViewTypes.EditSpecimanModalFormValues, caneId: string) => {
  const {
    specimentype,
    description,
    notes,
    color,
    freesedate,
    numberOfSpecimens,
    deviceId,
    qty,
  } = data;

  const newSpecimenData: ApiTypes.UpdatedeviceRequest = {
    caneId: caneId || '',
    specimenType: specimentype || '',
    numberDescription: description || null,
    notes: notes || '',
    color: color || null,
    expectedSpecimenQty: Number(numberOfSpecimens) || 1,
    id: deviceId,
    quantity: qty,
    freezeDate: freesedate ? formatDateDayJS(freesedate) : null,
  };

  return newSpecimenData;
};

export const mapFormValuesFromDeviceData = (
  deviceData: SpecimanDetailsByCane | null | undefined
): ViewTypes.EditSpecimanModalFormValues => {
  const formData = {
    freesedate: deviceData?.freezeDate || null,
    description: deviceData?.numberDescription || '',
    notes: deviceData?.notes || '',
    specimentype: deviceData?.specimenType || '',
    color: deviceData?.color || '',
    numberOfSpecimens: deviceData?.expectedSpecimenQty || '1',
    deviceId: deviceData?.id || '',
    qty: deviceData?.quantity || 1,
    donorOocyte: deviceData?.donorOocyte || false,
    donorSperm: deviceData?.donorSperm || false,
    deviceType: deviceData?.type || '',
  };
  return formData;
};

export const formInitValues: ViewTypes.EditSpecimanModalFormValues = {
  specimentype: '',
  deviceType: '',
  qty: 0,
  color: '',
  notes: '',
  description: '',
  numberOfSpecimens: '',
  freesedate: null,
  deviceId: '',
};
