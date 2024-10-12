import React, { useEffect, useState } from 'react';
import { Button, Container, Form, Row, Col } from 'react-bootstrap';
import CourseTable from '../../components/instructor/CourseTable';
import { useFetchCoursesQuery } from '../../store/instructorApiSlice';
import Pagination from '../../components/instructor/Pagination';
import { useNavigate } from 'react-router-dom';

const CoursesPage = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();


  const { data, isLoading, isError, refetch } = useFetchCoursesQuery({
    page: currentPage,
    search,
  });

  useEffect(() => {

    refetch();
  }, [refetch]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1>All Courses</h1>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
        <Col md={6} className="text-md-end">
          <Button onClick={() => navigate('/instructor/courses/create-course')}>Create Course</Button>
        </Col>
      </Row>

      <CourseTable courses={data?.data || []} refetch={refetch} />

      <Pagination
        currentPage={currentPage}
        totalPages={data?.totalPages || 0}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </Container>
  );
};

export default CoursesPage;
