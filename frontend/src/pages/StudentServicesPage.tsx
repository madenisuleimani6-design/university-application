import { useLocation } from 'react-router-dom';
import PortalPage from '../components/PortalPage';

const serviceConfigs: Record<string, {
  title: string;
  breadcrumb: string;
  columns: { key: string; label: string }[];
  data: Record<string, unknown>[];
  showAdd?: boolean;
}> = {
  'financial-services': {
    title: 'Financial Services',
    breadcrumb: 'Financial Services',
    columns: [
      { key: 'sn', label: 'S/N' },
      { key: 'serviceType', label: 'Service Type' },
      { key: 'description', label: 'Description' },
      { key: 'amount', label: 'Amount (TZS)' },
      { key: 'status', label: 'Status' },
      { key: 'requestedOn', label: 'Requested On' },
    ],
    data: [
      {
        id: 1, sn: 1, serviceType: 'Fee Statement',
        description: 'Semester fee statement request',
        amount: '1,250,000', status: 'Approved', requestedOn: '2026-01-15',
      },
      {
        id: 2, sn: 2, serviceType: 'Payment Receipt',
        description: 'Tuition payment receipt',
        amount: '850,000', status: 'Processed', requestedOn: '2026-02-01',
      },
    ],
  },
  'id-services': {
    title: 'ID Services',
    breadcrumb: 'ID Services',
    columns: [
      { key: 'sn', label: 'S/N' },
      { key: 'idType', label: 'ID Type' },
      { key: 'reason', label: 'Reason' },
      { key: 'status', label: 'Status' },
      { key: 'requestedOn', label: 'Requested On' },
    ],
    data: [
      {
        id: 1, sn: 1, idType: 'Student ID Card',
        reason: 'New issuance', status: 'Pending', requestedOn: '2026-02-10',
      },
    ],
  },
  accommodation: {
    title: 'Accommodation Services',
    breadcrumb: 'Accommodation',
    columns: [
      { key: 'sn', label: 'S/N' },
      { key: 'hostel', label: 'Hostel' },
      { key: 'roomNo', label: 'Room No' },
      { key: 'status', label: 'Status' },
      { key: 'allocatedOn', label: 'Allocated On' },
    ],
    data: [
      {
        id: 1, sn: 1, hostel: 'Mlimani Hostel',
        roomNo: 'B-204', status: 'Allocated', allocatedOn: '2025-09-01',
      },
    ],
  },
  'change-status': {
    title: 'Change Status',
    breadcrumb: 'Change Status',
    columns: [
      { key: 'sn', label: 'S/N' },
      { key: 'currentStatus', label: 'Current Status' },
      { key: 'requestedStatus', label: 'Requested Status' },
      { key: 'reason', label: 'Reason' },
      { key: 'status', label: 'Approval Status' },
      { key: 'appliedOn', label: 'Applied On' },
    ],
    data: [],
  },
  clearance: {
    title: 'Clearance',
    breadcrumb: 'Clearance',
    columns: [
      { key: 'sn', label: 'S/N' },
      { key: 'department', label: 'Department' },
      { key: 'clearanceType', label: 'Clearance Type' },
      { key: 'status', label: 'Status' },
      { key: 'clearedOn', label: 'Cleared On' },
    ],
    data: [
      { id: 1, sn: 1, department: 'Library', clearanceType: 'Book Return', status: 'Cleared', clearedOn: '2026-01-20' },
      { id: 2, sn: 2, department: 'Bursar', clearanceType: 'Financial', status: 'Pending', clearedOn: '-' },
      { id: 3, sn: 3, department: 'ICT', clearanceType: 'Equipment Return', status: 'Pending', clearedOn: '-' },
    ],
  },
  'results-appeal': {
    title: 'Result(s) Appeal',
    breadcrumb: 'Result(s) Appeal',
    columns: [
      { key: 'sn', label: 'S/N' },
      { key: 'courseCode', label: 'Course Code' },
      { key: 'courseName', label: 'Course Name' },
      { key: 'grade', label: 'Current Grade' },
      { key: 'status', label: 'Appeal Status' },
      { key: 'submittedOn', label: 'Submitted On' },
    ],
    data: [],
  },
  'academic-documents': {
    title: 'Academic Documents',
    breadcrumb: 'Academic Documents',
    columns: [
      { key: 'sn', label: 'S/N' },
      { key: 'documentType', label: 'Document Type' },
      { key: 'purpose', label: 'Purpose' },
      { key: 'status', label: 'Status' },
      { key: 'requestedOn', label: 'Requested On' },
    ],
    data: [
      {
        id: 1, sn: 1, documentType: 'Transcript',
        purpose: 'Job application', status: 'Ready', requestedOn: '2026-01-05',
      },
    ],
  },
};

function StudentServicesPage() {
  const location = useLocation();
  const segment = location.pathname.split('/').pop() || 'financial-services';
  const config = serviceConfigs[segment];

  if (!config) {
    return (
      <PortalPage
        title="Student Services"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Student Services' },
        ]}
        columns={[{ key: 'sn', label: 'S/N' }, { key: 'message', label: 'Message' }]}
        data={[{ sn: 1, message: 'Select a service from the sidebar menu.' }]}
        showAdd={false}
      />
    );
  }

  return (
    <PortalPage
      title={config.title}
      breadcrumbs={[
        { label: 'Home', to: '/' },
        { label: 'Student Services', to: '/student-services/financial-services' },
        { label: config.breadcrumb },
      ]}
      columns={config.columns}
      data={config.data}
      rowActions={[
        { label: 'View', variant: 'info', onClick: (row) => alert(JSON.stringify(row, null, 2)) },
        { label: 'Apply', variant: 'primary', onClick: () => alert('Application submitted') },
      ]}
      onAdd={() => alert(`New ${config.title} request`)}
      emptyMessage={`No ${config.title.toLowerCase()} records. Click Add + to create one.`}
    />
  );
}

export default StudentServicesPage;
