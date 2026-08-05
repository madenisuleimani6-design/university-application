import { useState } from 'react';
import PortalPage from '../../components/PortalPage';

function NhifVerificationPage() {
  const [data, setData] = useState<Record<string, unknown>[]>([]);

  const handleAdd = () => {
    const newRecord: Record<string, unknown> = {
      id: Date.now(),
      sn: data.length + 1,
      cardNo: '',
      verificationCode: '',
      fullName: 'SULEIMANI MAULID MADENI',
      remarks: '',
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setData((prev) => [...prev, newRecord]);
    alert('New card verification request added. Please complete the details.');
  };

  return (
    <PortalPage
      title="My NHIF Card Verifications"
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Nhif Portal', to: '/nhif/membership' },
        { label: 'Card Verification' },
      ]}
      columns={[
        { key: 'sn', label: 'S/N' },
        { key: 'cardNo', label: 'Card No' },
        { key: 'verificationCode', label: 'Verification Code' },
        { key: 'fullName', label: 'Full Name' },
        { key: 'remarks', label: 'Remarks' },
        { key: 'status', label: 'Status' },
        { key: 'appliedOn', label: 'Applied On' },
      ]}
      data={data}
      rowActions={[
        {
          label: 'Verify',
          variant: 'primary',
          onClick: (row) => {
            setData((prev) =>
              prev.map((item) =>
                item.id === row.id ? { ...item, status: 'Verified' } : item
              )
            );
          },
        },
      ]}
      onAdd={handleAdd}
      emptyMessage="No verification records. Click Add + to submit a new verification."
    />
  );
}

export default NhifVerificationPage;
