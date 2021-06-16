import * as type from "../actions/action_types";

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
      return {
        ...state,
        collections: action.collections,
        isLoading: false,
      };
    case type.LOAD_COLLECTIONS_FAILURE:
    default:
      return state;
  }
}
