import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import Table from "./Table";
import type { ClaimItem } from "../../types/claims";
import { formatDate, dateFormats } from "../../utils/dateFormatter";
import { CLAIM_STATUSES, CLAIM_STATUS_COLORS } from '../../constant/claimStatuses';

interface NemsasDetailsModalProps {
  open: boolean;
  onClose: () => void;
  claimItems: ClaimItem[];
  loading: boolean;
  error: string | null;
  patientName: string; 
  phoneNumber: string; 
}

// Numeric legacy -> textual mapping (aligning with canonical statuses; missing codes fallback to Pending)
const legacyNumericStatusMap: Record<number,string> = {
  0: 'Pending',
  1: 'Approved',
  2: 'Rejected',
  3: 'Paid',
  5: 'Resolved',
  6: 'Processed'
};

const getStatusText = (status: number | string): string => {
  if (typeof status === 'number') return legacyNumericStatusMap[status] || 'Pending';
  const normalized = status.trim();
  return CLAIM_STATUSES.includes(normalized as typeof CLAIM_STATUSES[number]) ? normalized : 'Pending';
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
  // Dispute workflow removed (status set no longer includes Disputed)

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

  // Handle approve
  const handleApprove = () => {
    console.log("Approving claim");
    console.log("Selected items:", Array.from(selectedItems));
    
    // Here you would typically make an API call to update the claim status
    alert("Claim approved successfully!");
    onClose();
  };

  // Handle reject (was decline)
  const handleReject = () => {
    console.log("Rejecting claim");
    console.log("Selected items:", Array.from(selectedItems));
    
    // Here you would typically make an API call to update the claim status
    alert("Claim rejected successfully!");
    onClose();
  };

  // Handle reject (was decline)
  const handleDispute = () => {
    console.log("Disputing claim");
    console.log("Selected items:", Array.from(selectedItems));
    
    // Here you would typically make an API call to update the claim status
    alert("Claim disputed successfully!");
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
  // Derive overall status (if all items share same status)
  const itemStatuses = claimItems.map(ci => getStatusText(ci.claimStatus));
  const uniqueStatuses = new Set(itemStatuses);
  const overallStatus = uniqueStatuses.size === 1 ? itemStatuses[0] : 'Mixed';

  return (
    <Modal open={open} onClose={onClose} title="Claims Details" width="800px">
      <div style={{ padding: "8px 0 0 0" }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 16,
            flexWrap: 'wrap',
            gap: 12
          }}
        >
          {/* Hide Reject when overall status is Rejected */}
          {overallStatus !== 'Rejected' && (
            <Button color="red" onClick={handleReject}>Reject</Button>
          )}
          <div className="flex gap-3">
            <Button color="gray" onClick={handleDispute}>Dispute</Button>
            {/* Hide Approve when overall status is Approved */}
            {overallStatus !== 'Approved' && (
              <Button color="green" onClick={handleApprove}>Approve</Button>
            )}
          </div>
        </div>
        {/* Dispute workflow removed */}
        
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
                color: CLAIM_STATUS_COLORS[getStatusText(item.claimStatus) as keyof typeof CLAIM_STATUS_COLORS] || "#6b6f80",
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