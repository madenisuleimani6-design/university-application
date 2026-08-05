import { useState } from 'react';
import PortalPage from '../components/PortalPage';

const initialResults = [
  {
    id: 1, sn: 1, courseCode: 'ISM 2101', courseName: 'Database Systems',
    creditHours: 10, marks: 78, grade: 'B+', gpa: 3.5, semester: 'Semester I', academicYear: '2025/26',
  },
  {
    id: 2, sn: 2, courseCode: 'ISM 2102', courseName: 'Software Engineering',
    creditHours: 10, marks: 85, grade: 'A', gpa: 4.0, semester: 'Semester I', academicYear: '2025/26',
  },
  {
    id: 3, sn: 3, courseCode: 'ISM 2103', courseName: 'Computer Networks',
    creditHours: 10, marks: 72, grade: 'B', gpa: 3.0, semester: 'Semester I', academicYear: '2025/26',
  },
  {
    id: 4, sn: 4, courseCode: 'ISM 1101', courseName: 'Introduction to Programming',
    creditHours: 10, marks: 68, grade: 'B-', gpa: 2.7, semester: 'Semester II', academicYear: '2024/25',
  },
  {
    id: 5, sn: 5, courseCode: 'ISM 1102', courseName: 'Mathematics for Computing',
    creditHours: 10, marks: 55, grade: 'C', gpa: 2.0, semester: 'Semester II', academicYear: '2024/25',
  },
];

function AcademicPage() {
  const [data] = useState(initialResults);

  const avgGpa = (data.reduce((sum, r) => sum + (r.gpa as number), 0) / data.length).toFixed(2);

  return (
    <div>
      <div className="alert alert-info mb-3">
        <i className="fas fa-info-circle me-2"></i>
        <strong>Overall GPA: {avgGpa}</strong> &mdash; Academic Year 2025/26
      </div>
      <PortalPage
        title="My Results"
        breadcrumbs={[
          { label: 'Home', to: '/' },
          { label: 'Academic', to: '/academic/results' },
          { label: 'My Results' },
        ]}
        columns={[
          { key: 'sn', label: 'S/N' },
          { key: 'courseCode', label: 'Course Code' },
          { key: 'courseName', label: 'Course Name' },
          { key: 'creditHours', label: 'Credit Hours' },
          { key: 'marks', label: 'Marks' },
          { key: 'grade', label: 'Grade' },
          { key: 'gpa', label: 'GPA' },
          { key: 'semester', label: 'Semester' },
          { key: 'academicYear', label: 'Academic Year' },
        ]}
        data={data}
        rowActions={[
          {
            label: 'View',
            variant: 'info',
            onClick: (row) =>
              alert(`${row.courseCode}: ${row.courseName}\nMarks: ${row.marks}\nGrade: ${row.grade}\nGPA: ${row.gpa}`),
          },
        ]}
        showAdd={false}
      />
    </div>
  );
}

export default AcademicPage;
