import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useCreateInstructorMutation } from '../../store/instructorApiSlice';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setCredentials } from '../../store/authSlice';

const BecomeTeacherForm = () => {
    const [qualifications, setQualifications] = useState([{ id: Date.now(), value: '' }]);
    const [teachingExperience, setTeachingExperience] = useState('');
    const [audience, setAudience] = useState('');
    const [preferredMethods, setPreferredMethods] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [createInstructor, { isLoading }] = useCreateInstructorMutation();
    const { userInfo } = useSelector((state) => state.auth);

    const handleAddQualification = () => {
        setQualifications([...qualifications, { id: Date.now(), value: '' }]);
    };

    const handleQualificationChange = (id, value) => {
        setQualifications(qualifications.map(q => (q.id === id ? { ...q, value } : q)));
    };

    const handleQualificationRemove = (id) => {
        setQualifications(qualifications.filter(q => q.id !== id));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const qualificationsArray = qualifications.map(q => q.value.trim()).filter(q => q !== '');
        const descriptionArray = [
            `Teaching Experience: ${teachingExperience}`,
            `Audience: ${audience}`,
            `Preferred Methods: ${preferredMethods}`
        ];

        if (qualificationsArray.length === 0) {
            setErrorMessage('Please add at least one qualification.');
            return;
        }

        try {
            await createInstructor({ qualifications: qualificationsArray, description: descriptionArray }).unwrap();
        
            const updatedUserInfo = { ...userInfo, role: 'RequestForInstructor' };
            dispatch(setCredentials(updatedUserInfo));
            
            setSuccessMessage('Instructor profile created successfully!');
            setErrorMessage('');
            navigate('/');
        } catch (error) {
            setErrorMessage(error.data?.message || 'Failed to create instructor profile.');
            setSuccessMessage('');
        }
    };

    return (
        <Container className="my-4">
            <h1 className="mb-4">Become a Tutor</h1>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && <Alert variant="success">{successMessage()}</Alert>}
            <Form onSubmit={handleSubmit}>
                {/* Qualifications Form Group */}
                <Form.Group controlId="qualifications" className="mb-4">
                    <Form.Label>Qualifications</Form.Label>
                    {qualifications.map((qual, index) => (
                        <Row key={qual.id} className="mb-3 align-items-center">
                            <Col>
                                <Form.Control
                                    type="text"
                                    placeholder={`Qualification ${index + 1}`}
                                    value={qual.value}
                                    onChange={(e) => handleQualificationChange(qual.id, e.target.value)}
                                />
                            </Col>
                            <Col xs="auto">
                                {qualifications.length > 1 && (
                                    <Button
                                        variant="danger"
                                        onClick={() => handleQualificationRemove(qual.id)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </Col>
                        </Row>
                    ))}
                    <Button variant="primary" onClick={handleAddQualification}>
                        Add Qualification
                    </Button>
                </Form.Group>

                {/* Teaching Experience Form Group */}
                <Form.Group controlId="teachingExperience" className="mb-4">
                    <Form.Label>What kind of teaching have you done before?</Form.Label>
                    <Form.Check
                        type="radio"
                        label="In person, informally"
                        value="in_person_informally"
                        name="teachingExperience"
                        checked={teachingExperience === 'in_person_informally'}
                        onChange={(e) => setTeachingExperience(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        label="In person, professionally"
                        value="in_person_professionally"
                        name="teachingExperience"
                        checked={teachingExperience === 'in_person_professionally'}
                        onChange={(e) => setTeachingExperience(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        label="Online"
                        value="online"
                        name="teachingExperience"
                        checked={teachingExperience === 'online'}
                        onChange={(e) => setTeachingExperience(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        label="Other"
                        value="other"
                        name="teachingExperience"
                        checked={teachingExperience === 'other'}
                        onChange={(e) => setTeachingExperience(e.target.value)}
                    />
                </Form.Group>

                {/* Audience Form Group */}
                <Form.Group controlId="audience" className="mb-4">
                    <Form.Label>Do you have an audience to share your content with?</Form.Label>
                    <Form.Check
                        type="radio"
                        label="Not at the moment"
                        value="not_at_moment"
                        name="audience"
                        checked={audience === 'not_at_moment'}
                        onChange={(e) => setAudience(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        label="I have a small following"
                        value="small_following"
                        name="audience"
                        checked={audience === 'small_following'}
                        onChange={(e) => setAudience(e.target.value)}
                    />
                    <Form.Check
                        type="radio"
                        label="I have a sizable following"
                        value="sizable_following"
                        name="audience"
                        checked={audience === 'sizable_following'}
                        onChange={(e) => setAudience(e.target.value)}
                    />
                </Form.Group>

                {/* Preferred Methods Form Group */}
                <Form.Group controlId="preferredMethods" className="mb-4">
                    <Form.Label>What are your preferred teaching methods?</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Describe your preferred teaching methods"
                        value={preferredMethods}
                        onChange={(e) => setPreferredMethods(e.target.value)}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </Button>
            </Form>
        </Container>
    );
};

export default BecomeTeacherForm;
