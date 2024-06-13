import React, { useState, useEffect } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Divider, Modal } from 'antd';
import Input from '../../../common/components/Input/Input';
import './SchoolForm.scss';
import DragDropFile from '../../components/DragDropFile/DragDropFile';
import eye from "../../assets/controls/eye.svg";
import closedEye from "../../assets/controls/closedEye.svg";
import SchoolModel from '../../models/SchoolModel';

function SchoolForm({ oneSchoolStore, schoolsStore, schoolModel, currentSchoolId }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [passwordShown, setPasswordShown] = useState(false);
    const [admins, setAdmins] = useState([{ email: '', password: '' }]);
    const [school, setSchool] = useState({
        name: '',
        specialization: '',
        logo: '',
    });
    const [errorMessage, setErrorMessage] = useState({
        name: '',
        specialization: '',
        admins: '',
        email: '',
        password: '',
        emailIndex: '',
        passwordIndex: '',
    });

    useEffect(() => {
        if (!currentSchoolId) {
            return;
        }
        const school = schoolsStore.getSchool(currentSchoolId);
        if (school?.isEdit) {
            setSchool(school);
            setAdmins(Object.values(school.admins));
        }
    }, []);

    useEffect(() => {
        if (oneSchoolStore.isEdit) {
            setSchool({
                id: oneSchoolStore.id,
                name: oneSchoolStore.name,
                specialization: oneSchoolStore.specialization,
                logo: oneSchoolStore.logo,
                isEdit: true,
            });
            setAdmins(oneSchoolStore.admins);
        }
    }, [oneSchoolStore.isEdit]);

    const clearStates = () => {
        setSchool({
            name: '',
            specialization: '',
            logo: '',
            isEdit: school.isEdit,
        });
        setAdmins([{ email: '', password: '' }]);
        setErrorMessage({
            name: '',
            specialization: '',
            admins: '',
            email: '',
            password: '',
            emailIndex: '',
            passwordIndex: '',
        });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const res = await schoolModel.saveSchool(school, admins);
        if (res.isValid) {
            clearStates();
            setModalVisible(true);
        } else {
            setErrorMessage(res.errorMessage);
        }
    };

    const handleChange = (e) => {
        setSchool({ ...school, [e.target.name]: e.target.value });
        setErrorMessage({ ...errorMessage, [e.target.name]: '' });
    }

    const handleChangeAdmin = (e, i) => {
        let data = [...admins];
        data[i][e.target.name] = e.target.value;
        setAdmins(data);
        setErrorMessage({ ...errorMessage, [e.target.name]: '', emailIndex: '', passwordIndex: '', admins: '' });
    }

    const addAdmin = () => {
        setAdmins([...admins, { email: '', password: '' }]);
    }

    const deleteAdmin = (i, item) => {
        let data = [...admins];
        data.splice(i, 1);
        setAdmins(data);

        // if (item.uid) {
        //     schoolModel.deleteAdmin(item.uid);
        // }
    }

    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    };

    return (
        <div className="addschool-container">
            <Divider orientation="center" id='divider'>
                <span id='divider-text'>
                    {school.isEdit ? 'Изменить данные школы' : 'Добавить школу'}
                </span>
            </Divider>
            <div className="addschool-content">
                <form className="addschool-form" onSubmit={submitHandler}>
                    <div className="addschool-form-item">
                        <label className="form-item-label" htmlFor='name'>Название школы</label>
                        <Input
                            type="text"
                            placeholder="Название школы"
                            value={school.name}
                            onChange={(e) => handleChange(e)}
                            className="searchInput-input school-form-input"
                            name='name'
                            required
                        />
                        {errorMessage.name && <div className='error-message'>{errorMessage.name}</div>}
                    </div>
                    <div className="addschool-form-item">
                        <label className="form-item-label" htmlFor='specialization'>Направление школы</label>
                        <Input
                            type="text"
                            placeholder="Направление школы"
                            value={school.specialization}
                            onChange={(e) => handleChange(e)}
                            className="searchInput-input school-form-input"
                            name='specialization'
                            required
                        />
                        {errorMessage.specialization && <div className='error-message'>{errorMessage.specialization}</div>}
                    </div>
                    {errorMessage.admins && <div className='error-message'>{errorMessage.admins}</div>}
                    {admins.map((item, i) => {
                        return (
                            <div key={i}>
                                {admins.length > 1 && i > 0 && <h2 className="form-item-title">Еще один администратор</h2>}
                                <div className="addschool-form-item">
                                    <label className="form-item-label" htmlFor='email'>Администратор школы</label>
                                    <Input
                                        type="email"
                                        minLength="6"
                                        placeholder="Email администратора школы"
                                        value={item.email.trim()}
                                        onChange={(e) => handleChangeAdmin(e, i)}
                                        className="searchInput-input school-form-input"
                                        name='email'
                                        required
                                    />
                                    {errorMessage.email && errorMessage.emailIndex === i &&
                                        <div className='error-message'>{errorMessage.email}</div>}
                                </div>
                                <div className="addschool-form-item">
                                    {item.hasOwnProperty('password') && <div>
                                        <label className="form-item-label" htmlFor='email'>Задайте пароль для кабинета администратора</label>
                                        <div className="addschool-form-input-container">
                                            <Input
                                                type={passwordShown ? 'text' : 'password'}
                                                minLength="6"
                                                maxLength="15"
                                                placeholder="Пароль"
                                                value={item.password.trim()}
                                                onChange={(e) => handleChangeAdmin(e, i)}
                                                className="searchInput-input school-form-input"
                                                name='password'
                                                required
                                            />
                                            <img
                                                className="input-password-icon"
                                                src={passwordShown ? eye : closedEye}
                                                alt="button"
                                                onClick={togglePassword}
                                            />
                                        </div>
                                        {errorMessage.password && errorMessage.passwordIndex === i &&
                                            <div className='error-message'>{errorMessage.password}</div>}
                                    </div>}
                                    <Button
                                        className="redBtn add-admin-button"
                                        type="submit"
                                        onClick={() => deleteAdmin(i, item)}
                                    >
                                        Удалить администратора
                                    </Button>
                                </div>
                            </div>
                        )
                    }
                    )}

                    <div className="addschool-form-item">
                        <Button
                            className="greenBtn add-admin-button"
                            type="submit"
                            onClick={addAdmin}
                        >
                            Добавить нового администратора
                        </Button>
                    </div>

                    <div className="addschool-form-item centered">
                        <DragDropFile
                            callToAction={'Перетащите лого школы размером 60x60px'}
                            name='logo'
                            setSchool={setSchool}
                            school={school}
                        />
                    </div>
                    <div className="addschool-form-item addschool-form-button-container">
                        <Button
                            type="submit"
                            onClick={submitHandler}
                            className="greenBtn addschool-form-button"
                        >
                            {school.isEdit ? 'Сохранить' : 'Создать школу'}
                        </Button>
                    </div>
                </form>
            </div >

            <Modal
                className="groupModal  group-removeModal"
                title={'Ура!'}
                open={isModalVisible}
                onOk={() => setModalVisible(false)}
                onCancel={() => setModalVisible(false)}
                footer={null}
            >
                <div>
                    {school.isEdit ? 'Данные успешно отредактированы!' : 'Школа успешно создана!'}
                </div>
            </Modal>

        </div >
    );
}

export default inject(({ auth, oneSchoolStore, schoolsStore }) => {
    useEffect(() => {
        schoolsStore.loadSchoolsData();
    }, []);
    const schoolModel = new SchoolModel(
        auth, oneSchoolStore, schoolsStore
    );
    return {
        oneSchoolStore,
        schoolsStore,
        schoolModel,
    };
})(observer(SchoolForm));