import { useIdleTimer } from 'react-idle-timer';
import { useState, useEffect } from 'react';
import { Button, Modal } from 'flowbite-react';
import { useUser } from '@auth0/nextjs-auth0/client';

const IdleTimer = () => {
  const { user } = useUser();
  const [open, setOpen] = useState<boolean>(false);
  const [remaining, setRemaining] = useState<number>(0);
  const isEnvDev = process.env.NODE_ENV === 'development';
  const idleTimeout = isEnvDev ? 32400000 : 300000;

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(Math.ceil(getRemainingTime() / 1000));
    }, 500);

    return () => {
      clearInterval(interval);
    };
  }, []);
  const onIdle = () => {
    setOpen(false);
    if (user) {
      window.location.replace('/api/auth/logout');
    }
  };

  const onPrompt = () => {
    setOpen(true);
  };

  const { getRemainingTime, activate } = useIdleTimer({
    onIdle,
    onPrompt,
    promptBeforeIdle: 30000,
    timeout: idleTimeout,
    throttle: 500,
  });

  const handleStillHere = () => {
    activate();
    setOpen(false);
  };

  if (!user) {
    return null;
  }

  return open ? (
    <Modal show={open} size="sm">
      <Modal.Body>
        <div className="flex justify-start">
          To protect your accout we will log you out in {remaining} {remaining > 1 ? 'seconds' : 'second'}
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-center">
        <Button gradientDuoTone="primary" onClick={handleStillHere}>
          I am still here
        </Button>
      </Modal.Footer>
    </Modal>
  ) : null;
};

export default IdleTimer;
