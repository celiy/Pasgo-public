import axios from 'axios';
import { useState } from 'react';

const baseUrl = import.meta.env.VITE_BACKEND_BASE_URL ?? "http://localhost:8000"

export const fetchRequest = (pathUrl) => {
    const url = `${baseUrl}${pathUrl}`
    const [fetchedData, setData] = useState(null);
    const [fetchLoading, setLoading] = useState(false);
    const [fetchError, setError] = useState(null);

    const getData = async (params) => {
        window.showLoader();
        setLoading(true);
        setError(null);

        try {
            let response;
            if (typeof (params) === "string") {
                response = await axios.get(url + params, {
                    withCredentials: true,
                });
            } else {
                response = await axios.get(url, {
                    withCredentials: true,
                });
            }

            setData(response.data);
            return response.data;
        } catch (err) {
            console.log(err);
            setError(err.response.data);
            throw err.response.data;
        } finally {
            setLoading(false);
            window.hideLoader();
        }
    };

    return { getData, fetchedData, fetchLoading, fetchError };
};

export const postRequest = (pathUrl) => {
    const url = `${baseUrl}${pathUrl}`
    const [postedData, setData] = useState(null);
    const [postLoading, setLoading] = useState(false);
    const [postError, setError] = useState(null);

    const postData = async (requestData, params) => {
        window.showLoader();
        setLoading(true);
        setError(null);

        try {
            let response;
            if (params && typeof params === 'string') {
                response = await axios.post(url + params, requestData, {
                    withCredentials: true,
                });
            } else {
                response = await axios.post(url, requestData, {
                    withCredentials: true,
                });
            }

            setData(response.data);
            return response.data;
        } catch (err) {
            if (err.response) {
                setError(err.response);
                throw err.response;
            } else {
                console.log(err);
                setError("Algo de errado aconteceu");
                throw "Algo de errado aconteceu";
            }

        } finally {
            setLoading(false);
            window.hideLoader();
        }
    };

    return { postData, postedData, postLoading, postError };
};

export const patchRequest = (pathUrl) => {
    const url = `${baseUrl}${pathUrl}`
    const [patchedData, setData] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [patchError, setError] = useState(null);

    const patchData = async (requestData, params) => {
        window.showLoader();
        setUpdating(true);
        setError(null);

        try {
            let response;
            if (typeof (params) === "string") {
                response = await axios.patch(url + params, requestData, {
                    withCredentials: true,
                });
            } else {
                response = await axios.patch(url, requestData, {
                    withCredentials: true,
                });
            }

            setData(response.data);
            return response.data;
        } catch (err) {
            console.log(err);
            setError(err.response.data);
            throw err.response.data;
        } finally {
            setUpdating(false);
            window.hideLoader();
        }
    };

    return { patchData, updating, patchedData, patchError };
};

export const deleteRequest = (pathUrl) => {
    const url = `${baseUrl}${pathUrl}`
    const [deleted, setData] = useState(null);
    const [deleting, setLoading] = useState(false);
    const [deletionError, setError] = useState(null);

    const deleteData = async () => {
        window.showLoader();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.delete(url, {
                withCredentials: true,
            });

            setData(response.data);
            return response.data;
        } catch (err) {
            console.log(err);
            setError(err.response.data);
            throw err.response.data;
        } finally {
            setLoading(false);
            window.hideLoader();
        }
    };

    return { deleteData, deleted, deleting, deletionError };
};