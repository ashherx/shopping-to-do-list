import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

const firebaseConfig = {   
    apiKey: 'AIzaSyA0ntPqyCol5J_tdQjXH6gSjUlBVCCGnFc',
    authDomain: 'shopping-list-11699.firebaseapp.com',
    projectId: 'shopping-list-11699',
    storageBucket: 'shopping-list-11699.appspot.com',
    messagingSenderId: '717950232360',
    appId: '1:717950232360:web:7987142837f80fa71b921d',
}

firebase.initializeApp(firebaseConfig);
export default firebase;
