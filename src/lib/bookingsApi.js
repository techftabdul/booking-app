import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

const bookingsCollection = collection(db, "bookings");

export async function fetchBookings() {
  const snapshot = await getDocs(bookingsCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

export async function createBooking(booking) {
  const bookingWithStatus = {
    ...booking,
    status: "confirmed",
    createdAt: Date.now(),
  };
  const docRef = await addDoc(bookingsCollection, bookingWithStatus);
  return { id: docRef.id, ...bookingWithStatus };
}

export async function deleteBooking(id) {
  await deleteDoc(doc(bookingsCollection, id));
}

export async function cancelBooking(id) {
  const bookingRef = doc(bookingsCollection, id);
  await updateDoc(bookingRef, {
    status: "cancelled",
  });
}

export async function restoreBooking(id) {
  const bookingRef = doc(bookingsCollection, id);
  await updateDoc(bookingRef, {
    status: "confirmed",
  });
}
