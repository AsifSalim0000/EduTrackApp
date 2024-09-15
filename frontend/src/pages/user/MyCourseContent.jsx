import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import ReactPlayer from 'react-player';
import axios from 'axios'; // For making API calls to your backend

const MyCourseContent = () => {
  // Use useParams to get courseId from the URL
  const { courseId } = useParams();
  
  const [courseData, setCourseData] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);

  useEffect(() => {
    // Fetch the course data from the backend
    axios.get(`/api/mycourses/${courseId}`)
      .then(response => {
        setCourseData(response.data);
      })
      .catch(error => {
        console.error('Error fetching the course data:', error);
      });
  }, [courseId]);

  if (!courseData) {
    return <div>Loading...</div>;
  }

  // Render video content with quality change
  const renderVideoContent = (content) => {
    return (
      <ReactPlayer
        url={`/src/assets/uploads/videos${content.contentId.url}`} // Access the video URL from contentId
        controls={true}
        config={{
          file: {
            attributes: {
              controlsList: 'nodownload' // This prevents download
            }
          }
        }}
      />
    );
  };

  // Render quiz content
  const renderQuizContent = (content) => {
    return (
      <Card>
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
  };

  // Render text content
  const renderTextContent = (content) => {
    return (
      <Card>
        <Card.Body>
          <p>{content.contentId.content}</p> {/* Access the text content from contentId */}
        </Card.Body>
      </Card>
    );
  };

  // Render the selected content based on its type
  const renderContent = (content) => {
    switch (content.contentId.type) { // Access type from contentId
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

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h2>{courseData.title}</h2>
          <p>{courseData.description}</p>
          {selectedContent ? renderContent(selectedContent) : <p>Select a content to view.</p>}
        </Col>
        <Col md={4}>
          <h4>Course Contents</h4>
          <ul>
            {courseData.contents.map((content, index) => (
              <li key={content.contentId._id}>
                <Button onClick={() => setSelectedContent(content)}>
                  {content.contentId.title} {/* Access title from contentId */}
                </Button>
              </li>
            ))}
          </ul>
        </Col>
      </Row>
    </Container>
  );
};

export default MyCourseContent;
