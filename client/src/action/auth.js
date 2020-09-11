import axios from 'axios';
import { setAlert } from '../action/alert';
import { REGISTER_SUCCESS, REGISTER_FAIL } from '../action/types';

// Register user
export const register = ({ name, email, password }) => 
  async dispatch => {
    const config = {
      headers: {
        'Content-type': 'application/json',
      },
    };

    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post('api/users', body, config);
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      const errors = error.response.data.errors;
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, 'danger'))); // Understood
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };
