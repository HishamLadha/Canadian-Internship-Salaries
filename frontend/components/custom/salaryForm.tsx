"use client"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import useFetchCompanies from "@/hooks/useFetchCompanies"
import useFetchFieldData from "@/hooks/useFetchFieldData"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import SuggestionInput from "./suggestionInput"


const VALUES = ["test", "hisham"] as const;

const formSchema = z.object({
  company: z.enum(VALUES, {
    message: "Please select a valid company",
  }),
  salary: z.number().int().positive({
    message: "Salary must be a positive number",
  }),
  role: z.string().nonempty(),
  location: z.string().nonempty(),
  year: z.number().int().positive(),
  university: z.string().nonempty(),
  bonus: z.number().int().positive(),
  term: z.number().int().positive(),

})

export function SalaryForm() {
  const {data: companies} = useFetchFieldData('all-companies');
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
    },
  })

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    alert(JSON.stringify(values))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="company"
          render={({ field }: { field: any }) => (
            <FormItem>
              <FormLabel>Company*</FormLabel>
              <FormControl>
                <SuggestionInput 
                  suggestions={companies || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Company"
                />
              </FormControl>
              <FormDescription>
                Company you received an offer from
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role* </FormLabel>
              <FormControl>
                <Input placeholder="Role" {...field} />
              </FormControl>
              <FormDescription>
                Role you received an offer for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row space-x-3">
          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hourly Salary*</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="$20" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Salary you received
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year*</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2025" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Year you received the offer
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University*</FormLabel>
              <FormControl>
                <Input placeholder="University" {...field} />
              </FormControl>
              <FormDescription>
                University you attended
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location*</FormLabel>
              <FormControl>
                <Input placeholder="Location" {...field} />
              </FormControl>
              <FormDescription>
                Location of the company
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row space-x-3">
          <FormField
            control={form.control}
            name="bonus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bonus (optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="2000" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Bonus you received (if applicable)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="term"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Work Term (optional)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="1" {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormDescription>
                  Work term when you received the offer
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
