// @refresh reload
import { Suspense } from "solid-js";

import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";

import RootLayout from "./components/root-layout";

import { MetaProvider } from "@solidjs/meta";
import "./app.css";

export default function App() {
  return (
    <Router
      base={import.meta.env.SERVER_BASE_URL}
      root={(props) => (
        <>
          <MetaProvider>
            <RootLayout>
              <Suspense>{props.children}</Suspense>
            </RootLayout>
          </MetaProvider>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
