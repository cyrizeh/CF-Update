import ImportPatientCSV from '@/features/Clinics/ImportPatientsCSV/ImportPatientCSV';

function ImportPatient() {
  return (
    <div className="h-full self-center whitespace-nowrap p-4 text-2xl font-semibold dark:text-gray-400 md:p-14">
      <ImportPatientCSV />
    </div>
  );
}

export default ImportPatient;
