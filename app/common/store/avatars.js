// import { makeAutoObservable } from "mobx";
// import { storage } from "../../modules/firebase/index";
// import {
// 	getDownloadURL,
// 	uploadBytesResumable,
// 	ref,
// 	deleteObject,
// } from "firebase/storage";
//
// export default class AvatarsStore {
// 	avatars = [];
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
//     uploudFileURL = async (avatar) => {
// 		const uploadFileRef = ref(storage, `/avatars/${avatar.name}`);
// 		const uploadedFile = await uploadBytesResumable(
// 			uploadFileRef,
// 			avatar
// 		).then((avatar) => {
// 			return avatar;
// 		});
// 		const fileURL = await getDownloadURL(uploadedFile.ref)
// 			.then((url) => {
// 				return url;
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 			});
//         this.avatars.push(avatar.name);
// 		return fileURL;
// 	};
//
// 	deleteFile = async (avatarName) => {
// 		if (!avatarName) return;
// 		const deleteFileRef = ref(storage, `/avatars/${avatarName}`);
// 		deleteObject(deleteFileRef)
// 			.then(() => "delete successfully")
// 			.catch((err) => console.log(err));
// 	};
// }
