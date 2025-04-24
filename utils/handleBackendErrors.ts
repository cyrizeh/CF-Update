import _ from 'lodash';
import { toast } from 'react-toastify';

interface Errors {
  [key: string]: string[];
}

interface BackendResponse {
  succeeded: boolean;
  errors: string[];
}
// todo: Tech debt: update this fn with 400 from backend
export const handleBackendErrors = (errors: Errors) => {
  const errorMessages: string[] = [];

  Object.values(errors).forEach(errorArray => {
    if (Array.isArray(errorArray)) {
      errorArray.forEach(error => errorMessages.push(error));
    } else {
      errorMessages.push(errorArray);
    }
  });

  const combinedErrorMessage = errorMessages.join('. ');
  toast.error(combinedErrorMessage);
};

export const handleResponseErrorsWithSucceedResult = (response: BackendResponse) => {
  if (!response.succeeded && Array.isArray(response.errors) && response.errors.length > 0) {
    const combinedErrorMessage = response.errors.join('. ');
    toast.error(combinedErrorMessage);
  }
};

export const handleApiResponseError = (reason: any, message?: string) => {
  if (reason?.response?.data) {
    if (!_.isEmpty(reason.response.data.errors)) {
      handleBackendErrors(reason.response.data.errors);
    } else if (!_.isEmpty(reason.response.data.detail)) {
      toast.error(reason.response.data.detail);
    } else {
      toast.error(message || 'An unexpected error occurred');
    }
  } else {
    toast.error('An unexpected error occurred');
  }
};
