import React, { useState } from 'react';
import { Button, Form, Container } from 'react-bootstrap';
import { useCreateCourseMutation } from '../../store/instructorApiSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateCourseForm = () => {
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    thumbnail: null,
  });

  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createCourse(courseData).unwrap();
      
      
      Swal.fire({
        icon: 'success',
        title: 'Course Created',
        text: 'Your course has been successfully created!',
        confirmButtonText: 'OK',
      }).then(() => {

        navigate('/instructor/courses');
      });

    } catch (err) {
      console.error('Failed to create the course: ', err);

      // SweetAlert2 error alert
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error creating the course.',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <Container>
      <h1>Create New Course</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="courseTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={courseData.title}
            onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="courseDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            value={courseData.description}
            onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
          />
        </Form.Group>

        <Form.Group controlId="courseThumbnail">
          <Form.Label>Thumbnail</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setCourseData({ ...courseData, thumbnail: e.target.files[0] })}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
          {isLoading ? 'Creating...' : 'Create Course'}
        </Button>
      </Form>
    </Container>
  );
};

export default CreateCourseForm;
