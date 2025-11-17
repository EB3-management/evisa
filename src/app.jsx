import "src/global.css";

import { useEffect } from "react";

import { usePathname } from "src/routes/hooks";

import { LocalizationProvider } from "src/locales";
import { themeConfig, ThemeProvider } from "src/theme";
import { I18nProvider } from "src/locales/i18n-provider";

import { Snackbar } from "src/components/snackbar";
import { ProgressBar } from "src/components/progress-bar";
import { MotionLazy } from "src/components/animate/motion-lazy";
import {
  SettingsDrawer,
  defaultSettings,
  SettingsProvider,
} from "src/components/settings";

import { StoreProvider } from "./redux";
import { ApolloProvider } from "./lib";
import { injectStore } from "./lib/axios/axios";
import store from "./redux/store";

injectStore(store)

// ----------------------------------------------------------------------

export default function App({ children }) {
  useScrollToTop();

  return (
    <I18nProvider>
      <SettingsProvider defaultSettings={defaultSettings}>
        <LocalizationProvider>
          <ThemeProvider
            noSsr
            defaultMode={themeConfig.defaultMode}
            modeStorageKey={themeConfig.modeStorageKey}
          >
            <MotionLazy>
              <Snackbar />
              <ProgressBar />
              <StoreProvider>
                <ApolloProvider>
                  {/* <SettingsDrawer defaultSettings={defaultSettings} /> */}
                  {children}
                </ApolloProvider>
              </StoreProvider>
            </MotionLazy>
          </ThemeProvider>
        </LocalizationProvider>
      </SettingsProvider>
    </I18nProvider>
  );
}

// ----------------------------------------------------------------------

function useScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
