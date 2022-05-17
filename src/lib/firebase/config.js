import db from "../../firebase-config";
import { collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";


export { db, collection, onSnapshot, addDoc, updateDoc, doc, deleteDoc }