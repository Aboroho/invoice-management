"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import toast from "react-hot-toast";

// ui
import { LoaderCircle } from "lucide-react";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

// constants
import { monthNames } from "@/constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

const date = new Date();

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  studentClass: z.string().min(3, "Class name must be at least 3 characters"),
  mobile: z.string().length(11, "Phone number must be 11 digits."),

  forMonth: z.enum(monthNames),
  forYear: z.number().max(date.getFullYear() + 1),
  studentID: z.string().min(1, "Student ID must be at least 1 characters"),
});

const feeSchema = z.object({
  feeDetails: z.string().min(3, "Fee must be at least 3 digits"),
  feeAmount: z.number().min(0, "Fee can not be negetive"),
});
const feeFormSchema = z
  .object({
    fees: z.array(feeSchema),
  })
  .merge(feeSchema);

type Invoice = {
  fees: Array<z.infer<typeof feeSchema>>;
} & z.infer<typeof formSchema>;

function PaymentForm() {
  const router = useRouter();

  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      studentClass: "",
      mobile: "",
      forMonth: monthNames[date.getMonth()],
      //   roll: "",
      forYear: date?.getFullYear(),

      studentID: "",
    },
  });

  const feeForm = useForm<z.infer<typeof feeFormSchema>>({
    resolver: zodResolver(feeFormSchema),
    defaultValues: {
      feeAmount: 0,
      feeDetails: "",
      fees: [],
    },
  });

  const {
    fields: fees,
    prepend: feePrepend,
    remove: removeFee,
  } = useFieldArray({
    control: feeForm.control,
    name: "fees",
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const invoice: Invoice = {
      ...data,
      fees: feeForm.getValues("fees"),
    };

    const invPromise = fetch("/api/invoice", {
      method: "post",
      body: JSON.stringify(invoice),
    });

    toast.promise(invPromise, {
      loading: "Creating, please wait",
      success: "Successfully created",
      error: "Something went wrong",
    });

    const response = await invPromise;

    const paymentDetails = await response.json();
    const invoiceID = paymentDetails._id;
    if (invoiceID) router.push("/invoice?invoiceID=" + invoiceID);
  };

  const handleFeeDeletion = (index: number) => {
    removeFee(index);
  };

  const addNewFee = (data: z.infer<typeof feeSchema>) => {
    feePrepend({ feeDetails: data.feeDetails, feeAmount: data.feeAmount });
    feeForm.setValue("feeAmount", 0);
    feeForm.setValue("feeDetails", "");
  };

  const handleSubmit = async () => {
    if (submitButtonRef.current) submitButtonRef.current.click();
  };

  return (
    <>
      {/* other details */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-2">
            <Card className="px-4 py-10 mb-4 flex flex-col gap-4">
              <h4 className="mb-3 font-bold">Student Details</h4>
              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Student Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Roll Field */}
              <FormField
                control={form.control}
                name="studentID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="Student ID" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Class Field */}
              <FormField
                control={form.control}
                name="studentClass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Class</FormLabel>
                    <FormControl>
                      <Input placeholder="Student studentClass" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mobile Field */}
              <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Mobile</FormLabel>
                    <FormControl>
                      <Input placeholder="Student Mobile Number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            <Card className="px-4 py-6 flex flex-col gap-4 mb-4">
              <h2 className="mb-3 font-bold">Fees For</h2>
              <FormField
                control={form.control}
                name="forYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Fees for Year
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">
                      Fees for Month
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Card>

            {/* Fees Field */}
          </div>

          <Button type="submit" className="hidden" ref={submitButtonRef}>
            Submit
          </Button>
        </form>
      </Form>

      {/* fees form */}
      <Form {...feeForm}>
        <form onSubmit={feeForm.handleSubmit(addNewFee)}>
          <Card className="px-4 py-6 mb-10">
            <h2 className="font-semibold mb-3">Fees Details</h2>
            <div className="flex gap-3 md:flex-col lg:flex-row lg:*:flex-1">
              <FormField
                control={feeForm.control}
                name="feeDetails"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Fee Details</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Description of the fee"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={feeForm.control}
                name="feeAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold">Fee amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Amount in Taka"
                        {...field}
                        onChange={(e) => {
                          field.onChange(parseInt(e.target.value) || undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="mt-4">
              Add
            </Button>

            <div className="my-4 flex flex-col gap-4 mb-10">
              <div className="flex gap-2 bg-slate-200 p-2 font-semibold">
                <div className="flex-1 text-center ">Fee Details</div>
                <div className="flex-1 text-center">Fee Amount</div>
              </div>

              {fees.length == 0 && (
                <div className="bg-slate-100 text-sm text-slate-400 p-3 text-center">
                  No fees added
                </div>
              )}
              {fees.map((fee, index) => (
                <div
                  key={fee.id}
                  className="flex gap-2 *:flex-1 border p-2 px-4"
                >
                  <div className="self-center">{fee.feeDetails}</div>
                  <div className="flex text-center">
                    <span className="self-center font-bold flex-1">
                      {fee.feeAmount.toFixed(2)}
                    </span>{" "}
                    <Button
                      className="ml-auto bg-red-500"
                      size="sm"
                      onClick={() => handleFeeDeletion(index)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <div className="p-4">
                <span className="font-bold">Total</span> :{" "}
                <span className="font-bold">
                  {" "}
                  {fees
                    .reduce((prev, cur) => prev + cur.feeAmount, 0)
                    .toFixed(2)}{" "}
                </span>
                BDT
              </div>
            </div>
          </Card>
        </form>
      </Form>

      <Button className="font-bold mb-12" onClick={handleSubmit}>
        Generate Invoice{" "}
      </Button>
    </>
  );
}

export default PaymentForm;
