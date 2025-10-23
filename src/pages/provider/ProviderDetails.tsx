import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../services/store/store';
import { fetchProviderById } from '../../services/thunks/iProviderThunk'; 
import Tabs from '../../components/ui/Tabs';
import Button from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import type { ProviderEntity } from '../../types/iProvider';

const ProviderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  
  // Use Redux state for provider details
  const { providers, loading, error } = useSelector((state: RootState) => state.allProviders);
  
  // Find the specific provider from the list or fetch individually
  const provider = providers.find(p => p.id === id);
  
  const [tab, setTab] = useState('details');
  const [data, setData] = useState<ProviderEntity | null>(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    // If provider is already in the list, use it
    if (provider) {
      setData(provider);
    } else {
      // Otherwise fetch the specific provider
      setLocalLoading(true);
      setLocalError(null);
      dispatch(fetchProviderById(id))
        .unwrap()
        .then((providerData) => {
          setData(providerData);
        })
        .catch((err) => {
          setLocalError(err.message || 'Failed to load provider details');
        })
        .finally(() => {
          setLocalLoading(false);
        });
    }
  }, [id, provider, dispatch]);

  const handleEditProvider = () => {
    // Navigate to edit page
    window.location.href = `/providers/${id}/edit`;
  };

  // Provider Details Tab
  const detailsTab = (
    <div className='text-sm space-y-6'>
      <div className='grid md:grid-cols-2 gap-6'>
        <Info label='Hospital Name' value={data?.hospitalName} />
        <Info label='Email' value={data?.email} />
        <Info label='Phone Number' value={data?.phoneNumber} />
        <Info label='Bank Name' value={data?.bankName} />
        <Info label='Account Number' value={data?.accountNumber} />
        <Info label='Account Name' value={data?.accountName} />
        <Info label='Account Type' value={data?.accountType} />
        <Info label='BVN' value={data?.bankVeririfationNumber} />
        <Info label='License Number' value={data?.stateLicenseNumber} />
        <Info label='License Expiry' value={data?.licenseExpiryDate ? new Date(data.licenseExpiryDate).toLocaleDateString() : 'N/A'} />
        <Info label='Location' value={data?.geoLocation} />
        <Info label='Hospital Address' value={data?.hospitalAdress} />
        <Info label='Status' value={
          <span className={`px-2 py-1 rounded text-xs ${
            data?.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}>
            {data?.isActive ? "Active" : "Inactive"}
          </span>
        } />
        <Info label='Created Date' value={data?.createdDate ? new Date(data.createdDate).toLocaleDateString() : 'N/A'} />
      </div>
    </div>
  );

  // Contacts Tab
  const contactsTab = (
    <div className='text-sm'>
      <div className='overflow-x-auto'>
        <table className='w-full text-sm'>
          <thead>
            <tr className='bg-green-50 text-left'>
              <th className='py-2 px-3 font-medium'>Name</th>
              <th className='py-2 px-3 font-medium'>Designation</th>
              <th className='py-2 px-3 font-medium'>Email</th>
              <th className='py-2 px-3 font-medium'>Phone Number</th>
            </tr>
          </thead>
          <tbody>
            {data?.contacts?.map((contact, index) => (
              <tr key={index} className='border-b last:border-b-0'>
                <td className='py-2 px-3'>{contact.name}</td>
                <td className='py-2 px-3'>{contact.designation}</td>
                <td className='py-2 px-3'>{contact.email}</td>
                <td className='py-2 px-3'>{contact.phoneNumber}</td>
              </tr>
            ))}
            {(!data?.contacts || data.contacts.length === 0) && (
              <tr>
                <td colSpan={4} className='py-4 text-center text-gray-500'>
                  No contacts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Claims Tab (if you want to show provider's claims)
  const claimsTab = (
    <div className='text-sm'>
      <div className='text-gray-500 text-center py-8'>
        Claims data for this provider would be displayed here
      </div>
      {/* You can integrate your claims table here */}
    </div>
  );

  const tabs = [
    { key: 'details', label: 'Provider Details', content: detailsTab },
    { key: 'contacts', label: 'Contacts', content: contactsTab },
    { key: 'claims', label: 'Claims', content: claimsTab }
  ];

  // Show loading state
  if (loading || localLoading) return <LoadingSpinner />;
  
  // Show error state
  if (error || localError) return (
    <div className='p-6 text-center text-red-600 text-sm'>
      {error || localError}
    </div>
  );

  // Show not found state
  if (!data) return (
    <div className='p-6 text-center text-gray-500'>
      Provider not found
    </div>
  );

  return (
    <div className='p-6 font-avenir tracking-tightpx'>
      <div className='bg-white rounded-md border shadow-sm p-6'>
        <div className='flex items-start justify-between mb-8'>
          <div className='flex items-center gap-6'>
            <div className='w-14 h-14 rounded-full bg-green-100 flex items-center justify-center text-green-800 text-lg font-medium'>
              {data.hospitalName?.charAt(0) || 'H'}
            </div>
            <div>
              <h2 className='font-avenir font-extrabold text-[24px] leading-8 tracking-tightpx'>
                {data.hospitalName}
              </h2>
              <div className='flex items-center gap-2 text-gray-600 font-avenir font-medium text-[16px] leading-5 tracking-tightpx'>
                <span className='font-avenir font-medium text-[16px] leading-5 tracking-tightpx'>
                  {data.email}
                </span>
                <span className={`px-2 py-0.5 rounded border text-[10px] ${
                  data.isActive 
                    ? 'text-green-700 border-green-600 bg-green-50' 
                    : 'text-gray-600 border-gray-400'
                }`}>
                  {data.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
          <div className='flex gap-3'>
            <Button size='sm' onClick={handleEditProvider}>
              Edit Provider
            </Button>
          </div>
        </div>
        
        <Tabs items={tabs} activeKey={tab} onChange={setTab} />
      </div>
    </div>
  );
};

const Info: React.FC<{ label: string; value?: string | number | React.ReactNode }> = ({ label, value }) => (
  <div className='grid grid-cols-2 md:pr-12'>
    <div className='font-avenir font-medium text-[16px] leading-5 tracking-tightpx text-left text-[#828282]'>
      {label}
    </div>
    <div className='font-avenir font-extrabold text-[16px] leading-5 tracking-tightpx text-right text-[#051827] break-words'>
      {value || '-'}
    </div>
  </div>
);

export default ProviderDetails;