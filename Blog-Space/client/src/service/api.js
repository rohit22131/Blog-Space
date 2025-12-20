import axios from 'axios';

import { API_NOTIFICATION_MESSAGES, SERVICE_URLS } from '../constants/config';
import { getType } from '../utils/common-utils';

const API_URL = 'http://localhost:8000';

const axiosInstance = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        "content-type": "application/json"
    },
    withCredentials: true
});

// ----------------------- REQUEST INTERCEPTOR ------------------------
axiosInstance.interceptors.request.use(
    function (config) {

        if (config.TYPE?.params) {
            config.params = config.TYPE.params;
        }

        else if (config.TYPE?.query) {
            config.url = `${config.url}?${config.TYPE.query}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// ----------------------- RESPONSE INTERCEPTOR ------------------------
axiosInstance.interceptors.response.use(
    response => processResponse(response),
    async error => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.get(
                    "http://localhost:8000/token",
                    { withCredentials: true }
                );

                if (refreshResponse.status === 200) {
                    return axiosInstance(originalRequest);
                }
            } catch (err) {
                window.location.href = "/account";
                return Promise.reject(err);
            }
        }

        return Promise.reject(ProcessError(error));
    }
);


// ----------------------- SUCCESS HANDLER ------------------------
const processResponse = (response) => {
    if (response?.status === 200) {
        return { isSuccess: true, data: response.data };
    } else {
        return {
            isFailure: true,
            status: response?.status,
            msg: response?.msg,
            code: response?.code
        };
    }
};

// ----------------------- ERROR HANDLER ------------------------
const ProcessError = (error) => {
    if (error.response) {

        if (error.response.status === 403) {
            return { isError: true, code: 403 };
        }

        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.responseFailure,
            code: error.response.status
        };
    }
    else if (error.request) {
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.requestFailure,
            code: ""
        };
    }
    else {
        return {
            isError: true,
            msg: API_NOTIFICATION_MESSAGES.networkError,
            code: ""
        };
    }
};

// ----------------------- API EXPORTER ------------------------
const API = {};

for (const [key, value] of Object.entries(SERVICE_URLS)) {

    API[key] = (body, showUploadProgress, showDownloadProgress) => {

        // Detect if body is FormData → then use multipart/form-data
        const isFormData = body instanceof FormData;

        const config = {
            method: value.method,
            url: value.url,
            data: value.method === 'DELETE' ? '' : body,
            responseType: value.responseType,
            withCredentials: true,
            TYPE: getType(value, body),
            onUploadProgress: showUploadProgress,
            onDownloadProgress: showDownloadProgress,
            headers: {
                ...(isFormData ? {} : { "Content-Type": "application/json" })
            }

        };

        // Handling dynamic URLs
        if (value.path) {
            if (typeof body === "object" && body.id) {
                config.url = value.url + body.id;
                config.data = body.data;
            } else {
                config.url = value.url + body;
            }
        }

        return axiosInstance(config);
    };
}

export { API };
