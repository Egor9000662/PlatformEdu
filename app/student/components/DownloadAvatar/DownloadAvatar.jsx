import React, {useEffect} from "react";
import "./DownloadAvatar.scss";
import { inject, observer } from "mobx-react";
import FrontendAvatar from "../../../common/assets/defaultAvatars/frontend-avatar.png";

function ChangeAvatar({
	uploudFileURL,
	updateAvatar,
	avatarURL,
	prevAvatarName,
	deleteFile,
	uid,
}) {
	const handleUploadFile = async (e) => {
		if (!e.target.files || e.target.files.length === 0) {
			return;
		}
		const newAvatarName = e.target.files[0].name;
		await uploudFileURL(e.target.files[0]).then((url) => {
			if (prevAvatarName !== newAvatarName) {
				deleteFile(prevAvatarName);
			}
			updateAvatar(uid, url, newAvatarName);
		});
	};
	return (
		<>
			<label htmlFor="changeImg" className="profileIcon">
				<p className="text-download">Загрузить фото</p>
				<img
					src={avatarURL ? avatarURL : FrontendAvatar}
					alt="avatar"
				/>
			</label>
			<input
				type="file"
				className="hidden_download-file"
				accept=".jpg, .jpeg, .png, .svg"
				onChange={handleUploadFile}
				name="changeImg"
				id="changeImg"
			></input>
		</>
	);
}
export default inject(({ avatars, auth }) => {
	const { profile, updateAvatar, user, isLoaded, getProfile } = auth;
	const { uploudFileURL, deleteFile } = avatars;

	useEffect(() => {
		getProfile();
	}, [isLoaded]);
	return {
		avatarURL: profile?.avatarURL,
		prevAvatarName: profile?.avatarName,
		deleteFile,
		uploudFileURL,
		updateAvatar,
		uid: user?.uid,
	};
})(observer(ChangeAvatar));
