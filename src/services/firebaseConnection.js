import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyB5puFRoEj7qLcKGhgz1c11TKGuBsWWbYw",
    authDomain: "sistema-chamados-2909c.firebaseapp.com",
    projectId: "sistema-chamados-2909c",
    storageBucket: "sistema-chamados-2909c.firebasestorage.app",
    messagingSenderId: "1061398067111",
    appId: "1:1061398067111:web:2c8cdec2e3b87d71d62882",
    measurementId: "G-PKJFXN1JF6"
  };

  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);

  export { auth, db, storage };