import { collection, getDocs, addDoc, query, where, doc, getDoc} from "firebase/firestore";
import { db } from "../conf/firebaseConfig";
import { getBathroomsByIds } from "./bathroomRepository";
import { fetchTicketsByIds } from "./ticketRepository";


export const fetchWorkOrders = async () => {
  try {
    const workOrdersSnapshot = await getDocs(collection(db, "WorkOrders"));

    const workOrders = await Promise.all(
      workOrdersSnapshot.docs.map(async (workOrderDoc) => {
        const workOrderData = workOrderDoc.data();
        const workOrderId = workOrderDoc.id;

        const bathrooms = await getBathroomsByIds(workOrderData.bathrooms || []);

        const tickets = [];
        for (const bathroom of bathrooms) {
          const bathroomTickets = await fetchTicketsByIds(
            bathroom.id,
            workOrderData.tickets || []
          );
          tickets.push(...bathroomTickets);
        }

        return {
          id: workOrderId,
          ...workOrderData,
          bathrooms,
          tickets,
        };
      })
    );

    return workOrders;
  } catch (error) {
    console.error("Error fetching work orders:", error);
    throw error;
  }
};
  export const createWorkOrder = async (workOrderData) => {
  try {
    const workOrderCollection = collection(db, "WorkOrders");
    await addDoc(workOrderCollection, workOrderData);
  } catch (error) {
    console.error("Error creating work order:", error);
    throw error;
  }
};


export const fetchWorkOrderById = async (workOrderId) => {
  try {
    const workOrderRef = doc(db, "WorkOrders", workOrderId);
    const workOrderSnapshot = await getDoc(workOrderRef);

    if (!workOrderSnapshot.exists()) {
      throw new Error("Work order not found.");
    }

    const workOrderData = workOrderSnapshot.data();
    console.log(workOrderData);

    const bathrooms = await getBathroomsByIds(workOrderData.bathrooms || []);
    const tickets = [];

    for (const bathroom of bathrooms) {
      const bathroomTickets = await fetchTicketsByIds(
        bathroom.id,
        workOrderData.tickets || []
      );
      tickets.push(...bathroomTickets);
    }

    return {
      id: workOrderId,
      ...workOrderData,
      bathrooms,
      tickets,
    };
  } catch (error) {
    console.error("Error fetching work order by ID:", error);
    throw error;
  }
};


export const getOpenWorkOrders = async () => {
  try {
    const q = query(collection(db, "WorkOrders"), where("status", "==", "Open"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching open work orders:", error);
    throw error;
  }
};