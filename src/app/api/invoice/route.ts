import { monthNames } from "@/constants";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import Invoice from "@/models/Invoice";
import { dbConnect } from "@/lib/db";

const date = new Date();

const invoiceSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  //   roll: z.string().min(1, "Roll number must not empty").optional(),
  studentClass: z.string().min(3, "Class name must be at least 3 characters"),
  mobile: z.string().length(11, "Phone number must be 11 digits."),
  //   date : z.date(),
  tutionFees: z
    .number()
    .min(0, "Tution Fees must be greater than or equal to 0"),
  sessionFees: z
    .number()
    .min(0, "Session Fees must be greater than or equal to 0"),
  admissionFees: z
    .number()
    .min(0, "Admissioin must be greater than or equal to 0"),
  fine: z.number().min(0, "Fine can not be negative").optional(),
  forMonth: z.enum(monthNames),
  forYear: z.number().max(date.getFullYear()),
  studentID: z.string().min(1, "Student ID must be at least 1 characters"),
});

export const POST = async (req: NextRequest) => {
  const data = await req.json();
  console.log(data);

  const parseResult = invoiceSchema.safeParse(data);

  if (!parseResult.success)
    NextResponse.json({ success: false, error: parseResult.error });

  try {
    await dbConnect();
    const invoice = new Invoice(data);
    await invoice.save();
    return NextResponse.json(invoice);
  } catch (err) {
    console.log(err);
    return NextResponse.json("something went wrong");
  }
};
