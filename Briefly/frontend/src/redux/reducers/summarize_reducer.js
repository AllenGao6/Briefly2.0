import * as type from "../actions/action_types";
import { toast } from "react-toastify";

const initialState = {};

export default function summarizeReducer(state = initialState, action) {
  switch (action.type) {
    case type.TRANSCRIBE_SUCCESS:
      toast.success("😎 Your document has been speech transcribed!");
      return state;
    case type.TRANSCRIBE_FAILURE:
      toast.error("Fail to transcribe your document.");
      return state;
    case type.SUMMARIZE_SUCCESS:
      toast.success("😎 Your document has been summarized!");
      return state;
    case type.SUMMARIZE_FAILURE:
      toast.error("Fail to summarize your document.");
      return state;
    case type.QuizGen_SUCCESS:
      toast.success("😎 Your pop quiz has been generated!");
      return state;
    case type.QuizGen_FAILURE:
      toast.error("Fail to generate pop quiz, please try again later..");
      console.log("this should be printed");
      return state;
    default:
      return state;
  }
}
