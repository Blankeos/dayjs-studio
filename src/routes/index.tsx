import {
  createEffect,
  createRenderEffect,
  createSignal,
  For,
  onMount,
  Show,
} from "solid-js";
import DAYJS_typedefs from "dayjs/index.d.ts?raw";
import { MonacoEditor } from "solid-monaco";
import { Panel, PanelGroup, ResizeHandle } from "solid-resizable-panels";

import DAYJS_SCRIPT_URL from "@/constants/dayjs.min.js?url";
import { createScriptLoader } from "@solid-primitives/script-loader";
import { A } from "@solidjs/router";

import IconVisible from "~icons/fluent/eye-48-regular";
import IconHidden from "~icons/fluent/eye-hide-20-regular";
import IconExecute from "~icons/material-symbols-light/play-arrow-outline";

import "solid-resizable-panels/styles.css";

const DAYJS_index_replaced = DAYJS_typedefs.replace(
  "export = dayjs;",
  "declare global dayjs",
);

export default function Home() {
  const [showAdvanced, setShowAdvanced] = createSignal(false);
  const [tsCodeState, setTSCodeState] = createSignal("");
  const [jsCodeState, setJSCodeState] = createSignal("");
  const [codeLogs, setCodeLogs] = createSignal<string[]>();

  const [dayjsIsReady, setDayJsIsReady] = createSignal(false);
  const [tsIsReady, setTsIsReady] = createSignal(false);
  const [hasExecutedOnce, setHasExecutedOnce] = createSignal(false);

  createScriptLoader({
    src: DAYJS_SCRIPT_URL,
    onLoad() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(!!(window as any).dayjs, "dayjs loaded.");
      setDayJsIsReady(true);
    },
    async: true,
    defer: true,
  });

  createScriptLoader({
    src: "https://unpkg.com/typescript@5.3.3/lib/typescript.js",
    onLoad() {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      console.log(!!(window as any).ts, "typescript loaded.");
      setTsIsReady(true);
    },
    async: true,
    defer: true,
  });

  createEffect(() => {
    if (dayjsIsReady() && tsIsReady() && !hasExecutedOnce()) {
      setTimeout(() => {
        executeCode();
      }, 500);

      setHasExecutedOnce(true);
    }
  });

  function executeCode() {
    if (!window?.ts || !window?.dayjs) return;

    const logs: string[] = [];

    // Override console logs.
    const originalLog = console.log;

    console.log = function (...args) {
      logs.push(args.map((arg) => JSON.stringify(arg, null, 2)).join(" "));
      originalLog.apply(console, args);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsCode = window.ts.transpile(tsCodeState(), {
      target: "esnext",
    });

    setJSCodeState(jsCode);

    eval(jsCode);

    setCodeLogs(logs);

    // Reset back the console log function.
    console.log = originalLog;
  }

  return (
    <PanelGroup class="flex h-screen bg-gray-50 text-gray-700">
      <Panel id="1" class="w-1/2 bg-gray-50">
        <MonacoEditor
          path="awesome"
          onChange={(value) => setTSCodeState(value)}
          value={tsCodeState()}
          language="typescript"
          onMount={(monaco, editor) => {
            monaco.editor.defineTheme("poimandres", {
              base: "vs-dark", // Base theme can be 'vs-dark', 'vs', or 'hc-black'
              inherit: true, // Whether to inherit from the base theme
              rules: [
                // Define token color rules based on the Poimandres theme
                // For example:
                { token: "comment", foreground: "767c9dB0" },
                { token: "keyword", foreground: "FF0000" },
                // Add more rules based on the Poimandres theme JSON
              ],
              colors: {
                // Define editor colors based on the Poimandres theme
                // For example:
                "editor.foreground": "#a6accd",
                "editor.background": "#1b1e28",
                "editorCursor.foreground": "#a6accd",
                "editor.lineHighlightBackground": "#FFFFFF0A",
                "editorLineNumber.foreground": "#767c9d50",
                "editor.selectionBackground": "#717cb425",
                "editor.inactiveSelectionBackground": "#717cb425",
                // Add more colors based on the Poimandres theme JSON
              },
            });

            monaco.editor.setTheme("poimandres");

            // Language Definition extension. https://stackoverflow.com/questions/43058191/how-to-use-addextralib-in-monaco-with-an-external-type-definition

            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
              ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
              allowSyntheticDefaultImports: true,
              moduleResolution: 1,
              isolatedModules: true,
              esModuleInterop: true,
            });

            monaco.languages.typescript.typescriptDefaults.addExtraLib(
              DAYJS_index_replaced,
              "file:///node_modules/@types/dayjs/index.d.ts",
            );

            // For imports on exported dayjs to work:
            const currentModel = editor?.getModel();

            const model = monaco.editor.createModel(
              currentModel?.getValue() ?? "",
              currentModel?.getLanguageId() || "typescript",
              monaco.Uri.parse("file:///main.ts"),
            );

            editor?.setModel(model);

            setTSCodeState(
              'const fiveDaysAfter = dayjs().add(5, "days");\n\nconsole.log(fiveDaysAfter.format("MMMM D YYYY"))',
            );
          }}
          options={{
            minimap: {
              enabled: false,
            },
          }}
        />
      </Panel>
      <ResizeHandle />
      <Panel id="2" class="flex w-full flex-col bg-gray-50 p-3" minSize={20}>
        <div class="py-2">
          <div class="mb-2 flex items-center gap-x-2">
            <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md object-contain">
              <img
                src="https://day.js.org/img/logo.png"
                class="h-full w-full"
                alt="dayjs logo"
              />
            </div>
            <h1 class="text-3xl font-medium">DayJS Studio</h1>
          </div>
          <p class="mb-1">
            A quick TypeScript environment on the browser that uses DayJS so you
            can calculate dates quickly.
            <br />
          </p>
          <p class="text-sm text-opacity-50">
            By{" "}
            <A
              href="https://carlo.vercel.app/"
              class="font-medium text-orange-500"
            >
              Carlo
            </A>{" "}
            💙.
          </p>
        </div>
        <div class="flex gap-x-4 py-2">
          <button
            onClick={executeCode}
            class="flex h-11 items-center gap-x-1.5 rounded-md border border-orange-400 bg-orange-600 px-3 py-2 pr-5 text-white"
          >
            <IconExecute font-size="22px" />
            <span>Execute</span>
          </button>
          <button
            class={`grid h-11 w-11 place-items-center rounded-md border border-slate-300 bg-slate-200 ${showAdvanced() ? "" : "opacity-70"}`}
            onClick={() => setShowAdvanced(!showAdvanced())}
          >
            <Show
              when={showAdvanced()}
              fallback={<IconHidden font-size="18px" />}
            >
              <IconVisible font-size="18px" />
            </Show>
          </button>
        </div>

        <hr />

        <div class="flex-grow">
          <Show when={showAdvanced()}>
            <div class="flex flex-col gap-y-2 py-2">
              <span class="font-medium">Code: </span>
              <pre class="rounded-md border-gray-500 bg-gray-800 p-2 text-gray-300">
                {tsCodeState()}
              </pre>
            </div>

            <hr />

            <div class="flex flex-col gap-y-2 py-2">
              <span class="font-medium">Transpiled TS to JS: </span>
              <Show when={!!jsCodeState()} fallback={<div>None</div>}>
                <pre class="rounded-md border-gray-500 bg-gray-800 p-2 text-gray-300">
                  {jsCodeState()}
                </pre>
              </Show>
            </div>

            <hr />
          </Show>

          <div class="flex flex-col gap-y-2 py-2">
            <span class="font-medium">Output: </span>

            <Show when={codeLogs()?.length} fallback={<div>None</div>}>
              <ul class="flex min-h-40 flex-col gap-y-1 rounded-md border-gray-500 bg-slate-800 p-2 text-slate-400">
                <For each={codeLogs()}>
                  {(codeLog, index) => <li>{codeLog}</li>}
                </For>
              </ul>
            </Show>
          </div>
        </div>

        <footer>
          Made with{" "}
          <A href="https://solidjs.com" class="text-sky-500">
            SolidJS
          </A>
          {", "}
          <A href="https://day.js.org/" class="font-medium text-orange-500">
            Day.js
          </A>
          {", and "}
          <A
            href="https://github.com/microsoft/monaco-editor"
            class="font-medium text-purple-500"
          >
            Monaco
          </A>
        </footer>
      </Panel>
    </PanelGroup>
  );
}
