import { Button, Timeline } from 'flowbite-react';
import PatientComponentLayout from './PatientComponentLayout';
import { HiCalendar, HiOutlineDownload } from 'react-icons/hi';

const Activity = () => {
  return (
    <PatientComponentLayout col>
      <h6 className="mb-6 text-2xl font-normal text-white">Activity</h6>

      <Timeline className="ml-4 text-left ">
        <Timeline.Item>
          <Timeline.Point icon={HiCalendar} className="mt-2" />
          <Timeline.Content>
            <Timeline.Title>Directive signed</Timeline.Title>
            <Timeline.Time>January 13th, 2022</Timeline.Time>
            <Timeline.Body style={{ overflow: 'hidden' }}>
              <p className="text-base font-normal text-[#828282]">
                Non eu pulvinar sit gravida egestas. Nullam suspendisse ultricies tempor vulputate vitae dui at metus.
                Quis enim placerat elit malesuada lectus in nec. Enim sed odio sit phasellus sed ut.
              </p>
            </Timeline.Body>
            <Button gradientDuoTone="primary">
              <div className="mr-2">
                <HiOutlineDownload />
              </div>
              <p>Download</p>
            </Button>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point icon={HiCalendar} />
          <Timeline.Content>
            <Timeline.Title>Account activated</Timeline.Title>
            <Timeline.Time>December 7th, 2021</Timeline.Time>
            <Timeline.Body style={{ overflow: 'hidden' }}>
              <p className="text-base font-normal text-[#828282]">
                Pretium auctor et proin velit eu malesuada tellus eu. Diam vitae facilisis consectetur morbi cum. Amet
                commodo habitant lectus morbi odio aenean. Vitae duis urna gravida molestie. Fermentum.
              </p>
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
        <Timeline.Item>
          <Timeline.Point icon={HiCalendar} />
          <Timeline.Content>
            <Timeline.Title>Application received</Timeline.Title>
            <Timeline.Time>December 2nd, 2021</Timeline.Time>
            <Timeline.Body style={{ overflow: 'hidden' }}>
              <p className="text-base font-normal text-[#828282]">
                Facilisis placerat amet enim dui elit sed non. Non rhoncus sit eu massa. Condimentum nulla.
              </p>
            </Timeline.Body>
          </Timeline.Content>
        </Timeline.Item>
      </Timeline>
    </PatientComponentLayout>
  );
};

export default Activity;
