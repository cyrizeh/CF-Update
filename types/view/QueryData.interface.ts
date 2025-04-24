import { AxiosError } from 'axios';

export interface QueryData<T> {
  data: T | undefined;
  error: AxiosError;
  isLoading: boolean;
  mutate: (data?: T) => Promise<T | undefined>;
}
