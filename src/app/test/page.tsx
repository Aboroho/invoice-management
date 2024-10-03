"use client";

import React from "react";
import InvoicePDF from "../invoice/InvoicePDF";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";

type Props = {};

function page({}: Props) {
  const data = {
    invoiceID: "dkjf",

    forMonth: "10 january",
    forYear: "2013",
    name: "Rifat",
    studentClass: "Three",
    studentID: "12kjdkfjd",
    mobile: "01990059129",
    fees: [{ feeAmount: 50, feeDetails: "Admission" }],
    total: 50,
    dateToday: "10 Janyary, 30292",
  };

  const downloadPdf = async () => {
    const fileName = `albab-invoice-${data.invoiceID}.pdf`;
    const blob = await pdf(<InvoicePDF {...data} />).toBlob();
    saveAs(blob, fileName);
  };
  return (
    <div>
      <button onClick={downloadPdf}>Download</button>
    </div>
  );
}

export default page;
