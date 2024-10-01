import React, { Suspense } from "react";
import Invoice from "./Invoice";

type Props = {};

function Page({}: Props) {
  return (
    <div>
      <Suspense>
        <Invoice />
      </Suspense>
    </div>
  );
}

export default Page;
