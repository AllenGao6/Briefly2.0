import * as type from "../actions/action_types";
import { toast } from "react-toastify";

const initialState = {
  collections: [],
  isLoading: false,
};

export default function collectionReducer(state = initialState, action) {
  switch (action.type) {
    case type.LOADING_COLLECTIONS:
      return {
        ...state,
        isLoading: true,
      };
    case type.LOAD_COLLECTIONS_SUCCESS:
      toast.success("😎 Your collections has been loaded!");
      return {
        ...state,
        collections: action.collections,
        isLoading: false,
      };
    case type.CREATING_COLLECTION:
      return {
        ...state,
        isLoading: true,
      };
    case type.CREATE_COLLECTION_SUCCESS:
      toast.success("😎 Your collection has been created!");
      const newCollections = [...state.collections, action.collection];
      return {
        ...state,
        collections: newCollections,
        isLoading: false,
      };
    case type.CREATE_COLLECTION_FAILURE:
      toast.failure("Fail to create collection.");
      return {
        ...state,
        isLoading: false,
      };
    case type.LOAD_COLLECTIONS_FAILURE:
      toast.failure("Fail to load collections.");
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
}
