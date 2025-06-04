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
  location: z.string().optional(),
  year: z.number({
    required_error: "Year is required",
    invalid_type_error: "Year must be a number",
  }).int().positive().or(z.literal("")),
  university: z.string().nonempty(),
  bonus: z.number().int().positive().optional(),
  term: z.string().optional(),
  arrangement: z.string().nonempty(),
}).refine((data) => {
  // Make location required for Hybrid and In-Office arrangements
  if ((data.arrangement === "Hybrid" || data.arrangement === "In-Office") && (!data.location || data.location.trim() === "")) {
    return false;
  }
  return true;
}, {
  message: "Location is required for Hybrid and In-Office work arrangements",
  path: ["location"], // This will show the error on the location field
});

export function SalaryForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Fetch Data from backend
  const {data: companies} = useFetchFieldData('all-companies');
  const {data: universities} = useFetchFieldData('all-universities');
  const {data: roles} = useFetchFieldData('all-roles');
  
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
      term: "",
      arrangement: ""
    },
  })

  // Watch the arrangement field to determine if location is required
  const arrangement = form.watch("arrangement");

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
              <FormLabel>Internship Role* </FormLabel>
              <FormControl>
                <SuggestionInput 
                  suggestions={roles || []}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Role"
                />
              </FormControl>
              <FormDescription>
                Internship role you received an offer for
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row space-x-3 justify-between">
          <div className="w-full">
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
          </div>
          <div className="w-full">
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
        <div className="flex flex-row space-x-4">
          <div className="w-full">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => {
                const isLocationRequired = arrangement === "Hybrid" || arrangement === "In-Office";
                return (
                  <FormItem>
                    <FormLabel>
                      Location {!arrangement || isLocationRequired ? "*" : "(optional)"}
                    </FormLabel>
                    <PlacesAutocomplete
                      value={field.value === undefined ? "" : field.value}
                      onChange={field.onChange}
                      placeholder="Enter company location"
                    />
                    <FormDescription>
                      City where the company is located
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
          <div className="w-full">
            <FormField
            control={form.control}
            name="arrangement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Arrangement*</FormLabel>
                <FormControl>
                <TermSelect 
                  terms={["Hybrid", "In-Office", "Remote"
                  ]}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  placeholder="Select work arrangement"
                />
                </FormControl>
                <FormDescription>
                  Your work arrangement with the company
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          </div>
        </div>
        <div className="flex flex-row space-x-3">
          <div className="w-full">
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
          </div>
          <div className="w-full">
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
                    defaultValue={field.value}
                  placeholder="Select work term"
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
        </div>
        <div className="flex justify-center">
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </div>
            ) : (
              "Submit Salary"
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
