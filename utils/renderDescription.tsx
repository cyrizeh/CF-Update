export const renderDescription = (text: string) => {
  const normalizedText = text.replace(/\\n/g, '\n');
  return normalizedText.split(/\n\n+/).map((paragraph, index) => (
    <p key={index} className="text-4 mb-2 font-light">
      {paragraph?.split('\n').map((line, lineIndex) => (
        <span key={lineIndex}>
          {line}
          {lineIndex < paragraph.split('\n').length - 1 && <br />}
        </span>
      ))}
    </p>
  ));
};
