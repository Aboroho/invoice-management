"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// ui
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

const date = new Date();

const formSchema = z.object({
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
  forYear: z.number().max(date.getFullYear() + 1),
  studentID: z.string().min(1, "Student ID must be at least 1 characters"),
});

function PaymentForm() {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      studentClass: "",
      mobile: "",
      forMonth: monthNames[date.getMonth()],
      tutionFees: 0,
      fine: 0,
      //   roll: "",
      forYear: date?.getFullYear(),
      sessionFees: 0,
      admissionFees: 0,
      studentID: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      const response = await fetch("/api/invoice", {
        method: "post",
        body: JSON.stringify(data),
      });
      const paymentDetails = await response.json();
      const invoiceID = paymentDetails._id;
      if (invoiceID) router.push("/invoice?invoiceID=" + invoiceID);
    } catch (err) {
      console.log(err);
    }
  };

  return (
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
                  <FormLabel className="font-semibold">Fees for Year</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
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

          {/* tutionFees Field */}

          <Card className="px-4 py-6 flex gap-4 flex-col">
            <h2 className="font-semibold mb-3">Fees Details</h2>
            <FormField
              control={form.control}
              name="tutionFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Tution Fees</FormLabel>
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

            <FormField
              control={form.control}
              name="sessionFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Session Fees</FormLabel>
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
            <FormField
              control={form.control}
              name="admissionFees"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">
                    Admission Fees
                  </FormLabel>
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

            {/* Fine Field */}
            <FormField
              control={form.control}
              name="fine"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Fine</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Fine"
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
          </Card>
        </div>
        {/* Submit Button */}
        <Button type="submit" className="mt-4">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default PaymentForm;
