import React, { useState,useEffect } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom'; 
import { Container, Row, Col, Button, Card, Badge, ListGroup } from 'react-bootstrap';
import { useGetCourseByIdQuery, useAddToCartMutation } from '../../store/userApiSlice'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import { BiVideo, BiTestTube, BiSolidFilePdf } from 'react-icons/bi'; 
import Footer from '../../components/Footer';

const CourseDetail = () => {
  const { courseId } = useParams(); 
  const navigate = useNavigate(); 

  const { data: course, error, isLoading,refetch } = useGetCourseByIdQuery(courseId);

  useEffect(() => {
    refetch();
  }, [refetch]);

  const [addToCart, { isLoading: isAdding, error: addError }] = useAddToCartMutation(); 

  const [activeTab, setActiveTab] = useState('about');
  const [isHovering, setIsHovering] = useState(false); 

  if (isLoading) return <p>Loading course details...</p>;
  if (error) return <p>Failed to load course details</p>;

  const { title, thumbnail, trailer, description, price, discountPrice, students, lastUpdated, contents, whatToTeach } = course || {};

  const getIconByType = (type) => {
    switch (type) {
      case 'video':
        return <BiVideo className="me-2" size={24} />;
      case 'quiz':
        return <BiTestTube className="me-2" size={24} />;
      case 'text':
        return <BiSolidFilePdf className="me-2" size={24} />;
      default:
        return null;
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(courseId); 
      navigate('/cart'); 
    } catch (error) {
      console.error("Failed to add course to cart", error);
    }
  };

  return (
    <>
      <div className='p-5' style={{backgroundColor:'#0000FF10'}}>
      <Row >
        <Col md={8}>
          <h2>{title}</h2>
          <p className="text-muted">{description}</p>
          <div className="mb-3">
            {Array.isArray(whatToTeach) && whatToTeach.map((item, index) => (
              <Badge bg="info" className="me-2" key={index}>{item}</Badge>
            ))}
          </div>
          <div className="d-flex align-items-center mb-3">
            <p className="me-3"><i className="bi bi-people-fill"></i> {students} Students</p>
            <p className="me-3"><i className="bi bi-book"></i> {contents.length || "0"} Lectures</p>
            <p className="me-3"><i className="bi bi-calendar-fill"></i> Last Updated on {lastUpdated}</p>
          </div>
          <div className="d-flex align-items-center mb-3">
            <h4 className="me-2 text-success">₹ {price}</h4>
            <span className="text-muted"><del>₹ {discountPrice}</del></span>
            <span className="ms-3 badge bg-danger">89% OFF</span>
          </div>

          {/* Add to Cart Button */}
          <Button variant="primary" className="me-3" onClick={handleAddToCart} disabled={isAdding}>
            {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
          </Button>
          {addError && <p className="text-danger mt-2">Failed to add to cart</p>}

          <Button variant="danger">Wishlist</Button>
        </Col>

        {/* Course Thumbnail/Video on Hover */}
        <Col md={4}>
          <Card
            onMouseEnter={() => setIsHovering(true)} // Start hovering
            onMouseLeave={() => setIsHovering(false)} // Stop hovering
          >
            {isHovering && trailer ? (
              <video
                width="100%"
                height="auto"
                autoPlay
                muted
                loop
              >
                <source src={`${trailer}`} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Card.Img variant="top" src={`${thumbnail}`} alt="Course Thumbnail" />
            )}
          </Card>
        </Col>
      </Row>
      </div>

      {/* Course Tabs */}
      <div className="px-5">
      <Row className="mb-5">
        <Col>
          <ul className="nav nav-tabs">
            <li className="nav-item ">
            <button
                className={`nav-link ${activeTab === 'about' ? 'active' : ''}`}
                style={{
                  borderBottom: activeTab === 'about' ? '3px solid #007bff' : 'none' 
                }}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'content' ? 'active' : ''}`}
                style={{
                  borderBottom: activeTab === 'content' ? '3px solid #007bff' : 'none' 
                }}
                onClick={() => setActiveTab('content')}
              >
                Course Content
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'included' ? 'active' : ''}`}
                style={{
                  borderBottom: activeTab === 'included' ? '3px solid #007bff' : 'none' 
                }}
                onClick={() => setActiveTab('included')}
              >
                What's Included
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === 'reviews' ? 'active' : ''}`}
                style={{
                  borderBottom: activeTab === 'reviews' ? '3px solid #007bff' : 'none' 
                }}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews
              </button>
            </li>
          </ul>

          {/* Conditionally render content based on the active tab */}
          {activeTab === 'about' && (
            <div id="about" className="mt-4">
              <h4>Description</h4>
              <p>{description}</p>
            </div>
          )}

          {activeTab === 'content' && (
            <div id="content" className="mt-4">
              <h4>Course Contents</h4>
              {contents && contents.map((chapter, index) => (
                <Card key={index} className="mb-2">
                  <Card.Body className="d-flex align-items-center">
                    <div className="col-1 fw-bold">{index + 1}</div>
                    <div className="col-8">{chapter.contentId.title}</div>
                    <div className="col-3 text-end">
                      {getIconByType(chapter.contentId.type)}
                      <span>{chapter.contentId.type.charAt(0).toUpperCase() + chapter.contentId.type.slice(1)}</span>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'included' && (
            <div id="included" className="mt-4">
              <h4>What's Included</h4>
              <p>Here are the features included in this course...</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div id="reviews" className="mt-4">
              <h4>Reviews</h4>
              <p>Customer reviews and feedback go here...</p>
            </div>
          )}
        </Col>
      </Row>
    </div>
    <Footer/>
    
    </>
  );
};

export default CourseDetail;
