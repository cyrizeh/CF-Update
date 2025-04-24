const PanelRow = ({ text, value, testId }: { text: string; value: string; testId?: string }) => {
  return (
    <div
      data-testid={testId}
      className={`flex w-full items-center justify-between gap-4 rounded-lg bg-[#292B2C] px-4 py-3`}>
      <div
        className="shrink-0 text-sm font-normal leading-[125%] text-[#D1D5DB]"
        data-testid={testId && `${testId}-label`}>
        {text}
      </div>
      <div
        className="truncate text-sm font-[500] leading-[125%] text-[#D1D5DB]"
        data-testid={testId && `${testId}-value`}>
        {value}
      </div>
    </div>
  );
};

export default PanelRow;
