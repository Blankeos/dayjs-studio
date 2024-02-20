import {
  Component,
  createEffect,
  createSignal,
  FlowComponent,
  mergeProps,
  onMount,
} from "solid-js";
import Tippy, {
  type Instance,
  type Props as TippyInstanceProps,
} from "tippy.js";

type PingingCircleProps = {
  content?: string;
  color?: string;
};

const PingingCircle: Component<PingingCircleProps> = (props) => {
  let tippable: HTMLDivElement | undefined;

  const [tippy, setTippy] = createSignal<Instance<TippyInstanceProps>>();

  onMount(() => {
    if (!tippable) return;

    const _tippy = Tippy(tippable, {
      content: props.content,
    });

    setTippy(_tippy);
  });

  createEffect(() => {
    if (!tippy()) return;

    if (props.content) tippy()?.setContent(props.content);
  });

  return (
    <div class="relative grid h-2 w-2 place-items-center" ref={tippable}>
      <div
        class="absolute h-2 w-2 animate-ping rounded-full"
        style={{ "background-color": props.color }}
      />
      <div
        class="absolute h-2 w-2 rounded-full"
        style={{ "background-color": props.color }}
      />
    </div>
  );
};

export default PingingCircle;
