import axios from "axios";

import { CONFIG } from "src/global-config";
import { clearOrganization } from "src/redux/actions/auth-actions";

// Import store to access Redux state directly
let store;

export const injectStore = (_store) => {
  store = _store;
  console.log("🏪 Store injected into axios");
};

// ----------------------------------------------------------------------

// const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

// // ✅ Request interceptor - Get token from Redux store
// axiosInstance.interceptors.request.use(
//   (config) => {
//     if (store) {
//       const state = store.getState();

//       const isPersistRehydrated = state._persist?.rehydrated;
//       const token = state.auth?.token;

//       console.log("📦 Redux persist rehydrated:", isPersistRehydrated);
//       console.log("🔐 Auth state:", state.auth);
//       console.log(
//         "🔑 Token:",
//         token ? `${token.substring(0, 30)}...` : "NO TOKEN"
//       );

//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//         console.log("✅ Token attached to request:", config.url);
//         console.log("🔑 Token:", token.substring(0, 30) + "...");
//       } else {
//         console.warn("⚠️ No token found in Redux store for:", config.url);
//         console.warn("⚠️ Full auth state:", state.auth);
//       }
//     } else {
//       console.warn("⚠️ Store not injected yet");
//     }

//     return config;
//   },
//   (error) => {
//     console.error("❌ Request interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// // ✅ Response interceptor - Handle errors
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       console.error("❌ 401 Unauthorized - Redirecting to sign-in");
//       console.error("❌ URL:", error.config?.url);
//       console.error("❌ Backend Response:", error.response?.data);

//       if (store) {
//         store.dispatch(clearOrganization());
//       }

//       // ✅ Redirect to sign-in page
//       window.location.href = "/auth/sign-in";
//     }

//     return Promise.reject(
//       (error.response && error.response.data) || "Something went wrong!"
//     );
//   }
// );

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    console.log("this is status code", status);
    
    // Check for 401 Unauthenticated error
    if (status === 401 && message === "Unauthenticated.") {
      console.error("❌ 401 Unauthenticated - Logging out user");
      console.error("❌ URL:", error.config?.url);
      console.error("❌ Backend Response:", error.response?.data);

      if (store) {
        store.dispatch(clearOrganization());
      }

      // Redirect to sign-in page
      window.location.href = "/auth/sign-in";
    }
    
    return Promise.reject(
      (error.response && error.response.data) || "Something went wrong!" 
    );
  }
);

// ----------------------------------------------------------------------

// export default axiosInstance;

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) =>
//     Promise.reject(
//       (error.response && error.response.data) || "Something went wrong!"
//     )
// );

// ----------------------------------------------------------------------

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error("Failed to fetch:", error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const poster = async (args, data) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  try {
    const response = data
      ? await axiosInstance.post(url, data, { ...config })
      : await axiosInstance.post(url, { ...config });

    return response.data;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

// ----------------------------------------------------------------------

export const deleter = async (args) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  try {
    const response = await axiosInstance.delete(url, { ...config });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const downloader = async (url, fallbackFilename = "download.xlsx") => {
  try {
    const response = await axiosInstance.get(url, {
      responseType: "blob",
    });

    const blob = new Blob([response.data]);
    const blobUrl = window.URL.createObjectURL(blob);

    const disposition = response.headers["content-disposition"];

    const extractedFilename = disposition
      ?.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)?.[1]
      ?.replace(/['"]/g, "");

    const filename = extractedFilename || fallbackFilename;

    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error(error);

    throw error;
  }
};
