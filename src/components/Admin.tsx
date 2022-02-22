import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import './Reflect.css';
import Calendar from 'react-calendar';
import { FaBars, FaPen, FaCheck } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import './Plan.css';
import ReactDOM from 'react-dom';
import 'react-responsive-modal/styles.css';
import ReactLoading from 'react-loading';
import { Modal } from 'react-responsive-modal';
import { Table } from 'reactstrap';
import './modal.css'
import './Admin.css'

const Admin: React.FunctionComponent = () => {

    const [users, setUsers] = useState([])
    const [userToDelete, setUserToDelete] = useState({});

    const fetchUsers = async () => {

        await fetch(`http://localhost:5000/user/allUsers`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((users) => {
            setUsers(users)
            console.log(users)
        })
    }; 

    const setTheUserToDelete = (user:any) => {
        setUserToDelete(user);
    }

    const deleteUser = (user:any) => {
        fetch(`http://localhost:5000/user/deleteUser/${user.idNumber}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        })
        alert('User Deleted');
        fetchUsers();
    }

    useEffect(() =>{
        fetchUsers();
    },[])
    
    return (
        <>
        <Sidebar/>
        <div className='AdminPage'>
        <h1>Welcome, Admin.</h1>
        <Table className='theTable'>
                        <tbody>
                            {users.map((user:any, index:any) => {
                                return(
                                    <tr key={index}>
                                        <td>{user.fullName}</td>
                                        <td>{user.email}</td>
                                        <td><button className='doneButton'onClick={() => {setTheUserToDelete(user); deleteUser(userToDelete)}}>DELETE USER</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>

        </div>
        </>
    )
}

export default Admin;