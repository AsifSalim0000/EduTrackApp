import { createReview ,findReviewByUserForCourse,findReviewsByCourse, updateCourseRatingInDB} from "../repositories/ReviewRepository.js"; 

const addNewReview = async (reviewData) => {
    return await createReview(reviewData);
};

const getReviewForCourse = async (courseId) => {
    return await findReviewsByCourse(courseId);
};
const getUserReviewsForCourse = async (courseId, userId) => {
   
    const userReview = await findReviewByUserForCourse(courseId, userId);

    if (!userReview) {
        throw new Error('No review found for this user');
    }

    return userReview;
};
const getReviewsByCourseId = async (courseId) => {
    return await findReviewsByCourse(courseId);
};

const updateCourseRating = async (courseId, newRating) => {
    return await updateCourseRatingInDB(courseId, newRating);
};

export {addNewReview,getReviewForCourse,getUserReviewsForCourse,getReviewsByCourseId,updateCourseRating}