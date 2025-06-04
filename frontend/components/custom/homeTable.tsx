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
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

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
  {
    accessorKey: "company",
    header: "Company",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
          {(row.getValue("company") as string).charAt(0).toUpperCase()}
        </div>
        <div className="font-semibold text-gray-900 capitalize">{row.getValue("company")}</div>
      </div>
    ),
  },
  {
    accessorKey: "salary",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="hover:bg-blue-50 text-blue-600 font-semibold"
        >
          Salary (/hr)
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("salary"))

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
      }).format(amount)

      return (
        <div className="font-bold text-lg text-green-600 text-center sm:text-start">
          {formatted}
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
          className="hover:bg-blue-50 text-blue-600 font-semibold"
        >
          Year
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => (
      <div className="text-center sm:text-start">
        <span className="px-2 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-700">
          {row.getValue("year")}
        </span>
      </div>
    ),
  },
  // {
  //   accessorKey: "role",
  //   header: "Role",
  //   cell: ({ row }) => (
  //     <div className="capitalize">{row.getValue("role") === "Unreported" ? "-" : row.getValue("role")}</div>
  //   ),
  // },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => (
      <div className="flex items-center gap-2 text-center sm:text-start">
        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
        <span className="capitalize text-gray-700 font-medium">{row.getValue("location")}</span>
      </div>
    ),
  },
  {
    accessorKey: "university",
    header: "University",
    cell: ({ row }) => (
      <div className="capitalize text-center sm:text-start text-gray-700 font-medium">
        {row.getValue("university")}
      </div>
    ),
  },
  {
    accessorKey: "term",
    header: "Work Term",
    cell: ({ row }) => (
      <div className="text-center sm:text-start">
        {row.getValue("term") ? (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
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
  //   header: "Work Arrangement",
  //   cell: ({ row }) => (
  //     <div className="capitalize text-center sm:text-start">{row.getValue("arrangement") ? row.getValue("arrangement"): "-"}</div>
  //   ),
  // },
  
  {
    id: "actions",
    enableHiding: true,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel className="font-semibold">Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => toast.success("Thank you for reporting potential spam!")}
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              Report as spam
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function HomeTable() {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [{ pageIndex, pageSize }, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 12,
  });
  const [totalRows, setTotalRows] = React.useState(0);

  const [data, setData] = React.useState<Salary[]>([]);
  const [loading, setLoading] = React.useState(true);
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  React.useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const offset = pageIndex * pageSize;
        const response = await fetch(`${BACKEND_URL}/all-salaries?offset=${offset}&limit=${pageSize}`);
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }
        const response_data = await response.json();
        setData(response_data.data || response_data);
        setTotalRows(response_data.total || response_data.length);
      } catch (error) {
        console.error("Error fetching companies: ", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, [pageIndex, pageSize]);

  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalRows / pageSize),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  })

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden">
      <div className="overflow-x-auto">
        {loading ? (
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
                        <span className="text-2xl">📊</span>
                      </div>
                      <div className="font-medium">No salary data found</div>
                      <div className="text-sm text-gray-400">Try adjusting your search criteria</div>
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
          Showing <span className="font-semibold">{table.getState().pagination.pageIndex * pageSize + 1}</span> to{' '}
          <span className="font-semibold">
            {Math.min((table.getState().pagination.pageIndex + 1) * pageSize, totalRows)}
          </span>{' '}
          of <span className="font-semibold">{totalRows}</span> entries
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