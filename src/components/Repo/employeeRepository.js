import {doc,getDoc, collection, query, where, getDocs, addDoc, updateDoc, setDoc, deleteDoc} from "firebase/firestore";
import { db } from "../conf/firebaseConfig";



export const getEmployeeById = async (employeeId) => {
    try {
      console.log(`Fetching employee with ID: ${employeeId}`);
      
      const employeeRef = doc(db, "User", employeeId);
      const employeeSnap = await getDoc(employeeRef); 
  
      if (!employeeSnap.exists()) {
        throw new Error("Employee not found.");
      }
  
      return { id: employeeSnap.id, ...employeeSnap.data() };
    } catch (error) {
      console.error("Error fetching employee:", error);
      throw error; 
    }
  };
  
  
  export const getWorkOrdersByEmployee = async (employeeId) => {
    try {
      const q = query(
        collection(db, "WorkOrders"),
        where("employeeId", "==", employeeId)
      );
      const querySnapshot = await getDocs(q);
  
      const workOrders = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      return workOrders;
    } catch (error) {
      console.error("Error fetching work orders:", error);
      throw error;
    }
  };


export const getEmployeesByFacility = async (facilityId) => {
  try {
    const employeeQuery = query(
      collection(db, "User"),
      where("role", "==", "employee"),
      where("facilityId", "==", facilityId)
    );
    const querySnapshot = await getDocs(employeeQuery);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching employees:", error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const addedEmployeeRef = await addDoc(collection(db, "User"), employeeData);
    return {
      id: addedEmployeeRef.id,
      ...employeeData,
    };
  } catch (error) {
    console.error("Error adding employee:", error);
    throw error;
  }
};


export const assignWorkOrderToEmployee = async (workOrderId, employeeId) => {
  try {
    const workOrderRef = doc(db, "WorkOrders", workOrderId);
    await updateDoc(workOrderRef, { employeeId, status: "assigned" });
    console.log(`Work order ${workOrderId} assigned to employee ${employeeId}.`);
  } catch (error) {
    console.error("Error assigning work order:", error);
    throw error;
  }
};

export const checkEmployeeEmail = async (email) => {
  try {
    const userQuery = query(collection(db, "User"), where("email", "==", email));
    const userSnapshot = await getDocs(userQuery);

    if (userSnapshot.empty) {
      return false; 
    }
    return true; 
  } catch (error) {
    console.error("Error checking employee email:", error);
    throw error;
  }
};

export const getEmployeeByEmail = async (email) => {
  try {
    const q = query(collection(db, "User"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("Employee not found.");
    }
    return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
  } catch (error) {
    console.error("Error fetching employee by email:", error);
    throw error;
  }
};



export const copyEmployeeData = async (oldDocId, newDocId) => {
  try {
    const oldDocRef = doc(db, "User", oldDocId);
    const oldDocSnapshot = await getDoc(oldDocRef);

    if (!oldDocSnapshot.exists()) {
      throw new Error("Old employee document not found.");
    }

    const oldDocData = oldDocSnapshot.data();
    const newDocRef = doc(db, "User", newDocId);

    await setDoc(newDocRef, oldDocData);
    await deleteDoc(oldDocRef);
  } catch (error) {
    console.error("Error copying employee data:", error);
    throw error;
  }
};