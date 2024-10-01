"use client";

import generatePDF, { Margin, Options } from "react-to-pdf";

import { monthNames } from "@/constants";
import { numberToWords } from "@/lib/utils";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

const options: Options = {
  method: "open",

  resolution: 4,
  page: {
    margin: Margin.MEDIUM,
  },
  canvas: {
    qualityRatio: 1,
  },

  overrides: {
    pdf: {
      compress: true,
    },

    canvas: {
      useCORS: true,
    },
  },
};

function Invoice() {
  const params = useSearchParams();
  const invoiceID = params.get("invoiceID");

  const [data, setData] = useState<Record<string, string>>({});
  const {
    name,
    roll,
    studentClass,
    mobile,
    forMonth,
    forYear,
    fine,
    tutionFees,
    sessionFees,
    admissionFees,
    studentID,
  } = data;

  const total = tutionFees + admissionFees + sessionFees + fine;

  const date = new Date();
  const dateToday = monthNames[date.getMonth()] + "," + date.getFullYear();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedData = await fetch("api/invoice/" + invoiceID, {
          method: "get",
        });
        setData(await fetchedData.json());
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [invoiceID]);

  const getPdfElement = () => document.getElementById("invoice");

  const handlePdf = (options: Options) => {
    const el = document.getElementById("pdf-wrapper");
    el?.classList.remove("hidden");
    generatePDF(getPdfElement, options);
    el?.classList.add("hidden");
  };
  const pdfDownloadHandler = () => {
    options.method = "save";
    handlePdf(options);
  };

  const openPdfHandler = async () => {
    options.method = "open";
    handlePdf(options);
  };

  return (
    <div>
      {/* button group */}
      <div className="mt-4 max-w-screen-lg mx-auto mb-4">
        <div className="flex w-full justify-end gap-4">
          <Button onClick={pdfDownloadHandler} className="bg-green-700">
            Download PDF
          </Button>
          <Button onClick={openPdfHandler}>Open</Button>
        </div>
      </div>

      {/* pdf to print | hidden from user */}
      <div id="pdf-wrapper" className="hidden">
        <div
          className="bg-white p-10 max-w-screen-lg mx-auto border shadow-md rounded-md"
          id="invoice"
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b-2 border-black pb-4 mb-1">
            <div>
              <h1 className="text-xl font-bold text-green-600">
                Albab Academy
              </h1>
              <p className="text-gray-700">
                House no 51, M A Bari Road (Air Club)
              </p>
              <p className="text-black">Sonadanga,Khulna, Bangladesh</p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-600">Receipt</h2>
              <p className="text-black">
                Receipt ID: <span className="text-black font-semibold">{}</span>
                <span className="font-semibold text-gray-600">{invoiceID}</span>
              </p>
              <p className="text-black">
                Payment Date: <span className="font-semibold">{dateToday}</span>
              </p>
            </div>
          </div>

          <div className=" border-b-2 border-black pb-4 mb-4 ">
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
                <th className="border-2 border-black px-4 pb-4  text-left">
                  Fee Details
                </th>

                <th className="border-2 border-black px-4  pb-4 text-left">
                  Amount (TK)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-collapse">
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  Tution Fees
                </td>
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  {parseInt(tutionFees).toFixed(2)}
                  {parseInt(tutionFees) > 0 && (
                    <span className="text-gray-600 font-semibold text-sm">
                      {" "}
                      ({numberToWords(parseInt(tutionFees))} Taka Only)
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  Session Fees
                </td>
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  {parseInt(sessionFees).toFixed(2)}
                  {parseInt(sessionFees) > 0 && (
                    <span className="text-gray-600 font-semibold text-sm">
                      {" "}
                      ({numberToWords(parseInt(sessionFees))} Taka Only)
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  Admission Fees
                </td>
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  {parseInt(admissionFees).toFixed(2)}
                  {parseInt(admissionFees) > 0 && (
                    <span className="text-gray-600 font-semibold text-sm">
                      {" "}
                      ({numberToWords(parseInt(admissionFees))} Taka Only)
                    </span>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  Fine
                </td>
                <td className="border-2 border-black px-4  pb-4 font-bold">
                  {parseInt(fine).toFixed(2)}{" "}
                  {parseInt(fine) > 0 && (
                    <span className="text-gray-600 font-semibold text-sm">
                      {" "}
                      ({numberToWords(parseInt(fine))} Taka Only)
                    </span>
                  )}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Totals */}
          <div className="text-right mb-4">
            {/* <p className="text-gray-700">
            <strong>Subtotal:</strong>{" "}
          </p>
          <p className="text-gray-700">
            <strong>Tax Rate:</strong>{" "}
          </p>
          <p className="text-gray-700">
            <strong>Tax Amount:</strong>{" "}
          </p> */}
            <p className="text-lg font-bold text-gray-900">
              <strong>
                {" "}
                <span className="text-gray-600">Total:</span>{" "}
                {parseInt(total).toFixed(2)}
              </strong>
              <br></br>
              {parseInt(total) > 0 && (
                <span className="text-gray-600 font-semibold text-sm align-middle">
                  {numberToWords(parseInt(total))} Taka Only
                </span>
              )}
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="border-t-2 border-black pt-4 text-black flex gap-6">
            <div className="  border-t-2 border-black mt-24 flex-1 text-center">
              Depositor's Signature and Mobile
            </div>
            <div className="border-t-2  border-black mt-24 flex-1 text-center">
              Officer
            </div>
            <div className="border-t-2 border-black mt-24 flex-1 text-center">
              Authorised Officer
            </div>
          </div>
        </div>
      </div>

      {/* summary to show */}
      <div
        className="bg-white p-10 max-w-screen-lg mx-auto border shadow-md rounded-md"
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
            <tr className="border-collapse">
              <td className="border-2 border-black px-4  py-2 font-bold">
                Tution Fees
              </td>
              <td className="border-2 border-black px-4  py-2 font-bold">
                {parseInt(tutionFees).toFixed(2)}
                {parseInt(tutionFees) > 0 && (
                  <span className="text-gray-600 font-semibold text-sm">
                    {" "}
                    ({numberToWords(parseInt(tutionFees))} Taka Only)
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td className="border-2 border-black px-4   py-2 font-bold">
                Session Fees
              </td>
              <td className="border-2 border-black px-4   py-2 font-bold">
                {parseInt(sessionFees).toFixed(2)}
                {parseInt(sessionFees) > 0 && (
                  <span className="text-gray-600 font-semibold text-sm">
                    {" "}
                    ({numberToWords(parseInt(sessionFees))} Taka Only)
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td className="border-2 border-black px-4   py-2 font-bold">
                Admission Fees
              </td>
              <td className="border-2 border-black px-4   py-2 font-bold">
                {parseInt(admissionFees).toFixed(2)}
                {parseInt(admissionFees) > 0 && (
                  <span className="text-gray-600 font-semibold text-sm">
                    {" "}
                    ({numberToWords(parseInt(admissionFees))} Taka Only)
                  </span>
                )}
              </td>
            </tr>
            <tr>
              <td className="border-2 border-black px-4  py-2  font-bold">
                Fine
              </td>
              <td className="border-2 border-black px-4   py-2 font-bold">
                {parseInt(fine).toFixed(2)}{" "}
                {parseInt(fine) > 0 && (
                  <span className="text-gray-600 font-semibold text-sm">
                    {" "}
                    ({numberToWords(parseInt(fine))} Taka Only)
                  </span>
                )}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Totals */}
        <div className="text-right mb-4">
          {/* <p className="text-gray-700">
            <strong>Subtotal:</strong>{" "}
          </p>
          <p className="text-gray-700">
            <strong>Tax Rate:</strong>{" "}
          </p>
          <p className="text-gray-700">
            <strong>Tax Amount:</strong>{" "}
          </p> */}
          <p className="text-lg font-bold text-gray-900">
            <strong>
              {" "}
              <span className="text-gray-600">Total:</span>{" "}
              {parseInt(total).toFixed(2)}
            </strong>
            <br></br>
            {parseInt(total) > 0 && (
              <span className="text-gray-600 font-semibold text-sm align-middle">
                {numberToWords(parseInt(total))} Taka Only
              </span>
            )}
          </p>
        </div>

        {/* Terms & Conditions */}
        <div className="border-t-2 border-black pt-4 text-gray-700 flex gap-6">
          <div className="border-t-2 border-black mt-20 flex-1 text-center">
            Depositor's Signature and Mobile
          </div>
          <div className="border-t-2 border-black mt-20 flex-1 text-center">
            Officer
          </div>
          <div className="border-t-2 border-black mt-20 flex-1 text-center">
            Authorised Officer
          </div>
        </div>
      </div>

      {/* button group */}
      <div className="max-w-screen-lg mx-auto mt-4 mb-4">
        <div className="flex w-full  gap-4">
          <Button onClick={pdfDownloadHandler} className="bg-green-700">
            Download PDF
          </Button>
          <Button onClick={openPdfHandler}>Open</Button>
        </div>
      </div>
    </div>
  );
}

export default Invoice;
