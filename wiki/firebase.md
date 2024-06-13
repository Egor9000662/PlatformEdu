# Firebase

Запись встречи [Firebase + Mobx](https://youtu.be/RIT4tKILSlw)

В проекте используются:

- [Firebase Authentication](https://firebase.google.com/docs/auth) — сервис для авторизации пользователей *([документация](https://firebase.google.com/docs/reference/js/firebase.auth))*
- [Firebase Realtime Database](https://firebase.google.com/docs/database) — одновременно API и база данных *([документация](https://firebase.google.com/docs/reference/js/firebase.database))*
- [Firebase Local Emulator](https://firebase.google.com/docs/emulator-suite) — инструменты для локальной разработки

## Работа с эмулятором

### Настройка проекта

Для работы эмулятора понадобится:
1. Установить на компьютер (если еще не установлен) [Java SE jdk 16](https://www.oracle.com/java/technologies/javase-jdk16-downloads.html) !!!
в терминале проверьте: `java --version`
2. Установить глобальный npm пакет для работы с firebase: `npm i -g firebase-tools`
в терминале проверьте: `firebase --version`
3. Авторизоваться в google developers console: `firebase login` — eduplatform2021@gmail.com (pass: edu123123123)
4. Добавить файлы `config.json` и `config-local.json` в папку [app/common/modules](../app/common/modules) — файлы содержат кофиг для firebase, взять можно у коллег
5. Перейти в папку [firebase/functions](../firebase/functions) и выполнить в ней `npm install`
6. Вернуться в корень проекта и запустить эмулятор

```bash
npm run start:firebase
```

При разработке **всегда запускайте эмулятор** параллельно с проектом. В нём лежит тестовая база данных и аккаунты пользователей.

### Экспорт данных из локальной базы

Если вы внесли существенные изменения в тестовую базу и хотите их сохранить, выполните в терминале:

```bash
cd firebase
firebase emulators:export data
```

### Деплой

В папке [firebase](../firebase) лежат правила для всех сервисов firebase. Их можно отправить на прод.

```bash
cd firebase
firebase deploy --only hosting
```

## Создание пользователей

На проекте есть 3 вида пользователей

1. admin — {"role": "admin"}
2. student
3. teacher - {"role": "teacher"}

## Как писать код

### Создание ссылок

Ссылки дают доступ к данным, позволяют делать запросы на их получение и изменение.

```js
const db = database.getDatabase()

// courses
database.ref(db, 'courses')
// courses/frontend
database.ref(db, 'courses/frontend')
```

### Получение данных

```js
const db = database.getDatabase();
const ref = database.ref(db, 'courses');

const data = await database.get(ref);
const courses = data.toJSON() // объект с данными
```

### Изменение данных

set заменяет все данные по пути на новые

```js
const db = database.getDatabase();
const ref = database.ref(db, 'users');

await database.set(ref, {
	'user-1': {name: 'Один'},
	'user-2': {name: 'Два'},
})
```

update обновляет данные точечно, добавляет их, если их нет

```js
const db = database.getDatabase();
const ref = database.ref(db, 'users');

await database.update(ref, {
	'user-1': {name: 'Один'},
	'user-2': {name: 'Два'},
})
```

### Создание нового объекта

С рандомным id

```js

const db = database.getDatabase();
const ref = database.ref(db, 'courses');

const newCourse = database.push(ref);
await database.set(newCourse, {
	key: 'value',
	key2: 'value2'
})
```

С кастомным id

```js
const db = database.getDatabase();
const ref = database.ref(db, 'users');
const childRef = database.child(ref, 'user-3');

await database.set(childRef, {
	name: 'Новенький'
})
```

### Удаление элемента

```js
const db = database.getDatabase();
const ref = database.ref(db, 'users/user-3');

await database.remove(ref);
```
