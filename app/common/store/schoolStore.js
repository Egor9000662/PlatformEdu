// import { makeAutoObservable } from "mobx";
// import { database } from "../../modules/firebase";
//
// export default class SchoolStore {
//     id = null;
//     courses = [];
//     groups = [];
//     mentors = [];
//     users = [];
//     name = '';
//     specialization = '';
//     admins = [];
//     password = '';
//     logo = '';
//     isLoaded = false;
//
//     constructor() {
//         makeAutoObservable(this);
//     }
//
//     /** Создание школы с предзаполненными данными */
//     static createSchool(data, { isLoaded = false } = {}) {
//         const store = new SchoolStore();
//         store.setData(data);
//         store.setLoaded(isLoaded);
//         return store;
//     }
//
//     /** Загрузка данных */
//
//     setData(data) {
//         this.id = data.id;
//         this.courses = data.courses || [];
//         this.groups = data.groups || [];
//         this.mentors = data.mentors || [];
//         this.users = data.users || [];
//         this.name = data.name || '';
//         this.specialization = data.specialization || '';
//         this.password = data.password || '';
//         this.logo = data.logo || '';
//         this.isBlocked = data.isBlocked || false;
//         this.setAdmins(data.admins);
//     }
//
//     setAdmins(admins) {
//         if (!admins) {
//             this.admins = [];
//             return;
//         }
//
//         this.admins = Object.values(admins);
//     }
//
//     setLoaded(value) {
//         this.isLoaded = value;
//     }
//
//     loadData = async () => {
//         if (this.isLoaded) {
//             return;
//         }
//
//         if (!this.id) {
//             return;
//         }
//
//         const db = database.getDatabase();
//         const ref = database.ref(db, `schools/${this.id}`);
//         const data = await database.get(ref);
//         const res = data.toJSON();
//         res.id = this.id;
//
//         this.setData(res);
//         this.setLoaded(true);
//     };
//
//     /** Обновление школы */
//
//     setIsEdit = (value) => {
//         this.isEdit = value;
//     }
//
//     updateSchool = async (data) => {
//         const db = database.getDatabase();
//         const ref = database.ref(db, `schools/${data.id}`);
//         await database.update(ref, data);
//     }
//
//     /** Удаление школы */
//
//     deleteSchool = async (id) => {
//         const db = database.getDatabase();
//         const ref = database.ref(db, `schools/${id}`);
//         await database.remove(ref);
//     }
//
//     /** Блокировка школы */
//
//     blockSchool = async (id, value) => {
//         const db = database.getDatabase();
//         const ref = database.ref(db, `schools/${id}`);
//         await database.update(ref, { isBlocked: value });
//     }
//
// }
