# Работа с Notion

Вся информация о курсе хранится в таблице в Notion.

Скрипт [notion/index.js](../app/notion/index.js) выкачивает из таблицы все данные и создаёт файлы курсов на их основе в папке `app/notion/frontend`

## Настройка

По умолчанию `app/notion/frontend` лежит в .gitignore, при старте проекта нужно её сгенерировать.

1. **Добавьте в корень проекта файл .env** (@marinatells)
2. Запустите npm script

```bash
npm run build:notion
```

## Структура курса

Файл `app/notion/frontend/index.json` — структура курса

Пример:

```json
{
    "week-1": {
        "id": "week-1",
        "block": "HTML CSS",
        "tasks": [
            {
                "id": "c2d8f150-19ec-423d-b04a-46aadfd5ff66",
                "type": "theme",
                "title": "Введение в курс"
            },
            {
                "id": "094c2b21-8de5-4e3a-b011-c1dae5d6766d",
                "type": "theme",
                "title": "Знакомство с инструментами"
            },
            {
                "id": "cb7ae27a-9104-4044-a665-70713dd9fa6c",
                "type": "test",
                "title": "Настройка окружения"
            },
            {
                "id": "7f07cab4-fb99-43d1-a5c4-727b182080ea",
                "type": "test",
                "title": "Основы HTML"
            },
            {
                "id": "335151a0-4797-4285-ac3a-ae6adf7dea3f",
                "type": "theme",
                "title": "Основы HTML"
            },
            {
                "id": "7c39d4dd-a3d8-4fbb-ab31-b191582ea981",
                "type": "practice",
                "title": "Страница Кота Учёного"
            }
        ],
        "title": "Введение в HTML",
        "description": "Изучаем основы HTML CSS"
    },
    "week-2": {
        "id": "week-2",
        "block": "HTML CSS",
        "tasks": [
            {
                "id": "692050d2-d4d4-4215-b790-542e4dd578e8",
                "type": "theme",
                "title": "Семантическая вёрстка"
            },
            {
                "id": "2b17c69f-760c-4d6c-aaf7-8f4455d6dd01",
                "type": "test",
                "title": "Семантическая вёрстка"
            },
            {
                "id": "043658cb-cf56-4d4c-966e-eb051fb4de4c",
                "type": "practice",
                "title": "Блог"
            },
            {
                "id": "3ce613f3-627d-4120-a66b-2e39480d7e72",
                "type": "theme",
                "title": "Теги форм"
            },
            {
                "id": "8531e1b5-a10b-4515-bd3e-30cf17ab2e86",
                "type": "test",
                "title": "Теги форм"
            },
            {
                "id": "41ad0f87-dccd-4b01-9ce3-b330508e4066",
                "type": "practice",
                "title": "Опросник"
            }
        ]
    }
}
```

## Структура урока

Файлы с id в папке `app/notion/frontend` это и есть уроки курса. Здесь собраны данные для рендера **теории** и **практики**.

Эти файлы импортируются динамически через webpack в компоненте [NotionPage](../app/student/pages/NotionPage/NotionPage.jsx) и рендерятся специальным пакетом `react-notion-x` в компоненте [NotionCard](../app/student/components/NotionCard/NotionCard.jsx)
