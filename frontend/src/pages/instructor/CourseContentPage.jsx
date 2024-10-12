import React, { useState, useEffect } from 'react';
import { Button, Container, Form, Row, Col, Card } from 'react-bootstrap';
import { FaUpload } from 'react-icons/fa'; 
import DraggableChapters from '../../components/instructor/DraggableChapters';
import { useNavigate, useParams } from 'react-router-dom'; 
import { useFetchCourseDetailsQuery, useSaveCourseDetailsMutation, useUploadVideoMutation } from '../../store/instructorApiSlice'; // Import the useUploadVideoMutation
import Swal from 'sweetalert2'; 
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const CourseContentPage = () => {
  const { courseId } = useParams(); 
  const [activeTab, setActiveTab] = useState('advance');
  const navigate = useNavigate();
  const [courseDetails, setCourseDetails] = useState({
    thumbnail: null,
    trailer: null,
    description: '',
    whatToTeach: [''],
    contents: [],
    title: '',
    price: '', 
  });
  


  const { data, error, isLoading, refetch } = useFetchCourseDetailsQuery(courseId); 

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [saveCourseDetails] = useSaveCourseDetailsMutation(); 
  const [uploadVideo] = useUploadVideoMutation(); 

  useEffect(() => {
    if (data) {
      setCourseDetails({
        ...courseDetails,
        thumbnail: data.thumbnail || null,
        trailer: data.trailer || null,
        description: data.description || '',
        whatToTeach: data.whatToTeach || [''],
        contents: data.contents || [],
        title: data.title || '',  
        price: data.price || '', 
      });
    }
  }, [data]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseDetails({ ...courseDetails, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setCourseDetails({
      ...courseDetails,
      [name]: files[0], 
    });
  };

  const handleWhatToTeachChange = (index, value) => {
    const updatedWhatToTeach = [...courseDetails.whatToTeach];
    updatedWhatToTeach[index] = value;
    setCourseDetails({ ...courseDetails, whatToTeach: updatedWhatToTeach });
  };

  const addWhatToTeachField = () => {
    setCourseDetails({
      ...courseDetails,
      whatToTeach: [...courseDetails.whatToTeach, ''],
    });
  };

  const removeWhatToTeachField = (index) => {
    const updatedWhatToTeach = courseDetails.whatToTeach.filter((_, i) => i !== index);
    setCourseDetails({ ...courseDetails, whatToTeach: updatedWhatToTeach });
  };

  const handleVideoUpload = async () => {
    if (!courseDetails.trailer) {
      Swal.fire({
        title: 'Error!',
        text: 'Please select a video to upload.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('video', courseDetails.trailer);

      const response = await uploadVideo(formData).unwrap(); 
      setCourseDetails({ ...courseDetails, trailer: response.videoUrl }); 

      Swal.fire({
        title: 'Success!',
        text: 'Trailer uploaded successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'Failed to upload trailer. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  const handleSave = async () => {
    try {
      const formData = new FormData();
  
      formData.append('description', courseDetails.description);
      formData.append('trailer', courseDetails.trailer);
      formData.append('whatToTeach', JSON.stringify(courseDetails.whatToTeach));
      formData.append('contents', JSON.stringify(courseDetails.contents));
      formData.append('courseId', courseId);
  
      if (courseDetails.thumbnail instanceof File) {
        formData.append('thumbnail', courseDetails.thumbnail);
      }

      formData.append('title', courseDetails.title);
      formData.append('price', courseDetails.price);
  
      const res=await saveCourseDetails(formData).unwrap();
      if(res.success){
        Swal.fire({
          title: 'Success!',
          text: 'Course details and chapters saved successfully!',
          icon: 'success',
          confirmButtonText: 'OK',
        });
    
        navigate('/instructor/courses');
      }
     else{
      Swal.fire({
        title: 'Error!',
        text: res.error,
        icon: 'error',
        confirmButtonText: 'OK',
      });
     }
    } catch (error) {
      console.error('Failed to save course details or chapters:', error);
      Swal.fire({
        title: 'Error!',
        text: error,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  };

  return (
    <Container className="mt-5 bg-white shadow p-3">
      {/* Top Navigation */}
      <nav className="nav nav-tabs">
        <a
          className={`nav-link ${activeTab === 'advance' ? 'active' : ''}`}
          href="#"
          onClick={() => setActiveTab('advance')}
        >
          Advance Information
        </a>
        <a
          className={`nav-link ${activeTab === 'curriculum' ? 'active' : ''}`}
          href="#"
          onClick={() => setActiveTab('curriculum')}
        >
          Curriculum
        </a>
      </nav>

      {/* Advance Information Tab */}
      {activeTab === 'advance' && (
        <div className="mt-4">
          <h4>Advance Information</h4>

          <Row className="mb-4">
            {/* Course Thumbnail */}
            <Col md={6}>
              <Form.Group controlId="courseThumbnail">
                <Form.Label>Course Thumbnail</Form.Label>
                <Card className="p-3">
                  {courseDetails.thumbnail ? (
                    <img
                      src={`${courseDetails.thumbnail}`}
                      className="card-img-top mb-3"
                      alt="Thumbnail"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/200x120"
                      className="card-img-top mb-3"
                      alt="Thumbnail"
                    />
                  )}
                  <Form.Control
                    type="file"
                    accept="image/*"
                    name="thumbnail"
                    onChange={handleFileChange}
                  />
                  <small className="text-muted">
                    Supported formats: jpg, jpeg, png. Recommended size: 1200x800 pixels or 12:8 ratio.
                  </small>
                </Card>
              </Form.Group>
            </Col>

            {/* Course - Trailer */}
            <Col md={6}>
              <Form.Group controlId="courseTrailer">
                <Form.Label>Course Trailer</Form.Label>
                <Card className="p-3">
                  {courseDetails.trailer ? (
                    <video
                      controls
                      src={`${courseDetails.trailer}`}
                      className="card-img-top mb-3"
                    />
                  ) : (
                    <img
                      src="https://via.placeholder.com/200x120"
                      className="card-img-top mb-3"
                      alt="Trailer"
                    />
                  )}
                  <div className="d-flex">
                    <Form.Control
                      type="file"
                      accept="video/*"
                      name="trailer"
                      onChange={handleFileChange}
                      className="me-2"
                    />
                    <Button variant="primary" onClick={handleVideoUpload}>
                      <FaUpload /> Upload
                    </Button>
                  </div>
                  <small className="text-muted">
                    Uploading a promo video can increase your course enrollment.
                  </small>
                </Card>
              </Form.Group>
            </Col>
          </Row>
          {/* Course Title */}
          <Form.Group controlId="courseTitle" className="mb-4">
            <Form.Label>Course Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={courseDetails.title || ''}
              onChange={handleInputChange}
              placeholder="Enter the course title"
            />
          </Form.Group>

          {/* Course Price */}
          <Form.Group controlId="coursePrice" className="mb-4">
            <Form.Label>Course Price</Form.Label>
            <Form.Control
              type="number"
              name="price"
              value={courseDetails.price || ''} 
              onChange={handleInputChange}
              placeholder="Enter the course price"
            />
          </Form.Group>
                            
          {/* Course Description */}
          <Form.Group controlId="courseDescription" className="mb-4">
            <Form.Label>Course Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description"
              value={courseDetails.description}
              onChange={handleInputChange}
              placeholder="Enter your course description"
            />
          </Form.Group>

          {/* What you will teach */}
          <Form.Group controlId="whatYouWillTeach" className="mb-4">
            <Form.Label>What you will teach in this course (4/8)</Form.Label>
            {courseDetails.whatToTeach.map((item, index) => (
              <div key={index} className="mb-3 d-flex align-items-center">
                <Form.Control
                  type="text"
                  value={item}
                  onChange={(e) => handleWhatToTeachChange(index, e.target.value)}
                  placeholder="What you will teach in this course..."
                  className="me-2"
                />
                <Button variant="danger" onClick={() => removeWhatToTeachField(index)}>Remove</Button>
              </div>

            ))}
            <Button variant="primary" onClick={addWhatToTeachField}>Add More</Button>
           
          </Form.Group>
        </div>
      )}

      {/* Curriculum Tab */}
      {activeTab === 'curriculum' && (
        <div className="mt-4">
          <h4>Course Curriculum</h4>

          <ToastContainer />
          <DraggableChapters
            chapters={courseDetails.contents}
            setChapters={(newChapters) =>
              setCourseDetails({ ...courseDetails, contents: newChapters })
            }
          />
          <Button className="mt-4" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </Container>
  );
};

export default CourseContentPage;
