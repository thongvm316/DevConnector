import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType, timeout = 7000) => dispatch => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: { msg, alertType, id }
  });

  setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout); // Even loop se giai thich duoc nguyen ly hoat dong
};

// import { SET_ALERT, REMOVE_ALERT } from './types';
// import { v4 as uuidv4 } from 'uuid';

// // export const setAlert = (msg, alertType) => (dispatch) => {
// //   const id = uuidv4();
// //   dispatch({
// //     type: SET_ALERT,
// //     payload: { msg, alertType, id },
// //   });
// // };

// // export const setAlert = (msg, alertType, timeout = 5000) => {
// //   return (dispatch) => {
// //     const id = uuidv4()
// //     dispatch({
// //       type: SET_ALERT,
// //       payload: { msg, alertType, id },
// //     });

// //     setTimeout(() => {
// //       dispatch({ type: REMOVE_ALERT, payload: id })
// //     }, timeout);
// //   };
// // };

// export const setAlert = (msg, alertType) => {
//   const id = uuidv4()
//     return  {
//       type: SET_ALERT,
//       payload: { msg, alertType, id },
//   }
// };
