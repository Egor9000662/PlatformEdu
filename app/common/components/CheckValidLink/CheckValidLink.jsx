import React, { useState } from 'react';
import { useEffect } from 'react';
import './CheckValidLink.scss';

export default function CheckValidLink({ link, setInvalidLink, invalidLink }) {
    const RegExp =
        /^((ftp|http|https):\/\/)?(www\.)?([A-Za-zА-Яа-я0-9]{1}[A-Za-zА-Яа-я0-9\-]*\.?)*\.{1}[A-Za-zА-Яа-я0-9-]{2,8}(\/([\w#!:.?+=&%@!\-\/])*)/;

    useEffect(() => {
        if (RegExp.test(link) || link === '') {
            setInvalidLink(false);
        } else {
            setInvalidLink(true);
        }
    }, [link]);
    return (
        <>
            {invalidLink && (
                <span className="err-message-link">ссылка не корректна</span>
            )}
        </>
    );
}