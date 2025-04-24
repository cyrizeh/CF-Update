import { ImFilesEmpty } from 'react-icons/im';

const NoData = () => {
  return (
    <div className='text-white flex flex-col items-center justify-center w-full h-full gap-3'>
      <ImFilesEmpty size={100}/>
      <p >No data found</p>
    </div>
  );
};
export default NoData;
