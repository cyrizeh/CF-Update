import { Button, Spinner, Dropdown, Modal } from 'flowbite-react';
import { FaFileImport, FaTimes, FaEllipsisV, FaEye, FaEdit, FaFileDownload, FaBan } from 'react-icons/fa';
import { HiViewList, HiFilter, HiChevronLeft, HiChevronRight } from 'react-icons/hi';
import { useState, useRef } from 'react';
import useTranslation from 'next-translate/useTranslation';
import DatePicker from 'react-datepicker';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';

const ShippingSettings = dynamic(() => import('@/features/Shipping/Settings/ShippingSettings'), {
  loading: () => <div className="flex justify-center p-4"><Spinner size="xl" /></div>
});

const SchedulePage = dynamic(() => import('@/pages/admin/shipping/schedule'), {
  loading: () => <div className="flex justify-center p-4"><Spinner size="xl" /></div>
});

const MapPage = dynamic(() => import('@/pages/admin/shipping/map'), {
  loading: () => <div className="flex justify-center p-4"><Spinner size="xl" /></div>
});

interface FilterState {
  assignee: string[];
  account: string[];
  fromClinic: string[];
  toClinic: string[];
  originFacility: string[];
  destFacility: string[];
  status: string[];
  dateRange: {
    start: Date | null;
    end: Date | null;
  };
}

interface ShippingRequestForm {
  // Patient Info
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  notes: string;
  hasPartner: boolean;
  
  // Shipping Details
  pickupDate: string;
  pickupTime: string;
  pickupLocation: string;
  pickupAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  deliveryLocation: string;
  deliveryAddress: string;
  transportationType: string;
}

