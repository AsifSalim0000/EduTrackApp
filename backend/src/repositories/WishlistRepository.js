import Wishlist from '../domain/Wishlist.js';

const findWishlistByUserId = async (userId) => {
  try {
    const wishlist = await Wishlist.findOne({ userId }).populate('courses.courseId');
    return wishlist;
  } catch (error) {
    throw new Error('Error finding wishlist');
  }
};

const createWishlist = async (userId, courseId) => {
  try {
    const newWishlist = new Wishlist({
      userId,
      courses: [{ courseId }],
    });
    await newWishlist.save();
    return newWishlist;
  } catch (error) {
    throw new Error('Error creating wishlist');
  }
};

const addItemToWishlist = async (userId, courseId) => {
  try {
    const wishlist = await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { courses: { courseId } }, lastAccessed: Date.now() }, 
      { new: true }
    ).populate('courses.courseId');
    
    return wishlist;
  } catch (error) {
    throw new Error('Error adding course to wishlist');
  }
};
const getWishlistByUserId = async (userId) => {
   const wishlist = await Wishlist.findOne({ userId })
   .populate({
    path: 'courses.courseId',
    populate: {
      path: 'instructor', 
      model: 'User',   
    },
  });
    console.log(wishlist,"c");
    return wishlist;
};

export {findWishlistByUserId,createWishlist,addItemToWishlist,getWishlistByUserId}