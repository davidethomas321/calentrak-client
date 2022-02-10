import React from 'react'
import { ProSidebar, SidebarHeader, SidebarContent, Menu, MenuItem, SidebarFooter, ProSidebarProps } from 'react-pro-sidebar';
import { Outlet, Link } from 'react-router-dom';
import './Sidebar.scss';
import './Sidebar.css';

const Sidebar: React.FunctionComponent = ({collapsed, toggled}:ProSidebarProps, {handleToggleSidebar}) => {
    return (
        <>
            <ProSidebar
             collapsed={collapsed}
             toggled={toggled}
             breakPoint="md"
             onToggle={handleToggleSidebar}
             className='sideBar'
            >
                <SidebarHeader>
                    <h1 className='logo'>calentrak</h1>
                </SidebarHeader>
                <SidebarContent>
                    <Menu>
                        <MenuItem><button className='menuItem'><Link to="/Today"/>TODAY</button></MenuItem>
                        <MenuItem><button className='menuItem'><Link to="/Plan"/>PLAN</button></MenuItem>
                        <MenuItem><button className='menuItem'><Link to="/Reflect"/>REFLECT</button></MenuItem>
                    </Menu>
                </SidebarContent>
                <SidebarFooter>
                    <button className='exitButton'>EXIT</button>
                </SidebarFooter>
            </ProSidebar>
        </>
    )
}

export default Sidebar
