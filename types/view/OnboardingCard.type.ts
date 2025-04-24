import { ReactNode } from "react";

export type OnboardingCard = {
  title: string;
  description: string;
  videoUrl: string;
  actions?: ButtonActions [];
  withContacts?: boolean;
  showNewWindow?: boolean;
  supportContact?: {
    email: string;
    phoneNumber: string;
  }
};

export type ButtonActions = {
label: string;
onClick: () => void;
icon?: ReactNode;
isIconPostfix?: boolean;
isFlat?: boolean;
isDisabled?: boolean;
};