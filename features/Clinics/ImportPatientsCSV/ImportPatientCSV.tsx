import { Button, Label, Radio, Select, TextInput, Toast } from 'flowbite-react';
import { ImWarning } from 'react-icons/im';
import transfer from '@/public/icons/transfer.svg';
import Image from 'next/image';
import useImportPatientCSV from './useImportPatientCSV';
import useTranslation from 'next-translate/useTranslation';
import { OnboardingType } from '@/types/view/OnBoardingType.type';
const ImportPatientCSV = () => {
  const {
    list,
    savePatient,
    isError,
    unmatchedList,
    handleChange,
    status,
    errorsList,
    uploadFile,
    availableFieldList,
    changeUnmatching,
    isVisible,
    closeToast,
    onboardingType,
    handleOnboardingType,
  } = useImportPatientCSV();

  const { t } = useTranslation('patients');

  return (
    <div className="flex flex-col">
      <div className="mb-4 w-full bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text text-4xl font-light text-transparent">
        Import CSV
      </div>

      {isError && (
        <Toast className="w-full flex-col">
          <div className="flex">
            <ImWarning className="h-4 w-4" />
            <div className="ml-3 text-sm font-normal">Cell-mapping mismatch</div>
            <Toast.Toggle className="absolute right-20" />
          </div>

          <div>
            <p className="overflow-auto pt-2 text-sm font-normal text-yellow-50">
              The CSV you imported contains some unexpected cells. Please check below and map the imported cells to the
              correct fields in the inventory.
            </p>
          </div>
        </Toast>
      )}
      {isVisible && status !== 'proccesing' && status !== 'Completed' && (
        <Toast className="fixed bottom-0 right-0 z-50 mb-4  flex items-center rounded-lg bg-yellow-50 p-4 dark:bg-gray-800 dark:text-yellow-300">
          <Toast.Toggle className="absolute right-20" onClick={closeToast} />

          <div className="ml-3 text-sm font-medium">{status === 'Completed' && <span>Completed</span>}</div>
          <div className="ml-3 text-sm font-medium">{status === 'Failed' && <span>Failed</span>}</div>
          <div className="ml-3 text-sm font-medium">
            <div className="flex flex-col">
              <span>Error list: </span>
              {errorsList.map(item => (
                <div key={item}>{item}</div>
              ))}

              <Button gradientDuoTone="primary" outline className="mt-4" disabled={!isVisible} onClick={uploadFile}>
                Download file
              </Button>
            </div>
          </div>
        </Toast>
      )}

      <div className="mt-4 rounded-lg p-8 shadow-sm  dark:bg-[#1E2021]">
        <div className="flex ">
          <div className="w-1/2 overflow-auto">
            <h6 className="text-2xl font-normal text-white">Imported cells (patient data)</h6>
            <span className="text-sm font-normal leading-tight text-gray-50">{`Here's the data you're importing—check to make sure it's right.`}</span>
          </div>

          <div className="ml-6 w-1/2 overflow-auto">
            <h6 className="text-2xl font-normal text-white">Mapped cells (patient data)</h6>
            <span className="text-sm font-normal leading-tight text-gray-50">{`This is how the data will appear in our database.`}</span>
          </div>
        </div>

        {list.map(item => (
          <div
            key={item?.columnName}
            className="mt-4 flex max-w-[100%] flex-nowrap items-center justify-between gap-4 ">
            <TextInput
              color="gray"
              className="w-1/2 text-white placeholder-white"
              placeholder={item?.columnName}
              disabled
            />
            <Image src={transfer} alt="transfer" />

            <Select
              value={item?.matchingName || ''}
              color={item?.error || item.matchingName === null ? 'failure' : 'gray'}
              className="w-1/2"
              onChange={e => handleChange(e, item.columnName)}>
              {availableFieldList?.map((elem: string) => (
                <option key={elem} value={elem}>
                  {elem}
                </option>
              ))}
            </Select>
          </div>
        ))}
        {!!unmatchedList.length && <span className="mt-10 text-sm font-normal leading-tight">Unmatched data</span>}

        {unmatchedList.map(item => (
          <div key={item?.columnName} className="mt-4">
            <div className="mt-4 flex max-w-[100%] flex-nowrap items-center justify-between gap-4 ">
              <TextInput
                color="gray"
                className="w-1/2 text-white placeholder-white"
                placeholder={item?.columnName}
                disabled
              />
              <Image src={transfer} alt="transfer" />

              <Select
                value={item?.matchingName || ''}
                className="w-1/2"
                disabled={item?.matchingName === 'Action * Ignore'}
                onChange={e => changeUnmatching(e, item?.columnName)}>
                {availableFieldList?.map((elem: string) => (
                  <option key={elem} value={elem}>
                    {elem}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        ))}

        <div className="my-3">
          <Label>{t('step5.onBoardingType.title')}</Label>
          <Label htmlFor="FullOnboard" className="flex items-center gap-2 pl-1">
            <Radio
              id="FullOnboard"
              name="FullOnboard"
              checked={onboardingType === OnboardingType.FullOnboard}
              onClick={() => handleOnboardingType(OnboardingType.FullOnboard)}
            />
            {t('step5.onBoardingType.fullOnboard')}
          </Label>

          <Label htmlFor="PaymentsOnboardPlusLogin" className="flex items-center gap-2 pl-1">
            <Radio
              id="PaymentsOnboardPlusLogin"
              name="PaymentsOnboardPlusLogin"
              checked={onboardingType === OnboardingType.PaymentsOnboardPlusLogin}
              onClick={() => handleOnboardingType(OnboardingType.PaymentsOnboardPlusLogin)}
            />
            {t('step5.onBoardingType.paymentsOnboardPlusLogin')}
          </Label>
          <Label htmlFor="JustPatientLogin" className="flex items-center gap-2 pl-1">
            <Radio
              id="JustPatientLogin"
              name="JustPatientLogin"
              checked={onboardingType === OnboardingType.JustPatientLogin}
              onClick={() => handleOnboardingType(OnboardingType.JustPatientLogin)}
            />
            {t('step5.onBoardingType.justPatientLogin')}
          </Label>

          <Label htmlFor="NoLoginOnboarding" className="flex items-center gap-2 pl-1">
            <Radio
              id="NoLoginOnboarding"
              name="NoLoginOnboarding"
              checked={onboardingType === OnboardingType.NoLoginOnboarding}
              onClick={() => handleOnboardingType(OnboardingType.NoLoginOnboarding)}
            />
            {
              <div>
                <p>{t('step5.onBoardingType.noLoginOnboarding1')}</p>
                <p>{t('step5.onBoardingType.noLoginOnboarding2')}</p>
              </div>
            }
          </Label>
        </div>

        <Button gradientDuoTone="primary" className="mt-4" onClick={savePatient}>
          Save
        </Button>
      </div>
    </div>
  );
};

export default ImportPatientCSV;
