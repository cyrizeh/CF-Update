const PatientComponentLayout = ({ children, col, isMediumScreen }: any) => {
  return (
    <div
      className={`${col ? 'flex-col ' : 'flex-row '} ${
        isMediumScreen && 'items-center '
      }flex  dark:bg-[#1E2021] p-4 sm:p-8  border border-transparent rounded-md gap-3 min-w-full  max-w-[370px] md:max-w-full `}>
      {children}
    </div>
  );
};

export default PatientComponentLayout;
