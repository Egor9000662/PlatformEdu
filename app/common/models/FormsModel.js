import { makeAutoObservable } from "mobx";

export default class FormsModel {

    // Sign up form
    validateName(value, valueType) {
        if (
            value.length < 2 ||
            value.length > 20 ||
            !(value[0] === value[0].toUpperCase())
        ) {
            const name = valueType === 'name' ? 'Имя' : 'Фамилия';
            const must = valueType === 'name' ? 'Имя должно' : 'Фамилия должна';
            const errorMessage = !value
                ? `${name} не может быть пустым`
                : `${must} содержать от двух до двадцати символов и начинаться с заглавной буквы`;
            return errorMessage;
        } else {
            return '';
        }
    }

    validateEmail(value) {
        const re =
            /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
        if (!re.test(String(value).toLowerCase()) || !value) {
            const errorMessage = !value
                ? 'Email не может быть пустым'
                : 'Некорректный email';
            return errorMessage;
        } else {
            return '';
        }
    }

    validatePassword(value) {
        if (value.length < 5 || value.length > 15) {
            const errorMessage = !value
                ? 'Пароль не может быть пустым'
                : 'Пароль должен содержать от пяти до пятнадцати символов';
            return errorMessage;
        } else {
            return '';
        }
    }

    validatePhone(value) {
        const re = /^(\s*)?(\+)?([- _():=+]?\d[- _():=+]?){10,14}(\s*)?$/;
        if (!re.test(String(value).toLowerCase()) || !value) {
            const errorMessage = !value
                ? 'Номер телефона не может быть пустым'
                : 'Некорректный номер телефона';
            return errorMessage;
        } else {
            return '';
        }
    }

}