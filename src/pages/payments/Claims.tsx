import { useState, useEffect, useCallback } from "react";
import { useProviderContext } from "../../context/useProviderContext";
import { useSelector } from "react-redux";
import type { RootState } from "../../services/store/store";
import { fetchClaims, fetchClaimDetails } from "../../services/api/claimsApi";
import { formatDate, dateFormats } from "../../utils/dateFormatter"; 
import EmptyState from "../../components/ui/EmptyState";
import Table from "../../components/ui/Table";
import ClaimDetailsModal from "../../components/ui/ClaimDetailsModal";
import { FaEye } from "react-icons/fa";
import FormHeader from "../../components/form/FormHeader";
import type { ClaimItem } from "../../types/claims"; 

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
  const [selectedClaims, setSelectedClaims] = useState<Set<string>>(new Set());

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  
  const [claimItems, setClaimItems] = useState<ClaimItem[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");

  const { selectedProviderId } = useProviderContext();
  const hmoId = useSelector((s: RootState) => s.auth.user?.hmoId);

  const loadClaims = useCallback(() => {
    setLoading(true);
    fetchClaims({
      PageNumber: 1,
      PageSize: 500,
      ProviderId: selectedProviderId || undefined,
      HmoId: hmoId || undefined,
    })
      .then((resp: unknown) => {
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
      })
      .catch(() => {
        setError("Failed to fetch claims");
      })
      .finally(() => setLoading(false));
  }, [selectedProviderId, hmoId]);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  // Handle individual checkbox selection
  const handleCheckboxChange = (claimId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation(); 
    
    setSelectedClaims(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(claimId)) {
        newSelected.delete(claimId);
      } else {
        newSelected.add(claimId);
      }
      return newSelected;
    });
  };

  // Handle select all checkbox
  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation(); // Prevent event bubbling
    
    if (selectedClaims.size === claims.length) {
      // If all are selected, deselect all
      setSelectedClaims(new Set());
    } else {
      // Select all claims
      const allClaimIds = new Set(claims.map(claim => claim.id));
      setSelectedClaims(allClaimIds);
    }
  };

  // Handle view claim details
  const handleViewClaim = async (enrolleeId: string) => {
    setDetailsLoading(true);
    setShowDetailsModal(true);
    try {
      const details = await fetchClaimDetails(enrolleeId);
      setClaimItems(details.data || []); // Use details.data based on your API response
      setDetailsError("");
    } catch {
      setClaimItems([]);
      setDetailsError("Failed to fetch claim details");
    } finally {
      setDetailsLoading(false);
    }
  };

  const statusColor = {
    Approved: "#217346",
    Paid: "#6b6f80",
    Disputed: "#d32f2f",
  };

  // Checkbox component for individual rows
  const Checkbox = ({ 
    checked, 
    onChange 
  }: { 
    checked: boolean; 
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void 
  }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()} // Additional click protection
      style={{
        cursor: "pointer",
        width: "16px",
        height: "16px",
      }}
    />
  );

  // Select all checkbox component
  const SelectAllCheckbox = () => (
    <input
      type="checkbox"
      checked={claims.length > 0 && selectedClaims.size === claims.length}
      onChange={handleSelectAll}
      onClick={(e) => e.stopPropagation()} // Additional click protection
      style={{
        cursor: "pointer",
        width: "16px",
        height: "16px",
      }}
    />
  );

  return (
    <div style={{ padding: "32px" }}>
      {loading ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          Loading claims...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "red", padding: 48 }}>
          {error}
        </div>
      ) : claims.length === 0 ? (
        <EmptyState
          icon={<span style={{ fontSize: 32 }}>📄</span>}
          title="No claims available yet"
          description="Start submitting claims to track and manage them here."
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
            <FormHeader>Submitted Claims</FormHeader>
            {selectedClaims.size > 0 && (
              <div style={{ color: "#6b6f80", fontSize: "14px" }}>
                {selectedClaims.size} claim(s) selected
              </div>
            )}
          </div>
          <Table
            headers={[
              <div key="select-all" onClick={(e) => e.stopPropagation()}>
                <SelectAllCheckbox />
              </div>,
              // "Claim Id",
              "Enrollee name",
              "Enrollee Id",
              "Enrollee Type", 
              "Health Provider", 
              "Submitted date",
              "Total amount",
              "Status",
              "Action",
            ]}
            rows={claims.map((claim) => [
              <div key={`checkbox-${claim.id}`} onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  checked={selectedClaims.has(claim.id)}
                  onChange={(e) => handleCheckboxChange(claim.id, e)}
                />
              </div>,
              // claim.id.substring(0, 8).toUpperCase(),
              claim.name,
              claim.enrolleeId,
              claim.enrolleeType || "Individual",
              claim.healthProvider || "N/A",
              formatDate(claim.date, dateFormats.short),
              claim.amount,
              <span
                key={`status-${claim.id}`}
                style={{
                  color: statusColor[claim.status as keyof typeof statusColor],
                  fontWeight: 600,
                }}
              >
                {claim.status}
              </span>,
              <span
                key={`action-${claim.id}`}
                style={{ cursor: "pointer", color: "#217346" }}
                title="View"
                onClick={() => handleViewClaim(claim.enrolleeId)}
              >
                <FaEye />
              </span>,
            ])}
          />
          
          <ClaimDetailsModal
            open={showDetailsModal}
            onClose={() => {
              setShowDetailsModal(false);
              setClaimItems([]); 
            }}
            claimItems={claimItems}
            loading={detailsLoading}
            error={detailsError}
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
            <span>Showing 1-20</span>
            <span>
              Page 1 of 20 &nbsp; {"<"} {">"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};