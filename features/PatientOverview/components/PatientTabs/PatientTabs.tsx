import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type PatientTab = {
  key: string;
  name: string;
  url: string;
};

type PatientTabsProps = {
  patientTabs: PatientTab[];
};

const PatientRouteTabs = ({ patientTabs }: PatientTabsProps) => {
  const { pathname } = useRouter();
  const [currentPage, setCurrentPage] = useState(pathname);

  function getLastPathSegment(url: string): string {
    const segments = url.split('/');
    return segments[segments.length - 1];
  }

  useEffect(() => {
    setCurrentPage(pathname.includes('onboarding') ? 'onboarding' : getLastPathSegment(pathname)), [pathname];
  });

  return (
    <div className="flex flex-row flex-wrap gap-8 text-sm font-medium leading-[150%] text-[#F9FAFB] mb-5">
      {patientTabs.map(tab => (
        <Link href={tab.url} key={tab.key}>
          <div
            className={
              currentPage === tab.key
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

export default PatientRouteTabs;
