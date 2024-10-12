import React, { useState } from 'react';
import { Container, Row, Col, Card, Dropdown, Pagination } from 'react-bootstrap';
import Swal from 'sweetalert2'; // Import SweetAlert
import { useFetchAllCoursesForAdminQuery, useBlockCourseMutation, useUnblockCourseMutation } from '../../store/adminApiSlice';
import "./AdminCourses.css";

const AdminCourses = () => {
  const [page, setPage] = useState(1); // Pagination state
  const [searchTerm, setSearchTerm] = useState(''); // Search term state
  const { data: coursesData, isLoading, error, refetch } = useFetchAllCoursesForAdminQuery({ page, searchTerm }); // Add `refetch`
  const [blockCourse] = useBlockCourseMutation();
  const [unblockCourse] = useUnblockCourseMutation();

  const handlePageChange = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleBlockUnblock = async (courseId, isBlocked) => {
    // Show confirmation dialog
    Swal.fire({
      title: isBlocked ? 'Unblock this course?' : 'Block this course?',
      text: isBlocked ? 'You can block it later if needed.' : 'This course will be blocked!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: isBlocked ? 'Yes, unblock it!' : 'Yes, block it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (isBlocked) {
            await unblockCourse(courseId).unwrap();
          } else {
            await blockCourse(courseId).unwrap();
          }

          // Reload courses after the action
          Swal.fire(
            isBlocked ? 'Unblocked!' : 'Blocked!',
            `The course has been ${isBlocked ? 'unblocked' : 'blocked'}.`,
            'success'
          );

          // Refetch the courses after block/unblock
          refetch(); // Refetch the course data to reflect the latest status
        } catch (error) {
          Swal.fire('Failed!', 'Action failed to complete.', 'error');
        }
      }
    });
  };

  if (isLoading) return <p>Loading courses...</p>;
  if (error) return <p>Failed to load courses.</p>;

  return (
    <Container className="admin-courses-page my-5"> {/* Changed to .admin-courses-page */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <input
          type="text"
          placeholder="Search in your courses..."
          className="form-control"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <Row>
        {coursesData.data.map((course) => (
          <Col key={course._id} md={3} sm={6} className="mb-4">
            <Card>
              <Card.Img variant="top" src={course.thumbnail} />
              <Card.Body>
                <Card.Title>{course.title}</Card.Title>
                <Card.Text>${course.price}</Card.Text>
              </Card.Body>
              <Card.Footer>
                <Dropdown align="end">
                  <Dropdown.Toggle variant="light" id="dropdown-basic" className="ellipsis">
                    <i className="bi bi-three-dots"></i> {/* Bootstrap Icons for ellipsis */}
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleBlockUnblock(course._id, course.isBlocked)}>
                      {course.isBlocked ? 'Unblock' : 'Block'}
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination className="justify-content-center mt-4">
        {[...Array(coursesData.totalPages)].map((_, index) => (
          <Pagination.Item key={index + 1} active={index + 1 === page} onClick={() => handlePageChange(index + 1)}>
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default AdminCourses;
