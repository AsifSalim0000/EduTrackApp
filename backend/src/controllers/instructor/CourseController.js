import asyncHandler from 'express-async-handler';
import courseUseCase from '../../usecases/courseUsecase.js';
import VideoContent from '../../domain/VideoContent.js';
import TextContent from '../../domain/TextContent.js';
import QuizContent from '../../domain/QuizContent.js';


const getCoursesController = asyncHandler(async (req, res) => {
  const { page = 1, search = '' } = req.query;
  const instructorId = req.user.id; 

  try {
    const courses = await courseUseCase.fetchCourses(instructorId, page, search);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses' });
  }
});

const createCourseController = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const { filename: thumbnail } = req.file; 
  const instructor = req.user.id;
  
  try {
    const course = await courseUseCase.addCourse({ title, description, thumbnail, instructor });
   
    
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ message: "Error creating course" });
  }
});
const fetchCourse=async(req, res) =>{
  try {
    const courseId = req.params.id;
    const course = await courseUseCase.fetchCourseDetails(courseId);
    
    
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
const saveCourseDetails = asyncHandler(async (req, res) => {
  try {
    const { courseId, trailer, title, price, description } = req.body;

    const whatToTeach = JSON.parse(req.body.whatToTeach);
    const contents = JSON.parse(req.body.contents);
    
    let thumbnail = null;
    if (req.file) {
      thumbnail = req.file.filename; 
    }
    
    const instructor = req.user.id;

    const courseUpdates = {
      title,
      description,
      price,
      trailer,
      whatToTeach,
      instructor
    };

    if (thumbnail) {
      courseUpdates.thumbnail = thumbnail;
    }
    
    const course = await courseUseCase.updateCourseDetails(courseId, courseUpdates);    
   
    const savedContents = [];
    const Allcontents = contents.map((chapter, index) => {
      let content;
     
      
      
      switch (chapter.contentId.type) {
        case 'video':
          content = new VideoContent({
            title: chapter.contentId.title,
            url: chapter.contentId.content || chapter.contentId.url,
            
          });
          break;

        case 'text':
          content = new TextContent({
            title: chapter.contentId.title,
            content: chapter.contentId.content,
          });
          break;

        case 'quiz':
          content = new QuizContent({
            title: chapter.contentId.title,
            questions: chapter.contentId.questions,
          });
          break;

        default:
          throw new Error(`Unknown chapter type: ${chapter.contentId.type}`);
      }
      return content.save().then(content => ({
        contentId: content._id,
        order: index + 1,  
      }));
    });


    const savedContentsData = await Promise.all(Allcontents);

    await courseUseCase.updateCourseContents(course._id, savedContentsData);

    res.status(200).json({ success:true,message: 'Course details and chapters saved successfully!', course });
  } catch (error) {
    console.error('Failed to save course details and chapters:', error);
    res.status(500).json({ error: error.message });
  }
});
const uploadVideo= async(req, res) => {
  
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
    
      const videoUrl = `/${req.file.filename}`;
      
      res.json({ videoUrl });
    }

export {getCoursesController,createCourseController,fetchCourse,saveCourseDetails,uploadVideo}
