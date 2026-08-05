import { useState } from 'react';
import PortalPage from '../../components/PortalPage';

const initialInvoices = [
  {
    id: 1,
    sn: 1,
    academicYear: '',
    batchNo: '5001187/2025/2026/21233',
    indexNo: 'S5380-0080-2021',
    membershipNo: '504012042',
    billAmount: '50400',
    controlNo: '994003068600',
    paymentStatus: 'Paid',
    createdOn: '2026-02-17 10:55:06',
  },
];

function NhifInvoicesPage() {
  const [data] = useState(initialInvoices);

  return (
    <PortalPage
      title="My NHIF Invoices"
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Nhif Portal', to: '/nhif/membership' },
        { label: 'Application Invoices' },
      ]}
      columns={[
        { key: 'sn', label: 'S/N' },
        { key: 'academicYear', label: 'Academic Year' },
        { key: 'batchNo', label: 'Batch No' },
        { key: 'indexNo', label: '4M4 Index#' },
        { key: 'membershipNo', label: 'Membership No' },
        { key: 'billAmount', label: 'Bill Amount (TZS)' },
        { key: 'controlNo', label: 'Control No' },
        { key: 'paymentStatus', label: 'Payment Status' },
        { key: 'createdOn', label: 'Created On' },
      ]}
      data={data}
      rowActions={[
        {
          label: 'View',
          variant: 'info',
          onClick: (row) =>
            alert(
              `Invoice Details\nBatch: ${row.batchNo}\nAmount: TZS ${row.billAmount}\nControl No: ${row.controlNo}\nStatus: ${row.paymentStatus}`
            ),
        },
      ]}
      showAdd={false}
    />
  );
}

export default NhifInvoicesPage;
