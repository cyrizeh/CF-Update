import { AxiosResponse } from 'axios';
import useSWRMutation from 'swr/mutation';
import { axiosInstanceReader } from '../queries/reader.queries';

const BASE_URL = '/v2/Readers';
const buildGetTagUrl = (id: string) => `${BASE_URL}/${id}/tags`;
const buildGetTagTypeUrl = (readerId: string, tagId: string) => `${BASE_URL}/${readerId}/tags/${tagId}`;

const useReadersMutation = () => {
  const getReaderTagFetcher = (
    url: string,
    { arg }: { arg: { id: string } }
  ): Promise<AxiosResponse<{ Antenna: number; UID: string[] }[]>> => {
    return axiosInstanceReader.get(buildGetTagUrl(arg?.id));
  };

  const getReaderTag = useSWRMutation('getReaderTag', getReaderTagFetcher);

  const getReaderTagTypeFetcher = (
    url: string,
    { arg }: { arg: { readerId: string; tagId: string } }
  ): Promise<AxiosResponse<{ Ident: string }>> => {
    return axiosInstanceReader.get(buildGetTagTypeUrl(arg?.readerId, arg?.tagId));
  };

  const getReaderTagType = useSWRMutation('getReaderTagType', getReaderTagTypeFetcher);

  return { getReaderTag, getReaderTagType };
};

export default useReadersMutation;
