import Review from '../domain/Review.js';

const createReview = async (reviewData) => {
    const newReview = new Review(reviewData);
    return await newReview.save();
};

const findReviewsByCourse = async (courseId) => {
    return await Review.find({ courseId }).populate('userId', 'username');
};
const findReviewByUserForCourse = async (courseId, userId) => {
    return await Review.findOne({ courseId, userId });
};

export {createReview, findReviewsByCourse,findReviewByUserForCourse}