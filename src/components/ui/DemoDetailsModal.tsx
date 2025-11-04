import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Table from "./Table";
import type { ClaimItem } from "../../types/claims";
import { formatDate, dateFormats } from "../../utils/dateFormatter";

interface NemsasDetailsModalProps {
  open: boolean;
  onClose: () => void;
  claimItems: ClaimItem[];
  loading: boolean;
  error: string | null;
  patientName: string; 
  phoneNumber: string; 
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

const DemoDetailsModal: React.FC<NemsasDetailsModalProps> = ({
  open,
  onClose,
  claimItems,
  loading,
  error,
  patientName,
  phoneNumber,
}) => {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [showDisputeComment, setShowDisputeComment] = useState(false);
  const [disputeComment, setDisputeComment] = useState("");

  // Handle individual checkbox change
  const handleCheckboxChange = (itemId: string) => {
    setSelectedItems(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(itemId)) {
        newSelected.delete(itemId);
      } else {
        newSelected.add(itemId);
      }
      return newSelected;
    });
  };

  // Handle select all checkbox
  const handleSelectAll = () => {
    if (selectedItems.size === claimItems.length) {
      setSelectedItems(new Set());
    } else {
      const allItemIds = new Set(claimItems.map(item => item.id));
      setSelectedItems(allItemIds);
    }
  };

  // Handle dispute button click
  const handleDisputeClick = () => {
    setShowDisputeComment(true);
  };

  // Handle submit dispute
  const handleSubmitDispute = () => {
    if (disputeComment.trim() === "") {
      alert("Please provide a reason for disputing this claim.");
      return;
    }
    
    console.log("Disputing claim with comment:", disputeComment);
    console.log("Selected items:", Array.from(selectedItems));
    
    // Here you would typically make an API call to update the claim status
    alert(`Claim disputed successfully!\nReason: ${disputeComment}`);
    
    // Reset and close
    setShowDisputeComment(false);
    setDisputeComment("");
    onClose();
  };

  // Handle approve
  const handleApprove = () => {
    console.log("Approving claim");
    console.log("Selected items:", Array.from(selectedItems));
    
    // Here you would typically make an API call to update the claim status
    alert("Claim approved successfully!");
    onClose();
  };

  // Handle decline
  const handleDecline = () => {
    console.log("Declining claim");
    console.log("Selected items:", Array.from(selectedItems));
    
    // Here you would typically make an API call to update the claim status
    alert("Claim declined successfully!");
    onClose();
  };

  // Checkbox component for individual rows
  const Checkbox = ({ 
    checked, 
    onChange 
  }: { 
    checked: boolean; 
    onChange: () => void 
  }) => (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      onClick={(e) => e.stopPropagation()}
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
      checked={claimItems.length > 0 && selectedItems.size === claimItems.length}
      onChange={handleSelectAll}
      onClick={(e) => e.stopPropagation()}
      style={{
        cursor: "pointer",
        width: "16px",
        height: "16px",
      }}
    />
  );

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
          <Button onClick={handleDecline}>Decline</Button>
          <div style={{ display: "flex", gap: "8px" }}>
            <Button 
              onClick={handleDisputeClick}
              // style={{ background: "#d32f2f", borderColor: "#d32f2f" }}
              color="gray"
            >
              Disputed
            </Button>
            <Button color="green" onClick={handleApprove}>Approve</Button>
          </div>
        </div>

        {/* Dispute Comment Section */}
        {showDisputeComment && (
          <div style={{ 
            marginBottom: 16, 
            padding: 16, 
            background: "#ffebee", 
            borderRadius: 8,
            border: "1px solid #d32f2f"
          }}>
            <div style={{ fontWeight: 600, color: "#d32f2f", marginBottom: 8 }}>
              Reason for Dispute *
            </div>
            <textarea
              value={disputeComment}
              onChange={(e) => setDisputeComment(e.target.value)}
              placeholder="Please provide a detailed reason for disputing this claim..."
              style={{
                width: "100%",
                minHeight: "80px",
                padding: "8px 12px",
                borderRadius: 4,
                border: "1px solid #ccc",
                fontSize: 14,
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Button 
                onClick={() => {
                  setShowDisputeComment(false);
                  setDisputeComment("");
                }}
                  color="gray"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitDispute}
                // style={{ background: "#d32f2f", borderColor: "#d32f2f" }}
              >
                Submit Dispute
              </Button>
            </div>
          </div>
        )}
        
        <div style={{ marginBottom: 16, fontWeight: 600, color: "#217346" }}>
          Patient Information
        </div>
        <Table
          headers={["Name", "Phone Number"]}
          rows={[
            [
              patientName || "N/A",
              phoneNumber || "N/A",
            ],
          ]}
          tableStyle={{ marginBottom: 16 }}
        />
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: 8 
        }}>
          <div style={{ fontWeight: 600, color: "#217346" }}>
            Claim Items ({claimItems.length})
          </div>
          {selectedItems.size > 0 && (
            <div style={{ color: "#6b6f80", fontSize: "14px" }}>
              {selectedItems.size} item(s) selected
            </div>
          )}
        </div>
        
        <Table
          headers={[
            <div key="select-all" onClick={(e) => e.stopPropagation()}>
              <SelectAllCheckbox />
            </div>,
            "Service Rendered", 
            "Service Date", 
            "Price", 
            "Amount", 
            "Status"
          ]}
          rows={claimItems.map((item) => [
            <div key={item.id} onClick={(e) => e.stopPropagation()}>
              <Checkbox
                checked={selectedItems.has(item.id)}
                onChange={() => handleCheckboxChange(item.id)}
              />
            </div>,
            item.serviceRendered || "N/A",
            formatDate(item.serviceDate, dateFormats.short),
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

export default DemoDetailsModal;