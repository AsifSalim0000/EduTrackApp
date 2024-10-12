import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, ListGroup, Alert } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import { useGetMyCourseByIdQuery, useMarkContentAsCompleteMutation } from '../../store/userApiSlice';
import './MyCourseContent.css';
import { toast } from 'react-toastify';

const MyCourseContent = () => {
  const { courseId } = useParams();
  const { data: courseData, isLoading, isError } = useGetMyCourseByIdQuery(courseId);
  const [selectedContentIndex, setSelectedContentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [markAsComplete] = useMarkContentAsCompleteMutation();

const handleMarkComplete = async () => {
  try {
    await markAsComplete({ courseId, contentId: selectedContent.contentId._id });
    toast.success('Marked as complete!');
  } catch (error) {
    console.error('Failed to mark as complete:', error);
    toast.error('Error marking as complete');
  }
};

  useEffect(() => {
    if (courseData && courseData.contents.length > 0 && selectedContentIndex === null) {
      setSelectedContentIndex(0);
    }
  }, [courseData]);

  if (isLoading) {
    return <div className="mycourse-loading">Loading...</div>;
  }

  if (isError) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center mycourse-error-alert">
          <h4>Course Not Purchased or Available</h4>
          <p>Please verify if you have purchased this course, or try again later.</p>
        </Alert>
      </Container>
    );
  }

  const selectedContent = courseData.contents[selectedContentIndex];

  const renderVideoContent = (content) => (
    <ReactPlayer
      url={`${content.contentId.url}`}
      controls={true}
      className="mycourse-video-player"
      config={{
        file: {
          attributes: {
            controlsList: 'nodownload',
          },
        },
      }}
    />
  );

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: selectedOption,
    }));
  };

  const renderQuizContent = (content) => (
    <Card className="mycourse-card mt-3">
      <Card.Body>
        <h5>Quiz</h5>
        {content.contentId.questions.map((q, index) => (
          <div key={index}>
            <p>{q.question}</p>
            {q.options.map((option, idx) => {
              const isCorrect = userAnswers[index] === parseInt(q.correctAnswer);
              const isSelected = userAnswers[index] === idx;

              let backgroundColor;
              if (isSelected && isCorrect) {
                backgroundColor = 'lightgreen'; 
              } else if (isSelected && !isCorrect) {
                backgroundColor = 'lightcoral'; 
              }

              return (
                <div key={idx} style={{ backgroundColor }}>
                  <input
                    type="radio"
                    id={`q-${index}-opt-${idx}`}
                    name={`q-${index}`}
                    value={idx}
                    checked={isSelected}
                    onChange={() => handleAnswerChange(index, idx)}
                  />
                  <label htmlFor={`q-${index}-opt-${idx}`}>{option}</label>
                </div>
              );
            })}
            {userAnswers[index] !== undefined && (
              <div>
                {userAnswers[index] === parseInt(q.correctAnswer) ? (
                  <span className="text-success">Correct!</span>
                ) : (
                  <span className="text-danger">Incorrect!</span>
                )}
              </div>
            )}
          </div>
        ))}
      </Card.Body>
    </Card>
  );

  const renderTextContent = (content) => (
    <Card className="mycourse-card mt-3">
      <Card.Body>
        <p>{content.contentId.content}</p>
      </Card.Body>
    </Card>
  );

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

  const handlePrev = () => {
    if (selectedContentIndex > 0) {
      setSelectedContentIndex(selectedContentIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedContentIndex < courseData.contents.length - 1) {
      setSelectedContentIndex(selectedContentIndex + 1);
    }
  };

  return (
    <Container fluid className="mycourse-container">
      <Row>
        <Col md={3} className="mycourse-sidebar p-3">
          <h4 className="mycourse-heading">Course Content</h4>
          <ListGroup variant="flush" className="mycourse-list-group">
            {courseData.contents.map((content, index) => (
              <ListGroup.Item
                key={content.contentId._id}
                action
                onClick={() => setSelectedContentIndex(index)}
                active={selectedContentIndex === index}
                className={`mycourse-list-item ${selectedContentIndex === index ? 'active' : ''}`}
              >
                {index + 1}. {content.contentId.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={9} className="p-4 mycourse-content">
          <h2 className="mycourse-title">{courseData.title}</h2>
          <p className="mycourse-description">{courseData.description}</p>

          <div className="d-flex justify-content-between my-4">
            <Button variant="outline-primary" onClick={handlePrev} disabled={selectedContentIndex === 0} className="mycourse-btn">
              Prev
            </Button>
            <Button variant="outline-primary" onClick={handleNext} disabled={selectedContentIndex === courseData.contents.length - 1} className="mycourse-btn">
              Next
            </Button>
            <Button variant="success" onClick={handleMarkComplete} className="mycourse-complete-btn">Mark as Complete</Button>
          </div>
          {selectedContent ? renderContent(selectedContent) : <p>Select a content to view.</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default MyCourseContent;
