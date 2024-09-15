import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';


const CourseTable = ({ courses }) => {
  const navigate = useNavigate();

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Course Title</th>
          <th>Thumpnail</th>
          <th>Instructor</th>
          <th>Date Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course._id}>
            <td>{course.title} </td>
            <td><img style={{ width: '80px', height: 'auto' }} src={`/src/assets/uploads/${course.thumbnail}`} alt="Thumbnail" /></td>
            <td>{course.instructor.username}</td>
            <td>{new Date(course.createdAt).toLocaleDateString()}</td>
            <td>
            {' '}
            <Button variant="success" onClick={() => navigate(`/instructor/courses/${course._id}/add-content`)}>
              <FontAwesomeIcon icon={faPlus} /> Add Content
            </Button>{' '}
            <Button variant="dark" onClick={() => navigate(`/instructor/courses/${course._id}/publish`)}>
              <FontAwesomeIcon icon={faCloudUploadAlt} /> Publish
            </Button>{' '}
            <Button variant="danger" onClick={() => deleteCourse(course._id)}>
              <FontAwesomeIcon icon={faTrash} />
            </Button>

            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CourseTable;
