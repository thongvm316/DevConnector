import axios from 'axios'

const setAuthToken = token => {
    if(token) {
        axios.defaults.headers.common['x-auth-token'] = token; // set token for headers request 
    } else {
        delete axios.defaults.headers.common['x-auth-token'] // del old header if have
    }
} 

export default setAuthToken