import * as type from "../actions/action_types";
import { toast } from "react-toastify";

const initialState = {
    texts: [],
    isLoading: false,
    isCreating: false,
    isDeleting: false,
  };

export default function textReducer(state = initialState, action) {
    switch (action.type) {
        case type.CREATING_TEXT:
          return {
            ...state,
            isLoading: true,
          };
        case type.CREATE_TEXT_SUCCESS:
            toast.success("😎 Your text has been created!");
          return {
            ...state,
            texts: [action.text, ...state.texts],
            isCreating: false,
          };
        case type.CREATE_TEXT_FAILURE:
            toast.error("Fail to create text.");
            return {
                ...state,
                isCreating: false,
            };
        case type.LOADING_TEXTS:
            return {
                ...state,
                isLoading: true,
            };
        case type.LOAD_TEXTS_SUCCESS:
            toast.success("😎 Your texts has been loaded!");
            return {
                ...state,
                texts: action.texts,
                isLoading: false,
            };
        case type.LOAD_TEXTS_FAILURE:
            toast.error("Fail to load text.");
            return {
              ...state,
              isLoading: false,
            };
        case type.UPDATE_TEXT_SUCCESS:
            toast.success("😎 Your texts has been updated!");
            return {
              ...state,
              texts: [...state.texts].map((text) =>
                text.id === action.text.id ? action.text : text
              ),
              isCreating: false,
            };
        case type.UPDATE_TEXT_FAILURE:
            toast.error("Fail to update text.");
            return {
              ...state,
              isCreating: false,
            };
        case type.RESET_TEXT_QUIZ_SUCCESS:
          toast.success("😎 Your PopQuiz has been reset!");
          console.log(action.textId);
          return {
            ...state,
            texts: [...state.texts].filter((text) =>
              text.id === action.textId
                ? {
                    ...text,
                    quiz: null,
                    
                  }
                : text
            ),
          };
        case type.RESET_TEXT_QUIZ_FAILURE:
          toast.error("Fail to reset pop quiz.");
          return state;
        default:
            return state;
    }
}
    