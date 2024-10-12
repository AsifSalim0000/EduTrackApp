
import Course from '../domain/Course.js';

const getCourses = async (instructorId, page, search) => {
  const limit = 10; // Items per page
  const skip = (page - 1) * limit;

  const query = {
    instructor: instructorId, // Filter by instructor ID
    ...(search ? { title: new RegExp(search, 'i') } : {})
  };

  const courses = await Course.find(query).skip(skip).limit(limit).populate('instructor');
  const totalCourses = await Course.countDocuments(query);

  return { data: courses, totalPages: Math.ceil(totalCourses / limit) };
};


const createCourse = async (courseData) => {
  const newCourse = new Course(courseData);
  
  await newCourse.save();
  
  return newCourse;
};
const findCourseById=async(courseId)=> {
    try {
        const course = await Course.findById(courseId)
            .populate('instructor');
       
        if (course.contents.length > 0) {
            await course.populate('contents.contentId');
        }

        return course;
    } catch (error) {
        throw new Error(`Error fetching course details: ${error.message}`);
    }
}

const updateCourse=async(courseId, courseData)=> {
  const course = await Course.findByIdAndUpdate(courseId, courseData, {
    new: true,  
    runValidators: true, 
  }).populate('instructor').populate('contents.contentId');
  
  if (!course) {
    throw new Error('Course not found');
  }
  
  return course;
}
const deleteCourse = async (courseId) => {
  return await Course.findByIdAndUpdate(courseId, { isDeleted: true }, { new: true });
};

const toggleLiveCourse = async (courseId, isLive) => {
  return await Course.findByIdAndUpdate(courseId, { isLive }, { new: true });
};

export {getCourses,createCourse,findCourseById,updateCourse,deleteCourse,toggleLiveCourse}