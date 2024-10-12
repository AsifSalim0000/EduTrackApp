import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faPlus, faTrash, faStopCircle } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2'; 
import { useDeleteCourseMutation, useToggleLiveCourseMutation } from '../../store/instructorApiSlice'; 
import "./CourseTable.css"

const CourseTable = ({ courses, refetch }) => {
  const navigate = useNavigate();
  const [deleteCourse] = useDeleteCourseMutation(); 
  const [toggleLiveCourse] = useToggleLiveCourseMutation(); 
  const [deletedCourses, setDeletedCourses] = useState([]);

  const handleToggleLive = async (course) => {
    const action = course.isLive ? 'Stop Live' : 'Publish';
    Swal.fire({
      title: `Are you sure you want to ${action} this course?`,
      text: `This action will ${course.isLive ? 'stop the live course' : 'make the course live'}.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: `Yes, ${action} it!`
    }).then(async (result) => {
      if (result.isConfirmed) {
        await toggleLiveCourse({ courseId: course._id, isLive: !course.isLive });
        refetch();
        Swal.fire('Updated!', `The course has been ${course.isLive ? 'stopped from live' : 'published live'}.`, 'success');
      }
    });
  };

  const handleDeleteCourse = async (courseId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this course!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteCourse(courseId);
        setDeletedCourses((prev) => [...prev, courseId]); // Mark course as deleted
        refetch();
        Swal.fire('Deleted!', 'The course has been deleted.', 'success');
      }
    });
  };

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Course Title</th>
          <th>Thumbnail</th>
          <th>Instructor</th>
          <th>Date Created</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course._id}>
            <td>{course.title}</td>
            <td>
              <img style={{ width: '80px', height: 'auto' }} src={`${course.thumbnail}`} alt="Thumbnail" />
            </td>
            <td>{course.instructor.username}</td>
            <td>{new Date(course.createdAt).toLocaleDateString()}</td>
            <td>
              {course.isDeleted ? (
                 <span className='deleted-stamp'>DELETED</span>
              ) : (
                <>
                  <Button variant="success" onClick={() => navigate(`/instructor/courses/${course._id}/add-content`)}>
                    <FontAwesomeIcon icon={faPlus} /> Add Content
                  </Button>{' '}
                  <Button
                    variant={course.isLive ? 'danger' : 'dark'}
                    onClick={() => handleToggleLive(course)}
                  >
                    <FontAwesomeIcon icon={course.isLive ? faStopCircle : faCloudUploadAlt} /> {course.isLive ? 'Stop Live' : 'Publish'}
                  </Button>{' '}
                  <Button variant="danger" onClick={() => handleDeleteCourse(course._id)}>
                    <FontAwesomeIcon icon={faTrash} /> Delete
                  </Button>
                </>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CourseTable;
