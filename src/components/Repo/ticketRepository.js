import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../conf/firebaseConfig";

export const fetchReportsByFacility = async (facilityId) => {
  try {
    const bathroomQuery = query(
      collection(db, "Bathroom"),
      where("facilityID", "==", facilityId)
    );
    const bathroomSnapshot = await getDocs(bathroomQuery);

    const reportsByBathroom = {};

    await Promise.all(
      bathroomSnapshot.docs.map(async (bathroomDoc) => {
        const bathroomID = bathroomDoc.id;
        const bathroomData = bathroomDoc.data();
        const reportsCollection = collection(db, `Bathroom/${bathroomID}/Reports`);
        const reportsSnapshot = await getDocs(reportsCollection);

        const tickets = reportsSnapshot.empty
          ? [] 
          : await Promise.all(
              reportsSnapshot.docs.map(async (reportDoc) => {
                const report = reportDoc.data();
                const userSnapshot = await getDoc(doc(db, "User", report.userId));
                return {
                  id: reportDoc.id,
                  category: report.category,
                  description: report.description,
                  timestamp: report.timestamp?.toDate() || null,
                  userId: userSnapshot.exists()
                    ? `${userSnapshot.data().firstName} ${userSnapshot.data().lastName}`
                    : "Unknown User",
                };
              })
            );

        reportsByBathroom[bathroomID] = {
          name: bathroomData.title || "Unnamed Bathroom",
          tickets,
        };
      })
    );

    return reportsByBathroom;
  } catch (error) {
    console.error("Error fetching reports by facility:", error);
    throw error;
  }
};


export const fetchOpenTickets = async () => {
  try {
    const ticketsQuery = query(
      collection(db, "Tickets"),
      where("attachedToWorkOrder", "==", false) 
    );
    const snapshot = await getDocs(ticketsQuery);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching open tickets:", error);
    throw error;
  }
};

export const fetchTicketsByIds = async (bathroomId,ticketIds) => {
  try {
    const tickets = await Promise.all(
      ticketIds.map(async (id) => {
        const ticketRef = doc(db, `Bathroom/${bathroomId}/Reports`, id); 
        const ticketSnapshot = await getDoc(ticketRef);
        return ticketSnapshot.exists()
          ? { id: ticketSnapshot.id, ...ticketSnapshot.data() }
          : null;
      })
    );
    return tickets.filter((ticket) => ticket !== null);
  } catch (error) {
    console.error(`Error fetching tickets for bathroom ${bathroomId}:`, error);
    throw error;
  }
};


export const getTicketsFromBathroom = async (bathroomId) => {
  try {
    const reportsSnapshot = await getDocs(
      collection(db, `Bathroom/${bathroomId}/Reports`)
    );
    return reportsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};
