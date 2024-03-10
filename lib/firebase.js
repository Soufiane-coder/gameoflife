// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { Timestamp, getFirestore } from "firebase/firestore";
import { 
    setDoc,
    doc,
    serverTimestamp, 
    getDoc,
    collection,
    getDocs,
    addDoc,
    updateDoc , 
    deleteDoc,
    where,
    query,
    increment,
    arrayUnion} from "firebase/firestore";
import {formatingDateToISO} from './utils';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyC3JKqg9C7gvc0qXVb1t2P1aVFVFeWq1cg",
    authDomain: "game-of--life.firebaseapp.com",
    projectId: "game-of--life",
    storageBucket: "game-of--life.appspot.com",
    messagingSenderId: "316235565145",
    appId: "1:316235565145:web:f6303068b2fcb8383f8948",
    measurementId: "G-02DRHQB54Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);


export const auth = getAuth();

export const addNewUser = async (userImp) => {
    try {
        const { uid, email, displayName, photoURL, emailVerified, phoneNumber, } = userImp;
        const userDoc = doc(db, "users", uid);
        await setDoc(userDoc, {
            uid,
            email,
            displayName,
            photoURL,
            emailVerified,
            phoneNumber,
            coins: 0,
            rate: 1,
            xp: 0,
            lastVisit: serverTimestamp(),
        });
    } catch (error) {
        console.error(error);
    }
}

export const getUserData = async (userImp) => {
    try {
        const { uid, } = userImp;
        const userDoc = doc(db, "users", uid);

        let docSnap = await getDoc(userDoc);

        if (!docSnap.exists()) {
            await addNewUser(userImp);
            docSnap = await getDoc(userDoc);
        }
        return docSnap.data();

    } catch (error) {
        console.error(error);
    }
}

export const signUserInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const credential = await signInWithPopup(auth, provider);
        return credential.user;
    }
    catch (error) {
        console.error(error)
    }

}

export const signUserOutFromFirebase = async () => {
    try {
        await signOut(auth)
        console.log('sign out success')
    }
    catch (error) {
        console.error('sign out failed', error)
    }
}

export const signUserUpWithEmail = async (email, password, displayName) => {
    try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(auth.currentUser, { displayName })
        return credential.user;
    } catch (error) {
        console.error(error);
    }
}

export const signUserInWithEmail = async (email, password,) => {
    try {
        const credential =
            await signInWithEmailAndPassword(auth, email, password)
        return credential.user;

    } catch (error) {
        const errorCode = error.code;
        // const errorMessage = error.message;
        if (errorCode === 'auth/user-not-found')
            throw Error('user not found try a diffrent email or sign up')
        if (errorCode === 'auth/wrong-password')
            throw Error('wrong password')
        else
            throw Error(errorCode);
    }
}

export const getRoutinesFromFirebase = async (uid,) => {
    const colRef = collection(db, `users/${uid}/routines`);
    const { docs } = await getDocs(colRef);
    return docs.map(doc => ({
        ...doc.data(),
        routineId: doc.id,
    }))
}



export const getGoalsOfRoutine = async (uid, routineId,) => {
    const colRef = collection(db, `users/${uid}/routines/${routineId}/goals`);
    const { docs } = await getDocs(colRef);
    return docs.map(doc => ({
        ...doc.data(),
        goalId: doc.id,
    }))
}

export const checkGoalInFirabase = async (uid, routineId, goalId) => {
    try {
        await updateDoc(doc(db, `/users/${uid}/routines/${routineId}/goals`, goalId), {
            isAchieved: true,
        })
    }
    catch (error) {
        console.error(error)
    }
}

export const setArchivedOptionInFirebase = async (uid, routineId, archivedOption) => {
    try {
        await updateDoc(doc(db, `/users/${uid}/routines`, routineId), {
            isArchived: archivedOption,
        })
    }
    catch (error) {
        console.error(error)
    }
}

export const addNewGoalToFirebase = async (uid, routineId, goal) => {
    try {
        const colRef = collection(db, `users/${uid}/routines/${routineId}/goals`);
        const { id: goalId } = await addDoc(colRef, { ...goal, isAchieved: false });
        return goalId;
    } catch (error) {
        console.error(error);
    }
}

