import React, { useState } from 'react';
import { Table, Button, Pagination, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useFetchStudentsQuery, useToggleBlockStudentMutation } from '../../store/adminApiSlice';

const AdminStudents = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10; // Number of students per page
  const { data: studentsData, refetch } = useFetchStudentsQuery({ page, limit });
  const [toggleBlockStudent] = useToggleBlockStudentMutation();

  const handleToggleBlock = async (studentId, currentStatus) => {
    const action = currentStatus === 'blocked' ? 'Unblock' : 'Block';
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this student?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await toggleBlockStudent(studentId).unwrap();
        refetch();
        Swal.fire(`${action}ed!`, `The student has been ${action.toLowerCase()}ed.`, 'success');
      } catch (err) {
        console.error('Failed to toggle block status: ', err);
        Swal.fire('Error', 'Failed to update the status. Please try again later.', 'error');
      }
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch(); // Refetch data for the new page
  };

  const filteredStudents = studentsData?.students?.filter((student) =>
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(studentsData?.totalCount / limit) || 1;

  return (
    <div className="admin-students">
      <h2>Manage Students</h2>
      <FormControl
        type="text"
        placeholder="Search by username or email"
        className="mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Table striped bordered hover responsive className="mt-4">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Plan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents?.map(student => (
            <tr key={student._id}>
              <td>{student.username}</td>
              <td>{student.email}</td>
              <td>{student.plan}</td>
              <td>
                <Button
                  variant={student.status === 'blocked' ? 'danger' : 'success'}
                  onClick={() => handleToggleBlock(student._id, student.status)}
                >
                  {student.status === 'blocked' ? 'Unblock' : 'Block'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination className="mt-4 align-items-center justify-content-center">
        <Pagination.Prev
          onClick={() => page > 1 && handlePageChange(page - 1)}
          disabled={page === 1}
        />
        {[...Array(totalPages)].map((_, index) => (
          <Pagination.Item
            key={index + 1}
            active={index + 1 === page}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
        <Pagination.Next
          onClick={() => page < totalPages && handlePageChange(page + 1)}
          disabled={page === totalPages}
        />
      </Pagination>
    </div>
  );
};

export default AdminStudents;
