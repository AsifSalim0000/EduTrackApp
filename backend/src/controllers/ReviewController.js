import {addNewReview,getReviewForCourse, getReviewsByCourseId, getUserReviewsForCourse, updateCourseRating} from '../usecases/ReviewUsecases.js';

const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
};

const addReview = async (req, res) => {
    const { courseId, rating, comment } = req.body;
    const userId=req.user._id

    try {
        const newReview = await addNewReview({ userId, courseId, rating, comment });

        const reviews = await getReviewsByCourseId(courseId);
        const newAverageRating = calculateAverageRating(reviews);

        await updateCourseRating(courseId, newAverageRating);

        return res.status(201).json(newReview);
    } catch (error) {
        return res.status(500).json({ message: 'Error creating review', error });
    }
};

const getReviewsForCourse = async (req, res) => {
    const { courseId } = req.params;

    try {
      
        const reviews = await getReviewForCourse(courseId);
        return res.status(200).json(reviews);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching reviews', error });
    }
};

const getUserReviewForCourse = async (req, res) => {
    
    const { courseId } = req.params;
    const userId = req.user._id; 
    
    try {
        
        const userReview = await getUserReviewsForCourse(courseId, userId);
        console.log(userReview,"aaa");
        
        return res.status(200).json(userReview);
    } catch (error) {
        console.error('Error fetching user review:', error.message);
        return res.status(404).json({ message: error.message });
    }
};
export {addReview,getReviewsForCourse,getUserReviewForCourse}