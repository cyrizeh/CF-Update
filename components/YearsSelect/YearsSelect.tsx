import { Button } from 'flowbite-react';

type Props = {
  years: Array<number>;
  selected: number;
  // eslint-disable-next-line no-unused-vars
  selectYear: (year: number) => void;
};

const YearsSelect = ({ years, selected, selectYear }: Props) => {
  return (
    <Button.Group className="mb-5 w-full">
      {years.map(el => (
        <Button
          key={el}
          size="sm"
          className="h-[53px] w-full p-0 ring-0 focus:ring-0"
          gradientDuoTone={selected === el ? 'primary' : 'inactiveTab'}
          onClick={() => selectYear(el)}>
          <div> {el}</div>
        </Button>
      ))}
    </Button.Group>
  );
};

export default YearsSelect;
