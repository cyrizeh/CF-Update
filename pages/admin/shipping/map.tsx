import { useState, useEffect } from 'react';
import { Card, Badge } from 'flowbite-react';
import { HiTruck, HiLocationMarker, HiClock, HiCheckCircle, HiInformationCircle } from 'react-icons/hi';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';

interface ShipmentLocation {
  id: string;
  name: string;
  location: google.maps.LatLngLiteral;
  status: 'in-transit' | 'delivered' | 'scheduled';
  type: 'pickup' | 'delivery';
  estimatedTime: string;
  address: string;
  lastUpdate: string;
}

const MapPage = () => {
  const [selectedShipment, setSelectedShipment] = useState<ShipmentLocation | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Mock data for shipments
  const shipments: ShipmentLocation[] = [
    {
      id: 'TR-1234',
      name: 'Nashville Lab',
      location: { lat: 36.1627, lng: -86.7816 },
      status: 'delivered',
      type: 'pickup',
      estimatedTime: '10:30 AM',
      address: '123 Medical Center Dr, Nashville, TN 37203',
      lastUpdate: '2 hours ago'
    },
    {
      id: 'TR-1235',
      name: 'Jacksonville Facility',
      location: { lat: 30.3322, lng: -81.6557 },
      status: 'in-transit',
      type: 'delivery',
      estimatedTime: '2:30 PM',
      address: '456 Healthcare Ave, Jacksonville, FL 32202',
      lastUpdate: '30 minutes ago'
    },
    {
      id: 'TR-1236',
      name: 'Orlando Medical Center',
      location: { lat: 28.5383, lng: -81.3792 },
      status: 'scheduled',
      type: 'delivery',
      estimatedTime: '3:45 PM',
      address: '789 Hospital Blvd, Orlando, FL 32801',
      lastUpdate: '1 hour ago'
    }
  ];

  const mapContainerStyle = {
    height: '600px',
    width: '100%'
  };

  const defaultCenter = {
    lat: 31.9686,
    lng: -83.5487
  };

  const getStatusColor = (status: ShipmentLocation['status']) => {
    switch (status) {
      case 'in-transit':
        return 'blue';
      case 'delivered':
        return 'green';
      case 'scheduled':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: ShipmentLocation['status']) => {
    switch (status) {
      case 'in-transit':
        return <HiTruck className="w-5 h-5" />;
      case 'delivered':
        return <HiCheckCircle className="w-5 h-5" />;
      case 'scheduled':
        return <HiClock className="w-5 h-5" />;
      default:
        return <HiInformationCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Transportation Map</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Real-time view of all transportation activities
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map Section */}
        <div className="lg:col-span-2">
          <Card>
            <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                zoom={6}
                center={defaultCenter}
                onLoad={() => setMapLoaded(true)}
              >
                {mapLoaded && shipments.map((shipment) => (
                  <Marker
                    key={shipment.id}
                    position={shipment.location}
                    onClick={() => setSelectedShipment(shipment)}
                    icon={{
                      url: `/icons/${shipment.status}.png`,
                      scaledSize: new google.maps.Size(30, 30)
                    }}
                  />
                ))}
                {mapLoaded && selectedShipment && (
                  <Polyline
                    path={[
                      { lat: 36.1627, lng: -86.7816 }, // Nashville
                      { lat: 30.3322, lng: -81.6557 }, // Jacksonville
                      { lat: 28.5383, lng: -81.3792 }, // Orlando
                    ]}
                    options={{
                      strokeColor: '#2563eb',
                      strokeOpacity: 0.8,
                      strokeWeight: 3,
                    }}
                  />
                )}
              </GoogleMap>
            </LoadScript>
          </Card>
        </div>

        {/* Shipment Details */}
        <div>
          <Card>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Package Status</h2>
                <Badge color="blue">Active Shipments: {shipments.length}</Badge>
              </div>
              
              {shipments.map((shipment) => (
                <div
                  key={shipment.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedShipment?.id === shipment.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setSelectedShipment(shipment)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-${getStatusColor(shipment.status)}-600`}>
                        {getStatusIcon(shipment.status)}
                      </span>
                      <h3 className="font-medium text-gray-900">{shipment.name}</h3>
                    </div>
                    <Badge color={getStatusColor(shipment.status)}>
                      {shipment.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <HiLocationMarker className="w-4 h-4" />
                      <span>{shipment.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <HiClock className="w-4 h-4" />
                      <span>ETA: {shipment.estimatedTime}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Last updated: {shipment.lastUpdate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MapPage; 