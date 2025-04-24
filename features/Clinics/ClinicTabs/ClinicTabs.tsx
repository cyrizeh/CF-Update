import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const ClinicTabs = ({ clinicId }: { clinicId: string | undefined }) => {
  const { pathname } = useRouter();
  const [currentPage, setCurrentPage] = useState(pathname);

  useEffect(() => setCurrentPage(pathname), [pathname]);

  const clinicDetailsTabs = [
    {
      key: 'general',
      name: 'General',
      url: `/admin/clinics/${clinicId}/general`,
    },
    {
      key: 'patients',
      name: 'Patients',
      url: `/admin/clinics/${clinicId}/patients`,
    },
    {
      key: 'specimens',
      name: 'Specimens',
      url: `/admin/clinics/${clinicId}/specimens`,
    },
    {
      key: 'billing',
      name: 'Billing',
      url: `/admin/clinics/${clinicId}/billing`,
    },
  ];

  return (
    <div className="flex h-6 flex-row gap-8 text-sm font-medium leading-[150%] text-[#F9FAFB]">
      {clinicDetailsTabs.map(tab => (
        <Link href={tab.url} key={tab.key}>
          <div
            className={
              currentPage.includes(tab.key)
                ? 'cursor-pointer border-b-[1px] border-blue-600 bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text font-medium text-transparent'
                : ''
            }>
            {tab.name}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ClinicTabs;
