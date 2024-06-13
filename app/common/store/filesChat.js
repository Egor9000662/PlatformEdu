// import { makeAutoObservable } from "mobx";
// import { storage } from "../../modules/firebase/index";
// import { getDownloadURL, uploadBytesResumable, ref, refFromURL } from "firebase/storage";
// import { v4 } from "uuid";
//
// export default class FilesStore {
// 	files = [];
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	uploudFileURL = async (file) => {
// 		const uploadFileRef = ref(storage, `/files/${file.type + v4()}`);
// 		const uploadedFile = await uploadBytesResumable(
// 			uploadFileRef,
// 			file
// 		).then((file) => {
// 			return file;
// 		});
// 		const fileURL = await getDownloadURL(uploadedFile.ref)
// 			.then((url) => {
// 				return url;
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 			});
//
// 		return fileURL;
// 	};
//
// 	getUploadFilesURLs = async (files) => {
// 		let filesURL = [];
// 		for (let file of files) {
// 			filesURL.push(await this.uploudFileURL(file));
// 		}
// 		return filesURL;
// 	};
// }
