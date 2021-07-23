import * as type from "../actions/action_types";
import { toast } from "react-toastify";

const initialState = {
  audios: [],
  isLoading: false,
  isCreating: false,
  isDeleting: false,
};

export default function audioReducer(state = initialState, action) {
  switch (action.type) {
    case type.LOADING_AUDIOS:
      return {
        ...state,
        isLoading: true,
      };
    case type.CREATING_AUDIO:
      return {
        ...state,
        isCreating: true,
      };
    case type.LOAD_AUDIOS_SUCCESS:
      toast.success("😎 Your audios has been loaded!");
      return {
        ...state,
        audios: action.audios,
        isLoading: false,
      };
    case type.LOAD_AUDIOS_FAILURE:
      toast.error("Fail to load audios.");
      return {
        ...state,
        isLoading: false,
      };
    case type.CREATE_AUDIO_SUCCESS:
      toast.success("😎 Your audio has been created!");
      return {
        ...state,
        audios: [action.audio, ...state.audios],
        isCreating: false,
      };
    case type.CREATE_AUDIO_FAILURE:
      toast.error("Fail to create audio.");
      return {
        ...state,
        isCreating: false,
      };
    case type.UPDATE_AUDIO_SUCCESS:
      toast.success("😎 Your audio has been updated!");
      return {
        ...state,
        audios: [...state.audios].map((audio) =>
          audio.id === action.audio.id ? action.audio : audio
        ),
        isCreating: false,
      };
    case type.UPDATE_AUDIO_FAILURE:
      toast.error("Fail to update audio.");
      return {
        ...state,
        isCreating: false,
      };
    case type.DELETING_AUDIOS:
      return {
        ...state,
        isDeleting: true,
      };
    case type.DELETE_AUDIO_SUCCESS:
      toast.success("😎 Your audio has been deleted!");
      const { list_id, total_size, remaining_size } = action.data;
      console.log(list_id);
      return {
        ...state,
        audios: [...state.audios].filter(
          (audio) => list_id.filter((id) => id === audio.id).length === 0
        ),
        isDeleting: false,
      };
    case type.DELETE_AUDIO_FAILURE:
      toast.error("Fail to delete audio.");
      return {
        ...state,
        isDeleting: false,
      };
    case type.RESET_AUDIO_SUMMARY_SUCCESS:
      toast.success("😎 Your audio summary has been reset!");
      return {
        ...state,
        audios: [...state.audios].filter(
          (audio) => audio.id !== action.audioId
        ),
      };
    case type.RESET_AUDIO_SUMMARY_FAILURE:
      toast.error("Fail to reset audio summary.");
      return state;
    default:
      return state;
  }
}
