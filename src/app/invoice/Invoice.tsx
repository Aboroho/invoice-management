"use client";

import { monthNames } from "@/constants";
import { numberToWords } from "@/lib/utils";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { LoaderCircle } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import InvoicePDF from "@/app/invoice/InvoicePDF";

type Invoice = {
  invoiceID: string;

  forMonth: string;
  forYear: string;
  name: string;
  studentClass: string;
  studentID: string;
  mobile: string;
  fees: { feeAmount: number; feeDetails: string }[];
};

function Invoice() {
  const params = useSearchParams();
  const invoiceID = params.get("invoiceID");

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Invoice>({} as Invoice);

  const {
    name,

    studentClass,
    mobile,
    forMonth,
    forYear,
    fees,
    studentID,
  } = data;

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedData = await fetch("api/invoice/" + invoiceID, {
        method: "get",
      });
      setData(await fetchedData.json());
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [invoiceID]);

  const downloadPdf = async () => {
    const fileName = `albab-invoice-${invoiceID}.pdf`;

    const blob = await pdf(
      <InvoicePDF
        {...data}
        total={total}
        dateToday={dateToday}
        invoiceID={invoiceID || ""}
      />
    ).toBlob();
    saveAs(blob, fileName);
  };

  const date = new Date();
  const dateToday = monthNames[date.getMonth()] + "," + date.getFullYear();

  const total = !fees
    ? 0
    : fees.reduce(
        (prev: number, cur: { feeAmount: number }) => prev + cur.feeAmount,
        0
      );

  if (loading)
    return (
      <div className="w-full h-[400px] bg-slate-200 flex justify-center items-center">
        <LoaderCircle className="w-9 animate-spin" />
      </div>
    );

  return (
    <div>
      {/* button group */}
      <div className="mt-4 max-w-screen-lg mx-auto mb-4">
        <div className="flex w-full justify-end gap-4">
          {Object.entries(data).length > 0 && (
            <Button className="bg-green-700" onClick={downloadPdf}>
              Download Pdf
            </Button>
          )}
        </div>
      </div>

      {/* summary to show */}
      <div
        className="bg-white p-10 max-w-screen-lg mx-auto border shadow-md rounded-md "
        id="invoice"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-1">
          <div>
            <h1 className="text-xl font-bold text-green-600">Albab Academy</h1>
            <p className="text-gray-700">
              House no 51, M A Bari Road (Air Club)
            </p>
            <p className="text-black">Sonadanga,Khulna, Bangladesh</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-green-600">Receipt</h2>
            <p className="text-gray-500">
              Receipt ID: <span className="font-semibold">{}</span>
              <span className="font-semibold text-gray-500">{invoiceID}</span>
            </p>
            <p className="text-gray-500">
              Payment Date: <span className="font-semibold">{dateToday}</span>
            </p>
          </div>
        </div>

        <div className=" border-b-2 border-black py-2 mb-4 ">
          <b className="text-gray-600">For Month : </b>
          <span className=" font-semibold"> {forMonth + ", " + forYear}</span>
        </div>
        {/* School Info */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="mb-1">
                <strong className="text-gray-600">Student Name:</strong>{" "}
                <span className=" font-bold">{name}</span>
              </p>
              <p className="mb-1">
                <strong className="text-gray-600">Class: </strong>
                <span className=" font-semibold">{studentClass}</span>
              </p>
              <p className="">
                <strong className="text-gray-600">studentID: </strong>
                <span className="font-semibold">{studentID}</span>
              </p>
            </div>
            <div>
              <p className="">
                <strong className="text-gray-600">Phone: </strong>
                <span className=" font-semibold">{mobile}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-green-100 border-collapse">
              <th className="border-2 border-black px-4 py-2  text-left">
                Fee Details
              </th>

              <th className="border-2 border-black px-4  py-2 text-left">
                Amount (TK)
              </th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee: { feeAmount: number; feeDetails: string }) => (
              <tr className="border-collapse" key={fee.feeDetails}>
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  {fee.feeDetails}
                </td>
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  {fee.feeAmount.toFixed(2)}
                  {fee.feeAmount > 0 && (
                    <span className="text-gray-600 font-semibold text-sm">
                      {" "}
                      ({numberToWords(fee.feeAmount)} Taka Only)
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-right mb-4">
          <p className="text-lg font-bold text-gray-900">
            <strong>
              {" "}
              <span className="text-gray-600">Total:</span> {total.toFixed(2)}
            </strong>
            <br></br>
            {total > 0 && (
              <span className="text-gray-600 font-semibold text-sm align-middle">
                {numberToWords(total)} Taka Only
              </span>
            )}
          </p>
        </div>
      </div>

      {/* button group */}
      <div className="max-w-screen-lg mx-auto mt-4 mb-4">
        <div className="flex w-full  gap-4">
          {Object.entries(data).length > 0 && (
            <Button className="bg-green-700" onClick={downloadPdf}>
              Downlaod Pdf
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Invoice;