const ShippingPage = () => {
  const { t } = useTranslation('common');
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState<'list'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [showShippingRequestModal, setShowShippingRequestModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeFilterTab, setActiveFilterTab] = useState('status');
  const filterButtonRef = useRef<HTMLButtonElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    assignee: [],
    account: [],
    fromClinic: [],
    toClinic: [],
    originFacility: [],
    destFacility: [],
    status: [],
    dateRange: {
      start: null,
      end: null,
    },
  });

  // Sample data for filter options
  const filterOptions = {
    status: ['Requested', 'In Progress', 'Completed', 'Cancelled'],
    assignee: ['John Smith', 'Sarah Lee', 'Mike Johnson'],
    account: ['CryoBank Inc', 'Fertility Center A', 'Lab B'],
    fromClinic: ['NYC Fertility', 'Boston IVF', 'LA Fertility'],
    toClinic: ['Boston IVF', 'NYC Fertility', 'Chicago Med'],
    originFacility: ['NYC Lab', 'Boston Lab', 'LA Lab'],
    destFacility: ['Boston Lab', 'NYC Lab', 'Chicago Lab'],
  };

  // Count active filters
  const activeFilterCount = Object.entries(filters).reduce((count, [key, value]) => {
    if (key === 'dateRange') {
      return count + (filters.dateRange.start || filters.dateRange.end ? 1 : 0);
    }
    return count + (value as string[]).length;
  }, 0);

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      if (category === 'dateRange') return prev;
      const currentValues = prev[category] as string[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      return { ...prev, [category]: newValues };
    });
  };

  const handleDateRangeChange = (start: Date | null, end: Date | null) => {
    setFilters(prev => ({
      ...prev,
      dateRange: { start, end },
    }));
  };

  const clearFilters = () => {
    setFilters({
      assignee: [],
      account: [],
      fromClinic: [],
      toClinic: [],
      originFacility: [],
      destFacility: [],
      status: [],
      dateRange: {
        start: null,
        end: null,
      },
    });
  };

  // Filter tabs configuration
  const filterTabs = [
    { id: 'status', label: 'Status' },
    { id: 'assignee', label: 'Assignee' },
    { id: 'account', label: 'Account' },
    { id: 'clinic', label: 'Clinic' },
    { id: 'facility', label: 'Facility' },
    { id: 'date', label: 'Date Range' },
  ];

  // Sample data - replace with actual data from API
  const stats = {
    onboarding: { count: 8, change: 15.5, trend: 'increase' },
    coordinating: { count: 25, change: 10, trend: 'increase' },
    scheduled: { count: 15, change: 12.45, trend: 'increase' },
    inTransit: { count: 10, change: 12.45, trend: 'decrease' },
    delivered: { count: 4, change: 12.45, trend: 'increase' }
  };

  const sampleData = [
    {
      id: 'TR-1234-122',
      patientName: 'Donna Garcia',
      status: 'Requested',
      account: 'CryoBank Inc',
      fromClinic: 'NYC Fertility',
      toClinic: 'Boston IVF',
      originFacility: 'NYC Lab',
      destFacility: 'Boston Lab',
      coordinator: 'John Smith',
      clinician: 'Dr. Sarah Lee',
      pickup: '-',
      delivery: '-'
    },
    {
      id: 'TR-1235-123',
      patientName: 'Michael Johnson',
      status: 'In Transit',
      account: 'Fertility Center A',
      fromClinic: 'LA Fertility',
      toClinic: 'Chicago Med',
      originFacility: 'LA Lab',
      destFacility: 'Chicago Lab',
      coordinator: 'Emily Brown',
      clinician: 'Dr. James Wilson',
      pickup: '2024-03-15',
      delivery: '2024-03-17'
    },
    {
      id: 'TR-1236-124',
      patientName: 'Sarah Williams',
      status: 'Delivered',
      account: 'Lab B',
      fromClinic: 'Boston IVF',
      toClinic: 'NYC Fertility',
      originFacility: 'Boston Lab',
      destFacility: 'NYC Lab',
      coordinator: 'David Miller',
      clinician: 'Dr. Emma Davis',
      pickup: '2024-03-10',
      delivery: '2024-03-12'
    },
    {
      id: 'TR-1237-125',
      patientName: 'Robert Taylor',
      status: 'Scheduled',
      account: 'CryoBank Inc',
      fromClinic: 'Chicago Med',
      toClinic: 'LA Fertility',
      originFacility: 'Chicago Lab',
      destFacility: 'LA Lab',
      coordinator: 'Lisa Anderson',
      clinician: 'Dr. Michael Brown',
      pickup: '2024-03-20',
      delivery: '-'
    },
    {
      id: 'TR-1238-126',
      patientName: 'Jennifer Martinez',
      status: 'Requested',
      account: 'Fertility Center A',
      fromClinic: 'NYC Fertility',
      toClinic: 'Boston IVF',
      originFacility: 'NYC Lab',
      destFacility: 'Boston Lab',
      coordinator: 'Thomas Wilson',
      clinician: 'Dr. Laura White',
      pickup: '-',
      delivery: '-'
    },
    {
      id: 'TR-1239-127',
      patientName: 'William Anderson',
      status: 'In Transit',
      account: 'Lab B',
      fromClinic: 'LA Fertility',
      toClinic: 'Chicago Med',
      originFacility: 'LA Lab',
      destFacility: 'Chicago Lab',
      coordinator: 'Sarah Thompson',
      clinician: 'Dr. Robert Johnson',
      pickup: '2024-03-18',
      delivery: '2024-03-20'
    },
    {
      id: 'TR-1240-128',
      patientName: 'Elizabeth Brown',
      status: 'Delivered',
      account: 'CryoBank Inc',
      fromClinic: 'Boston IVF',
      toClinic: 'NYC Fertility',
      originFacility: 'Boston Lab',
      destFacility: 'NYC Lab',
      coordinator: 'Michael Davis',
      clinician: 'Dr. Jennifer Lee',
      pickup: '2024-03-12',
      delivery: '2024-03-14'
    },
    {
      id: 'TR-1241-129',
      patientName: 'James Wilson',
      status: 'Scheduled',
      account: 'Fertility Center A',
      fromClinic: 'Chicago Med',
      toClinic: 'LA Fertility',
      originFacility: 'Chicago Lab',
      destFacility: 'LA Lab',
      coordinator: 'Amanda Martinez',
      clinician: 'Dr. David Miller',
      pickup: '2024-03-22',
      delivery: '-'
    },
    {
      id: 'TR-1242-130',
      patientName: 'Patricia Davis',
      status: 'Requested',
      account: 'Lab B',
      fromClinic: 'NYC Fertility',
      toClinic: 'Boston IVF',
      originFacility: 'NYC Lab',
      destFacility: 'Boston Lab',
      coordinator: 'Robert Brown',
      clinician: 'Dr. Sarah Thompson',
      pickup: '-',
      delivery: '-'
    },
    {
      id: 'TR-1243-131',
      patientName: 'John Thompson',
      status: 'In Transit',
      account: 'CryoBank Inc',
      fromClinic: 'LA Fertility',
      toClinic: 'Chicago Med',
      originFacility: 'LA Lab',
      destFacility: 'Chicago Lab',
      coordinator: 'Elizabeth Wilson',
      clinician: 'Dr. Michael Davis',
      pickup: '2024-03-19',
      delivery: '2024-03-21'
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(sampleData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = sampleData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'requested':
        return 'bg-blue-100 text-blue-800';
      case 'in transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'scheduled':
        return 'bg-orange-100 text-orange-800';
      case 'issue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const FilterPopover = () => (
    <div className="absolute right-0 mt-2 w-96 bg-[#282b2c] border border-gray-700 rounded-lg shadow-lg z-50">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white">Filters</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={clearFilters}
              className="text-sm text-gray-400 hover:text-white"
            >
              Clear all
            </button>
            <button
              onClick={() => setShowFilters(false)}
              className="text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-4 overflow-x-auto">
          {filterTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilterTab(tab.id)}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                activeFilterTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {activeFilterTab === 'date' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                <DatePicker
                  selected={filters.dateRange.start}
                  onChange={(date: Date | null) => handleDateRangeChange(date, filters.dateRange.end)}
                  className="w-full rounded-lg border border-gray-700 p-2 text-white bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select start date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                <DatePicker
                  selected={filters.dateRange.end}
                  onChange={(date: Date | null) => handleDateRangeChange(filters.dateRange.start, date)}
                  className="w-full rounded-lg border border-gray-700 p-2 text-white bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                  placeholderText="Select end date"
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {activeFilterTab === 'status' &&
                filterOptions.status.map(option => (
                  <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.status.includes(option)}
                      onChange={() => handleFilterChange('status', option)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              {activeFilterTab === 'assignee' &&
                filterOptions.assignee.map(option => (
                  <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.assignee.includes(option)}
                      onChange={() => handleFilterChange('assignee', option)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              {activeFilterTab === 'account' &&
                filterOptions.account.map(option => (
                  <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.account.includes(option)}
                      onChange={() => handleFilterChange('account', option)}
                      className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">{option}</span>
                  </label>
                ))}
              {activeFilterTab === 'clinic' && (
                <>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">From Clinic</h4>
                    {filterOptions.fromClinic.map(option => (
                      <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.fromClinic.includes(option)}
                          onChange={() => handleFilterChange('fromClinic', option)}
                          className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">To Clinic</h4>
                    {filterOptions.toClinic.map(option => (
                      <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.toClinic.includes(option)}
                          onChange={() => handleFilterChange('toClinic', option)}
                          className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
              {activeFilterTab === 'facility' && (
                <>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Origin Facility</h4>
                    {filterOptions.originFacility.map(option => (
                      <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.originFacility.includes(option)}
                          onChange={() => handleFilterChange('originFacility', option)}
                          className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Destination Facility</h4>
                    {filterOptions.destFacility.map(option => (
                      <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.destFacility.includes(option)}
                          onChange={() => handleFilterChange('destFacility', option)}
                          className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{option}</span>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const [formData, setFormData] = useState<ShippingRequestForm>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    notes: '',
    hasPartner: false,
    pickupDate: '',
    pickupTime: '',
    pickupLocation: '',
    pickupAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    deliveryLocation: '',
    deliveryAddress: '',
    transportationType: ''
  });

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof ShippingRequestForm, string>>>({});

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof ShippingRequestForm, string>> = {};

    if (step === 1) {
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
    }

    if (step === 2) {
      if (!formData.pickupDate) newErrors.pickupDate = 'Pickup date is required';
      if (!formData.pickupTime) newErrors.pickupTime = 'Pickup time is required';
      if (!formData.pickupLocation) newErrors.pickupLocation = 'Pickup location is required';
      if (!formData.pickupAddress) newErrors.pickupAddress = 'Pickup address is required';
      if (!formData.deliveryDate) newErrors.deliveryDate = 'Delivery date is required';
      if (!formData.deliveryTime) newErrors.deliveryTime = 'Delivery time is required';
      if (!formData.deliveryLocation) newErrors.deliveryLocation = 'Delivery location is required';
      if (!formData.deliveryAddress) newErrors.deliveryAddress = 'Delivery address is required';
      if (!formData.transportationType) newErrors.transportationType = 'Transportation type is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSubmit = () => {
    // TODO: Implement form submission
    console.log('Form submitted:', formData);
    setShowShippingRequestModal(false);
    setCurrentStep(1);
    setFormData({
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      notes: '',
      hasPartner: false,
      pickupDate: '',
      pickupTime: '',
      pickupLocation: '',
      pickupAddress: '',
      deliveryDate: '',
      deliveryTime: '',
      deliveryLocation: '',
      deliveryAddress: '',
      transportationType: ''
    });
  };

  return (
    <div className="p-4">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Shipping Management</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Manage and track specimen selections for retrieval, storage, or transfer, ensuring accuracy and efficient processing.
          </p>
        </div>
        <div className="flex gap-2">
          <Button color="dark" className="gap-3">
            <FaFileImport className="h-5 w-5" />
            Import CSV
          </Button>
          <Button gradientDuoTone="primary" onClick={() => setShowShippingRequestModal(true)}>
            + Shipping Request
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'schedule'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'mapView'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('mapView')}
        >
          Map View
        </button>
        <button
          className={`px-4 py-2 text-sm ${
            activeTab === 'settings'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-400 hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'settings' ? (
        <ShippingSettings />
      ) : activeTab === 'schedule' ? (
        <SchedulePage />
      ) : activeTab === 'mapView' ? (
        <MapPage />
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="p-4 rounded-lg text-white bg-[#282b2c] border border-gray-700">
              <div className="text-lg text-gray-200">Onboarding</div>
              <div className="text-4xl font-bold mb-2">{stats.onboarding.count}</div>
              <div className="text-sm text-green-500">
                ↑ {stats.onboarding.change}% vs last month
              </div>
            </div>
            <div className="p-4 rounded-lg text-white bg-[#282b2c] border border-gray-700">
              <div className="text-lg text-gray-200">Coordinating</div>
              <div className="text-4xl font-bold mb-2">{stats.coordinating.count}</div>
              <div className="text-sm text-gray-400">
                Increased by {stats.coordinating.change}% from last month
              </div>
            </div>
            <div className="p-4 rounded-lg text-white bg-[#282b2c] border border-gray-700">
              <div className="text-lg text-gray-200">Scheduled</div>
              <div className="text-4xl font-bold mb-2">{stats.scheduled.count}</div>
              <div className="text-sm text-green-500">
                ↑ {stats.scheduled.change}% vs last month
              </div>
            </div>
            <div className="p-4 rounded-lg text-white bg-[#282b2c] border border-gray-700">
              <div className="text-lg text-gray-200">In Transit</div>
              <div className="text-4xl font-bold mb-2">{stats.inTransit.count}</div>
              <div className="text-sm text-red-500">
                ↓ {stats.inTransit.change}% vs last month
              </div>
            </div>
            <div className="p-4 rounded-lg text-white bg-[#282b2c] border border-gray-700">
              <div className="text-lg text-gray-200">Delivered</div>
              <div className="text-4xl font-bold mb-2">{stats.delivered.count}</div>
              <div className="text-sm text-green-500">
                ↑ {stats.delivered.change}% vs last month
              </div>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-xl font-semibold text-white">Shipping List</div>
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search shipping..."
                  className="pl-10 pr-4 py-2 rounded-lg bg-[#282b2c] border border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="relative">
                <Button
                  color="dark"
                  size="sm"
                  ref={filterButtonRef}
                  onClick={() => setShowFilters(!showFilters)}
                  className="relative"
                >
                  <HiFilter className="mr-2 h-5 w-5" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </Button>
                {showFilters && (
                  <div className="absolute right-0 mt-2 w-96 bg-[#282b2c] border border-gray-700 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-white">Filters</h3>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={clearFilters}
                            className="text-sm text-gray-400 hover:text-white"
                          >
                            Clear all
                          </button>
                          <button
                            onClick={() => setShowFilters(false)}
                            className="text-gray-400 hover:text-white"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>

                      <div className="flex gap-2 mb-4 overflow-x-auto">
                        {filterTabs.map(tab => (
                          <button
                            key={tab.id}
                            onClick={() => setActiveFilterTab(tab.id)}
                            className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                              activeFilterTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      <div className="mt-4">
                        {activeFilterTab === 'date' ? (
                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                              <DatePicker
                                selected={filters.dateRange.start}
                                onChange={(date: Date | null) => handleDateRangeChange(date, filters.dateRange.end)}
                                className="w-full rounded-lg border border-gray-700 p-2 text-white bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                                placeholderText="Select start date"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                              <DatePicker
                                selected={filters.dateRange.end}
                                onChange={(date: Date | null) => handleDateRangeChange(filters.dateRange.start, date)}
                                className="w-full rounded-lg border border-gray-700 p-2 text-white bg-gray-800 focus:ring-blue-500 focus:border-blue-500"
                                placeholderText="Select end date"
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {activeFilterTab === 'status' &&
                              filterOptions.status.map(option => (
                                <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={filters.status.includes(option)}
                                    onChange={() => handleFilterChange('status', option)}
                                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            {activeFilterTab === 'assignee' &&
                              filterOptions.assignee.map(option => (
                                <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={filters.assignee.includes(option)}
                                    onChange={() => handleFilterChange('assignee', option)}
                                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            {activeFilterTab === 'account' &&
                              filterOptions.account.map(option => (
                                <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={filters.account.includes(option)}
                                    onChange={() => handleFilterChange('account', option)}
                                    className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                  />
                                  <span className="text-sm">{option}</span>
                                </label>
                              ))}
                            {activeFilterTab === 'clinic' && (
                              <>
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-white mb-2">From Clinic</h4>
                                  {filterOptions.fromClinic.map(option => (
                                    <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={filters.fromClinic.includes(option)}
                                        onChange={() => handleFilterChange('fromClinic', option)}
                                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-sm">{option}</span>
                                    </label>
                                  ))}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-2">To Clinic</h4>
                                  {filterOptions.toClinic.map(option => (
                                    <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={filters.toClinic.includes(option)}
                                        onChange={() => handleFilterChange('toClinic', option)}
                                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-sm">{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </>
                            )}
                            {activeFilterTab === 'facility' && (
                              <>
                                <div className="mb-4">
                                  <h4 className="text-sm font-medium text-white mb-2">Origin Facility</h4>
                                  {filterOptions.originFacility.map(option => (
                                    <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={filters.originFacility.includes(option)}
                                        onChange={() => handleFilterChange('originFacility', option)}
                                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-sm">{option}</span>
                                    </label>
                                  ))}
                                </div>
                                <div>
                                  <h4 className="text-sm font-medium text-white mb-2">Destination Facility</h4>
                                  {filterOptions.destFacility.map(option => (
                                    <label key={option} className="flex items-center space-x-2 text-gray-300 hover:bg-gray-700 p-1 rounded cursor-pointer">
                                      <input
                                        type="checkbox"
                                        checked={filters.destFacility.includes(option)}
                                        onChange={() => handleFilterChange('destFacility', option)}
                                        className="rounded border-gray-600 bg-gray-700 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="text-sm">{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <Button color="dark" size="sm">
                Download Report
              </Button>
              <Button
                color={viewMode === 'list' ? 'blue' : 'dark'}
                size="sm"
              >
                <HiViewList className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="relative">
            <div className="overflow-x-auto scrollbar rounded-lg border border-gray-700 bg-[#282b2c]">
              <table className="w-full min-w-max table-auto text-sm text-left">
                <thead className="text-xs uppercase bg-gray-800 text-gray-300">
                  <tr>
                    <th className="sticky left-0 z-10 bg-gray-800 p-4 whitespace-nowrap">
                      <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
                    </th>
                    <th className="px-6 py-3 whitespace-nowrap">Trans ID</th>
                    <th className="px-6 py-3 whitespace-nowrap">Patient Name</th>
                    <th className="px-6 py-3 whitespace-nowrap">Status</th>
                    <th className="px-6 py-3 whitespace-nowrap">Account</th>
                    <th className="px-6 py-3 whitespace-nowrap">From Clinic</th>
                    <th className="px-6 py-3 whitespace-nowrap">To Clinic</th>
                    <th className="px-6 py-3 whitespace-nowrap">Origin Facility</th>
                    <th className="px-6 py-3 whitespace-nowrap">Dest. Facility</th>
                    <th className="px-6 py-3 whitespace-nowrap">Coordinator</th>
                    <th className="px-6 py-3 whitespace-nowrap">Clinician</th>
                    <th className="px-6 py-3 whitespace-nowrap">Pickup</th>
                    <th className="px-6 py-3 whitespace-nowrap">Delivery</th>
                    <th className="px-6 py-3 whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {currentData.map((item) => (
                    <tr
                      key={item.id}
                      className="bg-[#282b2c] hover:bg-gray-800 cursor-pointer"
                      onClick={() => router.push(`/admin/shipping/${item.id}`)}
                    >
                      <td className="sticky left-0 z-10 bg-[#282b2c] hover:bg-gray-800 p-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <input type="checkbox" className="rounded bg-gray-700 border-gray-600" />
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.id}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.patientName}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusStyle(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.account}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.fromClinic}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.toClinic}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.originFacility}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.destFacility}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.coordinator}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.clinician}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.pickup}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">{item.delivery}</td>
                      <td className="px-6 py-4 text-gray-300 font-light whitespace-nowrap">
                        <Button size="xs" color="dark">
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Shipping Request Modal */}
      <Modal
        show={showShippingRequestModal}
        onClose={() => {
          setShowShippingRequestModal(false);
          setCurrentStep(1);
        }}
        size="xl"
        className="dark"
      >
        <div className="relative rounded-lg bg-[#282b2c] shadow border border-transparent bg-clip-padding" style={{ background: 'linear-gradient(to right, #282b2c, #282b2c) padding-box, linear-gradient(to right, #3b82f6, #14b8a6) border-box' }}>
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h3 className="text-xl font-semibold text-white">
              Transportation request
            </h3>
            <button
              onClick={() => {
                setShowShippingRequestModal(false);
                setCurrentStep(1);
              }}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            {/* Progress Steps */}
            <div className="mb-8 flex justify-center">
              <div className="flex items-center w-2/3">
                <div className="flex items-center relative">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${currentStep >= 1 ? 'bg-blue-600 border-blue-600' : 'border-gray-600 bg-gray-800'}`}>
                    {currentStep > 1 ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-white">1</span>
                    )}
                  </div>
                  <div className={`absolute -bottom-6 w-max text-xs ${currentStep >= 1 ? 'text-blue-500' : 'text-gray-400'}`}>
                    Patient Info
                  </div>
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                <div className="flex items-center relative">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${currentStep >= 2 ? 'bg-blue-600 border-blue-600' : 'border-gray-600 bg-gray-800'}`}>
                    {currentStep > 2 ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-white">2</span>
                    )}
                  </div>
                  <div className={`absolute -bottom-6 w-max text-xs ${currentStep >= 2 ? 'text-blue-500' : 'text-gray-400'}`}>
                    Shipping Details
                  </div>
                </div>
                <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                <div className="flex items-center relative">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${currentStep >= 3 ? 'bg-blue-600 border-blue-600' : 'border-gray-600 bg-gray-800'}`}>
                    <span className="text-white">3</span>
                  </div>
                  <div className={`absolute -bottom-6 w-max text-xs ${currentStep >= 3 ? 'text-blue-500' : 'text-gray-400'}`}>
                    Review
                  </div>
                </div>
              </div>
            </div>

            {/* Form Content */}
            <div className="mt-8">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${formErrors.email ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.email && <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-white mb-1">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border ${formErrors.firstName ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {formErrors.firstName && <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>}
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-white mb-1">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border ${formErrors.lastName ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {formErrors.lastName && <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${formErrors.phone ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                    />
                    {formErrors.phone && <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>}
                  </div>

                  <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-white mb-1">
                      Notes
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Add any additional notes..."
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hasPartner"
                      name="hasPartner"
                      checked={formData.hasPartner}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600 rounded border-gray-600 bg-gray-700 focus:ring-blue-500"
                    />
                    <label htmlFor="hasPartner" className="ml-2 text-sm font-medium text-white">
                      Has Partner
                    </label>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="pickupDate" className="block text-sm font-medium text-white mb-1">
                        Pickup Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="pickupDate"
                        name="pickupDate"
                        value={formData.pickupDate}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border ${formErrors.pickupDate ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {formErrors.pickupDate && <p className="mt-1 text-sm text-red-500">{formErrors.pickupDate}</p>}
                    </div>
                    <div>
                      <label htmlFor="pickupTime" className="block text-sm font-medium text-white mb-1">
                        Pickup Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        id="pickupTime"
                        name="pickupTime"
                        value={formData.pickupTime}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border ${formErrors.pickupTime ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {formErrors.pickupTime && <p className="mt-1 text-sm text-red-500">{formErrors.pickupTime}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pickupLocation" className="block text-sm font-medium text-white mb-1">
                      Pickup Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="pickupLocation"
                      name="pickupLocation"
                      value={formData.pickupLocation}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${formErrors.pickupLocation ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select pickup location</option>
                      <option value="facility1">Facility 1</option>
                      <option value="facility2">Facility 2</option>
                      <option value="facility3">Facility 3</option>
                    </select>
                    {formErrors.pickupLocation && <p className="mt-1 text-sm text-red-500">{formErrors.pickupLocation}</p>}
                  </div>

                  <div>
                    <label htmlFor="pickupAddress" className="block text-sm font-medium text-white mb-1">
                      Pickup Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="pickupAddress"
                      name="pickupAddress"
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                      rows={2}
                      className={`w-full rounded-lg border ${formErrors.pickupAddress ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter pickup address"
                    />
                    {formErrors.pickupAddress && <p className="mt-1 text-sm text-red-500">{formErrors.pickupAddress}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="deliveryDate" className="block text-sm font-medium text-white mb-1">
                        Delivery Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="deliveryDate"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border ${formErrors.deliveryDate ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {formErrors.deliveryDate && <p className="mt-1 text-sm text-red-500">{formErrors.deliveryDate}</p>}
                    </div>
                    <div>
                      <label htmlFor="deliveryTime" className="block text-sm font-medium text-white mb-1">
                        Delivery Time <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="time"
                        id="deliveryTime"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        className={`w-full rounded-lg border ${formErrors.deliveryTime ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                      />
                      {formErrors.deliveryTime && <p className="mt-1 text-sm text-red-500">{formErrors.deliveryTime}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="deliveryLocation" className="block text-sm font-medium text-white mb-1">
                      Delivery Location <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="deliveryLocation"
                      name="deliveryLocation"
                      value={formData.deliveryLocation}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${formErrors.deliveryLocation ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select delivery location</option>
                      <option value="facility1">Facility 1</option>
                      <option value="facility2">Facility 2</option>
                      <option value="facility3">Facility 3</option>
                    </select>
                    {formErrors.deliveryLocation && <p className="mt-1 text-sm text-red-500">{formErrors.deliveryLocation}</p>}
                  </div>

                  <div>
                    <label htmlFor="deliveryAddress" className="block text-sm font-medium text-white mb-1">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="deliveryAddress"
                      name="deliveryAddress"
                      value={formData.deliveryAddress}
                      onChange={handleInputChange}
                      rows={2}
                      className={`w-full rounded-lg border ${formErrors.deliveryAddress ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Enter delivery address"
                    />
                    {formErrors.deliveryAddress && <p className="mt-1 text-sm text-red-500">{formErrors.deliveryAddress}</p>}
                  </div>

                  <div>
                    <label htmlFor="transportationType" className="block text-sm font-medium text-white mb-1">
                      Transportation Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      id="transportationType"
                      name="transportationType"
                      value={formData.transportationType}
                      onChange={handleInputChange}
                      className={`w-full rounded-lg border ${formErrors.transportationType ? 'border-red-500' : 'border-gray-600'} bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500`}
                    >
                      <option value="">Select transportation type</option>
                      <option value="ground">Ground</option>
                      <option value="air">Air</option>
                    </select>
                    {formErrors.transportationType && <p className="mt-1 text-sm text-red-500">{formErrors.transportationType}</p>}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Patient Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Email</p>
                        <p className="text-white">{formData.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Name</p>
                        <p className="text-white">{`${formData.firstName} ${formData.lastName}`}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone</p>
                        <p className="text-white">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Has Partner</p>
                        <p className="text-white">{formData.hasPartner ? 'Yes' : 'No'}</p>
                      </div>
                      {formData.notes && (
                        <div className="col-span-2">
                          <p className="text-gray-400">Notes</p>
                          <p className="text-white">{formData.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-medium text-white mb-3">Shipping Information</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Pickup Date & Time</p>
                        <p className="text-white">{`${formData.pickupDate} ${formData.pickupTime}`}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Delivery Date & Time</p>
                        <p className="text-white">{`${formData.deliveryDate} ${formData.deliveryTime}`}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Pickup Location</p>
                        <p className="text-white">{formData.pickupLocation}</p>
                        <p className="text-gray-400 mt-1">{formData.pickupAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Delivery Location</p>
                        <p className="text-white">{formData.deliveryLocation}</p>
                        <p className="text-gray-400 mt-1">{formData.deliveryAddress}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Transportation Type</p>
                        <p className="text-white">{formData.transportationType}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setShowShippingRequestModal(false);
                setCurrentStep(1);
                setFormData({
                  email: '',
                  firstName: '',
                  lastName: '',
                  phone: '',
                  notes: '',
                  hasPartner: false,
                  pickupDate: '',
                  pickupTime: '',
                  pickupLocation: '',
                  pickupAddress: '',
                  deliveryDate: '',
                  deliveryTime: '',
                  deliveryLocation: '',
                  deliveryAddress: '',
                  transportationType: ''
                });
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShippingPage; 