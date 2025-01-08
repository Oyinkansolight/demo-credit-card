import { card_actions } from 'actions'
import { AtomIcon } from 'lucide-react'
import React from 'react'
import { RiMastercardFill } from 'react-icons/ri'
import { actionType, cardStateType } from 'types'

import { getCardType, isCardExpired } from '@/lib/helper'
import { cn } from '@/lib/utils'

import BasicCard from '@/components/cards/BasicCard'
import BasicInput from '@/components/inputs/BasicInput'

import { TextConstants } from '@/constant/text'

const CreditCard = ({ cardState, handleDispatch }: {
  cardState: cardStateType;
  handleDispatch: (action: actionType) => void;
}) => {
  const handleInputChange = ({ value, type }: {
    value: string, type: string
  }) => {
    handleDispatch({ type, value })
  }

  const getCardNumberError = () => {
    const cardType = getCardType(cardState?.cardNumber);

    if ((!cardType && cardState?.cardNumber.length > 0) || (cardState?.cardNumber.length > 0 && cardState?.cardNumber.length < 16)) {
      return {
        type: "error",
        message: TextConstants.errors.invalid_card_number
      }
    }

    return null;
  }

  const IsValidDate = () => {
    if (cardState?.expiryDate.length === 5 && isCardExpired(cardState?.expiryDate)) {
      return {
        message: TextConstants.errors.invalid_date,
        type: 'error',
      }
    }
    return null
  }

  return (
    <BasicCard width="100%" classNames="p-0 md:h-[270px] border-[1.5px] border-gray-200 border-r-0 shadow-none">
      <div className='grid grid-cols-4 h-full'>
        <div className='col-span-3 flex flex-col p-6 text-left justify-between'>
          <div className='flex flex-col'>
            <div className='h4'>
              {TextConstants.checkout_card_text.credit_card_title}
            </div>
            <div className='text-sm text-gray-500'>
              {TextConstants.checkout_card_text.enter_card_details}
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <BasicInput
              max={50}
              placeholder='T Grey'
              value={cardState?.name}
              name={card_actions.update_name}
              handleChange={handleInputChange}
            />

            <BasicInput
              // secureInput
              min={17}
              max={17}
              type='number'
              placeholder='000000000000'
              helper={getCardNumberError()}
              value={cardState?.cardNumber}
              handleChange={handleInputChange}
              name={card_actions.update_card_number}
              cardType={getCardType(cardState?.cardNumber)}
            />

            <div className='flex flex-row gap-2'>
              <BasicInput
                max={6}
                placeholder='02/27'
                helper={IsValidDate()}
                value={cardState?.expiryDate}
                name={card_actions.update_expiry}
                handleChange={handleInputChange}
              />

              <BasicInput
                max={4}
                type="number"
                placeholder='CVV'
                value={cardState?.cvv}
                name={card_actions.update_cvv}
                handleChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className={cn(
          'col-span-1 flex flex-col justify-between p-4',
          'bg-gradient-to-bl from-primary-200 via-primary-500 to-primary-400'
        )}>
          <AtomIcon className='w-4 h-4 md:w-10 md:h-10 text-white opacity-50' />
          <RiMastercardFill className='w-8 h-8 md:w-14 md:h-14 text-white opacity-30 mx-auto' />
        </div>
      </div>
    </BasicCard>
  )
}

export default CreditCard