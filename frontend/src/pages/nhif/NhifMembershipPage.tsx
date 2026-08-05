import { useState } from 'react';
import PortalPage from '../../components/PortalPage';

const initialMembership = [
  {
    id: 1,
    sn: 1,
    admissionNo: '32615/T.2024',
    indexNo: 'S5380/0080/2021',
    status: 'Success',
    message: 'Application Received successfully',
    appliedOn: '2026-02-17',
  },
];

function NhifMembershipPage() {
  const [data] = useState(initialMembership);

  return (
    <PortalPage
      title="My NHIF Membership Registration"
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Nhif Portal', to: '/nhif/membership' },
        { label: 'Membership Registration' },
      ]}
      columns={[
        { key: 'sn', label: 'S/N' },
        { key: 'admissionNo', label: 'Admission No' },
        { key: 'indexNo', label: '4M4 Index#' },
        { key: 'status', label: 'Status' },
        { key: 'message', label: 'Message' },
        { key: 'appliedOn', label: 'Applied On' },
      ]}
      data={data}
      rowActions={[
        {
          label: 'Resend',
          variant: 'info',
          onClick: (row: Record<string, unknown>) => alert(`Resending application for ${row.admissionNo}`),
        },
        {
          label: 'Submitted',
          variant: 'secondary',
          onClick: () => {},
          disabled: () => true,
        },
      ]}
      onAdd={() => alert('Add new NHIF membership registration')}
    />
  );
}

export default NhifMembershipPage;
