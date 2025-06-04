"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, DollarSign, Calendar, Briefcase, MapPin, GraduationCap, Building2, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { toast } from "sonner"

export type Salary = {
  company: string
  salary: number
  role: string
  year: number
  location: string
  university: string
  term: number
  arrangement: string
}

export const columns: ColumnDef<Salary>[] = [
  // {
  //   accessorKey: "company",
  //   header: "Company",
  //   cell: ({ row }) => (
  //     <div className="capitalize">{row.getValue("company")}</div>
  //   ),
  // },
  {
    accessorKey: "salary",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-blue-50"
        >
          <DollarSign className="w-4 h-4 mr-2" />
          Salary (/hr)
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("salary"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "CAD",
      }).format(amount)

      return (
        <div className="font-semibold text-center sm:text-start">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {formatted}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "year",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-blue-50"
        >
          <Calendar className="w-4 h-4 mr-2" />
          Year
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center sm:text-start">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {row.getValue("year")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <div className="flex items-center">
        <Briefcase className="w-4 h-4 mr-2" />
        Role
      </div>
    ),
    cell: ({ row }) => (
      <div className="capitalize">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {row.getValue("role")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <div className="flex items-center">
        <MapPin className="w-4 h-4 mr-2" />
        Location
      </div>
    ),
    cell: ({ row }) => {
      const location = row.getValue("location") as string;
      const displayLocation = !location || location.trim() === "" ? "not reported" : location;
      
      return (
        <div className="capitalize text-center sm:text-start flex items-center">
          <MapPin className="w-3 h-3 mr-1 text-gray-500" />
          <span className={`${!location || location.trim() === "" ? "text-gray-400 italic" : ""}`}>
            {displayLocation}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "university",
    header: ({ column }) => (
      <div className="flex items-center">
        <GraduationCap className="w-4 h-4 mr-2" />
        University
      </div>
    ),
    cell: ({ row }) => (
      <div className="capitalize text-center sm:text-start flex items-center">
        <GraduationCap className="w-3 h-3 mr-1 text-gray-500" />
        <span className="truncate max-w-[200px]" title={row.getValue("university")}>
          {row.getValue("university")}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "term",
    header: ({ column }) => (
      <div className="flex items-center">
        <Clock className="w-4 h-4 mr-2" />
        Work Term
      </div>
    ),
    cell: ({ row }) => (
      <div className="text-center sm:text-start">
        {row.getValue("term") ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Term {row.getValue("term")}
          </span>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </div>
    ),
  },
  // {
  //   accessorKey: "arrangement",
  //   header: "Arrangement",
  //   cell: ({ row }) => (
  //     <div className="capitalize text-center sm:text-start">{row.getValue("arrangement") ? row.getValue("arrangement") : "-"}</div>
  //   ),
  // },
  // {
  //   accessorKey: "bonus",
  //   header: "Bonus",
  //   cell: ({ row }) => (
  //     <div className="capitalize text-center sm:text-start">{row.getValue("bonus") ? row.getValue("bonus") : "-"}</div>
  //   ),
  // },
  
  {
    id: "actions",
    enableHiding: true,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast.success("Thank you for reporting potential spam!")}
            >
              Report as spam
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function CompanyTable({ companyRecords }: { companyRecords: Salary[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const data: Salary[] = companyRecords;

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        {data.length == 0 ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-gray-200 bg-gray-50/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-semibold text-gray-700 py-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {Array.from({ length: 8 }).map((_, rowIndex) => (
                <TableRow key={rowIndex} className="border-b border-gray-100">
                  {columns.map((column, colIndex) => (
                    <TableCell key={colIndex} className="py-4">
                      <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50/30">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-semibold text-gray-700 py-4">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-32 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="font-medium">No salary data found</div>
                      <div className="text-sm text-gray-400">There are no salary reports for this company yet.</div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
      
      {/* Enhanced Pagination */}
      <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{table.getState().pagination.pageSize * table.getState().pagination.pageIndex + 1}</span> to{' '}
          <span className="font-semibold">
            {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getCoreRowModel().rows.length)}
          </span>{' '}
          of <span className="font-semibold">{table.getCoreRowModel().rows.length}</span> entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="hover:bg-blue-50 border-blue-200 text-blue-600 disabled:opacity-50"
          >
            Previous
          </Button>
          <div className="px-3 py-1 bg-white rounded-lg border border-blue-200 text-sm font-medium text-blue-600">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="hover:bg-blue-50 border-blue-200 text-blue-600 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}