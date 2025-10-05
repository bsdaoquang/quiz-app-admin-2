/** @format */

import { RcFile } from 'antd/es/upload';
import { storage } from '../firebase/firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export class HandleFile {
	static Upload = async (file: RcFile) => {
		// upload file and return url
		const storageRef = ref(storage, 'images/' + file.name + Date.now());
		// upload file
		await uploadBytes(storageRef, file);
		return await getDownloadURL(storageRef);
	};
}
