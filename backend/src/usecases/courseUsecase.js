import { getCourses, createCourse, updateCourse, findCourseById, deleteCourse, toggleLiveCourse } from '../repositories/InstructorCourseRepository.js';
import Course from '../domain/Course.js';
import {countCourses, findCourses, getAllCourses,findUserCourseById, unblockCourse, blockCourse, getAllCoursesForAdmin, findCoursesByTitle, findCoursesWithFilters} from '../repositories/CourseRepository.js';
import {findMyCoursesByUserId, findUserEnrolledCourse} from '../repositories/MyCoursesRepository.js'
import { loginUser } from '../controllers/UserController.js';

const fetchAllCourses = async (userId,page, search) => {
  try {
    return await getAllCourses(userId,page, search);
  } catch (error) {
    throw new Error('Failed to fetch courses');
  }
};
const fetchCourses = async (instructorId, page, search) => {
  try {
    return await getCourses(instructorId, page, search);
  } catch (error) {
    throw new Error('Failed to fetch courses');
  }
};


const addCourse = async (courseData) => {
  try {
    console.log(courseData);
    const course=await createCourse(courseData);
   
    
    return course;
  } catch (error) {
    throw new Error('Failed to create course');
  }
};

const fetchCourseDetails=async(courseId)=> {
  const course = await findCourseById(courseId);
  
  return course;
}
const updateCourseDetails=async(courseId, courseData)=> {
  const course = await updateCourse(courseId, courseData);
  return course;
}

const updateCourseContents = async (courseId, contents) => {
  
  const updatedContents = contents.map((content, index) => ({
    contentId: content.contentId,  
    order: content.order, 
  }));

  
  const course = await Course.findByIdAndUpdate(
    courseId, 
    { contents: updatedContents }, 
    { new: true, runValidators: true }
  ).populate('instructor').populate('contents.contentId');

  if (!course) {
    throw new Error('Course not found');
  }
  
  return course;
};

const getMyCourses = async ({ userId, page, limit, search }) => {
  const skip = (page - 1) * limit;
  
  const myCourses = await findMyCoursesByUserId(userId);
  console.log(myCourses,userId);
  
  const courseIds = myCourses.courses.map(course => course.courseId);


  const courses = await findCourses({
    courseIds,
    search,
    skip,
    limit
  });

  const totalCourses = await countCourses({
    courseIds,
    search
  });

  return { courses, totalCourses };
};
const getMyCourseByIdUseCase = async (userId, courseId) => {
   
  const userEnrolled = await findUserEnrolledCourse(userId, courseId);
  
  if (!userEnrolled) {
      throw new Error('You have not purchased this course.');
  }

  const course = await findUserCourseById(courseId);
  if (!course) {
      throw new Error('Course not found.');
  }

  return course;
};

const fetchAllCoursesForAdmin = async ({ page, searchTerm }) => {
  const limit = 10; 
  const { courses, totalCourses } = await getAllCoursesForAdmin({ page, limit, search: searchTerm });
  const totalPages = Math.ceil(totalCourses / limit);
  
  return { courses, totalPages };
};

const blockCourseById = async (courseId) => {
  const updatedCourse = await blockCourse(courseId);
  if (!updatedCourse) {
      throw new Error('Course not found');
  }
  return updatedCourse;
};

const unblockCourseById = async (courseId) => {
  const updatedCourse = await unblockCourse(courseId);
  if (!updatedCourse) {
      throw new Error('Course not found');
  }
  return updatedCourse;
};
const softDeleteCourse = async (courseId) => {
  const course = await findCourseById(courseId);
  if (!course) throw new Error('Course not found');
  return await deleteCourse(courseId);
};

const handleToggleLiveCourse = async (courseId, isLive) => {
  const course = await findCourseById(courseId);
  if (!course) throw new Error('Course not found');
  return await toggleLiveCourse(courseId, isLive);
};
const searchCoursesUseCase = async (query) => {
  const searchRegex = new RegExp(query, 'i'); 
  return await findCoursesByTitle(searchRegex); 
};

const searchFilterCoursesUseCase = async (query, filters) => {
  const searchRegex = new RegExp(query, 'i'); 

  const filterConditions = {
    title: { $regex: searchRegex },
    price: { $lte: filters.priceRange[1] }, 
  };

  if (filters.tags && filters.tags.length > 0) {
    filterConditions.whatToTeach = { $in: filters.tags }; 
  }

  return await findCoursesWithFilters(filterConditions);
};
export default {
  fetchCourses,addCourse,fetchCourseDetails,updateCourseDetails,updateCourseContents,
  fetchAllCourses ,getMyCourses,getMyCourseByIdUseCase,
  fetchAllCoursesForAdmin,blockCourseById,unblockCourseById,
   softDeleteCourse,handleToggleLiveCourse,
   searchCoursesUseCase,searchFilterCoursesUseCase
  }