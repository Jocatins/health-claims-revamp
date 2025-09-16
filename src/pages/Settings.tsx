import React, { useState } from 'react';
import Tabs from '../components/ui/Tabs';
import Button from '../components/ui/Button';
import ProfileEditModal from '../components/settings/ProfileEditModal';
// import Input from '../components/ui/Input';
import { changePassword, passwordStrength } from '../services/api/userApi';
import { useSelector } from 'react-redux';
import type { RootState } from '../services/store/store';
import Input from '../components/form/Input';

const Settings: React.FC = () => {
	const user = useSelector((s: RootState) => s.auth.user);
	const [active, setActive] = useState('profile');
	const [profileModal, setProfileModal] = useState(false);
	// Inline password change form state (security tab)
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [pwLoading, setPwLoading] = useState(false);
	const [pwError, setPwError] = useState<string|null>(null);
	const [pwSuccess, setPwSuccess] = useState(false);

	const strength = passwordStrength(newPassword);

	const submitPassword = async () => {
		setPwError(null); setPwSuccess(false);
		if (newPassword !== confirmPassword) {
			setPwError('Passwords do not match');
			return;
		}
		try {
			setPwLoading(true);
			const res = await changePassword({ currentPassword, newPassword });
			if (res.isSuccess) {
				setPwSuccess(true);
				setCurrentPassword('');
				setNewPassword('');
				setConfirmPassword('');
			} else setPwError(res.message || 'Change failed');
		} catch (e) {
			setPwError(e instanceof Error ? e.message : 'Change failed');
		} finally {
			setPwLoading(false);
		}
	};

	const profileTab = (
		<div className='pb-6'>
			<div className='grid grid-cols-2 gap-6 max-w-4xl'>
				<div>
					<label className='text-xs font-medium text-gray-600 mb-1 block'>First name</label>
					<input disabled value={(user?.fullName||'').split(' ')[0] || ''} className='w-full border rounded px-3 h-[49px] text-sm bg-gray-50'/>
				</div>
				<div>
					<label className='text-xs font-medium text-gray-600 mb-1 block'>Last name</label>
					<input disabled value={(user?.fullName||'').split(' ').slice(1).join(' ')} className='w-full border rounded px-3 h-[49px] text-sm bg-gray-50'/>
				</div>
				<div>
					<label className='text-xs font-medium text-gray-600 mb-1 block'>Email address</label>
					<input disabled value={user?.emailAddress||''} className='w-full border rounded px-3 h-[49px] text-sm bg-gray-50'/>
					{/* <button onClick={()=> setProfileModal(true)} className='text-xs text-primary mt-2 underline'>Update email</button> */}
                    <Button size='sm' variant='text' onClick={()=> setProfileModal(true)}>Update email</Button>
				</div>
				<div>
					<label className='text-xs font-medium text-gray-600 mb-1 block'>Phone number</label>
					<input disabled value={''} className='w-full border rounded px-3 h-[49px] text-sm bg-gray-50'/>
				</div>
			</div>
			<div className='mt-6'>
				<Button size='sm' className='bg-primary' onClick={()=> setProfileModal(true)}>Update profile</Button>
			</div>
		</div>
	);

	const securityTab = (
		<div className='max-w-xl'>
			<p className='text-base lg:text-[20px] text-[#192F2B] mb-4 font-medium'>Change password</p>
			{pwError && <div className='mb-3 text-xs text-red-600'>{pwError}</div>}
			{pwSuccess && <div className='mb-3 text-xs text-green-600'>Password changed successfully.</div>}
			<div className='grid gap-1'>
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
				<Input label='Confirm New Password' type='password' value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
			</div>
			<div className='flex justify-end mt-2 mb-6'>
				<Button variant='solid' size='sm' disabled={pwLoading || !currentPassword || !newPassword || newPassword!==confirmPassword} onClick={submitPassword}>
					{pwLoading ? 'Submitting...' : 'Submit'}
				</Button>
			</div>
		</div>
	);

	return (
		<div className='p-6'>
			<div className='bg-white rounded-md border shadow-sm p-0'>
				<Tabs
					items={[
						{ key: 'profile', label: 'Personal details', content: profileTab },
						{ key: 'security', label: 'Security', content: securityTab },
					]}
					activeKey={active}
					onChange={setActive}
				/>
			</div>
			<ProfileEditModal open={profileModal} onClose={()=> setProfileModal(false)} />
			{/* Password change now inline in security tab; modal removed */}
		</div>
	);
};

export default Settings;

