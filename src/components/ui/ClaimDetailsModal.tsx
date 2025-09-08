import React from 'react';
import Modal from './Modal';
import Button from './Button';
import Table from './Table';

interface ClaimDetailsModalProps {
  open: boolean;
  onClose: () => void;
  claim: {
    id: string;
    status: string;
    enrollee: { name: string; id: string; plan: string };
    services: Array<{ name: string; approvalCode: string; amount: string }>;
    total: string;
  };
}

const statusColor = {
  Approved: '#217346',
  Paid: '#6b6f80',
  Disputed: '#d32f2f',
};

const ClaimDetailsModal: React.FC<ClaimDetailsModalProps> = ({ open, onClose, claim }) => (
  <Modal open={open} onClose={onClose} title="Claims Details" width="600px">
    <div style={{ padding: '8px 0 0 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <span style={{ fontWeight: 600, fontSize: 18 }}>Claim ID</span>
          <span style={{ marginLeft: 8, fontWeight: 500, color: '#6b6f80' }}>{claim.id}</span>
          <span style={{ marginLeft: 16, background: '#e6f4ea', color: statusColor[claim.status as keyof typeof statusColor], borderRadius: 8, padding: '2px 12px', fontWeight: 600, fontSize: 14 }}>{claim.status}</span>
        </div>
        <Button>Export</Button>
      </div>
      <div style={{ marginBottom: 16, fontWeight: 600, color: '#217346' }}>Enrollee information</div>
      <Table
        headers={["Name", "Enrollee Id", "Plan type"]}
        rows={[[claim.enrollee.name, claim.enrollee.id, <span style={{ fontWeight: 600 }}>{claim.enrollee.plan}</span>]]}
        tableStyle={{ marginBottom: 8 }}
      />
      <div style={{ marginBottom: 8, fontWeight: 600, color: '#217346' }}>Service information</div>
      <Table
        headers={["Service name", "Approval code", "Amount"]}
        rows={claim.services.map(s => [s.name, s.approvalCode, s.amount])}
        tableStyle={{ background: '#f6fbf9' }}
      />
      <div style={{ textAlign: 'right', marginTop: 24, fontWeight: 700, fontSize: 18 }}>
        Total: <span style={{ color: '#217346' }}>{claim.total}</span>
      </div>
    </div>
  </Modal>
);

export default ClaimDetailsModal;
