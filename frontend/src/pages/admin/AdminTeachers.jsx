import React, { useState } from 'react';
import { Table, Button, Pagination, FormControl } from 'react-bootstrap';
import Swal from 'sweetalert2';
import { useFetchTeachersQuery, useToggleBlockTeacherMutation, useAcceptInstructorRequestMutation, useRejectInstructorRequestMutation } from '../../store/adminApiSlice';
import { useSelector } from 'react-redux';

const AdminTeachers = () => {
  const { userInfo } = useSelector((state) => state.auth); 
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const limit = 10;
  const { data: teachersData, refetch } = useFetchTeachersQuery({ page, limit });
  const [toggleBlockTeacher] = useToggleBlockTeacherMutation();
  const [acceptInstructorRequest] = useAcceptInstructorRequestMutation();
  const [rejectInstructorRequest] = useRejectInstructorRequestMutation();

  const handleToggleBlock = async (teacherId, currentStatus) => {
    const action = currentStatus === 'blocked' ? 'Unblock' : 'Block';
    const result = await Swal.fire({
      title: `Are you sure you want to ${action} this teacher?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: `Yes, ${action}`,
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await toggleBlockTeacher(teacherId).unwrap();
        refetch();
        Swal.fire(`${action}ed!`, `The teacher has been ${action.toLowerCase()}ed.`, 'success');
      } catch (err) {
        console.error('Failed to toggle block status: ', err);
        Swal.fire('Error', 'Failed to update the status. Please try again later.', 'error');
      }
    }
  };

  const handleAcceptRequest = async (teacherId) => {
    try {
      await acceptInstructorRequest(teacherId).unwrap();
      refetch();
      Swal.fire('Accepted!', 'The request has been accepted.', 'success');
    } catch (err) {
      console.error('Failed to accept request:', err);
      Swal.fire('Error', 'Failed to accept the request. Please try again later.', 'error');
    }
  };

  const handleRejectRequest = async (teacherId) => {
    try {
      await rejectInstructorRequest(teacherId).unwrap();
      refetch();
      Swal.fire('Rejected!', 'The request has been rejected.', 'success');
    } catch (err) {
      console.error('Failed to reject request:', err);
      Swal.fire('Error', 'Failed to reject the request. Please try again later.', 'error');
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch();
  };

  const filteredTeachers = teachersData?.teachers?.filter((teacher) => {
    const username = teacher.username || '';
    const email = teacher.email || '';
    return username.toLowerCase().includes(searchTerm.toLowerCase()) ||
           email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(teachersData?.totalCount / limit) || 1;

  return (
    <div className="admin-teachers">
      <h2>Manage Teachers</h2>
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
            <th>Rating</th>
            <th>No. of Courses</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredTeachers?.map(teacher => (
            <tr key={teacher._id}>
              <td>{teacher.userId.username || 'N/A'}</td>
              <td>{teacher.userId.email || 'N/A'}</td>
              <td>{teacher.userId.rating || 'N/A'}</td>
              <td>{teacher.userId.courses?.length || 0}</td>
              <td>
                {teacher.userId.role === 'RequestForInstructor' ? (
                  <>
                    <Button variant="success" onClick={() => handleAcceptRequest(teacher.userId._id)}>
                      Accept
                    </Button>{' '}
                    <Button variant="danger" onClick={() => handleRejectRequest(teacher.userId._id)}>
                      Reject
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={teacher.userId.status === 'blocked' ? 'danger' : 'success'}
                    onClick={() => handleToggleBlock(teacher._id, teacher.userId.status)}
                  >
                    {teacher.userId.status === 'blocked' ? 'Unblock' : 'Block'}
                  </Button>
                )}
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

export default AdminTeachers;
