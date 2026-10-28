import axios from 'axios';

const loginApi = axios.create({
  baseURL: 'http://192.168.130.5/api/login/v1',
  timeout: 5000,
  headers: {'Content-Type': 'application/json'}
});

const articleApi = axios.create({
  baseURL: 'http://192.168.130.5/api/article_api/v1',
  timeout: 5000,
  headers: {'Content-Type': 'application/json'}
});

const rotationApi = axios.create({
  baseURL: 'http://192.168.130.5/api/rotation_api/v1',
  timeout: 5000,
  headers: {'Content-Type': 'application/json'}
});

export default loginApi;



