import { card_actions } from 'actions';
import React from 'react'
import { RiInformationFill } from 'react-icons/ri';
import { actionType } from 'types';

import { cn } from '@/lib/utils'

import MasterCard from '~/svg/mc.svg';
import Visa from '~/svg/visa.svg'

const InputVariant = ['primary', 'success', 'error'] as const;

const helperBorderClasses: Record<string, string> = {
  error: 'focus:border-red-400 focus:ring-red-300',
  success: 'focus:border-green-400 focus:ring-green-300',
  primary: 'focus:border-primary-400 focus:ring-primary-500',
};

const helperTextClasses: Record<string, string> = {
  primary: 'text-black',
  error: 'text-red-600',
  success: 'text-green-700',
};

type HelperProps = {
  message?: string;
  type?: (typeof InputVariant)[number];
};

const BasicInput = (
  {
    name, min, max, type = "text", cardType, secureInput = false, value, variant, placeholder = 'primary', helper, handleChange
  }: {
    min?: number;
    max?: number;
    name: string;
    type?: string;
    placeholder?: string;
    secureInput?: boolean;
    value: string | number;
    cardType?: string | null;
    helper?: HelperProps | any;
    handleChange: ({ type, value }: actionType) => void;
    variant?: (typeof InputVariant)[number];
  }) => {
  return (
    <div className="relative w-full max-w-sm">
      <input
        value={value}
        minLength={min ?? undefined}
        maxLength={max ?? undefined}
        type={secureInput ? 'password' : type}
        onChange={((e) => {
          let inputValue = e.target.value;
          if (name === card_actions.update_expiry) {
            if (inputValue.length === 1 && Number(inputValue) > 1) {
              inputValue = `0${inputValue}`
            }

            if (inputValue.length === 2 && inputValue[0] === '1' && inputValue[1] === '/') {
              inputValue = `0${inputValue}`
            }

            // Remove any char that is not 0-9 or /
            inputValue = inputValue.replace(/[^0-9/]/g, '')
            // Automatically add slash
            inputValue = inputValue.replace(/^(\d{2})(\d)/, '$1/$2');
          }
          e.target.value.length !== max && handleChange({ type: name, value: inputValue })
        })}
        className={cn(
          'block w-full rounded-[5px] border-[0.5px] border-primary-300 bg-white py-1 md:py-2 pl-2 pr-4 font-light text-black placeholder-opacity-30 focus:outline-none focus:ring focus:ring-opacity-60 appearance-none',
          [
            variant === 'primary' && [
              "text-black border border-primary-200 hover:border-primary-300"
            ],
            variant === 'success' && [
              "text-green-700 border border-green-200 hover:border-green-300"
            ],
            variant === 'error' && [
              "text-red-700 border border-red-200 hover:border-red-300"
            ]
          ],
          helper?.type
            ? helperBorderClasses[helper.type]
            : 'focus:border-primary focus:ring-primary-500',
        )
        }
        placeholder={placeholder ? placeholder : "Type here..."}
      />

      {cardType && (
        <div className={cn(
          helper?.message && "pb-4",
          "absolute inset-y-0 right-2 flex items-center"
        )}>
          {cardType === 'visa'
            ? <Visa className="h-5 w-8 object-contain" alt={cardType} />
            : <MasterCard className="h-5 w-8 object-contain" alt={cardType} />
          }
        </div>
      )}

      {helper?.message && (
        <p
          className={cn(helperTextClasses[helper.type], 'text-xs mt-1')}
          role='alert'
        >
          <div className='flex flex-row items-center gap-2'>
            <RiInformationFill className='fill-current text-red-500' />
            <div className='text-left'>{helper.message}</div>
          </div>
        </p>
      )}
    </div>
  )
}

export default BasicInput