import { useReducer } from "react";
import DigitBtn from './DigitBtn'
import OperationBtn from './OperationBtn'

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  CHOOSE_OPERATION: 'choose-operation',
  EVALUATE: 'evaluate'
}

function reducer(state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOperand === "0") { return state }
      if (payload.digit === "." && state.currentOperand.includes(".")) { return state }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`
      }

    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.previousOperand == null ){
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }

      return {
        ...state,
        previousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      }

    case ACTIONS.CLEAR:
      return {}

    case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: null,
          overwrite: false
        }
      }

      if (state.currentOperand == null) {
        return state
      }

      if (state.currentOperand.length === 1) {
        return {
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
 
    case ACTIONS.EVALUATE:
      if (
        state.operation == null || 
        state.currentOperand == null || 
        state.previousOperand == null
        ) {
          return state
        }
      
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null
      }
  }
}

function evaluate ({currentOperand, previousOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const current = parseFloat(currentOperand)
  if (isNaN(prev) || isNaN(current)) return ""
  let computation = ""
  switch(operation) {
    case "+":
      computation = prev + current
      break
    case "-":
      computation = prev - current
      break
    case "*":
      computation = prev * current
      break
    case "÷":
      computation = prev / current
      break
  }

  return computation.toString()

}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  const btn = 'cursor-pointer text-[2rem] border-solid border-[1px] border-white border-opacity-100 outline-none bg-white bg-opacity-75 hover:bg-opacity-90 focus:bg-opacity-90'
  const twoSpanbBtn = 'flex justify-center items-center col-span-2 cursor-pointer text-[2rem] border-solid border-[1px] border-white border-opacity-100 outline-none bg-white bg-opacity-75 hover:bg-opacity-90 focus:bg-opacity-90'
  
  return (
    <div className="grid mt-8 grid-cols-[repeat(4,_6rem)] grid-rows-[minmax(7rem,_auto)_repeat(5,_6rem)] justify-center text-right">
      <div className="col-span-full bg-black bg-opacity-75 flex-col items-end justify-around p-3 break-all ">
        <div className="text-white text-opacity-75 text-[1.5rem]">
          {formatOperand(previousOperand)} {operation}
        </div>
        <div className="text-white text-[2.5rem]">
          {formatOperand(currentOperand)}
        </div>
      </div>
      <button className={twoSpanbBtn} onClick={() => dispatch({type: ACTIONS.CLEAR })}>AC</button>
      <button className={btn} onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT })}>DEL</button>
      <OperationBtn operation="÷" dispatch={dispatch} className={btn} />
      <DigitBtn digit="1" dispatch={dispatch} className={btn} />
      <DigitBtn digit="2" dispatch={dispatch} className={btn} />
      <DigitBtn digit="3" dispatch={dispatch} className={btn} />
      <OperationBtn operation="*" dispatch={dispatch} className={btn} />
      <DigitBtn digit="4" dispatch={dispatch} className={btn} />
      <DigitBtn digit="5" dispatch={dispatch} className={btn} />
      <DigitBtn digit="6" dispatch={dispatch} className={btn} />
      <OperationBtn operation="+" dispatch={dispatch} className={btn} />
      <DigitBtn digit="7" dispatch={dispatch} className={btn} />
      <DigitBtn digit="8" dispatch={dispatch} className={btn} />
      <DigitBtn digit="9" dispatch={dispatch} className={btn} />
      <OperationBtn operation="-" dispatch={dispatch} className={btn} />
      <DigitBtn digit="." dispatch={dispatch} className={btn} />
      <DigitBtn digit="0" dispatch={dispatch} className={btn} />
      <button className={twoSpanbBtn} onClick={() => dispatch({type: ACTIONS.EVALUATE })}>=</button>
    </div>
  );
}

export default App;
