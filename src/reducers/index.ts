import { card_actions } from "actions";
import { actionType, cardStateType } from "types";

export const cardReducer = (state: cardStateType, action: actionType) => {
  switch (action.type) {
    case card_actions.update_name:
      state = {
        ...state,
        name: action.value
      }

      return state
    case card_actions.update_card_number:
      state = {
        ...state,
        cardNumber: action.value
      }

      return state
    case card_actions.update_expiry:
      state = {
        ...state,
        expiryDate: action.value
      }

      return state
    case card_actions.update_cvv:
      state = {
        ...state,
        cvv: action.value
      }

      return state

      case card_actions.reset:
      state = {
        cvv: "",
        name: "",
        cardNumber: "",
        expiryDate: "",
      }

      return state

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}