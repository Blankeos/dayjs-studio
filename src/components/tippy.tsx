import {
  createEffect,
  createSignal,
  FlowProps,
  mergeProps,
  onMount,
  ValidComponent,
} from "solid-js";
import { Dynamic, DynamicProps } from "solid-js/web";
import TippyJS, {
  type Instance,
  type Props as TippyInstanceProps,
} from "tippy.js";

type TippyProps<T extends ValidComponent> = {
  content?: string;
  /** @defaultValue "div" */
  containerProps?: DynamicProps<T>;
};

export default function Tippy<T extends ValidComponent>(
  props: FlowProps<TippyProps<T>>,
) {
  const defaultProps = mergeProps(
    {
      // Add default values here.
    },
    props,
  );

  const defaultContainerProps = mergeProps(
    { component: "div" },
    props.containerProps,
  );

  let tippable: HTMLDivElement | undefined;

  const [tippy, setTippy] = createSignal<Instance<TippyInstanceProps>>();

  onMount(() => {
    if (!tippable) return;

    const _tippy = TippyJS(tippable, {
      content: props.content,
    });

    setTippy(_tippy);
  });

  createEffect(() => {
    if (!tippy()) return;

    if (props.content) tippy()?.setContent(props.content);
  });

  return (
    <Dynamic
      component={defaultContainerProps.component as "div"}
      ref={tippable}
    >
      {props.children}
    </Dynamic>
  );
}
