import React, { useState } from 'react';
import Calendar from 'react-calendar';
import { FaBars, FaPen } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import './Plan.css';
import ReactDOM from 'react-dom';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import Sidebar from './Sidebar';
import './modal.css'

const Plan: React.FunctionComponent = () => {

    const [value, onChange] = useState(new Date());
    const [openGoal, setOpenGoal] = useState(false);
    const [openExpense, setOpenExpense] = useState(false);

    const onOpenModalGoal = () => setOpenGoal(true);
    const onOpenModalExpense = () => setOpenExpense(true);
    const onCloseModalGoal = () => setOpenGoal(false);
    const onCloseModalExpense = () => setOpenExpense(false);

    return (
        <>
        <div className='PlanPage'>
            <div className="btn-toggle">
                <FaBars />
            </div>
            <h1>Let's put some plans together!</h1>
            <div>
                <Calendar onChange={onChange} value={value} />
            </div>
            <h1>Goals<button className='addButton' onClick={onOpenModalGoal} ><FaPen size={30}/></button></h1>
                <Modal open={openGoal} onClose={onCloseModalGoal} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>What's your goal?</h2>
                        <input type='text' id='goal' name='goal' placeholder='Goal'></input>
                        <input type='date' id='writeDate' name='writeDate'></input>
                        <textarea id='description' name='description cols="50" rows="10"' placeholder='Description'></textarea>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton'>DELETE</button>
                        <button id='updateButton'>UPDATE</button>
                    </div>
                </Modal>
                <br />
            <h1>Expenses<button className='addButton' onClick={onOpenModalExpense}><FaPen size={30}/></button></h1>
            <Modal open={openExpense} onClose={onCloseModalExpense} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>What's your expense?</h2>
                        <input type='text' id='expense' name='expense' placeholder='Expense'></input>
                        <input type='date' id='writeDate' name='writeDate'></input>
                        <input type='number' id='expenseAmt' name='expenseAmt' min='1' step='any'  placeholder='$ 0.00'></input>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton'>DELETE</button>
                        <button id='updateButton'>UPDATE</button>
                    </div>
            </Modal>
        </div>
        </>
    )
}

export default Plan;