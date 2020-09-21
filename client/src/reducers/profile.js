import { GET_PROFILE, PROFILE_ERROR, CLEAR_PROFILE } from '../action/types';

const initialState = {
  profile: null,
  profiles: [],
  repos: [],
  loading: true,
  error: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_PROFILE:
      return {
        ...state,
        profile: payload,
        loading: false,
      };
    case PROFILE_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
      };
    case CLEAR_PROFILE:
        return {
            ...state,
            profile: null,
            repos: [],
            loading: false
        } // Khi da dang nhap user a, sau do logout user a, dang nhap user b, luc nay user b chua co profile nhung van render profile cua user a, them action de clear profile khi logout
    default:
      return state;
  }
}
