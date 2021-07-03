import * as type from "../actions/action_types";
import { toast } from "react-toastify";

const initialState = {
  collections: [],
  selectedCollection: null,
  isLoading: false,
  isCreating: false,
  isDeleting: false,
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
        isCreating: true,
      };
    case type.CREATE_COLLECTION_SUCCESS:
      toast.success("😎 Your collection has been created!");
      const newCollections = [...state.collections, action.collection];
      return {
        ...state,
        collections: newCollections,
        isCreating: false,
      };
    case type.UPDATE_COLLECTION_SUCCESS:
      toast.success("😎 Your collection has been updated!");
      const updatedCollections = [...state.collections].map((collection) =>
        collection.id === action.collection.id ? action.collection : collection
      );
      return {
        ...state,
        collections: updatedCollections,
        isCreating: false,
      };
    case type.CREATE_COLLECTION_FAILURE:
      toast.error("Fail to create collection.");
      return {
        ...state,
        isCreating: false,
      };
    case type.LOAD_COLLECTIONS_FAILURE:
      toast.error("Fail to load collections.");
      return {
        ...state,
        isLoading: false,
      };
    case type.UPDATE_COLLECTION_FAILURE:
      toast.error("Fail to update collection.");
      return {
        ...state,
        isCreating: false,
      };
    case type.DELETING_COLLECTION:
      return {
        ...state,
        isDeleting: true,
      };
    case type.DELETE_COLLECTION_SUCCESS:
      toast.success("😎 Your collection has been deleted!");
      const deletedCollections = [...state.collections].filter(
        (collection) => collection.id !== action.collection.collection_id
      );
      return {
        ...state,
        collections: deletedCollections,
        isDeleting: false,
      };
    case type.DELETE_COLLECTION_FAILURE:
      toast.error("Fail to delete collection.");
      return {
        ...state,
        isDeleting: false,
      };
    case type.SELECT_COLLECTION:
      toast.success(`Select collection ${action.collection.name} success!`);
      return {
        ...state,
        collection: action.collection,
      };
    default:
      return state;
  }
}
