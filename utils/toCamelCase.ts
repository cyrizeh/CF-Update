export const toCamelCase = (str: string): string => {
  const string = str.split('.');

  if (string.length > 1) {
    return string
      .map((word, index) => {
        if (index === 0) return word.toLowerCase();
        return word.charAt(0).toLowerCase() + word.slice(1).toLowerCase();
      })
      .join('.');
  } else {
    return str
      .replace(/\s(.)/g, function ($1) {
        return $1.toUpperCase();
      })
      .replace(/\s/g, '')
      .replace(/^(.)/, function ($1) {
        return $1.toLowerCase();
      });
  }
};
