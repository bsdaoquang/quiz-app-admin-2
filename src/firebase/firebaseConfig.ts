/** @format */
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
const firebaseConfig = {
	apiKey: 'AIzaSyDDjkiDzZ7ft8Bx8zktU4ZGEd0rM3kL-Xg',
	authDomain: 'quiz-app-test-a149c.firebaseapp.com',
	projectId: 'quiz-app-test-a149c',
	storageBucket: 'quiz-app-test-a149c.firebasestorage.app',
	messagingSenderId: '793026321445',
	appId: '1:793026321445:web:5037b7122b666e527433cc',
};

const app = initializeApp(firebaseConfig);

const storage = getStorage(app);
export { storage };
