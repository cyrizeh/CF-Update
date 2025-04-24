import { useState } from 'react';
import { Card, Button, Badge, Modal, Tabs, Label, TextInput, Textarea } from 'flowbite-react';
import { HiCalendar, HiClock, HiCheckCircle, HiXCircle, HiPlus } from 'react-icons/hi';
import { FaTruck, FaTint } from 'react-icons/fa';
import Calendar from 'react-calendar';
import type { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface Facility {
  id: string;
  name: string;
  location: string;
  tanks: Tank[];
  blockedSlots: BlockedSlot[];
}

interface Tank {
  id: string;
  name: string;
  capacity: number;
  currentUsage: number;
  status: 'available' | 'full' | 'maintenance';
}

interface BlockedSlot {
  id: string;
  start: Date;
  end: Date;
  reason: string;
  type: 'maintenance' | 'holiday' | 'other';
}

interface TransportationWindow {
  id: string;
  start: Date;
  end: Date;
  facilityId: string;
  status: 'pending' | 'approved' | 'rejected';
}

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedFacility, setSelectedFacility] = useState<string>('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedWindow, setSelectedWindow] = useState<TransportationWindow | null>(null);
  const [calendarView, setCalendarView] = useState<'month'>('month');

  // Mock data - replace with actual API calls
  const facilities: Facility[] = [
    {
      id: 'facility-1',
      name: 'NYC Lab',
      location: 'New York, NY',
      tanks: [
        { id: 'tank-1', name: 'Tank A', capacity: 100, currentUsage: 75, status: 'available' },
        { id: 'tank-2', name: 'Tank B', capacity: 100, currentUsage: 100, status: 'full' },
        { id: 'tank-3', name: 'Tank C', capacity: 100, currentUsage: 50, status: 'maintenance' },
      ],
      blockedSlots: [
        {
          id: 'block-1',
          start: new Date(2024, 2, 15, 9, 0),
          end: new Date(2024, 2, 15, 12, 0),
          reason: 'Maintenance',
          type: 'maintenance',
        },
      ],
    },
    {
      id: 'facility-2',
      name: 'Boston Lab',
      location: 'Boston, MA',
      tanks: [
        { id: 'tank-4', name: 'Tank D', capacity: 100, currentUsage: 25, status: 'available' },
        { id: 'tank-5', name: 'Tank E', capacity: 100, currentUsage: 90, status: 'available' },
      ],
      blockedSlots: [],
    },
  ];

  const transportationWindows: TransportationWindow[] = [
    {
      id: 'window-1',
      start: new Date(2024, 2, 15, 14, 0),
      end: new Date(2024, 2, 15, 16, 0),
      facilityId: 'facility-1',
      status: 'pending',
    },
  ];

  const getTankStatusColor = (status: Tank['status']) => {
    switch (status) {
      case 'available':
        return 'green';
      case 'full':
        return 'red';
      case 'maintenance':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getBlockedSlotColor = (type: BlockedSlot['type']) => {
    switch (type) {
      case 'maintenance':
        return 'yellow';
      case 'holiday':
        return 'red';
      default:
        return 'gray';
    }
  };

  const handleScheduleRequest = (window: TransportationWindow) => {
    setSelectedWindow(window);
    setShowApprovalModal(true);
  };

  const handleApprove = () => {
    // Handle approval logic
    setShowApprovalModal(false);
  };

  const handleReject = () => {
    // Handle rejection logic
    setShowApprovalModal(false);
  };

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Schedule Management</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Manage facility schedules, tank availability, and transportation windows
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Calendar Section */}
        <div className="lg:col-span-2">
          <Card className="!bg-[#282b2c]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-white">Facility Calendar</h2>
              <div className="flex gap-2">
                <Button 
                  color="blue"
                  size="sm"
                >
                  <HiCalendar className="mr-2 h-5 w-5" />
                  Month View
                </Button>
              </div>
            </div>
            <div className="calendar-container dark">
              <Calendar
                onChange={(value: any) => {
                  if (value instanceof Date) {
                    setSelectedDate(value);
                  }
                }}
                value={selectedDate}
                className="w-full border-0 font-light text-sm !bg-[#282b2c] text-white"
                tileClassName={({ date }: { date: Date }) => {
                  const hasBlockedSlot = facilities.some(facility =>
                    facility.blockedSlots.some(slot =>
                      date >= slot.start && date <= slot.end
                    )
                  );
                  return `${hasBlockedSlot ? 'bg-yellow-900/50' : ''} text-white hover:bg-gray-700`;
                }}
                view={calendarView}
                minDetail={calendarView}
                maxDetail={calendarView}
                formatShortWeekday={(locale, date) => 
                  ['S', 'M', 'T', 'W', 'T', 'F', 'S'][date.getDay()]
                }
                formatMonthYear={(locale, date) => 
                  date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
                }
              />
            </div>
          </Card>
        </div>

        {/* Facility List */}
        <div>
          <Card className="!bg-[#282b2c]">
            <h2 className="text-lg font-semibold text-white mb-4">Facilities</h2>
            <div className="space-y-4">
              {facilities.map((facility) => (
                <div
                  key={facility.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedFacility === facility.id 
                      ? 'border-blue-500 bg-blue-900/20 border-blue-400' 
                      : 'border-gray-700 hover:border-blue-600'
                  }`}
                  onClick={() => setSelectedFacility(facility.id)}
                >
                  <h3 className="font-medium text-white">{facility.name}</h3>
                  <p className="text-sm text-gray-400">{facility.location}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {facility.tanks.map((tank) => (
                      <Badge
                        key={tank.id}
                        color={getTankStatusColor(tank.status)}
                        className="flex items-center gap-1"
                      >
                        <FaTint className="h-3 w-3" />
                        {tank.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Transportation Windows */}
      <div className="mt-4">
        <Card className="!bg-[#282b2c]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-white">Transportation Windows</h2>
            <Button color="blue" onClick={() => setShowScheduleModal(true)}>
              <HiPlus className="mr-2 h-5 w-5" />
              Request Window
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-gray-300">Facility</th>
                  <th className="px-6 py-3 text-gray-300">Start Time</th>
                  <th className="px-6 py-3 text-gray-300">End Time</th>
                  <th className="px-6 py-3 text-gray-300">Status</th>
                  <th className="px-6 py-3 text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transportationWindows.map((window) => (
                  <tr key={window.id} className="border-b border-gray-700">
                    <td className="px-6 py-4 text-white">
                      {facilities.find(f => f.id === window.facilityId)?.name}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {window.start.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {window.end.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        color={
                          window.status === 'approved'
                            ? 'success'
                            : window.status === 'rejected'
                            ? 'failure'
                            : 'warning'
                        }
                        className="capitalize"
                      >
                        {window.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Button
                        size="xs"
                        color="blue"
                        onClick={() => handleScheduleRequest(window)}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Request Transportation Window Modal */}
      <Modal
        show={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        className="dark"
      >
        <Modal.Header className="border-b border-gray-700 !bg-[#282b2c]">
          <span className="text-white">Request Transportation Window</span>
        </Modal.Header>
        <Modal.Body className="!bg-[#282b2c]">
          <div className="space-y-4">
            <div>
              <Label htmlFor="facility" className="text-gray-200">
                Facility
              </Label>
              <select
                id="facility"
                className="w-full rounded-lg border border-gray-600 bg-gray-700 text-white p-2.5 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a facility</option>
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="startTime" className="text-gray-200">
                Start Time
              </Label>
              <TextInput
                id="startTime"
                type="datetime-local"
                className="bg-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="endTime" className="text-gray-200">
                End Time
              </Label>
              <TextInput
                id="endTime"
                type="datetime-local"
                className="bg-gray-700 text-white"
              />
            </div>
            <div>
              <Label htmlFor="reason" className="text-gray-200">
                Reason
              </Label>
              <Textarea
                id="reason"
                rows={4}
                className="bg-gray-700 text-white"
                placeholder="Enter the reason for this transportation window..."
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-700 !bg-[#282b2c]">
          <Button color="gray" onClick={() => setShowScheduleModal(false)}>
            Cancel
          </Button>
          <Button color="blue">
            Submit Request
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Approval Modal */}
      <Modal 
        show={showApprovalModal} 
        onClose={() => setShowApprovalModal(false)}
        className="dark"
      >
        <Modal.Header className="border-b border-gray-700 !bg-[#282b2c]">
          <span className="text-white">Review Transportation Window</span>
        </Modal.Header>
        <Modal.Body className="!bg-[#282b2c]">
          {selectedWindow && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-white">Facility</h3>
                <p className="text-gray-400">
                  {facilities.find(f => f.id === selectedWindow.facilityId)?.name}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-white">Time Window</h3>
                <p className="text-gray-400">
                  {selectedWindow.start.toLocaleString()} - {selectedWindow.end.toLocaleString()}
                </p>
              </div>
              <div>
                <h3 className="font-medium text-white">Status</h3>
                <Badge
                  color={
                    selectedWindow.status === 'approved'
                      ? 'success'
                      : selectedWindow.status === 'rejected'
                      ? 'failure'
                      : 'warning'
                  }
                  className="capitalize"
                >
                  {selectedWindow.status}
                </Badge>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="border-t border-gray-700 !bg-[#282b2c]">
          <Button color="failure" onClick={handleReject}>
            <HiXCircle className="mr-2 h-5 w-5" />
            Reject
          </Button>
          <Button color="success" onClick={handleApprove}>
            <HiCheckCircle className="mr-2 h-5 w-5" />
            Approve
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx global>{`
        .react-calendar {
          background-color: transparent !important;
          border: none !important;
          width: 100% !important;
        }
        .react-calendar__navigation {
          border-bottom: 1px solid #374151;
          margin-bottom: 0.5em;
        }
        .react-calendar__navigation button {
          color: white !important;
          font-weight: 500;
        }
        .react-calendar__navigation button:enabled:hover,
        .react-calendar__navigation button:enabled:focus {
          background-color: #374151 !important;
        }
        .react-calendar__month-view__weekdays {
          color: #9ca3af !important;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.75rem;
        }
        .react-calendar__month-view__days__day {
          color: white !important;
        }
        .react-calendar__tile {
          color: white !important;
          background-color: transparent !important;
        }
        .react-calendar__tile:enabled:hover,
        .react-calendar__tile:enabled:focus {
          background-color: #374151 !important;
        }
        .react-calendar__tile--now {
          background-color: #1e40af !important;
          color: white !important;
        }
        .react-calendar__tile--active {
          background-color: #2563eb !important;
          color: white !important;
        }
        .react-calendar__month-view__days__day--weekend {
          color: #fb7185 !important;
        }
        .react-calendar__month-view__days__day--neighboringMonth {
          color: #6b7280 !important;
        }
        .react-calendar__navigation button:disabled {
          background-color: transparent !important;
        }
        .react-calendar__tile:disabled {
          background-color: transparent !important;
          color: #6b7280 !important;
        }
      `}</style>
    </div>
  );
};

export default SchedulePage; 