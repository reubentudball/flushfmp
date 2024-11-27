import { collection, addDoc, query, orderBy, limit, getDocs, serverTimestamp, where } from "firebase/firestore";
import { db } from "../conf/firebaseConfig";

export const logActivity = async (logData) => {
  try {
    await addDoc(collection(db, "ActivityLogs"), {
      ...logData,
      timestamp: serverTimestamp(),
    });
    console.log("Activity logged successfully:", logData);
  } catch (error) {
    console.error("Error logging activity:", error);
    throw error;
  }
};

export const fetchRecentLogs = async (adminIds, limitCount = 10) => {
  try {
    const q = query(
      collection(db, "ActivityLogs"),
      where("actor", "in", adminIds), 
      orderBy("timestamp", "desc"),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching recent logs:", error);
    throw error;
  }
};
