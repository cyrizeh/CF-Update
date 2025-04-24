import React from 'react';
import classNames from 'classnames';
import { ViewTypes } from '@/types';

const StatusPanel = ({ statuses, status, handleChange, disabled }: ViewTypes.StatusPanel) => {
  return (
    <div className="text-md scrollbar mb-4 flex max-h-[500px] flex-col items-center gap-3 overflow-x-auto rounded-md border border-transparent p-4 text-center sm:p-8 md:max-w-full dark:bg-[#1E2021]">
      <ol className="flex w-full flex-col items-start space-y-4 border-gray-900 text-gray-500  sm:space-x-8 sm:space-y-0 md:flex-row rtl:space-x-reverse">
        {statuses.map(({ label, value, disabled: statusDisabled }, index) => (
          <li
            key={index}
            className={classNames('flex items-center space-x-2.5 ', {
              'bg-gradient-to-r from-cryo-blue to-cryo-cyan bg-clip-text font-light text-transparent': status === value,
            })}>
            <button
              className="font-medium leading-tight"
              onClick={e => handleChange(value)}
              disabled={disabled || statusDisabled}>
              <div className="flex gap-1">
                <span
                  className={classNames('flex h-8 w-8 shrink-0  items-center justify-center rounded-full border-2', {
                    'border-cryo-blue': status === value,
                    'border-gray-500': status !== value,
                  })}>
                  {status === value && (
                    <svg
                      className={classNames('h-3.5 w-3.5', {
                        'text-cyan-300 ': status === value,
                      })}
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 16 12">
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M1 5.917 5.724 10.5 15 1.5"
                      />
                    </svg>
                  )}
                </span>
                <span className="mr-2 text-start">{label}</span>
              </div>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default StatusPanel;
