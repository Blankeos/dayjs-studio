import { createSignal, For, onMount, Show } from "solid-js";
import { MonacoEditor } from "solid-monaco";
import { Panel, PanelGroup, ResizeHandle } from "solid-resizable-panels";

import Counter from "@/components/Counter";

import "solid-resizable-panels/styles.css";

export default function Home() {
  const [tsCodeState, setTSCodeState] = createSignal(
    "console.log('Hello World');",
  );

  const [jsCodeState, setJSCodeState] = createSignal("");
  const [codeLogs, setCodeLogs] = createSignal<string[]>();

  function executeCode() {
    const logs: string[] = [];

    // Override console logs.
    const originalLog = console.log;

    console.log = function (...args) {
      logs.push(args.join(" "));
      originalLog.apply(console, args);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const jsCode = (window as unknown as any).ts.transpile(tsCodeState());

    setJSCodeState(jsCode);

    eval(jsCode);

    const stringifiedLogs = logs.map((log) => JSON.stringify(log));

    setCodeLogs(stringifiedLogs);

    // Reset back the console log function.
    console.log = originalLog;
  }

  return (
    <PanelGroup class="flex h-screen bg-gray-50 text-gray-700">
      <script src="https://unpkg.com/typescript@latest/lib/typescript.js" />

      <Panel id="1" class="w-1/2 bg-gray-50">
        <MonacoEditor
          onChange={(value) => setTSCodeState(value)}
          language="typescript"
          value={tsCodeState()}
          onMount={(monaco) => {
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
          }}
          options={{
            minimap: {
              enabled: false,
            },
          }}
        />
      </Panel>
      <ResizeHandle />
      <Panel id="2" class="flex w-full flex-col bg-gray-50 p-3">
        <div class="py-2">
          <button
            onClick={executeCode}
            class="rounded-md border border-sky-400 bg-sky-600 px-3 py-2 text-white "
          >
            Execute Code
          </button>
        </div>

        <hr />

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

        <div class="flex flex-col gap-y-2 py-2">
          <span class="font-medium">Output: </span>

          <Show when={codeLogs()?.length} fallback={<div>None</div>}>
            <ul class="flex flex-col gap-y-1">
              <For each={codeLogs()}>
                {(codeLog, index) => <li>{codeLog}</li>}
              </For>
            </ul>
          </Show>
        </div>
      </Panel>
    </PanelGroup>
  );
}
