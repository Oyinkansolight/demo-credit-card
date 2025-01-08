import React from 'react'

import Success from "~/svg/success.svg";

const SuccessPage = () => {
  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <h1 className='h0 animate-flicker text-white'>Payment Successful</h1>
      <Success className="w-1/2 h-1/2" />
    </div>
  )
}

export default SuccessPage