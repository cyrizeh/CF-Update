export const conditionComponent = (value: boolean): JSX.Element => {
  let resultText = '-';
  if (value === true) {
    resultText = 'Yes';
  } else if (value === false) {
    resultText = 'No';
  }
  return <p>{resultText}</p>;
};
