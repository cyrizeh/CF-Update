import {
  buildAccountPatientProfilePageRoute,
  buildAdminGeneralPatientPageRoute,
  buildClinicPatientProfilePageRoute,
} from '@/constants/buildRoutes';
import useRole from '@/hooks/useRole';
import { isUserAccountAdmin, isUserAdmin, isUserClinicAdmin, isUserGodAdmin, isUserPatient } from '@/utils';
import Link from 'next/link';

interface LinkedAccountPartnerInfoProps {
  partnerId: string;
  name: string;
  isTheSameClinic: boolean;
}
export const LinkedAccountPartnerInfo: React.FC<LinkedAccountPartnerInfoProps> = ({
  partnerId,
  name,
  isTheSameClinic,
}) => {
  const { roles } = useRole();
  const isCryoAdmin = isUserAdmin(roles) || isUserGodAdmin(roles);
  const isClinicAdmin = isUserClinicAdmin(roles);
  const isNetworkAdmin = isUserAccountAdmin(roles);
  return (
    <>
      {isCryoAdmin ? (
        <Link href={buildAdminGeneralPatientPageRoute(partnerId)}>
          <span className="sensitive text-lg font-normal text-white hover:underline">{name}</span>
        </Link>
      ) : isClinicAdmin && isTheSameClinic ? (
        <Link href={buildClinicPatientProfilePageRoute(partnerId)}>
          <span className="sensitive text-lg font-normal text-white hover:underline">{name}</span>
        </Link>
      ) : isNetworkAdmin && isTheSameClinic ? (
        <Link href={buildAccountPatientProfilePageRoute(partnerId)}>
          <span className="sensitive text-lg font-normal text-white hover:underline">{name}</span>
        </Link>
      ) : (
        <span className="sensitive text-lg font-normal text-white">{name}</span>
      )}
    </>
  );
};
