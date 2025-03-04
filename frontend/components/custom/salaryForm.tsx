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
import useFetchFieldData from "@/hooks/useFetchFieldData"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import SuggestionInput from "./suggestionInput"
import { RoleSelect } from "./roleSelect"
import { TermSelect } from "./termSelect"
import { useState } from "react"
import PlacesAutocomplete from './PlacesAutocomplete';
import { toast } from "sonner"


const formSchema = z.object({
  company: z.string({
    message: "Please enter a company",
  }),
  salary: z.number({
    required_error: "Salary is required",
    invalid_type_error: "Salary must be a number",
  }).positive().or(z.literal("")),
  role: z.string().nonempty(),
  location: z.string().nonempty(),
  year: z.number({
    required_error: "Year is required",
    invalid_type_error: "Year must be a number",
  }).int().positive().or(z.literal("")),
  university: z.string().nonempty(),
  bonus: z.number().int().positive().optional(),
  term: z.string().optional(),
})

export function SalaryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fetch Data from backend
  const {data: companies} = useFetchFieldData('all-companies');
  const {data: universities} = useFetchFieldData('all-universities');
  const {data: roles} = useFetchFieldData('internship-roles');
  
  // Defining the form 
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company: "",
      salary: undefined,
      role: "",
      location: "",
      year: undefined, 
      university: "",
      bonus: undefined,
      term: ""
    },
  })

  // Defining a submit handler.
 async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    setIsSubmitting(true);
    try{
      const formattedValues = {
        ...values,
        term: values.term ? parseInt(values.term) : undefined
      };
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/submit-salary`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedValues),
      });

      if(!response.ok){
        throw new Error('Failed to submit salary information');
      }

      const data = await response.json();

      toast.success("Thank you for contributing 🎉")

      form.reset();
    }catch(error){
      toast.error("Oh no! An error occured. Please try again.")
    }finally{
      setIsSubmitting(false);
    }
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
                <RoleSelect 
                  roles={roles}
                  onValueChange={field.onChange}
                  defaultValue=""
                />
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
                  <Input 
                    type="number" 
                    placeholder="$20" 
                    {...field} 
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : Number(e.target.value);
                      field.onChange(value);
                    }} 
                  />
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
                  <Input 
                    type="number" 
                    placeholder="2025" 
                    {...field}
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : Number(e.target.value);
                      field.onChange(value);
                    }} 
                  />
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
              <SuggestionInput 
                  suggestions={universities || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="University"
                />
              </FormControl>
              <FormDescription>
                Canadian university you attended
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
              <PlacesAutocomplete
                value={field.value}
                onChange={field.onChange}
                placeholder="Enter company location"
              />
              <FormDescription>
                City where the company is located
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
                  <Input 
                    type="number" 
                    placeholder="2000" 
                    {...field}
                    value={field.value === undefined ? "" : field.value}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : Number(e.target.value);
                      field.onChange(value);
                    }} 
                  />
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
                <TermSelect 
                  terms={["1","2","3","4","5","6","7"
                  ]}
                  onValueChange={field.onChange}
                  defaultValue=""
                />
                </FormControl>
                <FormDescription>
                  Work term when you received the offer
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-center sm:justify-start">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
