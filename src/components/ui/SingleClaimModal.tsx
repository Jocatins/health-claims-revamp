import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';
import Table from './Table';

interface ServiceItem {
  name: string;
  approvalCode: string;
  amount: string;
}

interface SingleClaimModalProps {
  open: boolean;
  onClose: () => void;
}

const SingleClaimModal: React.FC<SingleClaimModalProps> = ({ open, onClose }) => {
  const [enrolleeName, setEnrolleeName] = useState('');
  const [enrolleeId, setEnrolleeId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [date, setDate] = useState('');
  const [serviceType, setServiceType] = useState('');
  const serviceOptions = [
    'Inpatient care',
    'Outpatient care',
    'Emergency care',
    'Specialist visit',
    'Routine care',
  ];
  const [items, setItems] = useState<ServiceItem[]>([{ name: '', approvalCode: '', amount: '' }]);

  const handleAddItem = () => {
    setItems([...items, { name: '', approvalCode: '', amount: '' }]);
  };

  const handleItemChange = (idx: number, field: keyof ServiceItem, value: string) => {
    const newItems = [...items];
    newItems[idx][field] = value;
    setItems(newItems);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="New Claim" width="600px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <input value={enrolleeName} onChange={e => setEnrolleeName(e.target.value)} placeholder="Enrollee name" required style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          <input value={enrolleeId} onChange={e => setEnrolleeId(e.target.value)} placeholder="Enrollee Id" required style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <input value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Phone number" required style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
          <input value={date} onChange={e => setDate(e.target.value)} type="date" required style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div className='flex items-center gap-5'>
            <p>Service Type</p>
          <select value={serviceType} onChange={e => setServiceType(e.target.value)} required style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">Select</option>
            {serviceOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <Table
          headers={["S/N", "Service name", "Approval code", "Amount"]}
          rows={items.map((item, idx) => [
            idx + 1,
            <input
              value={item.name}
              onChange={e => handleItemChange(idx, 'name', e.target.value)}
              placeholder="Name"
              required
              style={{ width: '100%', padding: 6 }}
            />,
            <input
              value={item.approvalCode}
              onChange={e => handleItemChange(idx, 'approvalCode', e.target.value)}
              placeholder="Approval code"
              required
              style={{ width: '100%', padding: 6 }}
            />,
            <input
              value={item.amount}
              onChange={e => handleItemChange(idx, 'amount', e.target.value)}
              placeholder="Amount"
              required
              style={{ width: '100%', padding: 6 }}
            />,
          ])}
        />
        <Button
            type="button"
            onClick={handleAddItem}
            className="bg-transparent text-green-700 hover:bg-green-50 flex self-start mb-12"
        >
            <div className="flex items-center gap-4 text-[#1B5845]">
                <div className="w-8 h-8 rounded-lg bg-[#1B5845]/20 text-xl font-extrabold">+</div>
                <p>Add item</p>
            </div>
        </Button>
        <Button
            type="submit"
            className='flex self-start px-8 py-4'
        >
            Submit Claims
        </Button>
      </form>
    </Modal>
  );
};

export default SingleClaimModal;
