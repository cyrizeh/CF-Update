import useInventoryMutation from '@/api/mutations/useInventoryMutation';
import { useGetReaders } from '@/api/queries/reader.queries';
import { useGetRfidConfiguration } from '@/api/queries/speciment.queries';
import { useCryoGattContext } from '@/contexts/CryoGattContext/CryoGattContext';
import { ViewTypes } from '@/types';
import { IdLabResultType } from '@/types/view/AddSpecimanModal.type';
import { formatDateDayJS } from '@/utils/formatDate';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import dayjs from 'dayjs';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import { Control, UseFormSetValue, UseFormWatch, useWatch } from 'react-hook-form';

export const requiredNotesLabResults = [IdLabResultType.Reactive, IdLabResultType.IncompleteTesting];

const useAddSpecimansModal = (
  onClose: any,
  formState: ViewTypes.AddSpecimanModalFormValues,
  patient: any,
  currentStep: number,
  setCurrentStep: Dispatch<SetStateAction<number>>,
  setValue: UseFormSetValue<ViewTypes.AddSpecimanModalFormValues>,
  refetchPatientInfo: ((id: any, options?: any) => void) | undefined,
  setError: any,
  isOpen: boolean,
  watch: UseFormWatch<ViewTypes.AddSpecimanModalFormValues>,
  control: Control<ViewTypes.AddSpecimanModalFormValues, any>
) => {
  const maxCountOfSteps = 3;
  // states
  const [dictionaryRFID, setDictionaryRFID] = useState<Record<string, string>>({});
  const [readersList, setReadersList] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  // apis
  const { createDevice, createCane, createCaneDisease, updateCane } = useInventoryMutation();
  const { addCaneNote, updateCaneNote } = useInventoryMutation();
  const { canUseScanner } = useCryoGattContext();
  const { data: dictionary } = useGetRfidConfiguration(canUseScanner);
  const { data: readers } = useGetReaders(canUseScanner);
  // form
  const newStep = useRef<number>(currentStep); // use to check if user go back from straws to stop request to scanner
  const currentStepWatch = useWatch({ control, name: 'currentStep' });
  const caneData = formState?.caneData;
  const deviceData = formState?.specimensData;

  const stepClick = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (currentStep === 1) {
        if (!!caneData?.id) {
          await updateCane
            .trigger({
              caneDescription: caneData?.caneColor || '',
              label: caneData?.caneLabel || '',
              expectedDeviceQty: caneData?.deviceNumber,
              primaryIdentifierId: caneData?.primaryIdentifier.userId || '',
              receiptDate: caneData?.receiptDate ? dayjs(caneData.receiptDate).format('YYYY-MM-DD') : null,
              caneId: caneData?.id,
            })
            .then((response: any) => {
              const caneId = response?.data?.id;
              setValue('caneData.id', caneId);

              setCurrentStep(2);
              setValue('currentStep', 2);
            })
            .catch(reason => {
              if (reason?.response?.data?.errors) {
                handleBackendErrors(reason.response.data.errors);
              }
            });
        } else {
          await createCane
            .trigger({
              patientId: patient.id,
              clinicId: caneData?.clinic.id || '',
              rfid: caneData?.rfId || '',
              caneDescription: caneData?.caneColor || '',
              label: caneData?.caneLabel || '',
              expectedDeviceQty: caneData?.deviceNumber,
              primaryIdentifierId: caneData?.primaryIdentifier?.userId || '',
              receiptDate: caneData?.receiptDate ? dayjs(caneData.receiptDate).format('YYYY-MM-DD') : null,
              facilityId: caneData?.facilityId.id || '',
            })
            .then((response: any) => {
              const caneId = response?.data?.id;
              setValue('caneData.id', caneId);

              setCurrentStep(2);
              setValue('currentStep', 2);
            })
            .catch(reason => {
              if (reason?.response?.data?.errors) {
                handleBackendErrors(reason.response.data.errors);
              }
            });
        }
      } else if (currentStep === 2) {
        await createCaneDisease
          .trigger({
            caneId: caneData?.id,
            fdaEligibility: caneData?.FDAEligibility,
            idLabResult: caneData?.idLabResult,
            reactive: caneData?.reactive || null,
            reactivity: caneData?.reactivity,
          })
          .then(() => {
            setCurrentStep(3);
            setValue('currentStep', 3);
          })
          .catch(reason => {
            if (reason?.response?.data?.errors) {
              handleBackendErrors(reason.response.data.errors);
            }
          });
        // Add Notes if ID LabResult equal [IdLabResultType.Reactive, IdLabResultType.IncompleteTesting]
        if (caneData?.idLabResult && requiredNotesLabResults.includes(caneData?.idLabResult)) {
          if (caneData?.noteId) {
            await updateCaneNote
              .trigger({
                caneId: caneData?.id,
                text: caneData?.notes || '',
                noteId: caneData.noteId,
              })
              .catch((reason: any) => {
                if (reason?.response?.data?.errors) {
                  handleBackendErrors(reason.response.data.errors);
                }
              });
          } else {
            await addCaneNote
              .trigger({
                caneId: caneData?.id,
                text: caneData?.notes || '',
              })
              .then((response: any) => {
                const { data } = response;
                setValue('caneData.noteId', data?.id);
              })
              .catch((reason: any) => {
                if (reason?.response?.data?.errors) {
                  handleBackendErrors(reason.response.data.errors);
                }
              });
          }
        }
      } else if (currentStep === 3) {
        await createDevice
          .trigger({
            devices: deviceData?.map(device => ({
              caneId: caneData?.id || '',
              expectedSpecimenQty: Number(device?.numberOfSpecimens),
              notes: device?.notes || '',
              quantity: Number(device?.qty),
              specimenType: device?.specimentype,
              color: device?.color || null,
              numberDescription: device?.description || null,
              rfid: device?.rfId || (device?.rfidType ? '' : null),
              freezeDate: device?.freesedate ? formatDateDayJS(device?.freesedate) : null,
            })),
          })
          .then(() => {
            refetchPatientInfo?.(undefined, { revalidate: true });
            onClose();
          })
          .catch(reason => {
            if (reason?.response?.data?.errors) {
              handleBackendErrors(reason.response.data.errors);
            }
          });
      }
    } catch (error) {
      console.error('Error in step click:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setValue('currentStep', watch('currentStep') - 1);
    }
  };

  const isLastStep = currentStep === maxCountOfSteps;

  useEffect(() => {
    if (dictionary) {
      setDictionaryRFID(dictionary);
    }
  }, [dictionary]);

  useEffect(() => {
    newStep.current = currentStepWatch;
  }, [currentStepWatch]);

  useEffect(() => {
    if (readers) {
      const list = readers.map((item: any) => {
        return {
          label: item?.Name,
          value: item?.Id,
        };
      });
      setReadersList(list);
    }
  }, [readers]);
  return {
    stepClick,
    isLastStep,
    maxCountOfSteps,
    onPrevStep,
    dictionaryRFID,
    readersList,
    isSubmitting,
  };
};

export default useAddSpecimansModal;
