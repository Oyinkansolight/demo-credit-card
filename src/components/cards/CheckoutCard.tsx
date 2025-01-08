import { card_actions } from 'actions'
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation'
import React, { useEffect, useReducer, useState } from 'react'
import { fetchApi } from 'server/api'
import { actionType, cardStateType } from 'types'

import Button from '@/components/buttons/Button'
import { CustomBorderWrapper } from '@/components/buttons/Wrapper'
import BasicCard from '@/components/cards/BasicCard'
import CreditCard from '@/components/cards/CreditCard'
import UnderlineLink from '@/components/links/UnderlineLink'

import { paymentOptions } from '@/constant/config'
import { TextConstants } from '@/constant/text'
import { cardReducer } from '@/reducers'

import ApplePayLogo from '~/svg/Apple_Pay_logo.svg';
import PayPalLogo from '~/svg/PayPal.svg';

const initialState: cardStateType = {
  cvv: "",
  name: "",
  cardNumber: "",
  expiryDate: "",
}

const CheckoutCard = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false);
  const [cardState, dispatch] = useReducer(cardReducer, initialState);

  const handleDispatch = (obj: actionType) => {
    dispatch(obj)
  }

  const handleCardSubmit = async () => {
    const cardData = JSON.stringify({
      "cvv": cardState.cvv,
      "card_number": cardState.cardNumber,
      "expiration_date": cardState.expiryDate,
    });

    setIsLoading(true)
    const response =
      await fetchApi("/card_validation/validate",
        {
          method: 'POST',
          body: cardData,
        },
        true
      )


    if (response) {
      router.push('/success')
    }

    setIsLoading(false)
  }

  return (
    <BasicCard width={600}>
      <CardItems
        isLoading={isLoading}
        cardState={cardState}
        handleDispatch={handleDispatch}
        handleCardSubmit={handleCardSubmit}
      />
    </BasicCard>
  )
}

const CardItems = ({ cardState, isLoading, handleCardSubmit, handleDispatch }: {
  isLoading: boolean;
  cardState: cardStateType;
  handleCardSubmit: () => void;
  handleDispatch: (action: actionType) => void;
}) => {

  const [selectedPaymentOption, setSelectedPaymentOption] = useState<string>(paymentOptions.applePay);

  const handleSelection = (option: string) => {
    setSelectedPaymentOption(option);
  }

  useEffect(() => {
    handleDispatch({ type: card_actions.reset, value: "" })
  }, [selectedPaymentOption])


  return (
    <div className='flex flex-col gap-10'>
      <CardHeader />
      <PaymentOptions
        handleSelection={handleSelection}
        selectedPaymentOption={selectedPaymentOption}
      />
      <OrderSummary
        cardState={cardState}
        handleDispatch={handleDispatch}
        selectedPaymentOption={selectedPaymentOption}
      />
      <ConfirmPayment
        cardState={cardState}
        isLoading={isLoading}
        callBack={handleCardSubmit}
      />
      <div className='text-xs text-gray-400 -mt-6'>
        *{TextConstants.checkout_card_text.sub_text}
      </div>
    </div>
  )
}

function CardHeader() {
  return (
    <section className='flex flex-col gap-3'>
      <div className='flex gap-3 items-baseline'>
        <h2 className='h2'>Checkout</h2>
        <div className='text-gray-500'>Order Number: <span className='text-black font-semibold'>#233-277</span></div>
      </div>

      <div className='text-gray-500 text-left'>{TextConstants.checkout_card_text.sub_text}</div>
    </section>
  );
}

function PaymentOptions({ selectedPaymentOption, handleSelection }: {
  selectedPaymentOption: string;
  handleSelection: (selection: string) => void;
}) {

  return (
    <section className='flex flex-col md:flex-row gap-4 justify-between'>
      <CustomBorderWrapper isSelected={selectedPaymentOption === paymentOptions.applePay}>
        <Button onClick={() => handleSelection(paymentOptions.applePay)} variant='outline' className='w-full py-2 justify-center'><ApplePayLogo className="md:w-20 h-4 md:h-6" /></Button>
      </CustomBorderWrapper>

      <CustomBorderWrapper isSelected={selectedPaymentOption === paymentOptions.paypal}>
        <Button onClick={() => handleSelection(paymentOptions.paypal)} variant='outline' className='w-full py-2 justify-center'><PayPalLogo className="md:w-20 h-4 md:h-6" /></Button>
      </CustomBorderWrapper>

      <CustomBorderWrapper isSelected={selectedPaymentOption === paymentOptions.card}>
        <Button onClick={() => handleSelection(paymentOptions.card)} variant='outline' className='w-full py-2 justify-center'>{TextConstants.checkout_card_text.credit_card}</Button>
      </CustomBorderWrapper>
    </section>
  );
}

function OrderSummary({ cardState, handleDispatch, selectedPaymentOption, price = 450, vat = 72, total = 522 }: {
  vat?: number;
  price?: number;
  total?: number;
  cardState: cardStateType;
  selectedPaymentOption: string;
  handleDispatch: (action: actionType) => void;
}) {
  return (
    <section className='flex flex-col gap-4' >
      {selectedPaymentOption === paymentOptions.card && (
        <AnimatePresence>
          <motion.div
            initial={{ x: '100%', opacity: 0 }} // Start off-screen to the right
            animate={{ x: 0, opacity: 1 }} // Slide into position
            exit={{ x: '100%', opacity: 0 }} // Slide out to the right (optional)
            transition={{
              type: 'spring', // Spring animation for a smooth effect
              stiffness: 100, // Controls the bounciness
              damping: 20, // Controls the spring's damping
              duration: 5, // Controls the animation duration
            }}
          >
            <CreditCard cardState={cardState} handleDispatch={handleDispatch} />
          </motion.div>
        </AnimatePresence>
      )}
      <div className='flex justify-between items-center'>
        <div className='h4'>{TextConstants.checkout_card_text.order_summary}</div>
        <UnderlineLink href='#' aria-disabled className='text-xs text-gray-400 cursor-not-allowed'>{TextConstants.checkout_card_text.save_pdf}</UnderlineLink>
      </div>

      <div className='flex flex-col divide-y-2 divide-dashed font-semibold'>
        <div className='flex flex-col py-2'>
          <div className='flex justify-between'>
            <div className='text-gray-500'>{TextConstants.checkout_card_text.sub_total}</div>
            <div>${price}</div>
          </div>

          <div className='flex justify-between'>
            <div className='text-gray-500'>{TextConstants.checkout_card_text.vat}</div>
            <div>${vat}</div>
          </div>
        </div>

        <div className='flex justify-between py-2'>
          <div className='text-gray-500'>{TextConstants.checkout_card_text.total}</div>
          <div className='h3 bg-clip-text text-transparent bg-gradient-to-r from-primary-300 to-primary-500'>${total}</div>
        </div>
      </div>
    </section>
  )
}

function ConfirmPayment({ isLoading, callBack, cardState }: {
  isLoading: boolean;
  callBack: () => void;
  cardState: cardStateType;
}) {
  const isDisabled = cardState.cardNumber.length < 16 || cardState.cvv.length < 3 || cardState.expiryDate.length < 5 || cardState.name.length === 0
  return (
    <Button
      isLoading={isLoading}
      disabled={isDisabled}
      onClick={callBack}
      className='justify-center py-4 -mt-6'>
      {TextConstants.checkout_card_text.confirm_payment}
    </Button>
  )
}

export default CheckoutCard