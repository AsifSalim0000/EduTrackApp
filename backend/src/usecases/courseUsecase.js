import { getCourses, createCourse, updateCourse, findCourseById } from '../repositories/InstructorCourseRepository.js';
import Course from '../domain/Course.js';
import {countCourses, findCourses, getAllCourses} from '../repositories/CourseRepository.js';
import {findMyCoursesByUserId} from '../repositories/MyCoursesRepository.js'

const fetchAllCourses = async (page, search) => {
  try {
    return await getAllCourses(page, search);
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
    console.log("as",courseData);
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

  // Update the course with new contents
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

export default {fetchCourses,addCourse,fetchCourseDetails,updateCourseDetails,updateCourseContents,fetchAllCourses ,getMyCourses}