export const checkRoutineInFirebase = async (uid, routineId, message,) => {
    await updateDoc(doc(db, `/users/${uid}/routines`, routineId), {
        combo: increment(1),
        isSubmitted: true,
        lastSubmit: serverTimestamp(),
        message,
    })
    await updateDoc(doc(db, `/users`, uid), {
        coins: increment(1),
    })
    const currentDate = formatingDateToISO()
    const statisticsRef = doc(db, `users/${uid}/statistics`, currentDate);

    const docSnap = await getDoc(statisticsRef)

    if (!docSnap.exists()) {
        await setDoc( statisticsRef, { 
            day: currentDate,
            routinesChecked: [routineId],
        });
    }
    else{
        await updateDoc(statisticsRef, {
            routinesChecked: arrayUnion(routineId)
        })
    }
}

export const deleteRoutineFromFirebase = async (uid, routineId) => {
    await deleteDoc(doc(db, `/users/${uid}/routines/`, routineId));
}

export const uncheckAllRoutinesBelongToUserInFirebase = async (uid, routines) => {
    const uncheckRoutine = async (routineId) => {
        try {
            return await updateDoc(doc(db, `/users/${uid}/routines`, routineId), {
                isSubmitted: false,
            })
        }
        catch (error) {
            console.error(error)
        }
    }

    await Promise.all(routines.map(routine => uncheckRoutine(routine.routineId)))
    return routines;
}

export const updateTheDayOfLastVisitToTodayInFirebase = async (uid) => {
    try {
        return await updateDoc(doc(db, `/users`, uid), {
            lastVisit: serverTimestamp(),
        })
    }
    catch (error) {
        console.error(error)
    }
}

export const addSkipDayToFirebase = async (uid, routineId) => {
    return await updateDoc(doc(db, `/users/${uid}/routines`, routineId), {
        skip: increment(1),
    })
}

export const buySkipFromFirebase = async (uid,) => {
    await updateDoc(doc(db, `/users`, uid), {
        coins: increment(-10)
    })
}

export const setComboToZeroInFirebase = async (uid, routineId) => {
    await updateDoc(doc(db, `/users/${uid}/routines`, routineId), {
        combo: 0,
    })
}

export const UpdateSkipAndLastSubmitInFirebase = async (uid, routineId, skip, lastSubmit,) => {
    await updateDoc(doc(db, `/users/${uid}/routines`, routineId), {
        skip,
        lastSubmit,
    })
}



export const addNewToDoItemToFirebase = async (uid, todoItemDescription) => {
    try {
        const colRef = collection(db, `users/${uid}/todoItems`);
        const { id: todoItemId } = await addDoc(colRef, {description:todoItemDescription, isAchieved: false });
        return todoItemId;
    } catch (error) {
        console.error(error);
    }
}

export const deleteAllToDoCheckedItemsFromFirebase = async (uid,) => {
    const checkedItems = query(collection(db, `users/${uid}/todoItems`), 
        where('isAchieved', '==', true))
    const allCheckedItems = await getDocs(checkedItems)
    // allCheckedItems
    allCheckedItems.forEach(doc => deleteDoc(doc.ref))
}

export const deleteToDoItemFromFirebase = async (uid, taskId) => {
    await deleteDoc(doc(db, `/users/${uid}/todoItems`, taskId));
}

export const changeTodoItemAttributesInFirebase = async (uid, todoItemId, isAchieved) => {
    await updateDoc(doc(db, `/users/${uid}/todoItems`, todoItemId), {
        isAchieved
    })
}

export const getTodoItemsOfRoutine = async (uid,) => {
    const colRef = collection(db, `users/${uid}/todoItems`);
    const { docs } = await getDocs(colRef);
    return docs.map(doc => ({
        ...doc.data(),
        todoItemId: doc.id,
    }))
}

export const getCategories = async (uid,) => {
    const colRef = collection(db, `users/${uid}/categories`);
    const { docs } = await getDocs(colRef);
    return docs.map(doc => ({
        ...doc.data(),
        categoryId: doc.id,
    }))
}

export const addCategoryToFirebase = async (uid, category,) => {
    try {
        const colRef = collection(db, `users/${uid}/categories`);
        const { id: routineId } = await addDoc(colRef, category);
        return routineId;
    } catch (error) {
        console.error(error);
    }
}

export const getStatisticsFromFirebase = async (uid,) => {
    const colRef = collection(db, `users/${uid}/statistics`);
    const { docs } = await getDocs(colRef);
    return docs.map(doc => ({
        ...doc.data(),
    }))
}

// export const updateStatisticsInFirebase = async (uid,statistics) => {
//     Promise.all(
//         statistics.map(async statistic => {
//             const statisticsRef = doc(db, `users/${uid}/statistics`, statistic.day);
//             const docSnap = await getDoc(statisticsRef)

//             if (!docSnap.exists()) {
//                 await setDoc( statisticsRef, {
//                     ...statistic
//                 });
//             }
//         })
//     )
// }