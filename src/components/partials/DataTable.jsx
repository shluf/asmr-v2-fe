import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Input } from "../ui/input";
import PrimaryButton from "../PrimaryButton";

const DataTable = ({
    data,
    columns,
    hide = {},
    pageSize = 5,
    refresh,
    isLoading = false,
}) => {
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState(hide);
    const [rowSelection, setRowSelection] = useState({});

    const table = useReactTable({
        data,
        columns,
        pageCount: Math.ceil(data.length / pageSize),
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
        initialState: {
            pagination: {
                pageSize,
            },
        },
    });

    const SkeletonRow = ({ cellCount }) => (
        <TableRow>
            {Array.from({ length: cellCount }).map((_, index) => (
                <TableCell key={index}>
                    <Skeleton className="h-6 w-full" />
                </TableCell>
            ))}
        </TableRow>
    );

    return (
        <div>
            <div className="flex items-center py-4 gap-3">
                <Input
                    placeholder="Cari nama..."
                    value={table.getColumn("nama")?.getFilterValue() ?? ""}
                    onChange={(event) =>
                        table
                            .getColumn("nama")
                            ?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm rounded-full"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Kolom <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                const header =
                                    column.columnDef?.name || column.id;
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {header}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div>
                <Table>
                    <TableHeader>
                        {isLoading ? (
                            <TableRow>
                                {columns.map((column, index) => (
                                    <TableHead key={column.id || index}>
                                        <Skeleton className="h-6 w-full" />
                                    </TableHead>
                                ))}
                            </TableRow>
                        ) : (
                            table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            Array.from({ length: pageSize }).map((_, index) => (
                                <SkeletonRow
                                    key={index}
                                    cellCount={columns.length}
                                />
                            ))
                        ) : table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row, index) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                    className={
                                        index % 2 === 0
                                            ? "bg-white"
                                            : "bg-gray-200"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
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
                                    className="h-24 text-center"
                                >
                                    Data tidak ditemukan.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-center md:justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground md:block hidden">
                    {isLoading ? (
                        <Skeleton className="h-4 w-[100px]" />
                    ) : (
                        `Halaman ${
                            table.getState().pagination.pageIndex + 1
                        } dari ${table.getPageCount()}`
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage() || isLoading}
                    >
                        Previous
                    </Button>
                    <div className="flex items-center space-x-1">
                        {Array.from(
                            { length: table.getPageCount() },
                            (_, i) => (
                                <PrimaryButton
                                    key={i}
                                    color={"blue"}
                                    variant={
                                        table.getState().pagination
                                            .pageIndex === i
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => table.setPageIndex(i)}
                                >
                                    {i + 1}
                                </PrimaryButton>
                            )
                        )}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage() || isLoading}
                    >
                        Next
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DataTable;
