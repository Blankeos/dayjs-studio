// @refresh reload
import { Suspense } from "solid-js";

import Nav from "@/components/Nav";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start";

import RootLayout from "./components/RootLayout";

import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <>
          <RootLayout>
            <Suspense>{props.children}</Suspense>
          </RootLayout>
        </>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
