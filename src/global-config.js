import { paths } from "src/routes/paths";

import packageJson from "../package.json";

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: "EB3 Visa",
  appVersion: packageJson.version,
  serverUrl: import.meta.env.VITE_SERVER_URL ?? "",
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? "",

  serverUrlHR: import.meta.env.VITE_HR_SERVER_URL  ?? "",
  assetsDirHR: import.meta.env.VITE_HR_ASSETS_DIR ?? "",
  adminRole: "org_admin",
  /**
   * Auth
   * @method jwt | amplify | supabase | auth0
   */
  auth: {
    method: "jwt",
    skip: false,
    redirectPath: paths.dashboard.root,

    assetsDir: "https://api.abroadworld.com/",
    assetsDirHR: "https://app.sajilohr.com/",
  },
  /**
   * Mapbox
   */
  mapboxApiKey: import.meta.env.VITE_MAPBOX_API_KEY ?? "",

  pusher: {
    key: "95c1d3ac06b279e7d247",
    cluster: "ap1",
  },
};
