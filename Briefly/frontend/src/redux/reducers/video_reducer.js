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
      toast.success("😎 Your videos has been loaded!");
      return {
        ...state,
        videos: action.videos,
        isLoading: false,
      };
    case type.LOAD_VIDEOS_FAILURE:
      toast.error("Fail to load videos.");
      return {
        ...state,
        isLoading: false,
      };
    case type.CREATE_VIDEO_SUCCESS:
      toast.success("😎 Your video has been created!");
      return {
        ...state,
        videos: [action.video, ...state.videos],
        isCreating: false,
      };
    case type.CREATE_VIDEO_FAILURE:
      toast.error("Fail to create video.");
      return {
        ...state,
        isCreating: false,
      };
    case type.UPDATE_VIDEO_SUCCESS:
      toast.success("😎 Your video has been updated!");
      return {
        ...state,
        videos: [...state.videos].map((video) =>
          video.id === action.video.id ? action.video : video
        ),
        isCreating: false,
      };
    case type.UPDATE_VIDEO_FAILURE:
      toast.error("Fail to update video.");
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
      toast.success("😎 Your video has been deleted!");
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
      toast.error("Fail to delete video.");
      return {
        ...state,
        isDeleting: false,
      };
    case type.RESET_VIDEO_SUMMARY_SUCCESS:
      toast.success("😎 Your video summary has been reset!");

      return {
        ...state,
        videos: [...state.videos].map((video) =>
          video.id === action.videoId
            ? {
                ...video,
                is_summarized: false,
                num_sentences: 0,
                summarization: null,
                model_type: null,
              }
            : video
        ),
      };
    case type.RESET_VIDEO_SUMMARY_FAILURE:
      toast.error("Fail to reset video summary.");
      return state;
    case type.RESET_VIDEO_QUIZ_SUCCESS:
      toast.success("😎 Your Quiz has been reset!");

      return {
        ...state,
        videos: [...state.videos].map((video) =>
          video.id === action.videoId
            ? {
                ...video,
                quiz: null,
              }
            : video
        ),
      };
    case type.RESET_VIDEO_QUIZ_FAILURE:
      toast.error("Fail to reset pop quiz.");
      return state;
    default:
      return state;
  }
}
