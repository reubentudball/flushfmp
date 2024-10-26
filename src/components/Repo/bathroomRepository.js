import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../conf/firebaseConfig';

const createBathroom = async (bathroom) => {
  try {
    const bathroomRef = await addDoc(collection(db, "Bathroom"), {
      ...bathroom,
      comments: [],  
    });
    console.log('Bathroom added with ID:', bathroomRef.id);
  } catch (e) {
    console.error('Error adding bathroom:', e);
  }
};

const createReview = async (bathroomId, review) => {
  try {
    const reviewRef = await addDoc(collection(db, `Bathroom/${bathroomId}/Reviews`), review);
    console.log('Review added with ID:', reviewRef.id);
  } catch (e) {
    console.error('Error adding review:', e);
  }
};

const getAllBathrooms = async () => {
  try {
    const bathroomsSnapshot = await getDocs(collection(db, 'Bathroom'));
    const bathrooms = bathroomsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('Fetched bathrooms:', bathrooms);
    return bathrooms;
  } catch (e) {
    console.error('Error fetching bathrooms:', e);
    throw e;
  }
};

const getReviewsFromBathroom = async (bathroomId) => {
  try {
    const reviewsSnapshot = await getDocs(collection(db, `Bathroom/${bathroomId}/Reviews`));
    const reviews = reviewsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return reviews;
  } catch (e) {
    console.error('Error fetching reviews:', e);
    throw e;
  }
};

const updateBathroom = async (bathroomId, updatedData) => {
  try {
    const bathroomRef = doc(db, 'Bathroom', bathroomId);
    await updateDoc(bathroomRef, updatedData);
    console.log('Bathroom updated successfully');
  } catch (e) {
    console.error('Error updating bathroom:', e);
    throw e;
  }
};

const deleteBathroom = async (bathroomId) => {
  try {
    const bathroomRef = doc(db, 'Bathroom', bathroomId);
    await deleteDoc(bathroomRef);
    console.log('Bathroom deleted successfully');
  } catch (e) {
    console.error('Error deleting bathroom:', e);
    throw e;
  }
};

const updateReview = async (bathroomId, reviewId, updatedData) => {
  try {
    const reviewRef = doc(db, `Bathroom/${bathroomId}/Reviews`, reviewId);
    await updateDoc(reviewRef, updatedData);
    console.log('Review updated successfully');
  } catch (e) {
    console.error('Error updating review:', e);
    throw e;
  }
};

const deleteReview = async (bathroomId, reviewId) => {
  try {
    const reviewRef = doc(db, `Bathroom/${bathroomId}/Reviews`, reviewId);
    await deleteDoc(reviewRef);
    console.log('Review deleted successfully');
  } catch (e) {
    console.error('Error deleting review:', e);
    throw e;
  }
};

const getBathroomById = async (bathroomId) => {
  try {
    const bathroomRef = doc(db, 'Bathroom', bathroomId);
    const bathroomSnap = await getDoc(bathroomRef);
    if (bathroomSnap.exists()) {
      return { id: bathroomSnap.id, ...bathroomSnap.data() };
    } else {
      console.error('No bathroom found with ID:', bathroomId);
      return null;
    }
  } catch (e) {
    console.error('Error fetching bathroom by ID:', e);
    throw e;
  }
};

const addComment = async (bathroomId, comment) => {
  try {
    const bathroomRef = doc(db, 'Bathroom', bathroomId);
    const bathroomSnap = await getDoc(bathroomRef);
    if (bathroomSnap.exists()) {
      const currentComments = bathroomSnap.data().comments || [];
      const updatedComments = [...currentComments, comment]; 
      await updateDoc(bathroomRef, { comments: updatedComments });
      console.log('Comment added successfully');
    } else {
      console.error('Bathroom not found, cannot add comment.');
    }
  } catch (e) {
    console.error('Error adding comment:', e);
    throw e;
  }
};

const deleteComment = async (bathroomId, commentIndex) => {
  try {
    const bathroomRef = doc(db, 'Bathroom', bathroomId);
    const bathroomSnap = await getDoc(bathroomRef);
    if (bathroomSnap.exists()) {
      const currentComments = bathroomSnap.data().comments || [];
      if (commentIndex >= 0 && commentIndex < currentComments.length) {
        const updatedComments = currentComments.filter((_, index) => index !== commentIndex); 
        await updateDoc(bathroomRef, { comments: updatedComments });
        console.log('Comment deleted successfully');
      } else {
        console.error('Invalid comment index, cannot delete.');
      }
    } else {
      console.error('Bathroom not found, cannot delete comment.');
    }
  } catch (e) {
    console.error('Error deleting comment:', e);
    throw e;
  }
};

export {
  createBathroom,
  createReview,
  getAllBathrooms,
  getBathroomById,
  getReviewsFromBathroom,
  updateBathroom,
  deleteBathroom,
  updateReview,
  deleteReview,
  addComment,    
  deleteComment,  
};
