import { useRouter } from 'next/router';
import { HiChevronLeft, HiClock, HiDocumentText, HiMail, HiPhone, HiUser, HiCheck } from 'react-icons/hi';
import { Button } from 'flowbite-react';

const ShippingDetailPage = () => {
  const router = useRouter();
  const { id } = router.query;

  // Mock data - replace with actual API call
  const shippingData = {
    patient: {
      name: 'Donna Garcia',
      dateOfBirth: '1990-05-15',
      email: 'donna.garcia@example.com',
      phone: '+1 (555) 123-4567',
      account: 'CryoBank Inc'
    },
    shipping: {
      origin: {
        facility: 'NYC Lab',
        clinic: 'NYC Fertility',
        address: '123 Medical Plaza, New York, NY 10001'
      },
      destination: {
        facility: 'Boston Lab',
        clinic: 'Boston IVF',
        address: '456 Healthcare Ave, Boston, MA 02108'
      },
      requestedDeliveryDate: '2024-03-25',
      specialInstructions: 'Temperature must be maintained at -196°C during transport.',
      status: 'In Transit',
      timeline: [
        {
          date: '2024-03-20 09:00 AM',
          status: 'Request Submitted',
          description: 'Transport request received and processed'
        },
        {
          date: '2024-03-21 10:30 AM',
          status: 'Pickup Scheduled',
          description: 'Courier assigned and pickup scheduled'
        },
        {
          date: '2024-03-22 08:45 AM',
          status: 'In Transit',
          description: 'Specimen picked up from NYC Lab'
        }
      ]
    },
    communication: [
      {
        date: '2024-03-20 09:15 AM',
        type: 'Email',
        description: 'Confirmation of transport request sent to clinic'
      },
      {
        date: '2024-03-21 11:00 AM',
        type: 'Phone',
        description: 'Pickup time confirmed with origin facility'
      }
    ],
    documents: [
      {
        name: 'Transport Request Form',
        date: '2024-03-20',
        type: 'PDF'
      },
      {
        name: 'Chain of Custody',
        date: '2024-03-22',
        type: 'PDF'
      }
    ]
  };

  const getTimelineStatusStyle = (index: number, currentStatus: string) => {
    const statusOrder = ['Request Submitted', 'Pickup Scheduled', 'In Transit', 'Delivered'];
    const currentStatusIndex = statusOrder.indexOf(currentStatus);
    
    if (index < currentStatusIndex) {
      // Completed steps
      return {
        icon: <HiCheck className="w-5 h-5 text-emerald-400" />,
        bgColor: 'bg-emerald-900/50',
        borderColor: 'border-2 border-emerald-500',
        lineColor: 'bg-emerald-500'
      };
    } else if (index === currentStatusIndex) {
      // Current step
      return {
        icon: <HiClock className="w-5 h-5 text-blue-400" />,
        bgColor: 'bg-blue-900/50',
        borderColor: 'border-2 border-blue-500',
        lineColor: 'bg-gray-700'
      };
    } else {
      // Pending steps
      return {
        icon: <HiClock className="w-5 h-5 text-gray-400" />,
        bgColor: 'bg-gray-800',
        borderColor: 'border-2 border-gray-600',
        lineColor: 'bg-gray-700'
      };
    }
  };

  return (
    <div className="p-4">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.push('/admin/shipping')}
          className="flex items-center text-gray-400 hover:text-white mb-4"
        >
          <HiChevronLeft className="w-5 h-5 mr-1" />
          Back to Shipping Overview
        </button>
        <h1 className="text-2xl font-bold text-white">
          Shipping Details
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Transport ID: {id}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Information Card */}
        <div className="bg-[#282b2c] rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-white">Patient Information</h2>
            <Button size="sm" color="dark">
              Edit
            </Button>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <HiUser className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-white">{shippingData.patient.name}</p>
                <p className="text-sm text-gray-400">Date of Birth: {shippingData.patient.dateOfBirth}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <HiMail className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-300">{shippingData.patient.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <HiPhone className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-300">{shippingData.patient.phone}</p>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <p className="text-sm text-gray-400">Associated Account</p>
              <p className="text-sm font-medium text-white">{shippingData.patient.account}</p>
            </div>
          </div>
        </div>

        {/* Shipping Details Card */}
        <div className="bg-[#282b2c] rounded-lg shadow-sm border border-gray-700 p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-white">Shipping Details</h2>
            <Button size="sm" color="dark">
              Edit
            </Button>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-white mb-2">Origin</p>
              <div className="text-sm text-gray-300">
                <p>{shippingData.shipping.origin.facility}</p>
                <p>{shippingData.shipping.origin.clinic}</p>
                <p>{shippingData.shipping.origin.address}</p>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-white mb-2">Destination</p>
              <div className="text-sm text-gray-300">
                <p>{shippingData.shipping.destination.facility}</p>
                <p>{shippingData.shipping.destination.clinic}</p>
                <p>{shippingData.shipping.destination.address}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-700">
              <p className="text-sm font-medium text-white mb-2">Delivery Information</p>
              <div className="text-sm text-gray-300">
                <p>Requested Delivery: {shippingData.shipping.requestedDeliveryDate}</p>
                <p className="mt-2">Special Instructions:</p>
                <p className="text-sm text-gray-300">{shippingData.shipping.specialInstructions}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Card */}
        <div className="bg-[#282b2c] rounded-lg shadow-sm border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Timeline</h2>
          <div className="space-y-6">
            {shippingData.shipping.timeline.map((event, index) => {
              const statusStyle = getTimelineStatusStyle(index, shippingData.shipping.status);
              return (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full ${statusStyle.bgColor} ${statusStyle.borderColor} flex items-center justify-center`}>
                      {statusStyle.icon}
                    </div>
                    {index !== shippingData.shipping.timeline.length - 1 && (
                      <div className={`w-0.5 flex-grow ${statusStyle.lineColor} mt-2`}></div>
                    )}
                  </div>
                  <div className="flex-1 -mt-1">
                    <p className="text-sm font-medium text-white">{event.status}</p>
                    <p className="text-sm text-gray-400">{event.date}</p>
                    <p className="text-sm text-gray-300 mt-1">{event.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Communication & Documents Card */}
        <div className="bg-[#282b2c] rounded-lg shadow-sm border border-gray-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Communication & Documents</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Communication History</h3>
              <div className="space-y-3">
                {shippingData.communication.map((comm, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                      {comm.type === 'Email' ? (
                        <HiMail className="w-4 h-4 text-gray-400" />
                      ) : (
                        <HiPhone className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm text-white">{comm.type}</p>
                      <p className="text-sm text-gray-400">{comm.date}</p>
                      <p className="text-sm text-gray-300">{comm.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-white mb-3">Linked Documents</h3>
              <div className="space-y-2">
                {shippingData.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <HiDocumentText className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-white">{doc.name}</p>
                        <p className="text-xs text-gray-400">{doc.date}</p>
                      </div>
                    </div>
                    <Button size="xs" color="dark">
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetailPage; 