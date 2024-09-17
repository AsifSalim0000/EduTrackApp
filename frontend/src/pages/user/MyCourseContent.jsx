import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { useGetMyCourseByIdQuery } from '../../store/userApiSlice';

const MyCourseContent = () => {
  // Extract courseId from the URL
  const { courseId } = useParams();

  const { data: courseData, isLoading, isError, error } = useGetMyCourseByIdQuery(courseId);

  const [selectedContentIndex, setSelectedContentIndex] = useState(0); // Track the index of selected content

  // Set first content as the default content when data is loaded
  useEffect(() => {
    if (courseData && courseData.contents.length > 0 && selectedContentIndex === null) {
      setSelectedContentIndex(0); // Set the first content as default
    }
  }, [courseData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center">
          <h4>Course Not Purchased or Available</h4>
          <p>Please verify if you have purchased this course, or try again later.</p>
        </Alert>
      </Container>
    );
  }

  // Get the current selected content based on index
  const selectedContent = courseData.contents[selectedContentIndex];

  // Render video content with ReactPlayer
  const renderVideoContent = (content) => (
    <ReactPlayer
      url={`/src/assets/uploads/videos${content.contentId.url}`} // Video URL from contentId
      controls={true}
      config={{
        file: {
          attributes: {
            controlsList: 'nodownload' // Disable downloading
          }
        }
      }}
    />
  );

  // Render quiz content as multiple choice questions
  const renderQuizContent = (content) => (
    <Card className="mt-3">
      <Card.Body>
        <h5>Quiz</h5>
        {content.contentId.questions.map((q, index) => (
          <div key={index}>
            <p>{q.question}</p>
            {q.options.map((option, idx) => (
              <div key={idx}>
                <input type="radio" id={`q-${index}-opt-${idx}`} name={`q-${index}`} />
                <label htmlFor={`q-${index}-opt-${idx}`}>{option}</label>
              </div>
            ))}
          </div>
        ))}
      </Card.Body>
    </Card>
  );

  // Render text-based content
  const renderTextContent = (content) => (
    <Card className="mt-3">
      <Card.Body>
        <p>{content.contentId.content}</p> {/* Access text content */}
      </Card.Body>
    </Card>
  );

  // Function to render different content types based on type
  const renderContent = (content) => {
    switch (content.contentId.type) {
      case 'video':
        return renderVideoContent(content);
      case 'quiz':
        return renderQuizContent(content);
      case 'text':
        return renderTextContent(content);
      default:
        return <p>Unknown content type</p>;
    }
  };

  // Navigate to the previous content
  const handlePrev = () => {
    if (selectedContentIndex > 0) {
      setSelectedContentIndex(selectedContentIndex - 1);
    }
  };

  // Navigate to the next content
  const handleNext = () => {
    if (selectedContentIndex < courseData.contents.length - 1) {
      setSelectedContentIndex(selectedContentIndex + 1);
    }
  };

  return (
    <Container fluid>
      <Row>
        {/* Left Sidebar - Course Content List */}
        <Col md={3} className="bg-light p-3">
          <h4>Course Content</h4>
          <ListGroup variant="flush">
            {courseData.contents.map((content, index) => (
              <ListGroup.Item
                key={content.contentId._id}
                action
                onClick={() => setSelectedContentIndex(index)}
                active={selectedContentIndex === index}
              >
               {index+1} {content.contentId.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

   
        <Col md={9} className="p-4">
          <h2>{courseData.title}</h2>
          <p>{courseData.description}</p>

          <div className="d-flex justify-content-between my-4">
            <Button variant="outline-primary" onClick={handlePrev} disabled={selectedContentIndex === 0}>
              Prev
            </Button>
            <Button variant="outline-primary" onClick={handleNext} disabled={selectedContentIndex === courseData.contents.length - 1}>
              Next
            </Button>
            <Button variant="success">Mark as Complete</Button>
          </div>
          {selectedContent ? renderContent(selectedContent) : <p>Select a content to view.</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default MyCourseContent;
