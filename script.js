// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js"

const firebaseConfig = {
    apiKey: "AIzaSyBzFBaUi11-Qw6kj5K61yGja5oyV6iKVpo",
    authDomain: "todoliste2.firebaseapp.com",
    projectId: "todoliste2",
    storageBucket: "todoliste2.appspot.com",
    messagingSenderId: "645581968514",
    appId: "1:645581968514:web:96a810be1e83a341b3509b",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

import {
    getFirestore,
    collection,
    doc,
    query,
    where,
    getDoc,
    getDocs,
    deleteDoc,
    addDoc, 
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js"

const db = getFirestore(app)
const docRef = doc(db, "todoItems", "1")
const docSnap = await getDoc(docRef)

if (docSnap.exists()) {
    console.log("Document data:", docSnap.data())
} else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!")
}

const listeRef = document.getElementById("liste")

// const q = query(collection(db, "TodoItems"), where("erFerdig", "==", false));
// const querySnapshot = await getDocs(q);
const querySnapshot = await getDocs(collection(db, "TodoItems"))
querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data())
    const item = document.createElement("li")
    // TODO: Legg til oppgave-teksten vår OG bruk appendChild for å legge til på lista
    item.innerHTML = doc.data().tekst
    item.dataset.id = doc.id
    if (doc.data().erFerdig) {
        item.classList.add("ferdig")
    }
    listeRef.appendChild(item)
    item.addEventListener("click", klikk)
})

async function klikk(event) {
    console.log("klikk")
    console.log(event.target)
    // Fjern objektet fra lista vår "lokalt":
    listeRef.removeChild(event.target)
    // Fjern objektet fra Google Firestore:
    const id = event.target.dataset.id
    await deleteDoc(doc(db, "TodoItems", id))
}

document.getElementById("knapp").addEventListener("click", leggTilOppgave)

async function leggTilOppgave() {
    const oppgaveTekst = document.getElementById("oppgave").value
    console.log(oppgaveTekst)

    // Lagre oppgaven hos Google firestore:
    const docRef = await addDoc(collection(db, "TodoItems"), {
        tekst: oppgaveTekst,
        erFerdig: false,
    })
    console.log("Document written with ID: ", docRef.id)

    // Legg til i den lokale lista vår: 
    const item = document.createElement("li")
    item.innerHTML = oppgaveTekst
    item.dataset.id = docRef.id
    listeRef.appendChild(item)
    item.addEventListener("click", klikk)

}
