import { useState } from 'react';
import PortalPage from '../../components/PortalPage';

const initialApplications = [
  {
    id: 1,
    sn: 1,
    batchNo: '5001187/2025/2026/26739',
    indexNo: 'S5380/0080/2021',
    cardNo: '-',
    mobile: '0789079611',
    year: 'Second Year',
    category: 'New Member',
    status: 'Pending',
    appliedOn: '2026-02-17',
  },
];

function NhifCardApplicationPage() {
  const [data, setData] = useState(initialApplications);

  return (
    <PortalPage
      title="My NHIF Card Applications"
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Nhif Portal', to: '/nhif/membership' },
        { label: 'Card Application' },
      ]}
      columns={[
        { key: 'sn', label: 'S/N' },
        { key: 'batchNo', label: 'Batch No' },
        { key: 'indexNo', label: 'Index #' },
        { key: 'cardNo', label: 'Card No' },
        { key: 'mobile', label: 'Mobile' },
        { key: 'year', label: 'Year' },
        { key: 'category', label: 'Category' },
        { key: 'status', label: 'Status' },
        { key: 'appliedOn', label: 'Applied On' },
      ]}
      data={data}
      rowActions={[
        {
          label: 'Edit',
          variant: 'success',
          onClick: (row) => alert(`Edit application ${row.batchNo}`),
        },
        {
          label: 'Send',
          variant: 'info',
          onClick: (row) => {
            setData((prev) =>
              prev.map((item) =>
                item.id === row.id ? { ...item, status: 'Submitted' } : item
              )
            );
            alert(`Application ${row.batchNo} sent successfully`);
          },
        },
      ]}
      onAdd={() => alert('Add new card application')}
    />
  );
}

export default NhifCardApplicationPage;
