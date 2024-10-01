import React, { Suspense } from "react";
import Invoice from "./Invoice";

type Props = {};

function Loading() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <h4>Loading...</h4>
    </div>
  );
}

function Page({}: Props) {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Invoice />
      </Suspense>
    </div>
  );
}

export default Page;
