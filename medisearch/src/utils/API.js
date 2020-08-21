import axios from 'axios';
axios.defaults.withCredentials = true;

const APIKey = process.env.REACT_APP_API;
const URL = 'http://localhost:8000';

const API = {
    login: (data, callback) => {
        axios.post(`${URL}/api/auth/login`, data, {
            header: { 'Content-Type': 'application/json' }
        }).then(res => {
            callback(res.data);
        })
    },
    register: (data, callback) => {
        axios.post(`${URL}/api/store/create`, data, {
            header: { 'Content-Type': 'application/json' }
        }).then(res => {
            callback(res.data);
        })
    },
    logout: (callback) => {
        axios.post(`${URL}/api/auth/logout`, {}, {
            header: { 'Content-Type': 'application/json' }
        }).then(res => {
            callback();
        })
    },
    getUser: (callback) => {
        axios.get(`${URL}/api`).then(res => {
            callback(res.data);
        })
    },
    store: {
        get: (callback) => {
            axios.get(`${URL}/api/store/get-all`).then(res => {
                callback(res.data);
            })
        },
        update: (data, callback) => {
            axios.post(`${URL}/api/store/update`, data, {
                header: { 'Content-Type': 'application/json', }
            }).then(res => {
                callback(res.data);
            })
        },
        updatePassword: (data, callback) => {
            axios.post(`${URL}/api/store/update-password`, data, {
                header: { 'Content-Type': 'application/json' }
            }).then(res => {
                callback(res.data);
            })
        },
        delete: (data, callback) => {
            axios.post(`${URL}/api/store/delete`, data, {
                header: { 'Content-Type': 'application/json' }
            }).then(res => {
                callback(res.data);
            })
        }
    }
}


export { API, APIKey };