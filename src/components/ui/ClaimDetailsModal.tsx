import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import Table from "./Table";
import type { ClaimItem } from "../../types/claims";
import { formatDate, dateFormats } from "../../utils/dateFormatter";

interface ClaimDetailsModalProps {
  open: boolean;
  onClose: () => void;
  claimItems: ClaimItem[];
  loading: boolean;
  error: string | null;
}

const statusColor = {
  Pending: "#6b6f80",
  Approved: "#217346",
  Paid: "#217346",
  Disputed: "#d32f2f",
};

// Helper function to map claim status number to text
const getStatusText = (status: number): string => {
  switch (status) {
    case 0: return "Pending";
    case 1: return "Approved";
    case 2: return "Paid";
    case 3: return "Disputed";
    default: return "Unknown";
  }
};

const ClaimDetailsModal: React.FC<ClaimDetailsModalProps> = ({
  open,
  onClose,
  claimItems,
  loading,
  error,
}) => {
  // Handle loading state
  if (loading) {
    return (
      <Modal open={open} onClose={onClose} title="Claims Details" width="600px">
        <div style={{ textAlign: "center", padding: "48px" }}>
          Loading claim details...
        </div>
      </Modal>
    );
  }

  // Handle error state
  if (error) {
    return (
      <Modal open={open} onClose={onClose} title="Claims Details" width="600px">
        <div style={{ textAlign: "center", color: "red", padding: "48px" }}>
          {error}
        </div>
      </Modal>
    );
  }

  // Handle empty claim items
  if (!claimItems || claimItems.length === 0) {
    return (
      <Modal open={open} onClose={onClose} title="Claims Details" width="600px">
        <div style={{ textAlign: "center", padding: "48px" }}>
          No claim details found.
        </div>
      </Modal>
    );
  }

  // Use the first claim item for enrollee information (they should all be for the same enrollee)
  const firstClaim = claimItems[0];

  // Calculate total amount
  const totalAmount = claimItems.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Modal open={open} onClose={onClose} title="Claims Details" width="800px">
      <div style={{ padding: "8px 0 0 0" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <div>
            <span style={{ fontWeight: 600, fontSize: 18 }}>Enrollee Number</span>
            <span style={{ marginLeft: 8, fontWeight: 500, color: "#6b6f80" }}>
              {firstClaim.patientEnrolleeNumber || "N/A"}
            </span>
            <span
              style={{
                marginLeft: 16,
                background: "#e6f4ea",
                color: statusColor[getStatusText(firstClaim.claimStatus) as keyof typeof statusColor] || "#6b6f80",
                borderRadius: 8,
                padding: "2px 12px",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {getStatusText(firstClaim.claimStatus)}
            </span>
          </div>
          <Button>Decline</Button>
          <Button>Activate</Button>
        </div>
        
        <div style={{ marginBottom: 16, fontWeight: 600, color: "#217346" }}>
          Enrollee Information
        </div>
        <Table
          headers={["Name", "Phone Number", "Email", "Plan Type"]}
          rows={[
            [
              firstClaim.enrolleeName || "N/A",
              firstClaim.enrolleePhoneNumber || "N/A",
              firstClaim.enrolleeEmail || "N/A",
              firstClaim.planTypeName || "N/A",
            ],
          ]}
          tableStyle={{ marginBottom: 16 }}
        />
        
        <div style={{ marginBottom: 8, fontWeight: 600, color: "#217346" }}>
          Claim Items ({claimItems.length})
        </div>
        <Table
          headers={[
            "Service Rendered", 
            "Service Date", 
            "Claim Type", 
            "Quantity", 
            "Price", 
            "Amount", 
            "Status"
          ]}
          rows={claimItems.map((item) => [
            item.serviceRendered || "N/A",
            formatDate(item.serviceDate, dateFormats.short),
            item.claimType || "N/A",
            item.quantity.toString(),
            `₦${item.price.toLocaleString()}`,
            `₦${item.amount.toLocaleString()}`,
            <span
              key={item.id}
              style={{
                background: "#e6f4ea",
                color: statusColor[getStatusText(item.claimStatus) as keyof typeof statusColor] || "#6b6f80",
                borderRadius: 8,
                padding: "2px 12px",
                fontWeight: 600,
                fontSize: 14,
              }}
            >
              {getStatusText(item.claimStatus)}
            </span>,
          ])}
          tableStyle={{ background: "#f6fbf9" }}
        />
        
        <div
          style={{
            textAlign: "right",
            marginTop: 24,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          Total Amount: <span style={{ color: "#217346" }}>
            ₦{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimDetailsModal;