import React, { Suspense } from "react";
import Invoice from "./Invoice";
import { LoaderCircle } from "lucide-react";

type Props = {};

function Loading() {
  return (
    <div className="w-ful h-[400px] bg-slate-200 flex justify-center items-center">
      <LoaderCircle />
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
