export const showBadgelabel = (el: string | { labelBadge: string } | boolean): string | null => {
  if (typeof el === 'string') {
    if (el === 'true') {
      return 'Yes';
    } else if (el === 'false') {
      return 'No';
    } else {
      return el;
    }
  } else if (typeof el === 'object' && el !== null && !Array.isArray(el)) {
    return el.labelBadge || null;
  } else if (typeof el === 'boolean') {
    return el ? 'Yes' : 'No';
  } else {
    return null;
  }
};
