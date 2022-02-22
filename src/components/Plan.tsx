import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { FaBars, FaPen, FaCheck } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import './Plan.css';
import ReactDOM from 'react-dom';
import 'react-responsive-modal/styles.css';
import ReactLoading from 'react-loading';
import { Modal } from 'react-responsive-modal';
import Sidebar from './Sidebar';
import { Table } from 'reactstrap';
import './modal.css'

const Plan: React.FunctionComponent = () => {

    const [value, onChange] = useState(new Date());
    const [openGoal, setOpenGoal] = useState(false);
    const [openExpense, setOpenExpense] = useState(false);
    const [result, setResult] = useState<any>([]);
    const [goals, setGoals] = useState<any>([]);
    const [goal, setGoal] = useState('');
    const [description, setDescription] = useState('');
    const [isDone, setIsDone] = useState(false);

    const [expenses, setExpenses] = useState<any>([]);
    const [expense, setExpense] = useState('');
    const [amount, setAmount] = useState('');
    const [isPaid, setIsPaid] = useState(false);

    const [goalToUpdate, setGoalToUpdate] = useState({});
    const [goalUpdate, setGoalUpdate] = useState('');
    const [descriptionUpdate, setDescriptionUpdate] = useState('');
    const [writeDateUpdate, setWriteDateUPdate] = useState('');
    const [isDoneUpdate, setIsDoneUpdate] =useState(false);
    const [isPaidUpdate, setIsPaidUpdate] =useState(false);
    const [expenseToUpdate, setExpenseToUpdate] = useState({});
    const [expenseUpdate, setExpenseUpdate] = useState('');
    const [amountUpdate, setAmountUpdate] = useState('');
  
    const [updateOnGoal, setUpdateOnGoal] = useState(false);
    const [updateOnExpense, setUpdateOnExpense] = useState(false);

    const onOpenModalGoal = () => setOpenGoal(true);
    const onOpenModalExpense = () => setOpenExpense(true);
    const onCloseModalGoal = () => setOpenGoal(false);
    const onCloseModalExpense = () => setOpenExpense(false);
    const onOpenModalUpdateGoal = () => setUpdateOnGoal(true);
    const onCloseModalUpdateGoal = () => setUpdateOnGoal(false);
    const onOpenModalUpdateExpense = () => setUpdateOnExpense(true);
    const onCloseModalUpdateExpense = () => setUpdateOnExpense(false);

    const editUpdateGoal = (goal:any) => {
        setGoalToUpdate(goal);
        setGoalUpdate(goal.goal);
        setDescriptionUpdate(goal.description);
        setWriteDateUPdate(`${value.getMonth()+1}-${value.getDate()}-${value.getFullYear()}`);
        setIsDoneUpdate(goal.isDone)
    };

    const editUpdateExpense = (expense:any) => {
        setExpenseToUpdate(expense);
        setExpenseUpdate(expense.expense);
        setAmountUpdate(expense.amount);
        setWriteDateUPdate(`${value.getMonth()+1}-${value.getDate()}-${value.getFullYear()}`);
        setIsPaidUpdate(expense.isPaid)
    };

    const fetchQuote = async () => {
        await fetch(`https://quotes.rest/qod?language=en`)
        .then(res => res.json())
        .then(result => {
          setResult(result)
          console.log(result.contents.quotes[0].quote);
        });
    }

    const fetchGoals = async () => {
        const today = `${value.getMonth()+1}-${value.getDate()}-${value.getFullYear()}`

        await fetch(`http://localhost:5000/goals/gDaySelect/${today}`, {
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

    const addGoal = (e:any) => {
        e.preventDefault();
        fetch(`http://localhost:5000/goals/addGoal`, {
            method: 'POST',
            body: JSON.stringify({goal: {goal:goal, description:description, writeDate:`${value.getMonth()+1}-${value.getDate()}-${value.getFullYear()}`}}),
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((logGoal) => {
            console.log(logGoal);
            setGoal('');
            setDescription('');
            onCloseModalGoal();
            fetchGoals();
            alert('Goal Added!')
        })
    }

    const deleteGoal = (goal:any) => {
        fetch(`http://localhost:5000/goals/deleteGoal/${goal.idNumber}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        })
        .then(fetchGoals);
        alert('Goal Deleted');
        onCloseModalUpdateGoal();
    }

    const  updateGoal = (goal:any) => {
        fetch(`http://localhost:5000/goals/updateGoal/${goal.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({goal: {goal:goalUpdate, writeDate:writeDateUpdate, description:descriptionUpdate}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            fetchGoals();
            alert('Goal updated!');
            onCloseModalUpdateGoal();
        })
    }

    const isDoneFunc = (goal:any) => {
        fetch(`http://localhost:5000/goals/updateGoalisDone/${goal.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({goal: {isDone:true}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            fetchGoals();
        })
    }

    const notDoneFunc = (goal:any) => {
        fetch(`http://localhost:5000/goals/updateGoalisDone/${goal.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({goal: {isDone:false}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            fetchGoals();
        })
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////

    const fetchExpenses = async () => {
        const today = `${value.getMonth()+1}-${value.getDate()}-${value.getFullYear()}`

        await fetch(`http://localhost:5000/expenses/eDaySelect/${today}`, {
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

    const addExpense = (e:any) => {
        e.preventDefault();
        fetch(`http://localhost:5000/expenses/addExpense`, {
            method: 'POST',
            body: JSON.stringify({expense: {expense:expense, amount:amount, writeDate:`${value.getMonth()+1}-${value.getDate()}-${value.getFullYear()}`}}),
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((logExpense) => {
            console.log(logExpense);
            setExpense('');
            setAmount('');
            onCloseModalExpense();
            fetchExpenses();
            alert('Expense Added!')
        })
    }

    const deleteExpense = (expense:any) => {
        fetch(`http://localhost:5000/goals/deleteExpense/${expense.idNumber}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        })
        .then(fetchExpenses);
        alert('Expense Deleted');
        onCloseModalUpdateExpense();
    }

    const  updateExpense = (expense:any) => {
        fetch(`http://localhost:5000/expenses/updateExpense/${expense.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({expense: {expense:expenseUpdate, writeDate:writeDateUpdate, amount:amountUpdate}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            fetchExpenses();
            alert('Expense updated!');
            onCloseModalUpdateExpense();
        })
    }

    
    const isPaidFunc = (expense:any) => {
        fetch(`http://localhost:5000/expenses/updateExpenseIsPaid/${expense.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({expense: {isPaid:true}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            fetchExpenses();
        })
    }

    const notPaidFunc = (expense:any) => {
        fetch(`http://localhost:5000/expenses/updateExpenseIsPaid/${expense.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({expense: {isPaid:false}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            fetchExpenses();
        })
    }


    useEffect(() =>{
        fetchQuote(); 
        fetchGoals();
        fetchExpenses();
    },[])

    return (
        <>
        <Sidebar/>
        <div className='PlanPage'>
            <div className="btn-toggle">
                <FaBars />
            </div>
            <h1>Let's put some plans together!</h1>
            {(result.contents != undefined) ? (
                <div className='quoteBox'>
                    <p className='quote'>{result.contents.quotes[0].quote}</p>
                    <p className='author'>- {result.contents.quotes[0].author}</p>
                </div>
            ) : (
                    <div className="quoteBox"> 
                        <ReactLoading className='loader' type={'spokes'} color={'white'} height={100} width={100} />
                        <h3>Grabbing today's quote...</h3>
                    </div>
                    
            )}

            <div>
                <br/>
                <Calendar onChange={onChange} value={value} onClickDay={() => {fetchGoals(); fetchExpenses()}}/>
            </div>
            <h1>Goals<button className='addButton' onClick={onOpenModalGoal} ><FaPen size={30}/></button></h1>
            {(goals.length == 0)
                    ?(<h2 id='placeholder'><i>No goals listed for this date.</i></h2>)
                    :(<Table className='theTable'>
                        <tbody>
                            {goals.map((goal:any, index:any) => {
                                return(
                                    <tr key={index}>
                                        <td><b><button className='updateBtn' onClick={() => {onOpenModalUpdateGoal(); editUpdateGoal(goal) }}>{goal.goal}</button></b></td>
                                        <td>{goal.description}</td>
                                        <td className='buttonColumn'>
                                            {(goal.isDone == true)
                                                ? (<button className='doneButton' onClick={()=> {editUpdateGoal(goal); notDoneFunc(goal)}}><FaCheck/></button>)
                                                : (<button className='notDoneButton' onClick={()=> {editUpdateGoal(goal); isDoneFunc(goal)}}>Done?</button>)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>)}

                <Modal open={openGoal} onClose={onCloseModalGoal} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>What's your goal?</h2>
                        <input value={goal} onChange={(e) => setGoal(e.target.value)} type='text' id='goal' name='goal' placeholder='Goal'></input>
                        <input type='text' id='writeDate' readOnly name='writeDate'placeholder={`${value.getMonth()+1}-${value.getDate()}-${value.getFullYear()}`}></input>
                        <textarea value={description} onChange={(e) => setDescription(e.target.value)} id='description' name='description cols="50" rows="10"' placeholder='Description'></textarea>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton'onClick={onCloseModalGoal}>CANCEL</button>
                        <button id='updateButton' onClick={addGoal}>ADD GOAL</button>
                    </div>
                </Modal>
                <br />
            <h1>Expenses<button className='addButton' onClick={onOpenModalExpense}><FaPen size={30}/></button></h1>
            {(expenses.length == 0)
                    ?(<h2 id='placeholder'><i>No expenses listed for this date.</i></h2>)
                    :(<Table className='theTable'>
                        <tbody>
                            {expenses.map((expense:any, index:any) => {
                                return(
                                    <tr key={index}>
                                        <td><b><button className='updateBtn' onClick={() => {onOpenModalUpdateExpense(); editUpdateExpense(expense) }}>{expense.expense}</button></b></td>
                                        <td>$ {expense.amount}</td>
                                        <td className='buttonColumn'>
                                            {(expense.isPaid == true)
                                                ? (<button className='doneButton' onClick={()=> {editUpdateExpense(expense); notPaidFunc(expense)}}><FaCheck/></button>)
                                                : (<button className='notDoneButton' onClick={()=> {editUpdateExpense(expense); isPaidFunc(expense)}}>Paid?</button>)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>)}
                <br/>
                <br/>

            <Modal open={openExpense} onClose={onCloseModalExpense} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>What's your expense?</h2>
                        <input value={expense} onChange={(e) => setExpense(e.target.value)}type='text' id='expense' name='expense' placeholder='Expense'></input>
                        <input type='text' id='writeDate' name='writeDate' placeholder={`${value.getMonth()+1}-${value.getDate()}-${value.getFullYear()}`} readOnly></input>
                        <input value={amount} onChange={(e) => setAmount(e.target.value)} type='number' id='expenseAmt' name='expenseAmt' min='1' step='any'  placeholder='$ 0.00'></input>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton' onClick={onCloseModalExpense}>CANCEL</button>
                        <button id='updateButton'onClick={addExpense}>ADD EXPENSE</button>
                    </div>
            </Modal>
            <Modal open={updateOnGoal} onClose={onCloseModalUpdateGoal} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>Let's do an edit</h2>
                        <input value={goalUpdate} onChange={(e) => setGoalUpdate(e.target.value)} type='text' id='goal' name='goal' placeholder='New Goal' ></input>
                        <textarea value={descriptionUpdate} onChange={(e) => setDescriptionUpdate(e.target.value)} id='description' name='description cols="50" rows="10"' placeholder='New Description' ></textarea>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton' onClick={() => deleteGoal(goalToUpdate)}>DELETE</button>
                        <button id='updateButton' onClick={() => updateGoal(goalToUpdate)}>UPDATE</button>
                    </div>
                </Modal>
                <Modal open={updateOnExpense} onClose={onCloseModalUpdateExpense} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>Let's do an edit</h2>
                        <input value={expenseUpdate} onChange={(e) => setExpenseUpdate(e.target.value)} type='text' id='goal' name='goal' placeholder='New Expense' ></input>
                        <textarea value={amountUpdate} onChange={(e) => setAmountUpdate(e.target.value)} id='description' name='description cols="50" rows="10"' placeholder='New Amount' ></textarea>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton' onClick={() => deleteExpense(expenseToUpdate)}>DELETE</button>
                        <button id='updateButton' onClick={() => updateExpense(expenseToUpdate)}>UPDATE</button>
                    </div>
                </Modal>
        </div>
        </>
    )
}

export default Plan;