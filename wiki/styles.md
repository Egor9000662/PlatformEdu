# Как писать стили

## Инструменты

1. sass-loader в webpack

## Переменные

### Локально

Если переменная локальная, добавьте её в нужный файл и сразу используйте
```css
/*  App.css */

$app-primary-color: blue;

.app {
	color: $app-primary-color;
}
```

### Глобально

Если переменная глобальная, добавьте её в файл [app/styles/vars.scss](../app/styles/vars.scss)

```css
/* app/styles/vars.scss */

$primary-color: blue;
```

Затем импортируйте её в свой файл

```css
/* App.css */

@use '../../../styles/vars';

.app {
	color: vars.$primary-color;
}
```

