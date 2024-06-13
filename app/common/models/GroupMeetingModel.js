// import { auth } from '../../modules/firebase/index';
// import moment from 'moment';
//
// export default class GroupMeetingModel {
//
//     /** @private {UsersStore}*/
//     #usersStore;
//
//     /** @private {MentorsStore}*/
//     #mentorsStore;
//
//     /** @private {GroupsStore}*/
//     #groupsStore;
//
//     /** @private {AuthStore}*/
//     #authStore;
//
//     /** @private {FilesStore}*/
//     #files;
//
//     constructor(usersStore, mentorsStore, groupsStore, auth, files) {
//         this.#usersStore = usersStore;
//         this.#mentorsStore = mentorsStore;
//         this.#groupsStore = groupsStore;
//         this.#authStore = auth;
//         this.#files = files;
//     }
//
//     get currentUser() {
//         const { currentUser } = auth.getAuth();
//         return currentUser;
//     }
//
//     get isMentorOrAdmin() {
//         return this.currentUser.reloadUserInfo.customAttributes;
//     }
//
//     get isMentor() {
//         return this.currentUser.reloadUserInfo.customAttributes === "{\"teacher\":true}";
//     }
//
//     get mentors() {
//         return this.#mentorsStore.mentors;
//     }
//
//     get mentor() {
//         return this.mentors.find(
//             (mentor) => mentor.uid === this.currentUser.uid);
//     }
//
//     get groups() {
//         let userGroups = [];
//         if (this.isMentorOrAdmin && this.mentor) {
//             userGroups = Object.keys(this.mentor.groups);
//         } else {
//             const { profile } = this.#authStore;
//             userGroups = profile?.groups.map((group) => group.groupId);
//         }
//         return this.#groupsStore.groups.filter(
//             (group) => userGroups.includes(group.id)
//         )
//     }
//
//     getGroupSchedule(groupId) {
//         return Object.values(
//             this.#groupsStore.getGroup(groupId).schedule
//         ).sort((a, b) => a.weekNumber - b.weekNumber);
//     }
//
//     async uploadFiles(e) {
//         if (!e.target.files || e.target.files.length === 0) {
//             return;
//         }
//         let filesURL = [];
//         for (let file of e.target.files) {
//             const link = await this.#files.uploudFileURL(file);
//             filesURL.push({
//                 name: file.name.split('.')[0],
//                 url: link,
//             });
//         }
//         return filesURL;
//     };
//
//     getCurrentVideos(value) {
//         if (!value) {
//             return [];
//         }
//
//         let videos = [];
//         const currentGroups = this.groups;
//         videos = currentGroups.map((group) => {
//             const groupMeetingsInfo = JSON.parse(
//                 JSON.stringify(group.meetings)
//             ) || {};
//             return Object.values(groupMeetingsInfo).map((meeting) => {
//                 if (meeting.videos) {
//                     const meetingVideos = Object.entries(meeting.videos).map(
//                         ([key, value]) => ({
//                             videoId: key,
//                             groupId: group.id,
//                             date: meeting.date,
//                             ...value,
//                         })
//                     );
//                     return meetingVideos;
//                 }
//                 return [];
//             }
//             )
//         }
//         ).flat(Infinity);
//
//         let currentVideos = [];
//         const chosenDay = value.toDate().getDate();
//         const chosenMonth = value.toDate().getMonth() + 1;
//         const chosenYear = value.toDate().getFullYear();
//         for (let video of videos) {
//             const videoDate = new Date(video.date);
//             const videoDay = videoDate.getDate();
//             const videoMonth = videoDate.getMonth() + 1;
//             const videoYear = videoDate.getFullYear();
//             if (
//                 videoDay === chosenDay &&
//                 videoMonth === chosenMonth &&
//                 videoYear === chosenYear
//             ) {
//                 currentVideos.push(video);
//             }
//         }
//         return currentVideos;
//     }
//
//     async addVideo(
//         invalidLink,
//         invalidLinks,
//         inputLink,
//         inputTheme,
//         selectWeekValue,
//         selectGroupValue,
//         uploadedFilesURL,
//         links,
//         meetingId,
//     ) {
//         if (
//             !invalidLink &&
//             !invalidLinks &&
//             inputLink !== '' &&
//             inputTheme !== '' &&
//             selectWeekValue !== '' &&
//             selectGroupValue !== 'course-unassigned' &&
//             meetingId
//         ) {
//             const group = await this.#groupsStore.getGroup(selectGroupValue);
//             const mentor = Object.values(JSON.parse(JSON.stringify(group.mentor)))
//                 .filter((mentor) => !mentor.isHidden)[0];
//             const linksToSave = [];
//             links.split(' ').forEach((link) => {
//                 if (link !== '') {
//                     linksToSave.push(link);
//                 }
//             });
//
//             const meetingObj = {
//                 groupId: selectGroupValue,
//                 theme: inputTheme,
//                 link: inputLink,
//                 week: selectWeekValue,
//                 mentor: mentor.name,
//                 files: uploadedFilesURL || [],
//                 extraLinks: linksToSave || [],
//             };
//             await group.addVideo(selectGroupValue, meetingObj, meetingId);
//             await this.#groupsStore.setLoaded(false);
//             return true;
//         }
//         return false;
//     }
//
//     getWeekDay(dateStr) {
//         const days = ['', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
//         return days.indexOf(dateStr);
//     }
//
//     validateMeetingsData(group, chosenDays, time) {
//         if (!group || chosenDays.length === 0 || time === '') {
//             return "Заполните все поля";
//         }
//         const hours = time.split(':')[0];
//         const minutes = time.split(':')[1];
//         if (time.length !== 5 || time[2] !== ':' || isNaN(hours) || isNaN(minutes) ||
//             hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
//             return "Неверный формат времени";
//         }
//         return '';
//     }
//
//     async addMeetingsSchedule(group, chosenDays, time) {
//         const currentGroup = this.#groupsStore.getGroup(group);
//         const currentMeetings = Object.fromEntries(Object.entries(currentGroup.meetings)
//             .filter(([key, value]) => new Date(value.date) < new Date())
//             .map(([key, value]) => [key, { ...value }]));
//         const groupSchedule = Object.values(currentGroup.schedule);
//
//         const meetingsDates = [];
//         groupSchedule
//             .filter((week) => new Date(week.dateEnd) > new Date())
//             .map((week) => {
//                 const date = new Date().setHours(0, 0, 0, 0);
//                 const start = new Date(week.dateStart) < date ? moment(date) : moment(week.dateStart);
//                 const end = moment(week.dateEnd);
//                 chosenDays
//                     .map((chosenDay) => {
//                         const day = this.getWeekDay(chosenDay);
//                         const current = start.clone();
//                         const currentDay = current.day(day);
//                         if (currentDay.isSameOrAfter(start) && currentDay.isSameOrBefore(end)) {
//                             meetingsDates.push({ date: current.clone().toDate(), time });
//                         }
//                     });
//             });
//         const formatedMeetingsDates = Object.fromEntries(meetingsDates
//             .map((meeting) => {
//                 const date = moment(meeting.date).format('DD-MM-YYYY');
//                 return [date, { date: +moment(meeting.date).format('x'), time: meeting.time }];
//             })
//         );
//
//         await currentGroup.addMeetings({ ...formatedMeetingsDates, ...currentMeetings });
//     }
//
//     getMeetings(group) {
//         const groupMeetings = this.#groupsStore.getGroup(group).meetings;
//         const meetings = Object.values(groupMeetings).map((meeting) => {
//             return { ...meeting, date: moment(meeting.date, 'x').format('DD-MM-YYYY') };
//         });
//         return meetings;
//     }
//
//     getCurrentUsersMeetingDates() {
//         const dates = [];
//         const currentGroups = this.groups;
//         currentGroups.map((group) => {
//             const groupMeetings = Object.values(group.meetings);
//             groupMeetings.map((meeting) => {
//                 const date = moment(meeting.date, 'x').format('DD-MM-YYYY');
//                 dates.push(date);
//             });
//         });
//         return dates;
//     }
//
//     getMeetingDataByDate(date) {
//         const meetings = [];
//         this.groups.map((group) => {
//             const groupMeetings = Object.values(group.meetings);
//             const meeting = groupMeetings.filter((meeting) => {
//                 const meetingDate = moment(meeting.date, 'x').format('DD-MM-YYYY');
//                 return meetingDate === date && !meeting.videos;
//             });
//             if (meeting.length > 0) {
//                 const mentor = Object.values(group.mentor).filter((mentor) => !mentor.isHidden)[0];
//                 meetings.push({ ...JSON.parse(JSON.stringify(...meeting)), group: group.id, mentor: mentor.name });
//             }
//         });
//         return meetings;
//     }
//
//     async sendNoticeToGroup(group, notifsData) {
//         const students = Object.keys(group.students);
//         for (let student of students) {
//             const currentStudent = await this.#usersStore.getUser(student);
//             if (currentStudent) {
//                 await currentStudent.sendUrgentNotice(student, 'teacher', notifsData);
//             }
//         }
//     }
//
//     async deleteMeeting(group, date) {
//         const currentGroup = this.#groupsStore.getGroup(group);
//         await currentGroup.deleteMeeting(date);
//         const notifsData = {
//             event: 'Отмена встречи',
//             message: 'Встреча ' + date + ' отменена',
//         }
//         await this.sendNoticeToGroup(currentGroup, notifsData);
//     }
//
//     async addNewMeeting(group, date, time) {
//         if (date === '' || time === '') {
//             return "Заполните все поля";
//         }
//         const currentGroup = this.#groupsStore.getGroup(group);
//         await currentGroup.updateMeeting(date, { date: +moment(date, 'DD-MM-YYYY').format('x'), time });
//
//         const notifsData = {
//             event: 'Новая встреча',
//             message: 'Добавлена новая встреча ' + date + ' в ' + time + '',
//         }
//         await this.sendNoticeToGroup(currentGroup, notifsData);
//         return '';
//     }
//
// }
