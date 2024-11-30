import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../conf/firebaseConfig";

export const fetchReportsByFacility = async (facilityId) => {
  try {
    const bathroomCollection = collection(db, "Bathroom");

    const bathroomQuery = query(
      bathroomCollection,
      where("facilityID", "==", facilityId)
    );

    const bathroomSnapshot = await getDocs(bathroomQuery);

    const reportsByBathroom = {};

    for (const bathroomDoc of bathroomSnapshot.docs) {
      const bathroomID = bathroomDoc.id;
      const bathroomName = bathroomDoc.data().title || "Unnamed Bathroom";

      const reportsCollection = collection(bathroomDoc.ref, "Reports");
      const reportsSnapshot = await getDocs(reportsCollection);

      const tickets = await Promise.all(
        reportsSnapshot.docs.map(async (reportDoc) => {
          const report = reportDoc.data();

          const userRef = doc(db, "User", report.userId);
          const userSnapshot = await getDoc(userRef);

          let userName = "Unknown User";
          if (userSnapshot.exists()) {
            const userData = userSnapshot.data();
            userName = `[${userData.lastName}, ${userData.firstName} - ${userData.username}]`;
          }

          return {
            id: reportDoc.id, 
            category: report.category,
            description: report.description,
            timestamp: report.timestamp.toDate(),
            userId: userName,
          };
        })
      );

      reportsByBathroom[bathroomID] = {
        name: bathroomName,
        tickets,
      };
    }

    return reportsByBathroom;
  } catch (error) {
    console.error("Error fetching reports from Firestore:", error);
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
