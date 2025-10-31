import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import FormHeader from "../../components/form/FormHeader";
import ActionMenu from "../../components/ui/ActionMenu";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { fetchCorporateEntities } from "../../services/thunks/corporateThunk";
import type { AppDispatch, RootState } from "../../services/store/store";

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

const CorporateEnrollees: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { corporates, loading, error } = useSelector((state: RootState) => state.corporate);

  // Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchCorporateEntities());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchCorporateEntities());
  };

  const handleAddCorporate = () => {
    navigate("/enrollee/registration/corporate");
  };

  const handleViewCorporate = (corporateId: string) => {
    navigate(`/corporates/${corporateId}`);
  };

  const handleEditCorporate = (corporateId: string) => {
    navigate(`/corporates/edit/${corporateId}`);
  };

  // SAFE ARRAY HANDLING
   const corporatesArray = useMemo(() => 
    Array.isArray(corporates) ? corporates : [], 
    [corporates]
  );

  // Map corporate data for table
  const mappedCorporates = useMemo(() => {
    return corporatesArray.map((corporate, index) => ({
      sn: index + 1,
      companyName: corporate.companyName,
      corporateType: corporate.corporateType || '--',
      corporateCategory: corporate.corporateCatgory || '--',
      email: corporate.email || '--',
      id: corporate.id,
    }));
  }, [corporatesArray]);

  // Define columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any>[] = [
    { accessorKey: 'sn', header: 'S/N' },
    { accessorKey: 'companyName', header: 'Company Name' },
    { accessorKey: 'corporateType', header: 'Corporate Type' },
    { accessorKey: 'corporateCategory', header: 'Corporate Category' },
    { accessorKey: 'email', header: 'Email' },
    {
      id: 'action',
      enableHiding: false,
      cell: ({ row }) => {
        if (!row.original.id) return null;
        return (
          <ActionMenu
            key={row.original.id}
            onView={() => handleViewCorporate(row.original.id)}
            onEdit={() => handleEditCorporate(row.original.id)}
          />
        );
      },
    },
  ];

  // Initialize table
  const table = useReactTable({
    data: mappedCorporates,
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

  const totalPages = table.getPageCount();

  return (
    <div className="p-6">
      <div className="bg-gray-100 overflow-scroll h-full">
        <div className="bg-white rounded-md flex flex-col mb-36">
          {/* Header */}
          <div className="flex flex-wrap gap-4 justify-between items-center p-6">
            <div className="flex items-center gap-8">
              <FormHeader>Corporate Enrollees</FormHeader>
              <input
                type="text"
                placeholder="Search corporates"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  table.setColumnFilters([
                    {
                      id: 'companyName',
                      value: e.target.value,
                    },
                  ]);
                }}
                className="border rounded-lg hidden lg:block px-4 py-2 lg:w-96 lg:max-w-2xl focus:outline-none"
              />
            </div>
            <div className="flex gap-4 items-center">
              <Button 
                type="button"
                size="sm" 
                onClick={handleRefresh}
                variant="outline"
              >
                Refresh
              </Button>
              <Button
                type="button"
                size="sm"
                className="bg-green-800 text-white hover:bg-green-900"
                onClick={handleAddCorporate}
              >
                + Add Corporate
              </Button>
            </div>
          </div>

          <div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-10">
                Failed to load corporates: {error}
              </div>
            ) : corporatesArray.length === 0 ? (
              <EmptyState
                icon={<span>👥</span>}
                title="No corporates found"
                description="Try refreshing or add a new corporate enrollee."
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
                                No corporates found
                              </span>
                              <span className="font-medium">
                                Try adjusting your search criteria
                              </span>
                              <Button
                                type="button"
                                size="sm"
                                className="bg-green-800 text-white hover:bg-green-900"
                                onClick={handleAddCorporate}
                              >
                                + Add Corporate
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
                    totalEntriesSize={table.getFilteredRowModel().rows.length}
                    currentPage={pageIndex + 1}
                    totalPages={totalPages}
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

export default CorporateEnrollees;