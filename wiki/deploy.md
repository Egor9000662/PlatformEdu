

Project Console: https://console.firebase.google.com/project/eduplatform2021-87ed9/overview

Hosting URL: https://itgirlschool.web.app



## Автоматическая сборка ##
[Файл с настройками deploy.yml](.github/workflows/deploy.yml)
Автоматически раскладывает все проекты и контент на бой
Чтобы корректно работал, в настройках репы гитхаба должна быть целая куча переменных Secrets

## Если очень хочется разложить руками ##
```bash
# шаг 1: настройка фаербейза на деплой (делается один раз)
cd firebase
firebase target:apply hosting app itgirlschool

# шаг 2: сборка проекта (из корня)
npm run init:env
npm run build:notion
npm run build:app

# шаг 3: деплой результатов сборки
npm run deploy:notion
npm run deploy:app
```
