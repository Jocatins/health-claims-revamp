import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { changePassword, passwordStrength } from '../../services/api/userApi';

interface Props { open: boolean; onClose: () => void; }

const ChangePasswordModal: React.FC<Props> = ({ open, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const strength = passwordStrength(newPassword);

  const submit = async () => {
    setError(null); setSuccess(false);
    try {
      setLoading(true);
      const res = await changePassword({ currentPassword, newPassword });
      if (res.isSuccess) {
        setSuccess(true);
        setCurrentPassword('');
        setNewPassword('');
      } else setError(res.message || 'Change failed');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Change failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title='Change Password' width='480px'>
      {error && <div className='mb-3 text-xs text-red-600'>{error}</div>}
      {success && <div className='mb-3 text-xs text-green-600'>Password changed successfully.</div>}
      <Input label='Old Password' type='password' value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} />
      <div>
        <Input label='New Password' type='password' value={newPassword} onChange={e=>setNewPassword(e.target.value)} />
        {newPassword && (
          <div className='flex items-center justify-between px-1 -mt-2 mb-3'>
            <div className='flex-1 h-1 bg-gray-200 rounded mr-3 overflow-hidden'>
              <div className={`h-full transition-all duration-300 ${strength.score <=2 ? 'bg-yellow-500' : strength.score<=3 ? 'bg-green-500' : 'bg-green-600'}`} style={{ width: `${(strength.score/5)*100}%`}} />
            </div>
            <span className='text-xs text-gray-500'>{strength.label}</span>
          </div>
        )}
      </div>
      <div className='flex justify-end mt-2'>
        <Button disabled={loading || newPassword.length===0} onClick={submit}>{loading ? 'Submitting...' : 'Submit'}</Button>
      </div>
    </Modal>
  );
};

export default ChangePasswordModal;
