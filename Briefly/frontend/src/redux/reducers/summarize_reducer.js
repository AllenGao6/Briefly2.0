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
    default:
      return state;
  }
}
