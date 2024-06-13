// import { makeAutoObservable, runInAction } from 'mobx';
// import { auth, database, functions } from '../../modules/firebase';
//
// export default class AuthStore {
// 	user = null;
//
// 	profile = null;
//
// 	claims = null;
//
// 	isLoading = true;
//
// 	isLoggedIn = false;
//
// 	isLoaded = false;
//
// 	role = null;
//
// 	constructor() {
// 		makeAutoObservable(this);
// 	}
//
// 	init = async () => {
// 		const unsubscribe = auth.getAuth().onAuthStateChanged(async () => {
// 			unsubscribe();
// 			const { currentUser } = auth.getAuth();
// 			if (!currentUser) {
// 				this.setIsLoggedIn(false);
// 				await this.setUser(null);
// 			} else {
// 				await this.setUser(currentUser);
// 				this.setIsLoggedIn(true);
// 			}
// 			this.setIsLoading(false);
// 		});
// 	};
//
// 	get isAdmin() {
// 		if (this.claims === null) {
// 			return null;
// 		}
//
// 		if (this.claims.admin) {
// 			return true;
// 		}
//
// 		return false;
// 	}
//
// 	get isTeacher() {
// 		if (this.claims === null) {
// 			return null;
// 		}
//
// 		if (this.claims.teacher) {
// 			return true;
// 		}
//
// 		return false;
// 	}
//
// 	setIsLoading = (bool) => {
// 		this.isLoading = bool;
// 	};
//
// 	setIsLoggedIn = (bool) => {
// 		this.isLoggedIn = bool;
// 	};
//
// 	setUser = async (currentUser) => {
// 		if (!currentUser) {
// 			this.user = null;
// 			this.claims = null;
// 			return;
// 		}
//
// 		this.user = {
// 			displayName: currentUser.displayName,
// 			displayNick: currentUser.displayNick,
// 			email: currentUser.email,
// 			uid: currentUser.uid,
// 			status: 'offline',
// 		};
//
// 		await this.getRole();
// 		await this.getProfile();
// 		await this.setOnlineStatus();
// 	};
//
// 	setOnlineStatus = async () => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${this.user.uid}`);
// 		await database.update(ref, { status: 'online' });
// 	};
//
// 	setOfflineStatus = async () => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${this.user.uid}`);
// 		await database.update(ref, { status: 'offline' });
// 	};
//
// 	setProfile = async (currentProfile) => {
// 		if (!currentProfile) {
// 			this.profile = null;
// 			return;
// 		}
//
// 		let userGroups = [];
// 		let currentGroup = '';
// 		let userCourses = [];
// 		let currentCourse = '';
// 		if (typeof (currentProfile.group) === 'object') {
// 			userGroups = Object.entries(JSON.parse(JSON.stringify(currentProfile.group)))
// 				.map(([key, value]) => ({ groupId: key, ...value }))
// 				.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));
// 			currentGroup = userGroups[0].groupId;
// 			userCourses = userGroups.map((group) => group.course);
// 			currentCourse = userCourses[0];
// 		} else {
// 			userGroups = [{ groupId: currentProfile.group, course: currentProfile.course }];
// 			currentGroup = currentProfile.group;
// 			userCourses = [currentProfile.course];
// 			currentCourse = currentProfile.course;
// 		}
//
// 		this.profile = {
// 			courses: userCourses || [],
// 			course: currentCourse,
// 			type: currentProfile.type,
// 			group: currentGroup,
// 			groups: userGroups || [],
// 			name: currentProfile.name,
// 			nickname: currentProfile.nickname,
// 			progress: currentProfile.progress,
// 			uid: currentProfile.uid,
// 			nextLesson: currentProfile.nextLesson,
// 			avatarURL: currentProfile.avatarURL,
// 			avatarName: currentProfile.avatarName,
// 		};
// 	};
//
// 	setRole = (claims) => {
// 		if (!claims === null) {
// 			return null;
// 		}
// 		if (claims.admin) {
// 			this.role = 'admin';
// 		} else if (claims.teacher) {
// 			this.role = 'teacher';
// 		} else if (claims.owner) {
// 			this.role = 'owner'
// 		} else {
// 			this.role = 'student';
// 		}
// 		this.claims = claims;
// 	};
//
// 	getProfile = async () => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${this.user.uid}`);
// 		const data = await database.get(ref);
//
// 		this.setProfile(data.toJSON());
// 	};
//
// 	createUser = async (email, password) => {
// 		const { user } = await auth.createUserWithEmailAndPassword(
// 			auth.getAuth(),
// 			email,
// 			password
// 		);
// 		return user;
// 	};
//
// 	createProfile = async (user) => {
// 		const defaultGroup = 'group-unassigned';
// 		const defaultCourse = 'course-unassigned';
// 		const result = {
// 			uid: user.uid,
// 			course: defaultCourse,
// 			email: user.email,
// 			type: null,
// 			group: defaultGroup,
// 			name: user.displayName,
// 			debtor: false,
// 			avatarURL: null,
// 			avatarName: null,
// 			newUser: true,
// 		};
//
// 		const db = database.getDatabase();
// 		const userRef = database.ref(db, `users/${user.uid}`);
// 		const groupRef = database.ref(
// 			db,
// 			`groups/${defaultGroup}/students/${user.uid}`
// 		);
//
// 		await database.set(userRef, result);
// 		await database.set(groupRef, true);
// 	};
//
// 	createAdmin = async (email, password, schoolId) => {
// 		let admin;
// 		try {
// 			admin = await this.createUser(email, password);
// 		} catch (error) {
// 			console.log(error);
// 			return null;
// 		}
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `schools/${schoolId}/admins/${admin.uid}`);
// 		await database.set(ref, { uid: admin.uid, email: email });
// 		return admin.uid;
// 	};
//
// 	addAdminClaim = async (email) => {
// 		const func = functions.getFunctions();
// 		const addRole = functions.httpsCallable(func, 'addClaimByEmail');
//
// 		runInAction(() => {
// 			this.role = 'admin';
// 		});
//
// 		return addRole({ email: email, claim: 'admin' })
// 			.then((result) => {
// 				console.log(result);
// 				return result;
// 			}
// 			);
// 	}
//
// 	isExistingUser = async (email, index) => {
// 		const func = functions.getFunctions();
// 		const isExistingUserFunc = functions.httpsCallable(func, 'checkIfUserExists');
// 		return isExistingUserFunc({ email: email }).then((result) => {
// 			return { status: result.data === true, email: email, index: index };
// 		});
// 	}
//
// 	deleteUser = async (uid) => {
// 		const func = functions.getFunctions();
// 		const deleteUserFunc = functions.httpsCallable(func, 'deleteUserByUid');
//
// 		return deleteUserFunc({ uid: uid })
// 			.then((result) => {
// 				console.log(result);
// 				return result;
// 			}
// 			);
// 	}
//
// 	getRole = async () => {
// 		const idTokenResult = await auth
// 			.getAuth()
// 			.currentUser.getIdTokenResult();
// 		this.setRole(idTokenResult.claims);
// 	};
//
// 	signup = async ({ firstName, lastName, email, password }) => {
// 		const user = await this.createUser(email, password);
// 		user.displayName = `${firstName} ${lastName}`;
// 		await this.createProfile(user);
// 	};
//
// 	login = async (email, password) => {
// 		try {
// 			this.setIsLoggedIn(false);
// 			this.setUser(null);
//
// 			await auth.signInWithEmailAndPassword(
// 				auth.getAuth(),
// 				email,
// 				password
// 			);
// 			await this.setUser(auth.getAuth().currentUser);
//
// 			this.setIsLoggedIn(true);
// 			return {
// 				success: true,
// 			};
// 		} catch (err) {
// 			const success = {
// 				success: false,
// 				message: 'Неверный email или пароль. Попробуй ещё раз :)',
// 			};
//
// 			return success;
// 		}
// 	};
//
// 	logout = async () => {
// 		this.setOfflineStatus();
// 		await auth.signOut(auth.getAuth());
// 		this.setIsLoggedIn(false);
// 		this.setUser(null);
// 	};
//
// 	resetPassword = async (email) => {
// 		const result = auth.sendPasswordResetEmail(auth.getAuth(), email)
// 			.then(() => {
// 				console.log('Password reset email sent!');
// 				return {
// 					success: true,
// 				};
// 			})
// 			.catch((error) => {
// 				const success = {
// 					success: false,
// 					message: 'Ошибка. Пользователь с таким email не найден',
// 				};
// 				console.log(error.message);
// 				return success
// 			});
//
// 		return result
// 	};
//
// 	updateName = async (uid, studentName) => {
// 		const db = database.getDatabase();
// 		const userRef = database.ref(db, `users/${uid}`);
//
// 		const nameRef = database.ref(db, `users/${uid}/name`);
// 		const dataName = await database.get(nameRef);
// 		const userName = dataName.toJSON();
//
// 		if (userName !== studentName) {
// 			await database.update(userRef, {
// 				name: studentName,
// 			});
// 		}
// 	};
//
// 	updateNick = async (uid, studentNick) => {
// 		const db = database.getDatabase();
// 		const userRef = database.ref(db, `users/${uid}`);
//
// 		const nameRef = database.ref(db, `users/${uid}/nickname`);
// 		const dataName = await database.get(nameRef);
// 		const userName = dataName.toJSON();
//
// 		if (userName !== studentNick) {
// 			await database.update(userRef, {
// 				nickname: studentNick,
// 			});
// 		}
// 	};
//
// 	updateAvatar = async (uid, avatarURL, fileName) => {
// 		const db = database.getDatabase();
// 		const userRef = database.ref(db, `users/${uid}`);
//
// 		const avatarRef = database.ref(db, `users/${uid}/avatarURL`);
// 		const dataAvatarURL = await database.get(avatarRef);
// 		const userAvatarURL = dataAvatarURL.toJSON();
//
// 		if (userAvatarURL !== avatarURL) {
// 			await database.update(userRef, {
// 				avatarURL: avatarURL,
// 				avatarName: fileName,
// 			});
// 		}
// 		runInAction(() => {
// 			this.isLoaded = !this.isLoaded;
// 		});
// 	};
//
// 	createCountry = async (uid, componentCountry) => {
// 		const country = {
// 			country: componentCountry,
// 		};
// 		const db = database.getDatabase();
// 		const userRef = database.ref(db, `users/${uid}`);
//
// 		const countryRef = database.ref(db, `users/${uid}/country`);
// 		const dataName = await database.get(countryRef);
// 		const countryName = dataName.toJSON();
//
// 		if (countryName !== componentCountry) {
// 			await database.update(userRef, country);
// 		}
// 	};
//
// 	getCountry = async (uid) => {
// 		const db = database.getDatabase();
// 		const ref = database.ref(db, `users/${uid}/country`);
// 		const data = await database.get(ref);
// 		const res = data.toJSON();
//
// 		return res;
// 	};
//
// 	setGroupByCourse(course) {
// 		if (!course) {
// 			return;
// 		}
// 		const currentGroup = this.profile.groups.find((group) => group.course === course);
// 		if (!currentGroup) {
// 			return;
// 		}
// 		this.profile.group = currentGroup.groupId;
// 	}
//
// 	setGroupByGroupId(groupId) {
// 		if (!groupId) {
// 			return;
// 		}
// 		this.profile.group = groupId;
// 	}
// }
