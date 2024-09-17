import Course from "../domain/Course.js";
import MyCourses from "../domain/MyCourses.js";

const getAllCourses = async (userId, page, search) => {
  try {
    const limit = 8; 
    const skip = (page - 1) * limit;

    const myCourses = await MyCourses.findOne({ userId }).select('courses.courseId');
    const purchasedCourseIds = myCourses ? myCourses.courses.map(course => course.courseId.toString()) : [];

    const query = search ? { title: new RegExp(search, 'i') } : {};
    const courses = await Course.find(query).skip(skip).limit(limit).populate('instructor');

    const totalCourses = await Course.countDocuments(query);

    const coursesWithPurchaseFlag = courses.map(course => {
      return {
        ...course.toObject(),
        isPurchased: purchasedCourseIds.includes(course._id.toString())
      };
    });
    return { data: coursesWithPurchaseFlag, totalPages: Math.ceil(totalCourses / limit) };

  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses.');
  }
};

  const findCourses = async ({ courseIds, search, skip, limit }) => {
    return await Course.find({
      _id: { $in: courseIds },
      title: new RegExp(search, 'i') 
    })
    .skip(Number(skip))
    .limit(Number(limit));
  };
  
  const countCourses = async ({ courseIds, search }) => {
    return await Course.countDocuments({
      _id: { $in: courseIds },
      title: new RegExp(search, 'i')
    });
  };
const findUserCourseById = async (courseId) => {
    return await Course.findById(courseId).populate("contents.contentId");
};
export {getAllCourses,findCourses,countCourses,findUserCourseById}