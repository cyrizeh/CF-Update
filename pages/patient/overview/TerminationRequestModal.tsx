/* eslint-disable complexity */
/* eslint-disable no-unused-vars */
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray, Controller } from 'react-hook-form';

import closeIcon from '@/public/icons/close-button.svg';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { Button, Label, Radio } from 'flowbite-react';
import Checkbox from '@/components/Forms/Checkbox/Checkbox';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { axiosInstance } from '@/api/axiosConfig';
import { toast } from 'react-toastify';
import { handleBackendErrors } from '@/utils/handleBackendErrors';
import Link from 'next/link';

interface TerminationRequestModalTypes {
  isOpen: boolean;
  onClose: () => void;
  specimenTypes: string[];
}

export type TerminationRequestFormValues = {
  specimenTerminationRequests: {
    specimenType: string;
    quantity: string;
    dispositionType: string;
  }[];
};

const TerminationRequestModal = ({ isOpen, onClose, specimenTypes }: TerminationRequestModalTypes) => {
  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(
      Yup.object().shape({
        specimenTerminationRequests: Yup.array().of(
          Yup.object().shape({
            quantity: Yup.string().required('Quantity is required'),
            dispositionType: Yup.string().when('quantity', {
              is: (quantity: string) => quantity !== 'None',
              then: schema => schema.required('Disposition type is required when quantity is not None'),
              otherwise: schema => schema.notRequired(),
            }),
          })
        ),
      })
    ),
    defaultValues: {
      specimenTerminationRequests: specimenTypes.map(type => ({
        specimenType: type,
        quantity: '',
        dispositionType: '',
      })),
    },
  });

  const [pdfDocs, setPdfDocs] = useState<{ documentUri: string; name: string }[]>([]);
  const [agreed, setAgreed] = useState(false);

  const downloadDocument = (file: any) => {
    if (file) {
      const a = document.createElement('a');
      a.href = file.documentUri;
      document.body.appendChild(a);
      window.URL.revokeObjectURL(file.documentUri);
      a.click();
    }
  };

  const onConfirm = (data: any) => {
    axiosInstance
      .post(`/Patients/requestTermination`, {
        specimenTerminationRequests: data.specimenTerminationRequests.map((item: any) => ({
          specimenType: item.specimenType,
          specimenTerminationQty: item.quantity,
          terminationType: item.dispositionType,
        })),
      })
      .then(resp => {
        setPdfDocs(resp.data);
        toast.success('The termination request submitted successfully.');
      })
      .catch(error => {
        if (error.response?.data?.errors) {
          handleBackendErrors(error.response.data.errors);
        }
      });
  };

  const { fields } = useFieldArray({
    control,
    name: 'specimenTerminationRequests',
  });
  useEffect(() => {
    reset();
    setPdfDocs([]);
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      scroll="paper"
      fullWidth={true}
      sx={{
        '& .MuiPaper-root': {
          background: 'transparent',
          zIndex: 20,
          maxWidth: '550px',
        },
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
        <div className="h-full w-full rounded-lg bg-[#1E2021]">
          <DialogTitle id="alert-dialog-title" sx={{ padding: 0 }}>
            <div className="flex justify-between p-5">
              <div className="h-5 w-5 cursor-pointer"></div>
              <div className="text-3xl font-light dark:text-white">{'Disposition or Donation Request'}</div>
              <div className="h-5 w-5 cursor-pointer" onClick={onClose}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>
          </DialogTitle>

          <DialogContent className="h-[600px] max-h-[calc(100vh-270px)] md:max-w-[550px]">
            <div className="space-y-6">
              <div className="flex w-full flex-col justify-between gap-4 overflow-y-scroll md:flex md:items-center">
                <div className="flex-1 gap-1 text-start font-normal text-[#D1D5DB]">
                  <p className="mb-2">
                    Please select the specimens for which you would like to terminate your cryostorage plan, and whether
                    you require disposition or donation for embryologist training for the selected specimens.
                  </p>
                  <p className="mb-2">
                    An initiated termination request for all specimens will pause your billing for 30 days to give you
                    time to complete any required documentation to complete the termination request. If you need
                    additional storage time beyond 30 days, you will be billed for an additional annual storage period
                    from the end of your previous billing period.
                  </p>
                  <p>
                    Select which specimens you wish to terminate, and whether they are to be discarded or donated. There
                    may be a fee for disposition, please see your{' '}
                    <Link className="underline" href={`/patient/billing`}>
                      billing tab
                    </Link>{' '}
                    for more details. Donated specimens will be transferred out of CryoFuture to World Embryology Skills
                    & Training (&ldquo;WEST&rdquo;) or an alternative embryologist training institute at no cost to you,
                    and used for clinical training of embryology and other laboratory staff as allowed by applicable
                    law. Specimens are ultimately destroyed and will not result in the birth of a child.
                  </p>
                  <div className="mt-5 flex flex-col gap-5">
                    <Checkbox
                      onChange={() => setAgreed(prev => !prev)}
                      checked={agreed}
                      label={'I agree to the terms and conditions above'}
                    />
                  </div>
                </div>
                <div className="divider h-[1px] w-full border-b border-cryo-light-grey" />
                {specimenTypes.length > 0 ? (
                  <form className="flex-1 justify-center">
                    {fields.map((field, index) => (
                      <div key={field.id} className="text-md mb-2 flex flex-col justify-center font-normal text-white">
                        <div className="mb-1 flex justify-center text-xl md:justify-start">{specimenTypes[index]}</div>
                        <div className="text-md grid-[repeat(7,_minmax(0,_auto)] mb-2 grid  items-center  gap-1 md:grid-cols-4  md:grid-rows-2 md:gap-2">
                          <p className="mb-2 pr-2 md:mb-0">Quantity:</p>
                          <Label
                            htmlFor={`specimenTerminationRequests[${index}].quantityAll`}
                            className="mb-2 flex items-center gap-2 md:mb-0">
                            <Controller
                              name={`specimenTerminationRequests.${index}.quantity`}
                              control={control}
                              render={({ field }) => (
                                <Radio
                                  {...field}
                                  id={`specimenTerminationRequests[${index}].quantityAll`}
                                  value="All"
                                  checked={watch(`specimenTerminationRequests.${index}.quantity`) === 'All'}
                                  onClick={() => setValue(`specimenTerminationRequests.${index}.quantity`, 'All')}
                                />
                              )}
                            />
                            All
                          </Label>
                          <Label
                            htmlFor={`specimenTerminationRequests[${index}].quantityNone`}
                            className="mb-2 flex items-center gap-2 md:mb-0">
                            <Controller
                              name={`specimenTerminationRequests.${index}.quantity`}
                              control={control}
                              render={({ field }) => (
                                <Radio
                                  {...field}
                                  id={`specimenTerminationRequests[${index}].quantityNone`}
                                  value="None"
                                  checked={watch(`specimenTerminationRequests.${index}.quantity`) === 'None'}
                                  onClick={() => setValue(`specimenTerminationRequests.${index}.quantity`, 'None')}
                                />
                              )}
                            />
                            None
                          </Label>

                          <Label
                            htmlFor={`specimenTerminationRequests[${index}].quantityOther`}
                            className="mb-2 flex  items-center  gap-2 md:mb-0">
                            <Controller
                              name={`specimenTerminationRequests.${index}.quantity`}
                              control={control}
                              render={({ field }) => (
                                <Radio
                                  {...field}
                                  id={`specimenTerminationRequests[${index}].quantityOther`}
                                  value="Other"
                                  checked={watch(`specimenTerminationRequests.${index}.quantity`) === 'Other'}
                                  onClick={() => setValue(`specimenTerminationRequests.${index}.quantity`, 'Other')}
                                />
                              )}
                            />
                            <p className="flex items-center gap-2 text-[#D1D5DB]">Other (Please contact CryoFuture)</p>
                          </Label>

                          <p className="mb-2 pr-2 md:mb-0">Termination Type:</p>

                          <Label
                            htmlFor={`specimenTerminationRequests.${index}.dispositionTypeDispose`}
                            className="mb-2 flex items-center gap-2 md:mb-0">
                            <Controller
                              name={`specimenTerminationRequests.${index}.dispositionType`}
                              control={control}
                              render={({ field }) => (
                                <Radio
                                  {...field}
                                  id={`specimenTerminationRequests[${index}].dispositionTypeDispose`}
                                  value="Disposition"
                                  checked={
                                    watch(`specimenTerminationRequests.${index}.dispositionType`) === 'Disposition'
                                  }
                                  onClick={() =>
                                    setValue(`specimenTerminationRequests.${index}.dispositionType`, 'Disposition')
                                  }
                                />
                              )}
                            />
                            Disposition
                          </Label>

                          <Label
                            htmlFor={`specimenTerminationRequests[${index}].dispositionTypeDonate`}
                            className="mb-2 flex items-center gap-2 md:mb-0">
                            <Controller
                              name={`specimenTerminationRequests.${index}.dispositionType`}
                              control={control}
                              render={({ field }) => (
                                <Radio
                                  {...field}
                                  id={`specimenTerminationRequests[${index}].dispositionTypeDonate`}
                                  value="Donation"
                                  checked={watch(`specimenTerminationRequests.${index}.dispositionType`) === 'Donation'}
                                  onClick={() =>
                                    setValue(`specimenTerminationRequests.${index}.dispositionType`, 'Donation')
                                  }
                                />
                              )}
                            />
                            Donate to WEST for Embryologist training
                          </Label>
                        </div>
                      </div>
                    ))}
                    {Object.values(errors).some((item: any) => item?.length > 0) && (
                      <div className="mb-2 text-xs text-rose-400">
                        Please select termination type for all selected specimens
                      </div>
                    )}
                    <div className="divider h-[1px] w-full border-b border-cryo-light-grey" />
                  </form>
                ) : (
                  <div className="text-md mb-2 flex flex flex-col items-center justify-center justify-center font-normal text-white">
                    <div className="mb-1 flex text-xl">No spesimen to terminate</div>
                  </div>
                )}
              </div>
              {pdfDocs.length > 0 && (
                <div className="text-md mb-2 flex flex-col justify-center font-normal text-white">
                  <div className="mb-1 flex text-xl">Termination Request Documents</div>
                  <p className="mb-0">
                    Please download and sign the termination of storage agreement for each specimen type you wish to
                    terminate.
                  </p>
                </div>
              )}

              {pdfDocs.length > 0
                ? pdfDocs.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-5 ">
                      <div className="flex items-center gap-2">
                        <div className="text-md sensitive mb-1 flex w-2/3 font-light dark:text-white">{file.name}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button gradientDuoTone="primary" onClick={() => downloadDocument(file)}>
                          Download
                        </Button>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </DialogContent>

          <DialogActions sx={{ padding: 0 }}>
            <div className="flex w-full justify-between p-5  pt-2">
              <Button color="transparent" onClick={onClose}>
                <div className=" font-light dark:text-white">Cancel</div>
              </Button>

              <Button
                type="submit"
                size="md"
                gradientDuoTone="primary"
                disabled={pdfDocs.length > 0 || !agreed}
                onClick={handleSubmit(onConfirm)}>
                Submit
              </Button>
            </div>
          </DialogActions>
        </div>
      </div>
    </Dialog>
  );
};

export default TerminationRequestModal;
