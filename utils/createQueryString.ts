export const createQueryString = (data: any) => {
  return Object.keys(data)
    .map(key => {
      let param = data[key];
      if (param !== null && typeof param === 'object') {
        return new URLSearchParams(param).toString();
      }
      if (key === 'sort') {
        return `sort=${param}`;
      } else return `${key}=${encodeURIComponent(`${param}`)}`;
    })
    .join('&');
};
