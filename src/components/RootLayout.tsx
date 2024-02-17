import { FlowComponent } from "solid-js";

import Nav from "@/components/Nav";

type RootLayoutProps = {};

const RootLayout: FlowComponent<RootLayoutProps> = (props) => {
  return (
    <div>
      {/* <Nav /> */}
      {props.children}
    </div>
  );
};

export default RootLayout;
