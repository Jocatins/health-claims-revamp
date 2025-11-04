// new claims page, for demo

import { useState, useEffect, useCallback } from "react";
import { formatDate, dateFormats } from "../../utils/dateFormatter"; 
import EmptyState from "../../components/ui/EmptyState";
import Table from "../../components/ui/Table";
import { FaEye, FaDatabase, FaSync } from "react-icons/fa";
import FormHeader from "../../components/form/FormHeader";
import type { ClaimItem } from "../../types/claims"; 
import DemoDetailsModal from "../../components/ui/DemoDetailsModal";
import { getClaimsFromLocalStorage } from "../../utils/localStorageUtils";

export const Claims = () => {
  type Claim = {
    id: string;
    name: string;
    date: string;
    amount: string;
    status: string;
    enrolleeType?: string;
    healthProvider?: string;
    phoneNumber: string;
    submittedAt: string;
  };

  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [claimItems, setClaimItems] = useState<ClaimItem[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [selectedPatientInfo, setSelectedPatientInfo] = useState<{patientName: string; phoneNumber: string}>({
    patientName: "",
    phoneNumber: ""
  });

  // Load claims from local storage
  const loadLocalClaims = useCallback(() => {
    setLoading(true);
    setError("");
    
    try {
      const storedClaims = getClaimsFromLocalStorage();
      console.log('Loaded local claims:', storedClaims); // Debug log
      
      const mapped: Claim[] = storedClaims.map((lc) => {
        const totalAmount = lc.items.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        
        return {
          id: lc.id,
          name: lc.patientName,
          date: lc.serviceDate,
          amount: totalAmount.toFixed(2),
          status: lc.status.charAt(0).toUpperCase() + lc.status.slice(1), // Capitalize status
          enrolleeType: "Individual",
          healthProvider: "Local Provider",
          phoneNumber: lc.phoneNumber,
          submittedAt: lc.submittedAt
        };
      });
      
      setClaims(mapped);
      console.log('Mapped claims:', mapped); // Debug log
    } catch (error) {
      console.error("Error loading local claims:", error);
      setError("Failed to load local claims");
    } finally {
      setLoading(false);
    }
  }, []);


const handleViewClaim = async (claimId: string) => {
  setDetailsLoading(true);
  setShowDetailsModal(true);
  
  try {
    // Get local storage claim details
    const storedClaims = getClaimsFromLocalStorage();
    const localClaim = storedClaims.find(lc => lc.id === claimId);
    
    if (localClaim) {
      // Store patient information for the modal
      setSelectedPatientInfo({
        patientName: localClaim.patientName,
        phoneNumber: localClaim.phoneNumber
      });

      // Convert local claim items - use type assertion to bypass TS errors for demo
      const convertedItems = localClaim.items.map((item, index) => ({
        id: `${localClaim.id}-${index}`,
        serviceRendered: item.name,
        amount: Number(item.amount),
        approvalCode: item.approvalCode,
        serviceDate: localClaim.serviceDate,
        quantity: 1,
        price: Number(item.amount),
        discount: 0,
        diagnosis: "",
        referralHospital: "",
        nhisno: "",
        attachments: [],
        claimStatus: 0,
        // Add all the missing required properties
        isActive: true,
        enrolleeName: localClaim.patientName,
        patientEnrolleeNumber: "", 
        providerId: localClaim.providerId,
        hmoId: localClaim.hmoId,
        enrolleeEmail: "",
        enrolleePhoneNumber: localClaim.phoneNumber,
        claimType: localClaim.serviceType,
        planTypeName: "",
        createdDate: localClaim.submittedAt,
        modifiedDate: localClaim.submittedAt,
        // Add the missing properties from the error
        planTypeId: "", // Add empty string
        providerName: "Local Provider", // Add default value
      }));
      
      // Use type assertion to bypass TypeScript errors for demo
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setClaimItems(convertedItems as any);
    } else {
      setDetailsError("Claim not found in local storage");
    }
    setDetailsError("");
  } catch {
    setClaimItems([]);
    setDetailsError("Failed to fetch claim details");
  } finally {
    setDetailsLoading(false);
  }
};

  // Handle modal close
  const handleCloseModal = () => {
    setShowDetailsModal(false);
    setClaimItems([]);
    setSelectedPatientInfo({
      patientName: "",
      phoneNumber: ""
    });
  };

  // Export claims as JSON
  const handleExportClaims = () => {
    try {
      const storedClaims = getClaimsFromLocalStorage();
      const dataStr = JSON.stringify(storedClaims, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `local-claims-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting claims:", error);
      setError("Failed to export claims");
    }
  };

  useEffect(() => {
    loadLocalClaims();
  }, [loadLocalClaims]);

  const statusColor = {
    Approved: "#217346",
    Paid: "#6b6f80",
    Disputed: "#d32f2f",
    Pending: "#ff9800",
    Processed: "#2196f3",
    Rejected: "#d32f2f",
  };

  return (
    <div style={{ padding: "32px" }}>
      {loading ? (
        <div style={{ textAlign: "center", padding: 48 }}>
          Loading local claims...
        </div>
      ) : error ? (
        <div style={{ textAlign: "center", color: "red", padding: 48 }}>
          {error}
        </div>
      ) : claims.length === 0 ? (
        <EmptyState
          icon={<span style={{ fontSize: 32 }}>📄</span>}
          title="No local claims available yet"
          description="Submit claims using the emergency claim form to see them here. All claims are stored locally in your browser."
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
            <FormHeader>Claims ({claims.length})</FormHeader>
            
            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={loadLocalClaims}
                style={{
                  padding: "8px 12px",
                  borderRadius: 4,
                  border: "1px solid #ccc",
                  background: "#f5f5f5",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FaSync /> Refresh
              </button>

              <button
                onClick={handleExportClaims}
                style={{
                  padding: "8px 12px",
                  borderRadius: 4,
                  border: "1px solid #217346",
                  background: "#e8f5e8",
                  color: "#217346",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <FaDatabase /> Export File
              </button>
            </div>
          </div>

          <Table
            headers={[
              <div key="select-all" onClick={(e) => e.stopPropagation()}>
                {/* Empty header cell */}
              </div>,
              "Patient Name",
              "Phone Number",
              "Service Date",
              "Total Amount",
              "Status",
              "Submitted",
              // "Action",
            ]}
            rows={claims.map((claim) => {
              return [
                <div key={claim.id} onClick={(e) => e.stopPropagation()}>
                  {/* Empty cell */}
                </div>,
                claim.name,
                claim.phoneNumber,
                formatDate(claim.date, dateFormats.short),
                `₦${claim.amount}`,
                <span
                  key={`status-${claim.id}`}
                  style={{
                    color: statusColor[claim.status as keyof typeof statusColor] || '#6b6f80',
                    fontWeight: 600,
                  }}
                >
                  {claim.status}
                </span>,
                formatDate(claim.submittedAt, dateFormats.short),
                <span
                  key={`action-${claim.id}`}
                  style={{ cursor: "pointer", color: "#217346" }}
                  title="View Details"
                  onClick={() => handleViewClaim(claim.id)}
                >
                  <FaEye />
                </span>,
              ];
            })}
          />
          
          <DemoDetailsModal
            open={showDetailsModal}
            onClose={handleCloseModal}
            claimItems={claimItems}
            loading={detailsLoading}
            error={detailsError}
            patientName={selectedPatientInfo.patientName}
            phoneNumber={selectedPatientInfo.phoneNumber}
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
              Showing all {claims.length} local claims
            </span>
          </div>
        </div>
      )}
    </div>
  );
};