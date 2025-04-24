import { TransportationContextProvider } from '@/contexts/TransportationContext/TransportationContextProvider';
import Transportations from '@/features/Transportation/Transportations';

export default function TransportationPage() {
  return (
    <TransportationContextProvider>
      <Transportations />
    </TransportationContextProvider>
  );
}
