import React from 'react';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const EmailWarningModal: React.FC<Props> = ({ open, onCancel, onConfirm }) => (
  <Modal open={open} onClose={onCancel} title="Email update" width='480px'>
    <p className='text-sm text-gray-600 leading-relaxed mb-6'>
      Updating email is limited to once every 6 months. If you proceed now, you will have to wait another 6 months before changing it again. <span className='font-semibold'>Do you still wish to continue?</span>
    </p>
    <div className='flex justify-end gap-3'>
      <Button variant='outline' size='sm' onClick={onCancel}>Cancel</Button>
      <Button size='sm' onClick={onConfirm}>Continue</Button>
    </div>
  </Modal>
);

export default EmailWarningModal;
