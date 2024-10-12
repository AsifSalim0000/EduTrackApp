import React, { useState, useRef } from 'react';
import { Form, Row, Col, Card, Button, Accordion } from 'react-bootstrap';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useUploadVideoMutation } from '../../store/instructorApiSlice';
import { FaUpload } from 'react-icons/fa';

const DraggableChapters = ({ chapters, setChapters }) => {
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [uploadVideo] = useUploadVideoMutation(); 

  const validChapters = Array.isArray(chapters) ? chapters : [];
  const [fileInputs, setFileInputs] = useState({}); 

  const handleChange = (index, field, value) => {
    const updatedChapters = [...validChapters];
    updatedChapters[index] = {
      ...updatedChapters[index],
      contentId: {
        ...updatedChapters[index].contentId,
        [field]: value,
      },
    };
    setChapters(updatedChapters);
  };

  const handleVideoUpload = async (index, file) => {
    

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await uploadVideo(formData).unwrap();
      toast.success("Video uploaded successfully")
      handleChange(index, 'content', response.videoUrl);
    } catch (error) {
      toast.error("Error uploading video")
      console.error('Error uploading video:', error);
    }

    setFileInputs((prev) => ({ ...prev, [index]: null }));
  };

  const handleDelete = (index) => {
    const updatedChapters = validChapters.filter((_, i) => i !== index);
    setChapters(updatedChapters);
  };

  const handleAddChapter = (type) => {
    const newChapter = {
      contentId: {
        title: '',
        type: type,
        questions: type === 'quiz' ? [] : undefined,
        content: type === 'quiz' ? undefined : '',
        url: type === 'video' ? '': undefined,
      },
    };
    setChapters([...validChapters, newChapter]);
  };

  const handleQuizQuestionChange = (chapterIndex, questionIndex, field, value) => {
    const updatedChapters = [...validChapters];
    updatedChapters[chapterIndex].contentId.questions[questionIndex][field] = value;
    setChapters(updatedChapters);
  };

  const handleAddQuizQuestion = (chapterIndex) => {
    const updatedChapters = [...validChapters];

    // Ensure the questions array is initialized
    if (!updatedChapters[chapterIndex].contentId.questions) {
      updatedChapters[chapterIndex].contentId.questions = [];
    }

    updatedChapters[chapterIndex].contentId.questions.push({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    });
    setChapters(updatedChapters);
  };

  const renderQuiz = (chapter, chapterIndex) => (
    <div>
      <Button variant="primary" onClick={() => handleAddQuizQuestion(chapterIndex)}>
        Add Quiz Question
      </Button>
      {chapter.contentId.questions.map((question, questionIndex) => (
        <Card className="my-3" key={questionIndex}>
          <Card.Body>
            <Form.Group>
              <Form.Label>Question</Form.Label>
              <Form.Control
                type="text"
                value={question.question}
                onChange={(e) => handleQuizQuestionChange(chapterIndex, questionIndex, 'question', e.target.value)}
                placeholder="Enter the question"
              />
            </Form.Group>
            <Row className="my-2">
              {question.options.map((option, optionIndex) => (
                <Col key={optionIndex}>
                  <Form.Group>
                    <Form.Label>Option {optionIndex + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      value={option}
                      onChange={(e) =>
                        handleQuizQuestionChange(chapterIndex, questionIndex, 'options', [
                          ...question.options.slice(0, optionIndex),
                          e.target.value,
                          ...question.options.slice(optionIndex + 1),
                        ])
                      }
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>
            <Form.Group>
              <Form.Label>Correct Answer</Form.Label>
              <Form.Select
                value={question.correctAnswer}
                onChange={(e) =>
                  handleQuizQuestionChange(chapterIndex, questionIndex, 'correctAnswer', parseInt(e.target.value))
                }
              >
                {question.options.map((_, optionIndex) => (
                  <option key={optionIndex} value={optionIndex}>
                    Option {optionIndex + 1}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Card.Body>
        </Card>
      ))}
    </div>
  );

  const renderContentInput = (chapter, index) => {
    if (chapter.contentId.type === 'video') {
      return (
        <Form.Group controlId={`chapterContent-${index}`}>
          <Form.Label>Upload Video</Form.Label>
          <Row>
            <Col xs={10}>
            {chapter.contentId.url ? (
                    <video
                      controls
                      src={`${chapter.contentId.url}`}
                      className="card-img-top mb-3 w-50"
                     
                    />
                  ) : (
                   <label>No video</label>
                  )}
              <Form.Control
                type="file"
                accept="video/*"
                onChange={(e) => setFileInputs((prev) => ({ ...prev, [index]: e.target.files[0] }))}
              />
            </Col>
            <Col xs={2}>
              <Button
                variant="primary"
                onClick={() => {
                  const file = fileInputs[index];
                  if (file) {
                    handleVideoUpload(index, file);
                  }
                }}
              >
                <FaUpload /> {/* Icon for upload */}
              </Button>
            </Col>
          </Row>
        </Form.Group>
      );
    } else if (chapter.contentId.type === 'text') {
      return (
        <Form.Group controlId={`chapterContent-${index}`}>
          <Form.Label>Text Content</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={chapter.contentId.content}
            onChange={(e) => handleChange(index, 'content', e.target.value)}
          />
        </Form.Group>
      );
    } else if (chapter.contentId.type === 'quiz') {
      return renderQuiz(chapter, index);
    }
    return null;
  };

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const updatedChapters = [...validChapters];
    const draggedItem = updatedChapters[dragItem.current];
    updatedChapters.splice(dragItem.current, 1);
    updatedChapters.splice(dragOverItem.current, 0, draggedItem);
    setChapters(updatedChapters);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  return (
    <div>
      <div className="draggable-container">
        {validChapters.length === 0 ? (
          <div className="text-center mt-4">
            <p>No chapters available. Please add new chapters.</p>
          </div>
        ) : (
          <Accordion>
            {validChapters.map((chapter, index) => (
              <Accordion.Item
                eventKey={index.toString()}
                key={index}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={(e) => e.preventDefault()}
              >
                <Accordion.Header>
                  <Row className="w-100">
                    <Col xs={1}>
                      <Button variant="light" className="drag-handle" aria-label="Drag">
                        &#x2630;
                      </Button>
                    </Col>
                    <Col>
                      <Form.Group controlId={`chapterTitle-${index}`}>
                        <Form.Label>Chapter Title</Form.Label>
                        <Form.Control
                          type="text"
                          value={chapter.contentId.title}
                          onChange={(e) => handleChange(index, 'title', e.target.value)}
                          placeholder="Enter chapter title"
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={3}>
                      <Form.Group controlId={`chapterType-${index}`}>
                        <Form.Label>Type</Form.Label>
                        <Form.Select
                          value={chapter.contentId.type}
                          onChange={(e) => handleChange(index, 'type', e.target.value)}
                        >
                          <option value="video">Video</option>
                          <option value="text">Text</option>
                          <option value="quiz">Quiz</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col xs={2}>
                      <Button variant="danger" onClick={() => handleDelete(index)}>Delete</Button>
                    </Col>
                  </Row>
                </Accordion.Header>
                <Accordion.Body>
                  {renderContentInput(chapter, index)}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        )}
      </div>
      <Button
        variant="success"
        onClick={() => handleAddChapter('video')}
        className="my-3"
      >
        Add Video Chapter
      </Button>
      <Button
        variant="success"
        onClick={() => handleAddChapter('text')}
        className="mx-2 my-3"
      >
        Add Text Chapter
      </Button>
      <Button
        variant="success"
        onClick={() => handleAddChapter('quiz')}
        className="my-3"
      >
        Add Quiz Chapter
      </Button>
    </div>
  );
};

DraggableChapters.propTypes = {
  chapters: PropTypes.array.isRequired,
  setChapters: PropTypes.func.isRequired,
};

export default DraggableChapters;
