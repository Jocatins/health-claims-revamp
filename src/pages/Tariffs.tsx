import React, { useEffect, useMemo, useState } from 'react';
import { useProviderContext } from '../context/useProviderContext';
import { useTariffs } from '../hooks/useTariffs';
import type { Tariff } from '../types/Tariff';
import Table from '../components/ui/Table';
import EmptyState from '../components/ui/EmptyState';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

interface SortState { field: string; direction: 'Asc' | 'Des'; }

const Tariffs: React.FC = () => {
	const { selectedProviderId, providers } = useProviderContext();
	const provider = providers.find(p => p.id === selectedProviderId);
	const providerId = provider?.id || 'provider-placeholder';
	const hmoId = provider?.hmoId || 'hmo-placeholder';

	const [pageNumber, setPageNumber] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [sort, setSort] = useState<SortState>({ field: 'service', direction: 'Asc' });
	const [selected, setSelected] = useState<Tariff | null>(null);
	const [serviceFilter, setServiceFilter] = useState('');
	const [deptFilter, setDeptFilter] = useState(''); // Not used in query yet (no spec), placeholder for future

	const { data, loading: isLoading, error: loadError, refetch } = useTariffs(selectedProviderId ? ({
		providerId,
		hmoId,
		pageNumber,
		pageSize,
		sortedBy: sort.field,
		sortDirection: sort.direction,
	}) : null);
	const isError = !!loadError;
	const errorMessage = loadError;

	// Reset pagination when provider changes
	useEffect(() => {
		setPageNumber(1);
	}, [selectedProviderId]);

		const { filtered } = useMemo(() => {
			const list: Tariff[] = data?.data || [];
			const filteredList = list.filter(t => (
				(!serviceFilter || t.service.toLowerCase().includes(serviceFilter.toLowerCase()))
			));
				return { filtered: filteredList };
		}, [data, serviceFilter]);

	const toggleSort = (field: string) => {
		setSort(prev => ({
			field,
			direction: prev.field === field && prev.direction === 'Asc' ? 'Des' : 'Asc'
		}));
	};

	const headers = [
		<span onClick={() => toggleSort('service')} className="cursor-pointer font-semibold text-sm">Service {sort.field==='service' ? (sort.direction==='Asc' ? '↑':'↓'):''}</span>,
		<span className="font-semibold text-sm">Description</span>,
		<span onClick={() => toggleSort('code')} className="cursor-pointer font-semibold text-sm">Code {sort.field==='code' ? (sort.direction==='Asc' ? '↑':'↓'):''}</span>,
		<span onClick={() => toggleSort('price')} className="cursor-pointer font-semibold text-sm">Pricing {sort.field==='price' ? (sort.direction==='Asc' ? '↑':'↓'):''}</span>,
		<span className="font-semibold text-sm">Action</span>
	];

	const rows = filtered.map(t => [
		t.service,
		<span className="truncate max-w-[240px] inline-block" title={t.descriptions}>{t.descriptions}</span>,
		t.code,
		new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(t.price),
		<button onClick={() => setSelected(t)} className="text-primary text-sm font-medium">View</button>
	]);

	const buildErrorMessage = () => errorMessage || 'An error occurred';

	return (
		<div className='p-6 space-y-6'>
			{!selectedProviderId && <div className='bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded text-sm'>Select a provider to load tariffs.</div>}
			{/* Filters Card */}
			<div className='bg-white rounded-md shadow-sm p-6 border border-gray-100'>
				<div className='flex flex-wrap gap-4 items-end'>
					<div className='flex flex-col w-56'>
						<label className='text-xs font-medium text-gray-600 mb-1'>Department</label>
						<input value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} placeholder='Department' className='border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary'/>
					</div>
					<div className='flex flex-col w-56'>
						<label className='text-xs font-medium text-gray-600 mb-1'>Service</label>
						<input value={serviceFilter} onChange={e=>setServiceFilter(e.target.value)} placeholder='Service' className='border rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary'/>
					</div>
					<Button size='md' onClick={()=>{ setPageNumber(1); refetch(); }} className='h-[38px]'>Apply filter</Button>
				</div>
			</div>

			{/* Table Card */}
			<div className='bg-white rounded-md shadow-sm border border-gray-100'>
				<div className='flex items-center justify-between px-6 py-4 border-b'>
					<h2 className='font-semibold text-sm'>All tariffs</h2>
					<Button size='sm' variant='outline' onClick={()=>refetch()}>Refresh</Button>
				</div>
				<div className='px-6 py-4'>
					{isLoading && <div className='py-10 text-center text-sm text-gray-500'>Loading tariffs...</div>}
					{isError && !isLoading && (
						<EmptyState title='Failed to load' description={buildErrorMessage()} action={<Button size='sm' onClick={()=>refetch()}>Retry</Button>} />
					)}
					{!isLoading && !isError && filtered.length === 0 && (
						<EmptyState title='No tariffs found' description='Adjust filters or try again later.' />
					)}
					{!isLoading && !isError && filtered.length > 0 && (
						<div className='overflow-x-auto'>
							<Table headers={headers} rows={rows} />
						</div>
					)}
				</div>
				{/* Simple pagination */}
				<div className='flex items-center justify-between px-6 py-3 border-t text-xs text-gray-600'>
					<span>Page {pageNumber}</span>
					<div className='space-x-2'>
						<Button size='sm' variant='outline' disabled={pageNumber===1 || isLoading} onClick={()=> setPageNumber(p=> Math.max(1,p-1))}>Prev</Button>
						<Button size='sm' variant='outline' disabled={isLoading || filtered.length < pageSize} onClick={()=> setPageNumber(p=> p+1)}>Next</Button>
						<select
							className='border rounded px-2 py-1 text-xs'
							value={pageSize}
							onChange={e=> { setPageSize(Number(e.target.value)); setPageNumber(1); }}
						>
							{[10,20,50].map(s=> <option key={s} value={s}>{s}/page</option>)}
						</select>
					</div>
				</div>
			</div>

			<Modal open={!!selected} onClose={()=> setSelected(null)} title='Tariff details' width='520px'>
				{selected && (
					<div className='space-y-4 text-sm'>
						<div className='grid grid-cols-2 gap-4'>
							<div>
								<p className='text-gray-500 text-xs uppercase'>Service</p>
								<p className='font-medium'>{selected.service}</p>
							</div>
							<div>
								<p className='text-gray-500 text-xs uppercase'>Code</p>
								<p className='font-medium'>{selected.code}</p>
							</div>
							<div>
								<p className='text-gray-500 text-xs uppercase'>Price</p>
								<p className='font-medium'>
									{new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(selected.price)}
								</p>
							</div>
							<div>
								<p className='text-gray-500 text-xs uppercase'>Status</p>
								<span className={'inline-block px-2 py-1 rounded text-xs ' + (selected.isActive ? 'bg-[#DC2626]-100 text-[#DC2626]-700' : 'bg-gray-200 text-gray-600')}>
									{selected.isActive ? 'Active' : 'Inactive'}
								</span>
							</div>
						</div>
						<div>
							<p className='text-gray-500 text-xs uppercase mb-1'>Description</p>
							<p className='leading-relaxed'>{selected.descriptions}</p>
						</div>
						<div className='text-xs text-gray-400'>Created: {new Date(selected.createdDate).toLocaleString()}</div>
					</div>
				)}
			</Modal>
		</div>
	);
};

export default Tariffs;

