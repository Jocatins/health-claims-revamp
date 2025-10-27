import { useState, useEffect, useCallback } from "react";

import { useSelector } from "react-redux";
import type { RootState } from "../../services/store/store";

import EmptyState from "../../components/ui/EmptyState";
import Table from "../../components/ui/Table";

import { FaEye } from "react-icons/fa";
import NemsasClaimModal from "../../components/ui/NemsasClaimModal";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import BatchUploadModal from "../../components/ui/BatchUploadModal";
import {
  exportClaimsReport as exportClaimsReportApi,
  fetchClaimDetails,
} from "../../services/api/claimsApi";

import { useAppSelector, useAppDispatch } from "../../hooks/redux";
import { fetchClaims } from "../../services/thunks/claimsThunk";
import { clearError } from "../../services/slices/claimSlice";
import NemsasDetailsModal from "../../components/ui/NemsasDetailsModal";
import type { ClaimItem } from "../../types/claims";

// Move the helper function to the top
const getClaimStatusText = (status: number | string): string => {
  const statusNum = typeof status === "string" ? parseInt(status, 10) : status;

  const statusMap: { [key: number]: string } = {
    0: "Pending",
    1: "Approved",
    2: "Rejected",
    3: "Paid",
    4: "Disputed",
  };
  return statusMap[statusNum] || "Unknown";
};

export const NemsasManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNemsasClaimModal, setShowNemsasClaimModal] = useState(false);
  const [showBatchUploadModal, setShowBatchUploadModal] = useState(false);

  const {
    claims: reduxClaims,
    loading,
    error,
  } = useAppSelector((state) => state.claims);
  const dispatch = useAppDispatch();

  // Get user data from Redux auth state - similar to Flutter's currentUser
  const currentUser = useSelector((state: RootState) => state.auth.user);

  // Debug: Check what's in Redux
  console.log("🔍 Redux Claims:", {
    reduxClaims,
    count: reduxClaims?.length,
    loading,
    error,
  });

  // Debug: Check user data
  console.log("👤 Current User:", {
    currentUser,
    providerId: currentUser?.providerId,
    hmoId: currentUser?.hmoId,
    hasProviderId: !!currentUser?.providerId,
    hasHmoId: !!currentUser?.hmoId,
  });

  // Map Redux claims to table format
  type TableClaim = {
    id: string;
    name: string;
    enrolleeId: string;
    date: string;
    amount: string;
    status: string;
  };

  const tableClaims: TableClaim[] = (reduxClaims || []).map((claim) => ({
    id: claim.id || "N/A",
    name: claim.enrolleeName || "N/A",
    enrolleeId: claim.patientEnrolleeNumber || "N/A",
    date: claim.serviceDate
      ? new Date(claim.serviceDate).toLocaleDateString()
      : "N/A",
    amount: `$${claim.amount?.toFixed(2) || "0.00"}`,
    status: getClaimStatusText(claim.claimStatus),
  }));

  // Modal state for claim details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
 
  const [selectedClaim, setSelectedClaim] = useState<ClaimItem[] | null>(null);
  // const [selectedClaimItems, setSelectedClaimItems] = useState<ClaimItem[] | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [exportError, setExportError] = useState("");

  // const { selectedProviderId } = useProviderContext();


  const loadClaims = useCallback(() => {
    console.log(" loadClaims called");

    const providerIdToUse = currentUser?.providerId;
    const hmoIdToUse = currentUser?.hmoId;

    console.log("📋 Using IDs from user state:", {
      providerIdToUse,
      hmoIdToUse,
    });

    if (!providerIdToUse) {
      console.error("❌ No ProviderId available from user state");
      return;
    }

    if (!hmoIdToUse) {
      console.error("❌ No HmoId available from user state");
      return;
    }

    // Pass the required parameters to fetchClaims from user state
    dispatch(
      fetchClaims({
        ProviderId: providerIdToUse,
        HmoId: hmoIdToUse,
        PageNumber: 1,
        PageSize: 500,
        SortBy: "createdDate",
      })
    );
  }, [dispatch, currentUser]); // Add currentUser to dependencies

  // Load claims when component mounts AND when currentUser is available
  useEffect(() => {
    console.log("🔄 Component mounted, checking user state");

    if (currentUser) {
      console.log("✅ User data available, loading claims");
      loadClaims();
    } else {
      console.log("⏳ Waiting for user data...");
    }
  }, [loadClaims, currentUser]); // Add currentUser to dependencies

  // Clear errors on unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Status color map
  const statusColor = {
    Approved: "#217346",
    Paid: "#6b6f80",
    Disputed: "#d32f2f",
    Pending: "#ff9800",
    Rejected: "#d32f2f",
    Unknown: "#6b6f80",
  };

  // Show loading while waiting for user data
  if (!currentUser) {
    return (
      <div style={{ padding: "32px", textAlign: "center" }}>
        Loading user data...
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
            // style={{ marginTop: 16 }}
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
              <p>
                <strong>ProviderId:</strong> {currentUser.providerId}
              </p>
              <p>
                <strong>HmoId:</strong> {currentUser.hmoId}
              </p>
              <p style={{ marginTop: "8px" }}>
                This means no claims exist in the database for these IDs.
              </p>
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              <Button variant="outline">Filter</Button>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                variant="outline"
                onClick={() => setShowExportModal(true)}
              >
                Export
              </Button>
              <Button onClick={() => setShowCreateModal(true)}>
                + Create new claim
              </Button>
            </div>
          </div>

          <Table
            headers={[
              "S/N",
              "Enrollee name",
              "Enrollee Id",
              "Submitted date",
              "Total amount",
              "Status",
              "Action",
            ]}
            rows={tableClaims.map((claim, index) => [
              (index + 1).toString(),
              claim.name,
              claim.enrolleeId,
              claim.date,
              claim.amount,
              <span
                key={`status-${claim.id}`}
                style={{
                  color:
                    statusColor[claim.status as keyof typeof statusColor] ||
                    "#000",
                  fontWeight: 600,
                }}
              >
                {claim.status}
              </span>,
              <span
                key={`action-${claim.id}`}
                style={{ cursor: "pointer", color: "#217346" }}
                title="View"
                onClick={async () => {
                  setDetailsLoading(true);
                  setShowDetailsModal(true);
                  try {
                    const details = await fetchClaimDetails(claim.id);
                    setSelectedClaim(details);
                    setDetailsError("");
                  } catch {
                    setSelectedClaim(null);
                    setDetailsError("Failed to fetch claim details");
                  }
                  setDetailsLoading(false);
                }}
              >
                <FaEye />
              </span>,
            ])}
          />

          <NemsasDetailsModal
            open={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            claimItems={selectedClaim || []} // ✅ Correct - passing the actual data
            loading={detailsLoading}
            error={detailsError}
          />

          {detailsLoading && (
            <div style={{ textAlign: "center", padding: 24 }}>
              Loading claim details...
            </div>
          )}
          {detailsError && (
            <div style={{ textAlign: "center", color: "red", padding: 24 }}>
              {detailsError}
            </div>
          )}

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

      {/* Rest of your modals remain the same */}
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

      <NemsasClaimModal
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

      <Modal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        title="Export Claims"
        width="350px"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
            <div style={{ textAlign: "center", padding: 8 }}>Exporting...</div>
          )}
          {exportError && (
            <div style={{ color: "red", textAlign: "center", padding: 8 }}>
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
  const response = await exportClaimsReportApi(arg0);
  return response;
}
