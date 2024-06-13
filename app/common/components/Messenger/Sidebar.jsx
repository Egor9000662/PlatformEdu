import React, { useState } from "react";
import Search from "./Search";
import Chats from "./Chats"

const Sidebar = ({ sidebarHidden, setSidebarHidden }) => {
    const [username, setUsername] = useState("");

    return (
        <div className={sidebarHidden ? "sidebar hidden-block" : "sidebar"}>
            <Search
                username={username}
                setUsername={setUsername}
            />

            <Chats
                username={username} setSidebarHidden={setSidebarHidden} />
        </div>
    );
};

export default Sidebar;