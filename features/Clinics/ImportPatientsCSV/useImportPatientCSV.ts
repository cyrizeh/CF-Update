/* eslint-disable react-hooks/exhaustive-deps */
import { axiosInstance } from '@/api/axiosConfig';
import { ListTypes } from '@/types/view';
import { OnboardingType } from '@/types/view/OnBoardingType.type';
import { useRouter } from 'next/router';
import { ChangeEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const useImportPatientCSV = () => {
  const router = useRouter();
  const ignorField = 'Action * Ignore';
  const headers = localStorage.getItem('headers');
  const availableFields = localStorage.getItem('availableFields');
  const id = localStorage.getItem('id');

  const [list, setList] = useState<ListTypes[]>([]);
  const [unmatchedList, setUnmatchedList] = useState<ListTypes[]>([]);
  const [availableFieldList, setAvailableFieldList] = useState<string[]>([]);
  const [status, setStatus] = useState('proccesing');
  const [errorsList, setErrorsList] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const isError = list.find(item => !!item?.error);
  const [onboardingType, setOnboardingType] = useState<OnboardingType>(OnboardingType.NoLoginOnboarding);

  const handleOnboardingType = (type: OnboardingType) => setOnboardingType(type);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>, name: string) => {
    const { value } = e.target;
    const newList = JSON.parse(JSON.stringify(list));
    const res = newList.find((elem: ListTypes) => elem.columnName === name);
    res.matchingName = value;
    const newUnmatchedList: ListTypes[] = JSON.parse(JSON.stringify(unmatchedList));

    const findUnmatchedItemIndex = newUnmatchedList.findIndex(elem => elem?.columnName === name);
    if (findUnmatchedItemIndex !== -1) {
      newUnmatchedList.splice(findUnmatchedItemIndex, 1);
      setUnmatchedList(newUnmatchedList);
    }

    if (value === ignorField) {
      newUnmatchedList.push(res);
      setUnmatchedList(newUnmatchedList);
    }
    const newArr = changeError(newList);

    return setList(newArr);
  };

  const changeUnmatching = (e: ChangeEvent<HTMLSelectElement>, name: string) => {
    const { value } = e.target;
    const newList = JSON.parse(JSON.stringify(unmatchedList));
    const res = newList.find((elem: ListTypes) => elem.columnName === name);
    res.matchingName = value;
    return setUnmatchedList(newList);
  };

  useEffect(() => {
    if (headers && availableFields) {
      const heads = JSON.parse(headers);
      const newList = changeError(heads);
      setList(newList);
      setAvailableFieldList([ignorField, ...JSON.parse(availableFields)]);
      getMatchingFields(heads);
    }
  }, []);

  const changeError = (arr: any) => {
    const matchingNames: { [name: string]: boolean } = {};
    const newList = JSON.parse(JSON.stringify(arr));
    newList.forEach((item: { matchingName: string | number; error: string }) => {
      if (matchingNames[item.matchingName]) {
        item.error = 'duplicate';
      } else {
        matchingNames[item.matchingName] = true;
      }
    });
    return newList;
  };

  const getMatchingFields = (heads: ListTypes[]) => {
    const available = availableFields && JSON.parse(availableFields);
    if (heads.length && available.length) {
      const length = heads.length - available.length;
      if (length < 0) {
        const newList = available.slice(length).map((item: string) => {
          return { columnName: item, matchingName: item };
        });

        setUnmatchedList(newList);
      } else if (length > 0) {
        const newList = heads.slice(-length);
        setUnmatchedList(newList);
      }
    }
  };

  const docStatus = async (id: string | null) => {
    let res = await axiosInstance.get(`/imports/${id}`);

    while (res?.data.status === 'Processing') {
      await new Promise(resolve => setTimeout(resolve, 1000));

      res = await axiosInstance.get(`/imports/${id}`);
    }

    return res;
  };

  const savePatient = async () => {
    setIsVisible(true);
    const result = [
      ...list.filter(item => item.matchingName !== null),
      ...unmatchedList.filter(item => item.matchingName !== null),
    ];

    const body = {
      fieldMaps: result.map(item => item.matchingName),
      importId: id,
      onboardingType
    };

    await axiosInstance.post(`/imports/${id}`, body);
    const res = await docStatus(id);
    setStatus(res.data.status);

    if (res.data.status === 'Completed') {
      toast.success('Success');
      setTimeout(() => {
        router.back();
      }, 2000);
    }

    if (res.data.status === 'PartiallyCompleted') {
      const err = res.data.importErrors;

      const errorMap: { [key: string]: number[] } = {};

      err.forEach((error: any) => {
        if (!errorMap[error.message]) {
          errorMap[error.message] = [];
        }
        errorMap[error.message].push(error.lineNumber);
      });

      const errorStrings = Object.keys(errorMap).map(message => {
        const lines = errorMap[message];
        if (lines.length > 4) {
          return `${message} Errors in line(s): ${lines.slice(0, 4).join(', ')}, and ${lines.length - 4} more`;
        } else {
          return `${message} Errors in line(s): ${lines.join(', ')}`;
        }
      });

      setErrorsList(errorStrings);
    }
  };

  const closeToast = () => {
    setIsVisible(false);
  };

  const uploadFile = async () => {
    const { data: fileUrl } = await axiosInstance.get(`/imports/${id}/file`);
    const { documentUri } = fileUrl;
    const a = document.createElement('a');
    a.href = documentUri;
    document.body.appendChild(a);
    window.URL.revokeObjectURL(documentUri);
    a.click();
  };

  return {
    list,
    handleChange,
    availableFieldList,
    unmatchedList,
    changeUnmatching,
    savePatient,
    status,
    isError,
    isVisible,
    errorsList,
    closeToast,
    uploadFile,
    onboardingType,
    handleOnboardingType
  };
};

export default useImportPatientCSV;
