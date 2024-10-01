import { dbConnect } from "@/lib/db";
import Invoice from "@/models/Invoice";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { invoiceID: string } }
) => {
  await dbConnect();
  const invoiceID = params.invoiceID;
  // return NextResponse.json(invoiceID);
  const invoice = await Invoice.findById(invoiceID);
  console.log(invoiceID);
  if (!invoice) {
    return NextResponse.json({ message: "Invoice not found" });
  }

  return NextResponse.json(invoice);
};
