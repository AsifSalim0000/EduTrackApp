import Course from "../domain/Course.js";
import CourseProgress from "../domain/CourseProgress.js";
import MyCourses from "../domain/MyCourses.js";

const getAllCourses = async (userId, page, search) => {
  try {
    const limit = 8; 
    const skip = (page - 1) * limit;

    const myCourses = await MyCourses.findOne({ userId }).select('courses.courseId');
    const purchasedCourseIds = myCourses ? myCourses.courses.map(course => course.courseId.toString()) : [];

    const query = search ? { title: new RegExp(search, 'i'),isLive:true,isDeleted:false,isBlocked:false } : {isLive:true,isDeleted:false,isBlocked:false};
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

const countAllCourses = async () => {
  return await Course.countDocuments();
};


const getAllCoursesForAdmin = async ({ page = 1, limit = 10, search = '' }) => {
    const skip = (page - 1) * limit;
    const query = { isDeleted: false };

    if (search) {
        query.title = { $regex: search, $options: 'i' }; 
    }
  
    const totalCourses = await Course.countDocuments(query);
    const courses = await Course.find(query)
        .populate('instructor', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    return { courses, totalCourses };
};

const blockCourse = async (courseId) => {
    return Course.findByIdAndUpdate(courseId, { isBlocked: true }, { new: true });
};

const unblockCourse = async (courseId) => {
    return Course.findByIdAndUpdate(courseId, { isBlocked: false }, { new: true });
};
const getProgressByUserAndCourse = async (userId, courseId) => {
  return await CourseProgress.findOne({ userId, courseId });
};

const createProgress = async (progressData) => {
  return await CourseProgress.create(progressData);
};

const updateProgress = async (progressId, updatedProgress) => {
  return await CourseProgress.findByIdAndUpdate(progressId, updatedProgress, { new: true });
};

const findCourseProgressByUserId = async (userId) => {
  return await CourseProgress.find({ userId }).populate('courseId');
};
const findCoursesByTitle = async (searchRegex) => {
  return await Course.find({ title: { $regex: searchRegex } }).select('_id title'); // Return only title and _id
};

const findCoursesWithFilters = async (filterConditions) => {
  return await Course.find(filterConditions); // Find courses based on the filter conditions
};
export {getAllCourses,findCourses,countCourses,findUserCourseById,countAllCourses, getAllCoursesForAdmin,blockCourse,unblockCourse,
  getProgressByUserAndCourse,createProgress,updateProgress,findCourseProgressByUserId,findCoursesByTitle,findCoursesWithFilters}