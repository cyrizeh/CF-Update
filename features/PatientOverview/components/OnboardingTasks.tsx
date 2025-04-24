import { OnboardingTask } from '@/types/view';
import { Accordion, Badge } from 'flowbite-react';
import { FaRegCircleCheck, FaRegClock } from 'react-icons/fa6';

const OnboardingTasks = ({ label, steps }: { label: string; steps: OnboardingTask[] }) => {
  const { Panel, Title, Content } = Accordion;

  const statusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'Completed':
        return <FaRegCircleCheck color="#84E1BC" size={15} />;

      default:
        return <FaRegClock color="#FDF6B2" size={15} />;
    }
  };

  return (
    <Accordion className="border-0">
      <Panel>
        <Title>
          <div className="flex items-center gap-3">
            {label}
            <Badge color={'cryo'} className="item-center flex h-[22px] w-[28px] justify-center text-center">
              {steps.length}
            </Badge>
          </div>
        </Title>
        <Content>
          {steps.map((elem, i) => (
            <div key={i} className="flex justify-between py-3">
              <div className="flex items-center justify-center gap-3">
                <div>{statusIcon(elem?.status)}</div>
                <div>
                  <p className="max-w-[250px] break-all text-xs font-semibold uppercase lg:max-w-full">{elem.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                {elem?.status === 'Overdue' && (
                  <span className="ml-2 text-xs font-medium text-[#F98080]">{'Overdue'}</span>
                )}
              </div>
            </div>
          ))}
        </Content>
      </Panel>
    </Accordion>
  );
};

export default OnboardingTasks;
