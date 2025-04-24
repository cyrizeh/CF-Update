export const maxLengthMessage = (length: number, name: string) => `${name} can't be longer than ${length} characters`;
export const maxNumberMessage = (count: number, name: string) => `${name} must be less than or equal to ${count}`;
export const minNumberMessage = (count: number, name: string) => `${name} must be greater than ${count}`;
export const fieldIsRequiredMessage = (name: string) => `${name} is required`;
export const minLengthMessage = (length: number, name: string) => `${name} can't be less than ${length} characters`;