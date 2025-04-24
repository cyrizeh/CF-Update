import { useState } from 'react';
import { Card, Tabs, ToggleSwitch } from 'flowbite-react';
import { HiOutlineMail, HiOutlineBell } from 'react-icons/hi';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  emailEnabled: boolean;
  notificationEnabled: boolean;
}

export default function ShippingSettings() {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'transport-request',
      title: 'Transport Request',
      description: 'Get notified when a new transport request is created',
      emailEnabled: true,
      notificationEnabled: true,
    },
    {
      id: 'status-change',
      title: 'Status Changes',
      description: 'Receive updates when transport status changes',
      emailEnabled: true,
      notificationEnabled: true,
    },
    {
      id: 'schedule-confirmation',
      title: 'Schedule Confirmation',
      description: 'Get notified about schedule confirmations and changes',
      emailEnabled: false,
      notificationEnabled: true,
    },
    {
      id: 'delivery-updates',
      title: 'Delivery Updates',
      description: 'Receive notifications about delivery status and completion',
      emailEnabled: true,
      notificationEnabled: true,
    },
  ]);

  const handleToggle = (id: string, type: 'emailEnabled' | 'notificationEnabled') => {
    setNotificationSettings(prevSettings =>
      prevSettings.map(setting =>
        setting.id === id
          ? { ...setting, [type]: !setting[type] }
          : setting
      )
    );
  };

  return (
    <div className="p-4">
      <Tabs.Group aria-label="Shipping settings tabs" className="border-b border-gray-700">
        <Tabs.Item title="Email Templates" icon={HiOutlineMail}>
          <div className="relative rounded-lg bg-[#282b2c] shadow border border-transparent bg-clip-padding" style={{ background: 'linear-gradient(to right, #282b2c, #282b2c) padding-box, linear-gradient(to right, #3b82f6, #14b8a6) border-box' }}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Email Templates
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Configure automated email templates for different events
              </p>
              <div className="space-y-6">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-medium text-white">
                        {setting.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={setting.emailEnabled}
                      onChange={() => handleToggle(setting.id, 'emailEnabled')}
                      label=""
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Item>
        <Tabs.Item title="Notifications" icon={HiOutlineBell}>
          <div className="relative rounded-lg bg-[#282b2c] shadow border border-transparent bg-clip-padding" style={{ background: 'linear-gradient(to right, #282b2c, #282b2c) padding-box, linear-gradient(to right, #3b82f6, #14b8a6) border-box' }}>
            <div className="p-6">
              <h3 className="text-lg font-medium text-white mb-4">
                Notification Preferences
              </h3>
              <p className="text-sm text-gray-400 mb-6">
                Manage your notification settings and preferences
              </p>
              <div className="space-y-6">
                {notificationSettings.map((setting) => (
                  <div key={setting.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-medium text-white">
                        {setting.title}
                      </p>
                      <p className="text-sm text-gray-400">
                        {setting.description}
                      </p>
                    </div>
                    <ToggleSwitch
                      checked={setting.notificationEnabled}
                      onChange={() => handleToggle(setting.id, 'notificationEnabled')}
                      label=""
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Tabs.Item>
      </Tabs.Group>
    </div>
  );
} 