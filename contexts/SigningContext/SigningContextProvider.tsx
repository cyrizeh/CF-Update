import { PropsWithChildren, useState } from 'react';
import { SigningContext } from './SigningContext';

export const SigningContextProvider = ({ children }: PropsWithChildren) => {
  const [signingStatus, setSigningStatus] = useState('');

  return <SigningContext.Provider value={{ signingStatus, setSigningStatus }}>{children}</SigningContext.Provider>;
};
