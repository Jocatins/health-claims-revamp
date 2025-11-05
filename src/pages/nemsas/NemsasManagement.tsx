import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../services/store/store";
import EmptyState from "../../components/ui/EmptyState";
import Table from "../../components/ui/Table";
import NemsasClaimDetailsModal from "../../components/ui/NemsasClaimDetailsModal";
import NemsasModal from "../../components/ui/NemsasModal";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import BatchUploadModal from "../../components/ui/BatchUploadModal";
import {
  exportNemsasClaimsReport as exportNemsasClaimsReportApi,
} from "../../services/api/nemsasApi";
import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { fetchNemsasClaims, fetchNemsasClaimsByPatient } from "../../services/thunks/nemsasThunk";
import { clearError } from "../../services/slices/nemsasSlice";
import { useProviderContext } from "../../context/useProviderContext";

// Helper: backend now returns textual claimStatus; keep numeric fallback for legacy responses
const legacyStatusCodeMap: Record<number,string> = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Paid',
  4: 'Disputed'
};
const getClaimStatusText = (status: number | string | undefined): string => {
  if (status === undefined || status === null) return 'Pending';
  if (typeof status === 'number') return legacyStatusCodeMap[status] || 'Pending';
  return status.trim() || 'Pending';
};

export const NemsasManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNemsasClaimModal, setShowNemsasClaimModal] = useState(false);
  const [showBatchUploadModal, setShowBatchUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClaimId, setSelectedClaimId] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [claimStatus, setClaimStatus] = useState<string>("");
  const [patientNumberFilter, setPatientNumberFilter] = useState<string>("");
  const NEMSAS_ID = "2e4c6fa4-6ac3-43bb-b78f-326dccac110c";

  const {
    claims: reduxClaims,
    loading,
    error,
  } = useAppSelector((state) => state.nemsas);
  const dispatch = useAppDispatch();

  // Get user data from Redux auth state
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Debug: Check what's in Redux
  console.log("🔍 Redux Claims:", {
    reduxClaims,
    count: reduxClaims?.length,
    loading,
    error,
  });

  // Debug: Check user data
  const { selectedProviderId } = useProviderContext(); // still available for other areas but not used for fetch

  console.log("👤 Current User & Provider Selection:", {
    currentUser,
    selectedProviderId,
    hasSelectedProvider: !!selectedProviderId,
  });

  // Map Redux claims to table format
  type TableClaim = {
    id: string;
    name: string;
    patientNumber: string;
    serviceType: string;
    date: string;
    amount: string;
    status: string;
  };

  // Add this currency formatting function
  const formatCurrency = (amount: number | undefined): string => {
    if (amount === undefined || amount === null) return "0.00";
    return amount.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  };

  // Adapt mapping to new NEMSAS response schema (claimName, patientName, patientNumber, claimItems[])
  // Lightweight type to represent the NEMSAS claim shape we actually receive
  interface NemsasClaimItem { id: string; amount: number; status?: number | string; claimStatus?: number | string; }
  interface NemsasClaimRaw {
    id: string;
    claimName?: string;
    patientName?: string;
    patientNumber?: string;
    patientEnrolleeNumber?: string;
    serviceDate?: string;
    amount?: number;
    claimStatus?: number | string;
    claimItems?: NemsasClaimItem[];
    serviceType?: string;
  }

  const tableClaims: TableClaim[] = (reduxClaims || []).map((claim: NemsasClaimRaw) => {
    // Derive total amount from claimItems if top-level amount missing
    const totalAmount = Array.isArray(claim.claimItems)
      ? claim.claimItems.reduce((sum: number, item: NemsasClaimItem) => sum + (item?.amount || 0), 0)
      : (claim.amount || 0);

    // Derive status: backend now provides textual claimStatus; still fallback to legacy numeric if present
    const rawStatus: string | number | undefined = Array.isArray(claim.claimItems) && claim.claimItems.length > 0
      ? (claim.claimItems[0].claimStatus ?? claim.claimItems[0].status)
      : claim.claimStatus;

    return {
      id: claim.id || 'N/A',
      name: claim.claimName || claim.patientName || 'N/A',
      patientNumber: claim.patientNumber || claim.patientEnrolleeNumber || 'N/A',
  serviceType: claim.serviceType || 'N/A',
      date: claim.serviceDate ? new Date(claim.serviceDate).toLocaleDateString() : 'N/A',
      amount: `₦${formatCurrency(totalAmount)}`,
  status: getClaimStatusText(rawStatus),
    };
  });

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");

  // General claims fetch (ignores patientNumberFilter)
  const loadClaims = useCallback(() => {
    console.log(" loadClaims called");

    const providerIdToUse = currentUser?.providerId; // use logged in user's providerId per requirement

    console.log("📋 Using logged-in user's providerId:", {
      providerIdToUse,
      selectedProviderIdFallback: selectedProviderId
    });

    if (!providerIdToUse) {
      console.error("❌ No providerId on current user (login response missing providerId)");
      return;
    }

    dispatch(
      fetchNemsasClaims({
        ProviderId: providerIdToUse,
        NEMSASId: NEMSAS_ID,
        StartDate: startDate ? new Date(startDate).toISOString() : undefined,
        EndDate: endDate ? new Date(endDate).toISOString() : undefined,
        ClaimStatus: claimStatus || undefined,
        PageNumber: 1,
        PageSize: 500,
        SortBy: "createdDate",
      })
    );
  }, [dispatch, currentUser?.providerId, startDate, endDate, claimStatus, selectedProviderId]);

  // Patient-specific search triggered only by button
  const searchByPatient = useCallback(() => {
    const providerIdToUse = currentUser?.providerId;
    if (!providerIdToUse || !patientNumberFilter.trim()) return;
    console.log('🔍 Patient search triggered (logged-in providerId):', { providerIdToUse, patientNumber: patientNumberFilter.trim() });
    dispatch(
      fetchNemsasClaimsByPatient({
        patientNumber: patientNumberFilter.trim(),
        ProviderId: providerIdToUse,
      })
    );
  }, [dispatch, currentUser?.providerId, patientNumberFilter]);

  // Load claims when component mounts AND when currentUser is available
  useEffect(() => {
    console.log("🔄 Component mounted, checking user state");

    if (currentUser) {
      console.log("✅ User data available, loading claims");
      loadClaims();
    } else {
      console.log("⏳ Waiting for user data...");
    }
  }, [loadClaims, currentUser]);

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Status color map
  const statusColor: Record<string,string> = {
    Pending: '#ff9800',
    Processed: '#1976d2',
    Rejected: '#d32f2f',
    Resolved: '#2e7d32',
    Approved: '#217346',
    Paid: '#6b6f80'
  };

  // Show loading while waiting for user data
  if (!currentUser) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        Loading user data...
      </div>
    );
  }

  if (!currentUser?.providerId) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        No providerId found on logged in user. Please re-login or contact support.
      </div>
    );
  }

  return (
    <div style={{ padding: "32px" }}>
      {loading ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          Loading claims...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "red", padding: 48 }}>
          <div>{error}</div>
          <Button
            onClick={loadClaims}
          >
            Retry Loading Claims
          </Button>
        </div>
      ) : tableClaims.length === 0 ? (
        <EmptyState
          icon={<span style={{ fontSize: 32 }}>📄</span>}
          title="No claims available yet"
          description={
            <div>
              <p>No claims found for your provider.</p>
            </div>
          }
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              + Create new claim
            </Button>
          }
        />
      ) : (
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            padding: 24,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          }}
        >
          <div className="w-full flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setShowExportModal(true)}
            >
              Export
            </Button>
            <Button onClick={() => setShowCreateModal(true)}>
              Create new claim
            </Button>
          </div>
          <div className="my-10 flex flex-wrap gap-2 items-end">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#555]">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}                
                className="p-2 border border-[#ccc] rounded-sm"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#555]">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border border-[#ccc] rounded-sm"
              />
            </div>
            {/* <div className="flex flex-col gap-1">
              <label className="text-sm text-[#555]">Status</label>
              <select
                value={claimStatus}
                onChange={(e) => setClaimStatus(e.target.value)}
                className="p-2 border border-[#ccc] rounded-sm"
              >
                <option value="">All</option>
                {['Pending','Processed','Rejected','Resolved','Approved','Paid'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div> */}
            <div className="col-span-2 flex flex-col gap-1">
              <label style={{ fontSize: 12, color: '#555' }}>Patient Number</label>
              <div className="flex gap-1">
                <input
                  type="text"
                  value={patientNumberFilter}
                  onChange={(e) => setPatientNumberFilter(e.target.value)}
                  placeholder="e.g. 000001"
                  style={{ padding: 6, border: '1px solid #ccc', borderRadius: 4, minWidth: 140 }}
                />
                <Button
                  variant="outline"
                  onClick={searchByPatient}
                  disabled={!patientNumberFilter.trim()}
                >
                  Search
                </Button>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="outline" onClick={() => loadClaims()}>Apply</Button>
              <Button variant="outline" onClick={() => {setStartDate(""); setEndDate(""); setClaimStatus(""); setPatientNumberFilter("");}}>Reset</Button>
            </div>
          </div>

          <Table
            headers={[
              'S/N',
              'Patient name',
              'Patient number',
              'Service type',
              'Service date',
              'Total amount',
              'Status',
              'Action',
            ]}
            rows={tableClaims.map((claim, index) => [
              (index + 1).toString(),
              claim.name,
              claim.patientNumber,
              claim.serviceType,
              claim.date,
              claim.amount,
              <span
                key={`status-${claim.id}`}
                style={{
                  color:
                    statusColor[claim.status as keyof typeof statusColor] || '#000',
                  fontWeight: 600,
                }}
              >
                {claim.status}
              </span>,
              <Button
                key={`view-${claim.id}`}
                variant="outline"
                size="sm"
                className="h-auto py-1 px-2 text-xs"
                onClick={() => {
                  setSelectedClaimId(claim.id);
                  setShowDetailsModal(true);
                }}
              >
                View
              </Button>
            ])}
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 16,
              fontSize: 14,
              color: "#6b6f80",
            }}
          >
            <span>
              Showing 1-{tableClaims.length} of {tableClaims.length}
            </span>
            <span>
              Page 1 of 1 &nbsp; {"<"} {">"}
            </span>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="How would you like to submit your claims?"
        width="400px"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Button
            variant="outline"
            onClick={() => {
              setShowNemsasClaimModal(true);
              setShowCreateModal(false);
            }}
          >
            Single claim
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setShowBatchUploadModal(true);
              setShowCreateModal(false);
            }}
          >
            Batch upload
          </Button>
          <Button variant="outline">Generate from HMIS</Button>
        </div>
      </Modal>

      <NemsasModal
        open={showNemsasClaimModal}
        onClose={() => setShowNemsasClaimModal(false)}
        onSubmitted={() => {
          loadClaims();
        }}
      />

      <BatchUploadModal
        open={showBatchUploadModal}
        onClose={() => setShowBatchUploadModal(false)}
      />

      <NemsasClaimDetailsModal
        open={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedClaimId(null); }}
        claimId={selectedClaimId}
      />

      <Modal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Claims"
        width="350px"
      >
        <div className="flex flex-col gap-4">
          <Button
            onClick={async () => {
              setExportLoading(true);
              setExportError("");
              try {
                const blob = await exportClaimsReport({ IsExcel: false });
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "claims.csv");
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                setShowExportModal(false);
              } catch {
                setExportError("Failed to export CSV");
              }
              setExportLoading(false);
            }}
            disabled={exportLoading}
          >
            Export as CSV
          </Button>
          <Button
            onClick={async () => {
              setExportLoading(true);
              setExportError("");
              try {
                const blob = await exportClaimsReport({ IsExcel: true });
                const url = window.URL.createObjectURL(new Blob([blob]));
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", "claims.xlsx");
                document.body.appendChild(link);
                link.click();
                link.parentNode?.removeChild(link);
                setShowExportModal(false);
              } catch {
                setExportError("Failed to export Excel");
              }
              setExportLoading(false);
            }}
            disabled={exportLoading}
          >
            Export as Excel
          </Button>
          {exportLoading && (
            <div className="text-center p-2">Exporting...</div>
          )}
          {exportError && (
            <div className="text-center p-2 text-red-500">
              {exportError}
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

// Move this outside the component
async function exportClaimsReport(arg0: { IsExcel: boolean }) {
  const response = await exportNemsasClaimsReportApi(arg0);
  return response;
}