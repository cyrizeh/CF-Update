import { getSession } from '@auth0/nextjs-auth0';
import { axiosInstance } from '@/api/axiosConfig';

const getPatientStatus = async (token?: string) => {
  const { data }: { data: { isOnboarded: boolean; id: string; patientType: string }; loading: boolean } =
    await axiosInstance.get('/patients/status', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

  return data;
};

export default function Home() {
  return null;
}

export async function getServerSideProps(context: any) {
  const { req, res } = context;
  const session = await getSession(req, res);
  const roles = session?.user['.roles'];
  if (roles[0] === 'patient') {
    const data = await getPatientStatus(session?.accessToken);
    if (data.patientType === 'Transportation') {
      return {
        redirect: {
          destination: '/transportation/onboarding',
          permanent: false,
        },
      };
    }
    return {
      redirect: {
        destination: '/patient',
        permanent: false,
      },
    };
  } else if (roles[0] === 'superadmin' || roles[0] === 'godadmin') {
    return {
      redirect: {
        destination: '/admin/overview',
        permanent: false,
      },
    };
  } else if (roles[0] === 'clinic_admin') {
    return {
      redirect: {
        destination: '/clinic/general',
        permanent: false,
      },
    };
  } else if (roles[0] === 'account_admin') {
    return {
      redirect: {
        destination: '/account/overview',
        permanent: false,
      },
    };
  }
}
