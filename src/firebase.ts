import * as firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/performance';
import 'firebase/remote-config';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyAcP-xv4rvh6ia6R2JoPTUA2UT6zWWE7-s',
    authDomain: 'active-owner-registry.firebaseapp.com',
    databaseURL: 'https://active-owner-registry.firebaseio.com',
    projectId: 'active-owner-registry',
    storageBucket: 'active-owner-registry.appspot.com',
    messagingSenderId: '201415925411',
    appId: '1:201415925411:web:cb75f59e16e9a83cf7e916',
    measurementId: 'G-KMLZ1XXSKG'
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const db = firebase.firestore();
export const analytics = firebase.analytics();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const performance = firebase.performance();
// export const remoteConfig = firebase.remoteConfig();

export default firebase;
