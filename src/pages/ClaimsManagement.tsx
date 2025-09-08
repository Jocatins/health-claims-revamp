import { useState } from 'react';
import { useEffect } from 'react';
import { fetchClaims, fetchClaimDetails } from '../services/api/claimsApi';
import EmptyState from '../components/ui/EmptyState';
import Table from '../components/ui/Table';
import ClaimDetailsModal from '../components/ui/ClaimDetailsModal';
import { FaEye } from 'react-icons/fa';
import SingleClaimModal from '../components/ui/SingleClaimModal';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import BatchUploadModal from '../components/ui/BatchUploadModal';
// import your icon if needed

export const ClaimsManagement = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSingleClaimModal, setShowSingleClaimModal] = useState(false);
  const [showBatchUploadModal, setShowBatchUploadModal] = useState(false);
  // Claims state
  type Claim = {
    id: string;
    name: string;
    enrolleeId: string;
    date: string;
    amount: string;
    status: string;
  };
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal state for claim details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  type ClaimDetails = {
    id: string;
    status: string;
    enrollee: { name: string; id: string; plan: string };
    services: { name: string; approvalCode: string; amount: string }[];
    total: string;
  };
  const [selectedClaim, setSelectedClaim] = useState<ClaimDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
    // Export modal state
    const [showExportModal, setShowExportModal] = useState(false);
    const [exportLoading, setExportLoading] = useState(false);
    const [exportError, setExportError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetchClaims({})
      .then(data => {
        const newData = data?.data;
        setClaims(newData);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch claims');
        setLoading(false);
      });
  }, []);

  // Status color map
  const statusColor = {
    Approved: '#217346',
    Paid: '#6b6f80',
    Disputed: '#d32f2f',
  };

  return (
    <div style={{ padding: '32px' }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>Loading claims...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red', padding: 48 }}>{error}</div>
      ) : claims.length === 0 ? (
        <EmptyState
          icon={<span style={{ fontSize: 32 }}>📄</span>}
          title="No claims available yet"
          description="Start submitting claims to track and manage them here."
          action={
            <Button onClick={() => setShowCreateModal(true)}>
              + Create new claim
            </Button>
          }
        />
      ) : (
        <div style={{ background: '#fff', borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <Button variant="outline">Filter</Button>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline" onClick={() => setShowExportModal(true)}>Export</Button>
                <Button onClick={() => setShowCreateModal(true)}>+ Create new claim</Button>
            </div>
          </div>
          <Table
            headers={["Claim Id", "Enrollee name", "Enrollee Id", "Submitted date", "Total amount", "Status", "Action"]}
            rows={claims.map((claim) => [
              claim.id,
              claim.name,
              claim.enrolleeId,
              claim.date,
              claim.amount,
              <span style={{ color: statusColor[claim.status as keyof typeof statusColor], fontWeight: 600 }}>{claim.status}</span>,
              <span
                style={{ cursor: 'pointer', color: '#217346' }}
                title="View"
                onClick={async () => {
                  setDetailsLoading(true);
                  setShowDetailsModal(true);
                  try {
                    const details = await fetchClaimDetails(claim.id);
                    setSelectedClaim(details);
                    setDetailsError('');
                  } catch {
                    setSelectedClaim(null);
                    setDetailsError('Failed to fetch claim details');
                  }
                  setDetailsLoading(false);
                }}
              >
                <FaEye />
              </span>,
            ])}
          />
          <ClaimDetailsModal
            open={showDetailsModal}
            onClose={() => setShowDetailsModal(false)}
            claim={selectedClaim || {
              id: '', status: '', enrollee: { name: '', id: '', plan: '' }, services: [], total: ''
            }}
          />
          {detailsLoading && <div style={{ textAlign: 'center', padding: 24 }}>Loading claim details...</div>}
          {detailsError && <div style={{ textAlign: 'center', color: 'red', padding: 24 }}>{detailsError}</div>}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, fontSize: 14, color: '#6b6f80' }}>
            <span>Showing 1-20</span>
            <span>Page 1 of 20 &nbsp; {'<'} {'>'}</span>
          </div>
        </div>
      )}

      <Modal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="How would you like to submit your claims?"
        width="400px"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Button variant="outline" onClick={() => { setShowSingleClaimModal(true); setShowCreateModal(false); }}>Single claim</Button>
          <Button variant="outline" onClick={() => { setShowBatchUploadModal(true); setShowCreateModal(false); }}>Batch upload</Button>
          <Button variant="outline">Generate from HMIS</Button>
        </div>
      </Modal>

        <SingleClaimModal open={showSingleClaimModal} onClose={() => setShowSingleClaimModal(false)} />

        {/* Batch Upload Modal */}
        <BatchUploadModal open={showBatchUploadModal} onClose={() => setShowBatchUploadModal(false)} />
        
        {/* Export Modal */}
        <Modal
          open={showExportModal}
          onClose={() => setShowExportModal(false)}
          title="Export Claims"
          width="350px"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <Button
              onClick={async () => {
                setExportLoading(true);
                setExportError('');
                try {
                  const blob = await exportClaimsReport({ IsExcel: false });
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'claims.csv');
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode?.removeChild(link);
                  setShowExportModal(false);
                } catch {
                  setExportError('Failed to export CSV');
                }
                setExportLoading(false);
              }}
              disabled={exportLoading}
            >Export as CSV</Button>
            <Button
              onClick={async () => {
                setExportLoading(true);
                setExportError('');
                try {
                  const blob = await exportClaimsReport({ IsExcel: true });
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const link = document.createElement('a');
                  link.href = url;
                  link.setAttribute('download', 'claims.xlsx');
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode?.removeChild(link);
                  setShowExportModal(false);
                } catch {
                  setExportError('Failed to export Excel');
                }
                setExportLoading(false);
              }}
              disabled={exportLoading}
            >Export as Excel</Button>
            {exportLoading && <div style={{ textAlign: 'center', padding: 8 }}>Exporting...</div>}
            {exportError && <div style={{ color: 'red', textAlign: 'center', padding: 8 }}>{exportError}</div>}
          </div>
        </Modal>
      </div>
  );
};

import { exportClaimsReport as exportClaimsReportApi } from '../services/api/claimsApi';

async function exportClaimsReport(arg0: { IsExcel: boolean; }) {
    // Use the API to fetch the export file (CSV or Excel) based on arg0
    const response = await exportClaimsReportApi(arg0);
    return response;
}

