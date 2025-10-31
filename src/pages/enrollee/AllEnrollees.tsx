import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useProviderContext } from "../../context/useProviderContext";
import type { RootState } from "../../services/store/store";
import type { Enrollee } from "../../types/Enrollee";
import {
  exportEnrolleesReport,
  getEnrollees,
} from "../../services/api/enrolleeApi";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import FormHeader from "../../components/form/FormHeader";
import ActionMenu from "../../components/ui/ActionMenu";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

// Import table dependencies
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
} from "@tanstack/react-table";
import { flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/table";
import { Pagination } from "../../components/pagination";

const AllEnrollees: React.FC = () => {
  const navigate = useNavigate();
  const { selectedProviderId } = useProviderContext(); 
  const userHmoId = useSelector((s: RootState) => s.auth.user?.hmoId);
  const [items, setItems] = useState<Enrollee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const load = useCallback(() => {
    if (!userHmoId) return;
    setLoading(true);
    setError(null);
    const hasDigit = /\d/.test(searchTerm);
    const params: Record<string, unknown> = {
      HMOId: userHmoId,
      PageNumber: pageIndex + 1, // Convert to 1-based for API
      PageSize: pageSize,
    };
    if (searchTerm) {
      if (hasDigit) params.EnrolleeNumber = searchTerm;
      else params.EnrolleeName = searchTerm;
    }
    getEnrollees(params)
      .then((res) => {
        setItems(res.data || []);
      })
      .catch((e) =>
        setError(e instanceof Error ? e.message : "Failed to load enrollees")
      )
      .finally(() => setLoading(false));
  }, [userHmoId, searchTerm, pageIndex, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  const doExport = async (isExcel: boolean) => {
    if (!selectedProviderId) return;
    setExporting(true);
    setExportError(null);
    try {
      const end = new Date();
      const start = new Date();
      start.setMonth(start.getMonth() - 1);
      const blob = await exportEnrolleesReport({
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        isExcel,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `enrollees.${isExcel ? "xlsx" : "csv"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      setExportError(e instanceof Error ? e.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleAddEnrollee = () => {
    navigate("/enrollee/registration/individual");
  };

  const handleViewEnrollee = (enrolleeId: string) => {
    navigate(`/enrollees/${enrolleeId}`);
  };

  const handleEditEnrollee = (enrolleeId: string) => {
    navigate(`/enrollees/${enrolleeId}/edit`);
  };

  // Map enrollees data for table
  const mappedEnrollees = useMemo(() => {
    return items.map((enrollee, index) => ({
      sn: index + 1,
      fullName: `${enrollee.firstName} ${enrollee.lastName}`.trim(),
      gender: enrollee.gender || '--',
      enrolleeClass: enrollee.enrolleeClass?.name || '--',
      enrolleeType: enrollee.enrolleeType?.name || '--',
      id: enrollee.id,
    }));
  }, [items]);

  // Define columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any>[] = [
    { accessorKey: 'sn', header: 'S/N' },
    { accessorKey: 'fullName', header: 'Enrollee Name' },
    { accessorKey: 'gender', header: 'Gender' },
    { accessorKey: 'enrolleeClass', header: 'Enrollee Class' },
    { accessorKey: 'enrolleeType', header: 'Enrollee Type' },
    {
      id: 'action',
      enableHiding: false,
      cell: ({ row }) => {
        if (!row.original.id) return null;
        return (
          <ActionMenu
            onView={() => handleViewEnrollee(row.original.id)}
            onEdit={() => handleEditEnrollee(row.original.id)}
          />
        );
      },
    },
  ];

  // Initialize table
  const table = useReactTable({
    data: mappedEnrollees,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: { pageIndex, pageSize },
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newState = updater(table.getState().pagination);
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      } else {
        setPageIndex(updater.pageIndex);
        setPageSize(updater.pageSize);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  // const totalPages = table.getPageCount();

  return (
    <div className="p-6">
      <div className="bg-gray-100 overflow-scroll h-full">
        <div className="bg-white rounded-md flex flex-col mb-36">
          {/* Header */}
          <div className="flex flex-wrap gap-4 justify-between items-center p-6">
            <div className="flex items-center gap-8">
              <FormHeader>All Enrollees</FormHeader>
              <input
                type="text"
                placeholder="Search enrollees"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  // Search will be handled by the API call in the load function
                }}
                className="border rounded-lg hidden lg:block px-4 py-2 lg:w-96 lg:max-w-2xl focus:outline-none"
              />
            </div>
            <div className="flex gap-4 items-center">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={exporting}
                onClick={() => doExport(false)}
              >
                {exporting ? "Exporting..." : "Export"}
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-green-800 text-white hover:bg-green-900"
                onClick={handleAddEnrollee}
              >
                + Add New Enrollee
              </Button>
            </div>
          </div>

          {exportError && (
            <div className="px-6">
              <div className="text-xs text-red-600 p-2 bg-red-50 rounded-md">
                {exportError}
              </div>
            </div>
          )}

          <div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-10">
                Failed to load enrollees: {error}
              </div>
            ) : items.length === 0 ? (
              <EmptyState
                icon={<span>👥</span>}
                title="No enrollees found"
                description="Adjust filters or add new enrollees."
              />
            ) : (
              <>
                {/* Table */}
                <div className="flex-1 lg:px-0 lg:mt-4">
                  <Table className="min-w-[600px]">
                    <TableHeader className="border-y border-[#CDE5F9]">
                      {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map(header => (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                            </TableHead>
                          ))}
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map(row => (
                          <TableRow key={row.id}>
                            {row.getVisibleCells().map(cell => (
                              <TableCell key={cell.id}>
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext(),
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
                            <div className="flex flex-col items-center gap-4">
                              <span className="font-medium">
                                No enrollees found
                              </span>
                              <span className="font-medium">
                                Try adjusting your search criteria
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                className="bg-green-800 text-white hover:bg-green-900"
                                onClick={handleAddEnrollee}
                              >
                                + Add New Enrollee
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="p-4 flex items-center justify-end">
                  <Pagination
                    totalEntriesSize={items.length} // Use original items length since API handles pagination
                    currentPage={pageIndex + 1}
                    totalPages={Math.ceil(items.length / pageSize)} // Estimate based on current page data
                    pageSize={pageSize}
                    onPageChange={p => setPageIndex(p - 1)}
                    onPageSizeChange={size => {
                      setPageSize(size);
                      setPageIndex(0);
                    }}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEnrollees;