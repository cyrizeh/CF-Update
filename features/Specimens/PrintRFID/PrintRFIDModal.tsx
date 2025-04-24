/* eslint-disable complexity */
// @ts-nocheck
import Image from 'next/image';
import { yupResolver } from '@hookform/resolvers/yup';
import { FormProvider, useForm } from 'react-hook-form';
import { ViewTypes } from '@/types';
import closeIcon from '@/public/icons/close-button.svg';
import { Button, Label, Modal, Spinner } from 'flowbite-react';
import CustomSelect from '@/components/Forms/Select/Select';
import { ErrorValidationMessage } from '@/components/Forms/ErrorValidationMessage/ErrorValidationMessage';
import * as Yup from 'yup';
import { useEffect, useRef, useState } from 'react';
import useTranslation from 'next-translate/useTranslation';
import { toast } from 'react-toastify';
import classNames from 'classnames';

const printers = [{ label: 'Zebra Printer', value: 'Zebra' }];
const fonts = [
  { label: 'Standard', value: '1' },
  { label: 'Smaller', value: '2' },
];

interface PrintRFIDModalTypes {
  isOpen: boolean;

  onClose: () => void;
  caneData: CaneDetails | null | undefined;
  isLoading?: boolean;
}

const PrintRFIDModal = ({ isOpen, onClose, caneData }: PrintRFIDModalTypes) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { t } = useTranslation('specimens');
  const handlePrint = () => writeToSelectedPrinter();
  const errorCallback = errorMessage => {
    toast.error('Error: ' + errorMessage);
  };

  const [selectedDevice, setSelectedDevice] = useState();
  const [devices, setDevices] = useState([]);
  const [zplCmd, setZPLCmd] = useState();
  const [selectedFontSize, setSelectedFontSize] = useState('1');
  const {
    handleSubmit,
    setError,
    clearErrors,
    control,
    formState: { errors },
    watch,
    register,
    ...formProps
  } = useForm<ViewTypes.DateFormValues>({
    // @ts-ignore
    resolver: yupResolver(
      Yup.object().shape({
        printer: Yup.string().required('Please select a printer'),
      })
    ),
  });

  useEffect(() => {
    if (caneData && isOpen) {
      init();
      setup();
      formProps.setValue('printer', 'Zebra');
    }
  }, [caneData, isOpen]);

  function getTextWidth(text, font) {
    // Reuse a canvas object for better performance
    const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
    const context = canvas.getContext('2d');
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }

  function init() {
    var FNameWidth = getTextWidth(
      caneData?.patient?.firstName,
      'bold ' + selectedFontSize == '1' ? '30' : '25' + 'px serif'
    );
    var FNameOffset = 120 - FNameWidth / 2 < 4 ? 4 : 140 - FNameWidth / 2;
    var LNameWidth = getTextWidth(
      caneData?.patient?.lastName,
      'bold ' + selectedFontSize == '1' ? '30' : '25' + 'px serif'
    );
    var LNameOffset = 120 - LNameWidth / 2 < 4 ? 4 : 140 - LNameWidth / 2;
    var RFIDWidth = getTextWidth(caneData?.rfid, 'bold 20px serif');

    var RFIDOffset = RFIDWidth < 50 ? 100 : 140 - RFIDWidth / 2;

    var cmds = '^XA';
    cmds += '^MMT';
    cmds += '^PW524';
    cmds += '^LL262';
    cmds += '^LS0';
    cmds +=
      '^FO61,210^GFA,445,700,20,:Z64:eJxl0j1OwzAUB/B/atTHEMWM2dyNNRILA2p6FLhBNzJUrXsPjsIQFlau4N7AFRLyENU8v7q0pFaS4aeX95VAAahwOp08ie/YIwYEbSmezSfrtNXRJrufoWCIA1Yamt/gs1mC2Pwa8zna6JK1DuQ6eAa+lGeamp2lXsxwaJGsoq3VnJhNBzxC4v5ZJ/ZDxXsyrvtna1JBLIB8tg0pn025bDxPT1bGKxyexFqrPdklvp2Y9BKdCeQG7H2yY8+LRV0rTrYPycyXy0tL5gex4w4gCeBXyfKuZDd92gubOuCY7xZGZiu4nSFZcHWH0dlwL2NLc4zNkLoy2Yur6uKAF6udyvsbSlQ1GrZyNklxn7R9G1v6HlemPy7sWfLdmB10ny3XQLvEOc7Ku3htLsxNTv9Vieldzndhk4btAVzjbJy6QYtyJjV+ATQantU=:828E';
    //cmds += "^FO18,67^CF0,30^FDDOB:^FS";
    cmds += '^FT87,170^BXN,5,200,0,0,1,_,1';
    cmds += '^CF0,30^FH^FDCRFS' + caneData?.rfid + '^FS';
    cmds +=
      '^CF0,' +
      (selectedFontSize == '1' ? '30' : '25') +
      '^FO' +
      FNameOffset.toString() +
      ',20^FD' +
      caneData?.patient?.firstName +
      '^FS';
    cmds +=
      '^CF0,' +
      (selectedFontSize == '1' ? '30' : '25') +
      '^FO' +
      LNameOffset.toString() +
      ',50^FD' +
      caneData?.patient?.lastName +
      '^FS';
    cmds += '^CF0,20^FO' + RFIDOffset.toString() + ',180^FD' + caneData?.rfid + '^FS';
    cmds += '^RFW,H,1,2,1^FD4000^FS';
    cmds += '^RFW,H,2,16,1^FD' + caneData?.rfid.toString().padStart(32, 0) + '^FS'; // UHF RFID chip (Class 1, Gen 2) can be encoded with up to 32 hexadecimal characters
    cmds += '^PQ1,0,1,Y';
    cmds += '^XZ';
    setZPLCmd(cmds);
    requestLabel(cmds);
  }

  function fontSizeChange(fontVal) {
    setSelectedFontSize(fontVal);
    var FNameWidth = getTextWidth(caneData?.patient?.firstName, 'bold ' + fontVal == '1' ? '30' : '25' + 'px serif');
    var FNameOffset = 120 - FNameWidth / 2 < 4 ? 4 : 140 - FNameWidth / 2;
    var LNameWidth = getTextWidth(caneData?.patient?.lastName, 'bold ' + fontVal == '1' ? '30' : '25' + 'px serif');
    var LNameOffset = 120 - LNameWidth / 2 < 4 ? 4 : 140 - LNameWidth / 2;

    var RFIDWidth = getTextWidth(caneData?.rfid, 'bold 20px serif');
    var RFIDOffset = RFIDWidth < 50 ? 100 : 140 - RFIDWidth / 2;

    var cmds = '^XA';
    cmds += '^MMT';
    cmds += '^PW524';
    cmds += '^LL262';
    cmds += '^LS0';
    cmds +=
      '^FO61,210^GFA,445,700,20,:Z64:eJxl0j1OwzAUB/B/atTHEMWM2dyNNRILA2p6FLhBNzJUrXsPjsIQFlau4N7AFRLyENU8v7q0pFaS4aeX95VAAahwOp08ie/YIwYEbSmezSfrtNXRJrufoWCIA1Yamt/gs1mC2Pwa8zna6JK1DuQ6eAa+lGeamp2lXsxwaJGsoq3VnJhNBzxC4v5ZJ/ZDxXsyrvtna1JBLIB8tg0pn025bDxPT1bGKxyexFqrPdklvp2Y9BKdCeQG7H2yY8+LRV0rTrYPycyXy0tL5gex4w4gCeBXyfKuZDd92gubOuCY7xZGZiu4nSFZcHWH0dlwL2NLc4zNkLoy2Yur6uKAF6udyvsbSlQ1GrZyNklxn7R9G1v6HlemPy7sWfLdmB10ny3XQLvEOc7Ku3htLsxNTv9Vieldzndhk4btAVzjbJy6QYtyJjV+ATQantU=:828E';
    //cmds += "^FO18,67^CF0,30^FDDOB:^FS";
    cmds += '^FT87,170^BXN,5,200,0,0,1,_,1';
    cmds += '^CF0,30^FH^FDCRFS' + caneData?.rfid + '^FS';
    cmds +=
      '^CF0,' +
      (fontVal == '1' ? '30' : '25') +
      '^FO' +
      FNameOffset.toString() +
      ',20^FD' +
      caneData?.patient?.firstName +
      '^FS';
    cmds +=
      '^CF0,' +
      (fontVal == '1' ? '30' : '25') +
      '^FO' +
      LNameOffset.toString() +
      ',50^FD' +
      caneData?.patient?.lastName +
      '^FS';
    cmds += '^CF0,20^FO' + RFIDOffset.toString() + ',180^FD' + caneData?.rfid + '^FS';
    cmds += '^RFW,H,1,2,1^FD4000^FS';
    cmds += '^RFW,H,2,16,1^FD' + caneData?.rfid.toString().padStart(32, 0) + '^FS'; // UHF RFID chip (Class 1, Gen 2) can be encoded with up to 32 hexadecimal characters
    cmds += '^PQ1,0,1,Y';
    cmds += '^XZ';
    setZPLCmd(cmds);

    requestLabel(cmds);
  }
  async function requestLabel(cmds) {
    const response = await fetch(`https://api.labelary.com/v1/printers/12dpmm/labels/.875x.875/0/`, {
      method: 'POST',
      headers: {
        Accept: 'image/png',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(cmds),
    });
    const responseBlob = await response.blob();
    const img = document.createElement('img');
    img.src = URL.createObjectURL(responseBlob);

    document.querySelector(`#container`).replaceChildren(img);
  }

  function setup() {
    //Get the default device from the application as a first step. Discovery takes longer to complete.

    BrowserPrint.getDefaultDevice(
      'printer',
      function (device) {
        //Add device to list of devices and to html select element
        setSelectedDevice(device);
        setDevices([...devices, device]);

        //Discover any other devices available to the application
        BrowserPrint.getLocalDevices(
          function (device_list) {
            for (var i = 0; i < device_list.length; i++) {
              //Add device to list of devices and to html select element
              var device = device_list[i];
              if (!selectedDevice || device.uid != selectedDevice.uid) {
                setDevices([...devices, device]);
              }
            }
          },
          function () {
            toast.error('Error getting local devices.');
          },
          'printer'
        );
      },
      function (error) {
        toast.error('Zebra Browser Print Error. Make sure you have installed the Zebra Browser Print software.', error);
      }
    );
  }

  function writeToSelectedPrinter() {
    if (selectedDevice) {
      selectedDevice.send(zplCmd, undefined, errorCallback);
    } else {
      toast.error('Error printing on the local device.');
    }
  }

  const caneDetails = [
    {
      name: t('caneDetails.rfid'),
      value: caneData?.rfid,
    },
    {
      name: t('table.locationStatus'),
      value: caneData?.locationStatus,
    },
    {
      name: t('table.patientName'),
      value: caneData?.patient?.fullName,
      sensitive: true,
    },
    {
      name: t('locationDetails.facility'),
      value: caneData?.facilityName,
    },
    {
      name: t('locationDetails.vault'),
      value: caneData?.vault,
    },
    {
      name: t('locationDetails.tank'),
      value: caneData?.tank,
    },
    {
      name: t('locationDetails.pie'),
      value: caneData?.pie,
    },
    {
      name: t('strawVialDetails.cane_description'),
      value: caneData?.caneDescription,
    },
    {
      name: t('locationDetails.canister'),
      value: caneData?.canister,
    },
    {
      name: t('table.caneLabel'),
      value: caneData?.caneLabel,
    },
    {
      name: t('caneDetails.slot'),
      value: caneData?.number,
    },
  ];

  return (
    <div ref={rootRef}>
      <Modal root={rootRef.current ?? undefined} show={isOpen} onClose={onClose}>
        <div className="h-full w-full rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 p-[1px]">
          <div className="h-full w-full rounded-lg bg-[#1E2021]">
            <div className="flex items-center justify-between p-5">
              <div className="h-5 w-5"></div>

              <div className="text-3xl font-light dark:text-white">
                <div className="flex flex-row">{'Print RFID label'}</div>
              </div>

              <div className="h-5 w-5 cursor-pointer" onClick={onClose}>
                <Image priority src={closeIcon} alt="Close" />
              </div>
            </div>

            <Modal.Body>
              <div>
                <div className="mb-0 grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="flex w-full flex-col gap-1">
                    <>
                      <div className="flex items-center text-center">
                        <span className="mb-1 text-xl font-normal text-white">Cane Details:</span>
                      </div>
                      {!caneData ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-white">
                          <Spinner size="sm" className="mt-[-1px]" />
                        </div>
                      ) : (
                        caneDetails?.map(
                          ({ name, value, styles, sensitive }: any) =>
                            value && (
                              <div
                                key={name}
                                className={classNames(
                                  'flex justify-between gap-4 rounded-md border border-transparent px-4 py-3 text-sm font-normal leading-tight text-gray-300 dark:bg-[#292B2C]',
                                  { sensitive: sensitive }
                                )}>
                                <div>{name}</div>
                                <div className="w-2/3 break-words text-end ">{value}</div>
                              </div>
                            )
                        )
                      )}
                    </>
                  </div>
                  <div className="flex w-full flex-col gap-6">
                    <>
                      <div className="flex items-center text-center">
                        {/* <span className="mb-1 text-xl font-normal text-white">Preview:</span> */}
                      </div>
                      {!caneData ? (
                        <div className="flex items-center justify-center gap-2 text-sm text-white">
                          <Spinner size="sm" className="mt-[-1px]" />
                        </div>
                      ) : (
                        <div className="ZPLBox ph-no-capture px-4 pt-4" id="container"></div>
                      )}
                      <div className="FontSizeBox">
                        <Label>
                          Text size
                          <div className="mb-1 mt-2">
                            <CustomSelect
                              name="font"
                              error={errors?.font}
                              options={fonts}
                              placeholder={'Text size'}
                              onChange={fontSizeChange}
                            />
                          </div>
                        </Label>
                      </div>
                    </>
                  </div>

                  <div className="max-h-[470px] overflow-y-scroll" ref={scrollRef}>
                    <FormProvider
                      handleSubmit={handleSubmit}
                      setError={setError}
                      clearErrors={clearErrors}
                      control={control}
                      {...formProps}
                      errors={errors}
                      watch={watch}
                      register={register}>
                      <form className="mb-1 flex max-w-md flex-col gap-0">
                        <ErrorValidationMessage touched={errors?.printer} message={errors?.printer?.message}>
                          <Label>
                            Printer
                            <div className="">
                              <CustomSelect
                                control={control}
                                name="printer"
                                error={errors?.printer}
                                options={printers}
                                placeholder={'Select printer *'}
                              />
                            </div>
                          </Label>
                        </ErrorValidationMessage>
                      </form>
                    </FormProvider>
                  </div>
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <div className="flex w-full justify-between">
                <Button color="transparent" onClick={onClose}>
                  {t('common:cancel')}
                </Button>
                <Button gradientDuoTone="primary" onClick={handleSubmit(handlePrint)}>
                  {t('common:print')}
                </Button>
              </div>
            </Modal.Footer>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PrintRFIDModal;
