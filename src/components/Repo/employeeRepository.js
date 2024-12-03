import {doc,getDoc, collection, query, where, getDocs, addDoc, updateDoc } from "firebase/firestore";
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


const getEmployeesByFacility = async (facilityId) => {
  try {
    const employeeQuery = query(
      collection(db, "User"),
      where("role", "==", "employee"),
      where("facilityID", "==", facilityId)
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

const addEmployee = async (employeeData) => {
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

export { getEmployeesByFacility, addEmployee };

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