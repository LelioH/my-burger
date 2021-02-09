import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://react-complete-guide-lelio-default-rtdb.firebaseio.com/',
});

export default instance;
