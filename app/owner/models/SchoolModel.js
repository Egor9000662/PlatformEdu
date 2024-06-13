// import { async } from "@firebase/util";
// import { makeAutoObservable } from "mobx";
// import { v4 } from 'uuid';
//
// export default class SchoolModel {
//     /** @private {AuthStore} */
//     #auth;
//
//     /** @private {OneSchoolStore}*/
//     #oneSchoolStore;
//
//     /** @private {SchoolsStore}*/
//     #schoolsStore;
//
//     constructor(
//         auth,
//         oneSchoolStore,
//         schoolsStore
//     ) {
//         this.#auth = auth;
//         this.#oneSchoolStore = oneSchoolStore;
//         this.#schoolsStore = schoolsStore;
//         makeAutoObservable(this);
//     };
//
//     async loadData() {
//         await Promise.all([
//             this.#schoolsStore.loadSchoolsData(),
//             this.#oneSchoolStore.loadData(),
//         ]);
//     }
//
//     async #validateSchoolForm(schoolObj, admins) {
//         let isValid = true;
//         let errorMessage = {
//             name: '',
//             specialization: '',
//             admins: '',
//         };
//         const existingSchool = this.#schoolsStore.getSchoolbyName(schoolObj.name);
//         const re =
//             /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//
//         switch (true) {
//             case schoolObj.name === '':
//                 errorMessage = { ...errorMessage, name: 'Поле не может быть пустым' };
//                 isValid = false;
//                 break;
//             case schoolObj.isEdit && existingSchool && existingSchool.id !== schoolObj.id:
//                 errorMessage = { ...errorMessage, name: 'Школа с таким именем уже существует' };
//                 isValid = false;
//                 break;
//             case existingSchool && !schoolObj.hasOwnProperty('isEdit'):
//                 errorMessage = { ...errorMessage, name: 'Школа с таким именем уже существует' };
//                 isValid = false;
//                 break;
//         }
//         if (schoolObj.specialization === '') {
//             errorMessage = { ...errorMessage, specialization: 'Поле не может быть пустым' };
//             isValid = false;
//         }
//         const promises = [];
//         if (admins.length === 0) {
//             errorMessage = { ...errorMessage, admins: 'Добавьте хотя бы одного администратора' };
//             isValid = false;
//         }
//         admins.map((admin, index) => {
//             switch (true) {
//                 case admin.email === '' || !admin.email:
//                     errorMessage = { ...errorMessage, email: 'Email не может быть пустым', emailIndex: index };
//                     isValid = false;
//                     break;
//                 case admin.email.length < 6 || !re.test(String(admin.email).toLowerCase()):
//                     errorMessage = { ...errorMessage, email: 'Некорректный email', emailIndex: index };
//                     isValid = false;
//                     break;
//                 default:
//                     promises.push(this.#auth.isExistingUser(admin.email, index));
//             }
//             switch (true) {
//                 case !schoolObj.isEdit && (admin.password === '' || !admin.password):
//                     errorMessage = { ...errorMessage, password: 'Пароль не может быть пустым', passwordIndex: index };
//                     isValid = false;
//                     break;
//                 case !schoolObj.isEdit && (admin.password.length < 6 || admin.password.length > 15):
//                     errorMessage = { ...errorMessage, password: 'Пароль должен содержать от шести до пятнадцати символов', passwordIndex: index };
//                     isValid = false;
//                     break;
//             }
//         }, this);
//
//         await Promise.all(promises).then((results) => {
//             results.map((result) => {
//                 if (result.status) {
//                     errorMessage = { ...errorMessage, email: `Пользователь с email ${result.email} уже существует`, emailIndex: result.index };
//                     isValid = false;
//                 }
//             })
//         })
//
//         return { isValid, errorMessage };
//     }
//
//     async #addAdmin(email, password, schoolId) {
//         const uid = await this.#auth.createAdmin(email, password, schoolId);
//         if (uid) {
//             this.#auth.addAdminClaim(email);
//             return uid;
//         }
//     }
//
//     async deleteAdmin(uid) {
//         await this.#auth.deleteUser(uid);
//     }
//
//     async saveSchool(schoolObj, admins) {
//         const { isValid, errorMessage } = await this.#validateSchoolForm(schoolObj, admins);
//
//         if (isValid) {
//             const currentSchool = { ...schoolObj };
//             if (currentSchool.isEdit) {
//                 const school = this.#schoolsStore.getSchoolbyName(schoolObj.name);
//                 const currentAdmins = Object.values(school.admins);
//                 currentAdmins.map((currentAdmin) => {
//                     if (!admins.some((admin) => admin.email === currentAdmin.email)) {
//                         this.deleteAdmin(currentAdmin.uid);
//                     }
//                 })
//             }
//
//             delete currentSchool.isEdit;
//             const schoolId = schoolObj.isEdit ? schoolObj.id : v4();
//
//             for (let admin of admins) {
//                 if (admin.password) {
//                     admin.uid = await this.#addAdmin(admin.email, admin.password, schoolId)
//                 }
//             }
//
//             this.#oneSchoolStore.updateSchool({
//                 ...currentSchool,
//                 id: schoolId,
//                 admins: admins?.reduce((acc, admin) => (acc[admin.uid] = { email: admin.email, uid: admin?.uid }, acc), {})
//             });
//
//             this.#schoolsStore.setLoaded(false);
//         }
//         return { isValid, errorMessage };
//     }
//
//     async deleteAdminsBySchoolId(schoolId) {
//         const school = this.#schoolsStore.getSchool(schoolId);
//         const admins = Object.values(school.admins);
//         await Promise.all(admins.map((admin) => this.#auth.deleteUser(admin.uid)));
//     }
//
//     async deleteSchool(id) {
//         await this.#oneSchoolStore.deleteSchool(id);
//         await this.deleteAdminsBySchoolId(id);
//         await this.#schoolsStore.setLoaded(false);
//     }
//
//     blockSchool(id, value) {
//         this.#oneSchoolStore.blockSchool(id, value);
//         this.#schoolsStore.setLoaded(false);
//     };
//
//     handleEditSchool = (school) => {
//         this.#oneSchoolStore.setData(school)
//         this.#oneSchoolStore.setIsEdit(true);
//     }
//
//     filterSchools = (searchName) => {
//         return Object.values(this.#schoolsStore.schools)
//             .sort((a, b) => a.name.localeCompare(b.name))
//             .filter((school) => {
//                 switch (true) {
//                     case searchName === '':
//                         return school;
//                     case school.name.toLowerCase().includes(searchName.toLowerCase()):
//                         return school;
//                     default:
//                         return null;
//                 }
//             })
//     }
// }
