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

const Reflect: React.FunctionComponent = () => {

    const [goals, setGoals] = useState<any>([]);
    const [expenses, setExpenses] = useState<any>([]);
    const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
    const [date3, setDate3] = useState('');
    const [date4, setDate4] = useState('');
    
    const fetchGoalsRange = async () => {

        await fetch(`http://localhost:5000/goals/gRangeSelect/${date1}/${date2}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((goals) => {
            setGoals(goals)
            console.log(goals)
        })
    } 
    
    const fetchAllGoals = async () => {

        await fetch(`http://localhost:5000/goals/allGoals`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((goals) => {
            setGoals(goals)
            console.log(goals)
        })
    } 

    const fetchExpensesRange = async () => {

        await fetch(`http://localhost:5000/expenses/eRangeSelect/${date3}/${date4}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((expenses) => {
            setExpenses(expenses)
            console.log(expenses)
        })
    } 

    const fetchAllExpenses = async () => {

        await fetch(`http://localhost:5000/expenses/allExpenses`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((expenses) => {
            setExpenses(expenses)
            console.log(expenses)
        })
    } 
    
    return (
        <>
        <Sidebar/>
        <div className='ReflectPage'>
            <div className="btn-toggle">
                <FaBars />
            </div>
            <h1>Reflect, adjust, progress.</h1>
            <div className='goalPercentages'>
                <h2>PERCENT OF GOALS COMPLETED</h2>
                <div className='percentsContainer'>
                    <div className='percentBox'>
                        <h1 className='percent'>100%</h1>
                        <h5 className='percentTime'>Today</h5>
                    </div>
                    <div className='percentBox'>
                        <h1 className='percent'>80%</h1>
                        <h5 className='percentTime'>This Week</h5>
                    </div>
                    <div className='percentBox'>
                        <h1 className='percent'>70%</h1>
                        <h5 className='percentTime'>This Month</h5>
                    </div>
                    <div className='percentBox'>
                        <h1 className='percent'>70%</h1>
                        <h5 className='percentTime'>This Year</h5>
                    </div>
                </div>
            </div>
            <h1>View Goals</h1>
            <div className='searchBlock'>
                <div>
                    <input value={date1} onChange={(e) => setDate1(e.target.value)} className='searchInput1' id='startDate'type='text' name='expense' placeholder='   Start  MM-DD-YYYY'></input>
                    <input value={date2} onChange={(e) => setDate2(e.target.value)} className='searchInput2' id='endDate'type='text' name='expense' placeholder='   End  MM-DD-YYYY'></input>
                </div>
                <div>
                    <button className='viewButton' onClick={fetchGoalsRange}>VIEW</button>
                    <button className='allButton' onClick={fetchAllGoals}>ALL</button>
                </div>
            </div>
            <br/>
            <br/>
            {(goals.length == 0)
                    ?(<div/>)
                    :(<Table className='theTable'>
                        <tbody>
                            {goals.map((goal:any, index:any) => {
                                return(
                                    <tr key={index}>
                                        <td className='dateColumn'>{goal.writeDate.slice(0, 10)}</td>
                                        <td><b><button className='updateBtn' >{goal.goal}</button></b></td>
                                        <td className='buttonColumn'>
                                            {(goal.isDone == true)
                                                ? (<button className='doneButton' ><FaCheck/></button>)
                                                : (<button className='notDoneButton' >Done?</button>)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>)}
            <br />
            <h1>View Expenses</h1>
            <div className='searchBlock'>
                <div>
                    <input value={date3} onChange={(e) => setDate3(e.target.value)} className='searchInput1' id='startDate'type='text' name='expense'  placeholder='   Start  MM-DD-YYYY'></input>
                    <input value={date4} onChange={(e) => setDate4(e.target.value)} className='searchInput2' id='endDate'type='text' name='expense'  placeholder='   End  MM-DD-YYYY'></input>
                </div>
                <div>
                    <button className='viewButton' onClick={fetchExpensesRange}>VIEW</button>
                    <button className='allButton ' onClick={fetchAllExpenses}>ALL</button>
                </div>
            </div>
            <br/>
            <br/>
            {(expenses.length == 0)
                    ?(<div/>)
                    :(<Table className='theTable'>
                        <tbody>
                            {expenses.map((expense:any, index:any) => {
                                return(
                                    <tr key={index}>
                                        <td className='dateColumn'>{expense.writeDate.slice(0, 10)}</td>
                                        <td><b><button className='updateBtn' >{expense.expense}</button></b></td>
                                        <td className='buttonColumn'>
                                            {(expense.isPaid == true)
                                                ? (<button className='doneButton' ><FaCheck/></button>)
                                                : (<button className='notDoneButton' >Paid?</button>)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>)}
            <br/>
        <br/>
        </div>
        </>
    )
}

export default Reflect;