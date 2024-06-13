import React, { useState, useEffect } from "react";
import './MessengerPage.scss';
import Header from '../../components/Messenger/Header';
import Sidebar from '../../components/Messenger/Sidebar';
import MessengerWindow from '../../components/Messenger/MessengerWindow';
import { inject, observer } from 'mobx-react';
import {useParams} from "react-router-dom";

const MessengerPage = ({ auth, groupsStore, mentorsStore }) => {
    const [sidebarHidden, setSidebarHidden] = useState(false);

    return (
        <div className={auth.role === 'student' ? 'messenger' : 'messenger-noAppSidebar'}>
            <Header
                sidebarHidden={sidebarHidden}
                setSidebarHidden={setSidebarHidden}
            />
            <div className="messenger-container">
                <Sidebar sidebarHidden={sidebarHidden} setSidebarHidden={setSidebarHidden} />
                <MessengerWindow
                    uid={auth.user.uid}
                    role={auth.role}
                    sidebarHidden={sidebarHidden}
                    setSidebarHidden={setSidebarHidden}
                />
            </div>
        </div>
    )
}
export default inject(({ auth, groupsStore, mentorsStore }) => {
    useEffect(() => {
        mentorsStore.loadData();
    }, []);
    useEffect(() => {
        groupsStore.loadData();
    }, [groupsStore.isLoaded]);

    return { auth, groupsStore, mentorsStore };
})(observer(MessengerPage));

