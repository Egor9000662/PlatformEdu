// import { makeAutoObservable } from 'mobx';
// import { database } from '../../modules/firebase';
// import oneSchoolStore from './schoolStore';
//
//
// export default class SchoolsStore {
//     schools = [];
//     isLoaded = false;
//
//     constructor() {
//         makeAutoObservable(this);
//     }
//
//     loadSchoolsData = async () => {
//         if (this.isLoaded) {
//             return;
//         }
//
//         const db = database.getDatabase();
//         const ref = database.ref(db, 'schools');
//         const data = await database.get(ref);
//         const res = data.toJSON();
//
//         if (!res) {
//             this.setSchools([]);
//             this.setLoaded(true);
//             return;
//         }
//
//         const schools = Object.entries(res).map(([key, value]) => oneSchoolStore.createSchool({
//             ...value,
//             id: key,
//         }, { isLoaded: true }));
//
//         this.setSchools(schools);
//         this.setLoaded(true);
//     };
//
//     setSchools(schools) {
//         this.schools = schools;
//     }
//
//     setLoaded(value) {
//         this.isLoaded = value;
//     }
//
//     getSchool = (id) => {
//         return this.schools.find((item) => item.id === id);
//     };
//
//     getSchoolbyName = (name) => {
//         return this.schools.find((item) => item.name === name);
//     };
// }
