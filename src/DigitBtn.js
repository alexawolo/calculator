import React from 'react'
import { ACTIONS } from './App'

function DigitBtn({ dispatch, digit }) {
    const btn = 'cursor-pointer text-[2rem] border-solid border-[1px] border-white border-opacity-100 outline-none bg-white bg-opacity-75 hover:bg-opacity-90 focus:bg-opacity-90'

  return (
    <button 
    onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}
    className={btn}
    >
        {digit}
    </button>
  )
}

export default DigitBtn