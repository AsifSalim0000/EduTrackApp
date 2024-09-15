import Course from "../domain/Course.js";

const getAllCourses = async (page, search) => {
    const limit = 8; // Items per page
    const skip = (page - 1) * limit;
    
    const query = search ? { title: new RegExp(search, 'i') } : {};
    const courses = await Course.find(query).skip(skip).limit(limit).populate('instructor');
    const totalCourses = await Course.countDocuments(query);
  
    return { data: courses, totalPages: Math.ceil(totalCourses / limit) };
  };

  const findCourses = async ({ courseIds, search, skip, limit }) => {
    return await Course.find({
      _id: { $in: courseIds },
      title: new RegExp(search, 'i') // Case-insensitive search
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
export {getAllCourses,findCourses,countCourses}