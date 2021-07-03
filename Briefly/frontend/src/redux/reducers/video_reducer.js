import * as type from "../actions/action_types";
import { toast } from "react-toastify";

const initialState = {
  videos: [],
  isLoading: false,
  isCreating: false,
  isDeleting: false,
};

export default function videoReducer(state = initialState, action) {
  switch (action.type) {
    case type.LOADING_VIDEOS:
      return {
        ...state,
        isLoading: true,
      };
    case type.CREATING_VIDEO:
      return {
        ...state,
        isCreating: true,
      };
    case type.LOAD_VIDEOS_SUCCESS:
      return {
        ...state,
        videos: action.videos,
        isLoading: false,
      };
    case type.LOAD_VIDEOS_FAILURE:
      return {
        ...state,
        isLoading: false,
      };
    case type.CREATE_VIDEO_SUCCESS:
      return {
        ...state,
        videos: [action.video, ...state.videos],
        isCreating: false,
      };
    case type.CREATE_VIDEO_FAILURE:
      return {
        ...state,
        isCreating: false,
      };
    case type.UPDATE_VIDEO_SUCCESS:
      return {
        ...state,
        videos: [...state.videos].map((video) =>
          video.id === action.video.id ? action.video : video
        ),
        isCreating: false,
      };
    case type.UPDATE_VIDEO_FAILURE:
      return {
        ...state,
        isCreating: false,
      };
    case type.DELETING_VIDEOS:
      return {
        ...state,
        isDeleting: true,
      };
    case type.DELETE_VIDEO_SUCCESS:
      const { list_id, total_size, remaining_size } = action.data;
      console.log(list_id);
      return {
        ...state,
        videos: [...state.videos].filter(
          (video) => list_id.filter((id) => id === video.id).length === 0
        ),
        isDeleting: false,
      };
    case type.DELETE_VIDEO_FAILURE:
      return {
        ...state,
        isDeleting: false,
      };
    default:
      return state;
  }
}
