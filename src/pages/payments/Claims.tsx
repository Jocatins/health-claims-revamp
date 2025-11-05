// new claims page, for demo

import { useState, useEffect, useMemo } from 'react';
import { formatDate, dateFormats } from '../../utils/dateFormatter';
import EmptyState from '../../components/ui/EmptyState';
import Table from '../../components/ui/Table';
import { FaEye, FaSync } from 'react-icons/fa';
import FormHeader from '../../components/form/FormHeader';
import type { ClaimItem } from '../../types/claims';
import DemoDetailsModal from '../../components/ui/DemoDetailsModal';
import { useProviderContext } from '../../context/useProviderContext';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchNemsasClaims } from '../../services/thunks/nemsasThunk';
import { fetchNemsasClaimById } from '../../services/api/nemsasApi';

export const Claims = () => {
  // Table shape after mapping backend claims
  type TableClaim = {
    id: string;
    name: string;
    phoneNumber: string;
    serviceDate: string;
    amount: string;
    status: string;
    submittedAt: string;
  };

  const dispatch = useAppDispatch();
  const { selectedProviderId } = useProviderContext();
  const { claims: backendClaims, loading, error } = useAppSelector(state => state.nemsas);
  const NEMSAS_ID = '2e4c6fa4-6ac3-43bb-b78f-326dccac110c';

  // Status mapping (numeric legacy -> text) and reverse
  const statusCodeToText = useMemo<Record<number,string>>(() => ({
    0: 'Pending',
    1: 'Approved',
    2: 'Rejected',
    3: 'Paid',
    4: 'Disputed',
    5: 'Resolved',
    6: 'Processed'
  }), []);
  const textToStatusCode = useMemo<Record<string,number>>(
    () => Object.fromEntries(Object.entries(statusCodeToText).map(([k,v]) => [v, Number(k)])),
    [statusCodeToText]
  );

  const [tableClaims, setTableClaims] = useState<TableClaim[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [claimItems, setClaimItems] = useState<ClaimItem[]>([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [selectedPatientInfo, setSelectedPatientInfo] = useState<{patientName: string; phoneNumber: string}>({
    patientName: "",
    phoneNumber: ""
  });

  // Map backend claims to table shape whenever redux updates
  interface BackendClaimItem { id: string; amount: number; claimStatus?: string | number; status?: string | number; quantity?: number; name?: string; claimType?: string; }
  interface BackendClaim {
    id: string;
    patientName?: string;
    claimName?: string;
    phoneNumber?: string;
    serviceDate?: string;
    claimDate?: string;
    createdDate?: string;
    claimItems?: BackendClaimItem[];
    amount?: number;
    claimStatus?: string | number;
  }

  useEffect(() => {
    const mapped: TableClaim[] = (backendClaims || []).map((claim: BackendClaim) => {
      const totalAmount = Array.isArray(claim.claimItems)
        ? claim.claimItems.reduce((sum: number, item: BackendClaimItem) => sum + (item?.amount || 0), 0)
        : (claim.amount || 0);
      const rawStatus: string | number | undefined = Array.isArray(claim.claimItems) && claim.claimItems.length > 0
        ? (claim.claimItems[0].claimStatus ?? claim.claimItems[0].status)
        : claim.claimStatus;
      const statusText = typeof rawStatus === 'number' ? (statusCodeToText[rawStatus] || 'Pending') : (rawStatus || 'Pending');
      return {
        id: claim.id || 'N/A',
        name: claim.patientName || claim.claimName || 'N/A',
        phoneNumber: claim.phoneNumber || 'N/A',
        serviceDate: claim.serviceDate || claim.claimDate || '',
        amount: totalAmount.toFixed(2),
      status: statusText,
        submittedAt: claim.claimDate || claim.createdDate || claim.serviceDate || '',
      };
    });
    setTableClaims(mapped);
  }, [backendClaims, statusCodeToText]);

  // Initial load from backend
  useEffect(() => {
    if (selectedProviderId) {
      dispatch(fetchNemsasClaims({
        ProviderId: selectedProviderId,
        NEMSASId: NEMSAS_ID,
        PageNumber: 1,
        PageSize: 500,
        SortBy: 'createdDate'
      }));
    }
  }, [dispatch, selectedProviderId]);


const handleViewClaim = async (claimId: string) => {
  setDetailsLoading(true);
  setShowDetailsModal(true);
  try {
    const res = await fetchNemsasClaimById(claimId);
    if (res?.isSuccess && res?.data) {
      const data = res.data;
      setSelectedPatientInfo({
        patientName: data.patientName || data.claimName || 'N/A',
        phoneNumber: data.phoneNumber || 'N/A'
      });
      const convertedItems: ClaimItem[] = (data.claimItems || []).map((ci: BackendClaimItem) => ({
        id: ci.id,
        serviceRendered: ci.name,
        amount: ci.amount,
        approvalCode: '',
        serviceDate: data.serviceDate,
        quantity: ci.quantity || 1,
        price: ci.amount,
        discount: 0,
        diagnosis: '',
        referralHospital: '',
        nhisno: '',
        attachments: [],
        claimStatus: typeof (ci.claimStatus ?? ci.status) === 'number'
          ? (ci.claimStatus as number)
          : textToStatusCode[String(ci.claimStatus ?? ci.status ?? 'Pending')] ?? 0,
        isActive: true,
        enrolleeName: data.patientName,
        patientEnrolleeNumber: data.patientNumber || '',
        providerId: data.providerId,
        hmoId: data.hmoId || '',
        enrolleeEmail: '',
        enrolleePhoneNumber: data.phoneNumber || '',
        claimType: ci.claimType || 'EmergencyService',
        planTypeName: '',
        createdDate: data.claimDate || data.serviceDate,
        modifiedDate: data.claimDate || data.serviceDate,
        planTypeId: '',
        providerName: '',
      }));
      setClaimItems(convertedItems);
      setDetailsError('');
    } else {
      setClaimItems([]);
      setDetailsError(res?.message || 'Failed to fetch claim details');
    }
  } catch {
    setClaimItems([]);
    setDetailsError('Failed to fetch claim details');
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


  // Refresh mapping only (backendClaims effect handles updates)
  const refreshClaims = () => {
    if (selectedProviderId) {
      dispatch(fetchNemsasClaims({
        ProviderId: selectedProviderId,
        NEMSASId: NEMSAS_ID,
        PageNumber: 1,
        PageSize: 500,
        SortBy: 'createdDate'
      }));
    }
  };

  const statusColor = {
    Pending: '#ff9800',
    Processed: '#1976d2',
    Rejected: '#d32f2f',
    Resolved: '#2e7d32',
    Approved: '#217346',
    Paid: '#6b6f80'
  } as const;

  return (
    <div style={{ padding: "32px" }}>
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>
          Loading claims...
        </div>
      ) : error ? (
        <div style={{ textAlign: 'center', color: 'red', padding: 48 }}>
          {error}
        </div>
      ) : tableClaims.length === 0 ? (
        <EmptyState
          icon={<span style={{ fontSize: 32 }}>📄</span>}
          title="No claims available yet"
          description="Submit or process claims to see them here."
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
            <FormHeader>Claims ({tableClaims.length})</FormHeader>
            
            {/* Action Buttons */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <button
                onClick={refreshClaims}
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
            rows={tableClaims.map((claim) => {
              return [
                <div key={claim.id} onClick={(e) => e.stopPropagation()}>
                  {/* Empty cell */}
                </div>,
                claim.name,
                claim.phoneNumber,
                formatDate(claim.serviceDate, dateFormats.short),
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
              Showing all {tableClaims.length} claims
            </span>
          </div>
        </div>
      )}
    </div>
  );
};