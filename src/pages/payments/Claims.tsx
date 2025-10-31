import { useState, useEffect, useMemo } from "react";
import { useProviderContext } from "../../context/useProviderContext";
import { useSelector } from "react-redux";
import type { RootState } from "../../services/store/store";
import { fetchClaims, fetchClaimDetails } from "../../services/api/claimsApi";
import { formatDate, dateFormats } from "../../utils/dateFormatter"; 
import EmptyState from "../../components/ui/EmptyState";
import FormHeader from "../../components/form/FormHeader";
import type { ClaimItem } from "../../types/claims"; 
import NemsasDetailsModal from "../../components/ui/NemsasDetailsModal";
import { FaEye } from "react-icons/fa";

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
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

export const Claims = () => {
  type Claim = {
    id: string;
    name: string;
    enrolleeId: string;
    date: string;
    amount: string;
    status: string;
    enrolleeType?: string;
    healthProvider?: string;
  };

  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Table states
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [claimItems, setClaimItems] = useState<ClaimItem[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const { selectedProviderId } = useProviderContext();
  const hmoId = useSelector((s: RootState) => s.auth.user?.hmoId);

  // Load claims
  useEffect(() => {
    const loadClaims = async () => {
      setLoading(true);
      try {
        const resp = await fetchClaims({
          PageNumber: 1,
          PageSize: 500,
          ProviderId: selectedProviderId || undefined,
          HmoId: hmoId || undefined,
        });

        interface RawClaim {
          id?: unknown;
          claimId?: unknown;
          claimName?: unknown;
          enrolleeName?: unknown;
          patientEnrolleeNumber?: unknown;
          enrolleeId?: unknown;
          claimDate?: unknown;
          serviceDate?: unknown;
          amount?: unknown;
          claimStatus?: unknown;
          status?: unknown;
          enrolleeType?: unknown;
          healthProvider?: unknown;
          providerName?: unknown;
        }

        const toArray = (val: unknown): RawClaim[] => {
          if (Array.isArray(val)) return val as RawClaim[];
          if (
            typeof val === "object" &&
            val &&
            Array.isArray((val as { data?: unknown }).data)
          ) {
            return (val as { data: unknown[] }).data as RawClaim[];
          }
          return [];
        };

        const arr = toArray(resp);
        const mapped: Claim[] = arr.map((rc) => {
          const numAmount =
            typeof rc.amount === "number"
              ? rc.amount
              : typeof rc.amount === "string"
              ? Number(rc.amount)
              : NaN;
          return {
            id: String(rc.id ?? rc.claimId ?? ""),
            name: String(rc.claimName ?? rc.enrolleeName ?? ""),
            enrolleeId: String(rc.patientEnrolleeNumber ?? rc.enrolleeId ?? ""),
            date: String(rc.claimDate ?? rc.serviceDate ?? ""),
            amount: isFinite(numAmount)
              ? numAmount.toFixed(2)
              : typeof rc.amount === "string"
              ? rc.amount
              : "",
            status: String(rc.claimStatus ?? rc.status ?? ""),
            enrolleeType: String(rc.enrolleeType ?? "Individual"),
            healthProvider: String(rc.healthProvider ?? rc.providerName ?? "N/A"),
          };
        });
        setClaims(mapped.filter((c) => c.id));
        setError("");
      } catch {
        setError("Failed to fetch claims");
      } finally {
        setLoading(false);
      }
    };

    loadClaims();
  }, [selectedProviderId, hmoId]);

  // Map claims data for table
  const mappedClaims = useMemo(() => {
    return claims.map((claim, index) => ({
      sn: index + 1,
      enrolleeName: claim.name,
      enrolleeId: claim.enrolleeId,
      enrolleeType: claim.enrolleeType || "Individual",
      healthProvider: claim.healthProvider || "N/A",
      submittedDate: formatDate(claim.date, dateFormats.short),
      totalAmount: claim.amount,
      status: claim.status,
      id: claim.id,
      rawEnrolleeId: claim.enrolleeId, // For action handler
    }));
  }, [claims]);

  // Define columns
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<any>[] = [
    { accessorKey: 'sn', header: 'S/N' },
    { accessorKey: 'enrolleeName', header: 'Enrollee Name' },
    { accessorKey: 'enrolleeId', header: 'Enrollee ID' },
    { accessorKey: 'enrolleeType', header: 'Enrollee Type' },
    { accessorKey: 'healthProvider', header: 'Health Provider' },
    { accessorKey: 'submittedDate', header: 'Submitted Date' },
    { 
      accessorKey: 'totalAmount', 
      header: 'Total Amount',
      cell: ({ row }) => `₦${row.original.totalAmount}`
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const statusColor = {
          Approved: "#217346",
          Paid: "#6b6f80",
          Disputed: "#d32f2f",
        };
        return (
          <span
            style={{
              color: statusColor[row.original.status as keyof typeof statusColor],
              fontWeight: 600,
            }}
          >
            {row.original.status}
          </span>
        );
      },
    },
    {
      id: 'action',
      enableHiding: false,
      cell: ({ row }) => {
        if (!row.original.rawEnrolleeId) return null;
        return (
          <span
            style={{ cursor: "pointer", color: "#217346" }}
            title="View Details"
            onClick={() => handleViewClaim(row.original.rawEnrolleeId)}
          >
            <FaEye />
          </span>
        );
      },
    },
  ];

  // Initialize table
  const table = useReactTable({
    data: mappedClaims,
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

  // Handle view claim details
  const handleViewClaim = async (enrolleeId: string) => {
    setDetailsLoading(true);
    setShowDetailsModal(true);
    try {
      const details = await fetchClaimDetails(enrolleeId);
      setClaimItems(details.data || []);
      setDetailsError("");
    } catch {
      setClaimItems([]);
      setDetailsError("Failed to fetch claim details");
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-gray-100 overflow-scroll h-full">
        <div className="bg-white rounded-md flex flex-col mb-36">
          {/* Header */}
          <div className="flex flex-wrap gap-4 justify-between items-center p-6">
            <div className="flex items-center gap-8">
              <FormHeader>Submitted Claims</FormHeader>
              <input
                type="text"
                placeholder="Search claims"
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value);
                  table.setColumnFilters([
                    {
                      id: 'enrolleeName',
                      value: e.target.value,
                    },
                  ]);
                }}
                className="border rounded-lg hidden lg:block px-4 py-2 lg:w-96 lg:max-w-2xl focus:outline-none"
              />
            </div>
          </div>

          <div>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-10">
                Failed to load claims: {error}
              </div>
            ) : claims.length === 0 ? (
              <EmptyState
                icon={<span>📄</span>}
                title="No claims available yet"
                description="Start submitting claims to track and manage them here."
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
                                No claims found
                              </span>
                              <span className="font-medium">
                                Try adjusting your search criteria
                              </span>
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

      {/* Details Modal */}
      <NemsasDetailsModal
        open={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setClaimItems([]);
        }}
        claimItems={claimItems}
        loading={detailsLoading}
        error={detailsError}
      />
    </div>
  );
};