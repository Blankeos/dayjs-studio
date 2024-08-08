import { FlowComponent } from "solid-js";

type RootLayoutProps = {};

const RootLayout: FlowComponent<RootLayoutProps> = (props) => {
  return <div>{props.children}</div>;
};

export default RootLayout;
