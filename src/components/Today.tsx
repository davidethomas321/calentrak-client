import { stringify } from 'querystring';
import React, { useState } from 'react';
import Radium from 'radium';
import { ReactDOM } from 'react';
import Calendar from 'react-calendar';
import { Component } from 'react';
import { FaBars, FaPen, FaCheck } from 'react-icons/fa';
import { Modal } from 'react-responsive-modal';
import ReactLoading from 'react-loading';
import { Table } from 'reactstrap';
import './Today.css';
import Sidebar from './Sidebar';
import {Link} from 'react-router-dom';
import './modal.css';


class Today extends Component<{token:any},{
    location:any,
    weatherResult:any,
    weatherDescription:string,
    openGoal:any,
    openExpense:any,
    goals:any,
    today:Date,
    goal:string,
    description:string,
    writeDate:any
    isDone:boolean

    goalUpdate:string
    descriptionUpdate:string
    writeDateUpdate: any
    updateActiveGoal:boolean
    updateActiveExpense:boolean
    goalToUpdate:any
    isDoneUpdate:any

    expenses:any
    expense:string
    amount:any
    expenseUpdate:string
    amountUpdate:string
    expenseToUpdate:any
    isPaid:any
    isPaidUpdate:any
}> {

    constructor(props:any) {
        super(props)
        this.state = {
            location: [0,0],
            weatherResult: {name:'name',weather:[{icon:'icon'}],main:{temp:0},},
            weatherDescription: '',
            openGoal: false,
            openExpense: false,
            goals:[],
            today:new Date(),
            goal:'',
            description: '',
            writeDate:'',
            isDone:false,

            goalUpdate:'',
            descriptionUpdate:'',
            writeDateUpdate:'',
            updateActiveGoal:false,
            updateActiveExpense:false,
            goalToUpdate: {},
            isDoneUpdate: false,

            expenses:[],
            expense:'',
            amount:'',
            expenseUpdate:'',
            expenseToUpdate:{},
            amountUpdate:'',
            isPaid:false,
            isPaidUpdate: false
        }
    };
        

    getLocation(){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getPosition);
        }
    };
    getPosition = (position:any) => {
        this.setState({location:[position.coords.latitude, position.coords.longitude]});
        this.fetchWeatherFahrenheit()
    }
    
    onOpenModalGoal = () => this.setState({openGoal:true});
    onOpenModalExpense = () => this.setState({openExpense:true});
    onCloseModalGoal = () => this.setState({openGoal:false});
    onCloseModalExpense = () => this.setState({openExpense:false});

    updateOnGoal = () => this.setState({updateActiveGoal:true})
    updateOffGoal = () => this.setState({updateActiveGoal:false});
    updateOnExpense = () => this.setState({updateActiveExpense:true})
    updateOffExpense = () => this.setState({updateActiveExpense:false});

    editUpdateGoal = (goal:any) => {
        this.setState({
            goalToUpdate:goal, 
            goalUpdate:goal.goal, 
            descriptionUpdate:goal.description,
            writeDateUpdate:goal.writeDate,
            isDoneUpdate:goal.isDone
        });
    };

    editUpdateExpense = (expense:any) => {
        this.setState({
            expenseToUpdate:expense, 
            expenseUpdate:expense.expense, 
            amountUpdate:expense.amount,
            writeDateUpdate:expense.writeDate,
            isPaidUpdate:expense.isPaid
        });
    };

    async fetchWeatherFahrenheit()  {
        let lat:number = this.state.location[0];
        let lon:number = this.state.location[1];
        let url:string = 'https://api.openweathermap.org/data/2.5';
        let key:string = 'f19f2d47c690f58f576572b71182a24e';
        await fetch(`${url}/weather/?lat=${lat}&lon=${lon}&units=imperial&APPID=${key}`)
        .then(res => res.json())
        .then(weatherResults => {
            this.setState({weatherResult:weatherResults})
            this.setState({weatherDescription:weatherResults.weather[0].description.toUpperCase()})
        });
    }

    componentDidMount(){
        this.getLocation();
        this.fetchGoals();
        this.fetchExpenses();
        console.log(this.props.token)
    }
    
    fetchGoals = () => {
        const today = `${this.state.today.getMonth()+1}-${this.state.today.getDate()}-${this.state.today.getFullYear()}`

        fetch(`http://localhost:5000/goals/gDaySelect/${today}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((data) => {
            this.setState({goals:data})
            console.log()
        })
    }

    addGoal = (e:any) => {
        e.preventDefault();
        fetch(`http://localhost:5000/goals/addGoal`, {
            method: 'POST',
            body: JSON.stringify({goal: {goal:this.state.goal, description:this.state.description, writeDate:this.state.writeDate}}),
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((logGoal) => {
            console.log(logGoal);
            this.setState({goal:''});
            this.setState({description:''});
            this.setState({writeDate:''});
            this.setState({openGoal:false})
            this.fetchGoals();
            alert('Goal Added!')
        })
    }

    deleteGoal = (goal:any) => {
        fetch(`http://localhost:5000/goals/deleteGoal/${goal.idNumber}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        })
        .then( this.fetchGoals);
        alert('Goal Deleted');
        this.setState({updateActiveGoal:false})
        this.updateOffGoal()
    }

    updateGoal = (goal:any) => {
        fetch(`http://localhost:5000/goals/updateGoal/${goal.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({goal: {goal:this.state.goalUpdate, writeDate:this.state.writeDateUpdate, description:this.state.descriptionUpdate}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            this.fetchGoals();
            alert('Goal updated!');
            this.updateOffGoal()
        })
    }

    isDone = (goal:any) => {
        fetch(`http://localhost:5000/goals/updateGoalisDone/${goal.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({goal: {isDone:true}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            this.fetchGoals();
        })
    }

    notDone = (goal:any) => {
        fetch(`http://localhost:5000/goals/updateGoalisDone/${goal.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({goal: {isDone:false}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            this.fetchGoals();
        })
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    fetchExpenses = () => {
        const today = `${this.state.today.getMonth()+1}-${this.state.today.getDate()}-${this.state.today.getFullYear()}`

        fetch(`http://localhost:5000/expenses/eDaySelect/${today}`, {
            method: 'GET',
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((dataExpenses) => {
            this.setState({expenses:dataExpenses})
            console.log(this.state.expenses+'expenses')
        })
    }

    addExpense = (e:any) => {
        e.preventDefault();
        fetch(`http://localhost:5000/expenses/addExpense`, {
            method: 'POST',
            body: JSON.stringify({expense: {expense:this.state.expense, amount:this.state.amount, writeDate:this.state.writeDate}}),
            headers: new Headers ({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token') 
            })
        }) .then ((res) => res.json())
        .then((logExpense) => {
            console.log(logExpense);
            this.setState({expense:''});
            this.setState({amount:''});
            this.setState({writeDate:''});
            this.setState({openExpense:false})
            this.fetchExpenses();
            alert('Expense Added!')
        })
    }

    deleteExpense = (expense:any) => {
        fetch(`http://localhost:5000/expenses/deleteExpense/${expense.idNumber}`, {
            method: 'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        })
        .then( this.fetchExpenses);
        alert('Expense Deleted');
        this.setState({updateActiveGoal:false});
        this.updateOffExpense()
    }

    updateExpense = (expense:any) => {
        fetch(`http://localhost:5000/expenses/updateExpense/${expense.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({expense: {expense:this.state.expenseUpdate, writeDate:this.state.writeDateUpdate, amount:this.state.amountUpdate}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            this.fetchExpenses();
            alert('Expense updated!');
            this.updateOffExpense()
        })
    }

    isPaid = (expense:any) => {
        fetch(`http://localhost:5000/expenses/updateExpenseIsPaid/${expense.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({expense: {isPaid:true}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            this.fetchExpenses();
        })
    }

    notPaid = (expense:any) => {
        fetch(`http://localhost:5000/expenses/updateExpenseIsPaid/${expense.idNumber}`, {
            method: 'PUT',
            body: JSON.stringify({expense: {isPaid:false}}),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '+ localStorage.getItem('token')
            })
        }) .then((res) => {
            this.fetchExpenses();
        })
    }



    render() {
        return (
            <>
            <div className='sidebarDiv'> 
                <Sidebar/>
            </div>
            <div className='todayPage'>
                <div className="btn-toggle">
                    <FaBars />
                </div>
                <h1>Make today great! Today is {this.state.today.getMonth()+1}/{this.state.today.getDate()}/{this.state.today.getFullYear()}.</h1>
                {(this.state.weatherDescription.length > 0) ? (
                <div className="Weather">
                    <div>
                        <div className="citySentence">Today's Weather <br/><div className='city'>{this.state.weatherResult.name}</div></div>
                        <img className="weatherImg" src={`https://openweathermap.org/img/wn/${this.state.weatherResult.weather[0].icon}@2x.png`} />
                        <div className='temp'>{Math.round(this.state.weatherResult.main.temp)+"°F"}</div>
                        <div>{this.state.weatherDescription}</div>
                    </div>
                </div>
                ): (
                <div className='Weather'> 
                    <div className="weatherDiv"> 
                        <ReactLoading className='loader' type={'spokes'} color={'white'} height={100} width={100} />
                        <h3>Grabbing the weather...</h3>
                    </div>
                </div>
                )}
                <h1>Goals<button onClick={this.onOpenModalGoal} className='addButton'><FaPen size={30}/></button></h1>
                {(this.state.goals.length == 0)
                    ?(<h2 id='placeholder'><i>No goals listed for today. Let's get started!</i></h2>)
                    :(<Table className='theTable'>
                        <tbody>
                            {this.state.goals.map((goal:any, index:any) => {
                                return(
                                    <tr key={index}>
                                        <td><b><button className='updateBtn'onClick={() => {this.updateOnGoal(); this.editUpdateGoal(goal) }}>{goal.goal}</button></b></td>
                                        <td>{goal.description}</td>
                                        <td className='buttonColumn'>
                                            {(goal.isDone == true)
                                                ? (<button className='doneButton'onClick={() => {this.editUpdateGoal(goal); this.notDone(goal) }}><FaCheck/></button>)
                                                : (<button className='notDoneButton'onClick={() => {this.editUpdateGoal(goal); this.isDone(goal) }}>Done?</button>)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>)}
                <Modal open={this.state.openGoal} onClose={this.onCloseModalGoal} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>What's your goal?</h2>
                        <input value={this.state.goal} onChange={(e) => this.setState({goal:e.target.value})} type='text' id='goal' name='goal' placeholder='Goal'></input>
                        <input value={this.state.writeDate} onChange={(e) => this.setState({writeDate:e.target.value})}type='text' id='writeDate' name='writeDate' placeholder='MM/DD/YYYY'></input>
                        <textarea value={this.state.description} onChange={(e) => this.setState({description:e.target.value})} id='description' name='description cols="50" rows="10"' placeholder='Description'></textarea>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton' onClick={this.onCloseModalGoal}>CANCEL</button>
                        <button id='updateButton' onClick={this.addGoal}>ADD GOAL</button>
                    </div>
                </Modal>
                <br />
                <h1>Expenses<button onClick={this.onOpenModalExpense} className='addButton'><FaPen size={30}/></button></h1>

                {(this.state.expenses.length == 0)
                    ?(<h2 id='placeholder'><i>No expenses listed for today.</i></h2>)
                    :(<Table className='theTable'>
                        <tbody>
                            {this.state.expenses.map((expense:any, index:any) => {
                                return(
                                    <tr key={index}>
                                        <td><b><button className='updateBtn'onClick={() => {this.updateOnExpense(); this.editUpdateExpense(expense) }}>{expense.expense}</button></b></td>
                                        <td>$ {expense.amount}</td>
                                        <td className='buttonColumn'>
                                            {(expense.isPaid == true)
                                                ? (<button className='doneButton'onClick={() => {this.editUpdateExpense(expense); this.notPaid(expense) }}><FaCheck/></button>)
                                                : (<button className='notDoneButton'onClick={() => {this.editUpdateExpense(expense); this.isPaid(expense) }}>Paid?</button>)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>)}
                    <br/>
                    <br/>
                <Modal open={this.state.openExpense} onClose={this.onCloseModalExpense} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>What's your expense?</h2>
                        <input value={this.state.expense} onChange={(e) => this.setState({expense:e.target.value})} type='text' id='expense' name='expense' placeholder='Expense'></input>
                        <input value={this.state.writeDate} onChange={(e) => this.setState({writeDate:e.target.value})} type='text' id='writeDate' name='writeDate' placeholder='MM/DD/YYYY'></input>
                        <input value={this.state.amount} onChange={(e) => this.setState({amount:e.target.value})} type='number' id='expenseAmt' name='expenseAmt' min='1' step='any'  placeholder='$ 0.00'></input>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton' onClick={this.onCloseModalExpense}>CANCEL</button>
                        <button id='updateButton' onClick={this.addExpense}>UPDATE</button>
                    </div>
                </Modal>
                <Modal open={this.state.updateActiveGoal} onClose={this.updateOffGoal} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>Let's do an edit</h2>
                        <input value={this.state.goalUpdate} onChange={(e) => this.setState({goalUpdate:e.target.value})} type='text' id='goal' name='goal' placeholder='New Goal' ></input>
                        <textarea value={this.state.descriptionUpdate} onChange={(e) => this.setState({descriptionUpdate:e.target.value})} id='description' name='description cols="50" rows="10"' placeholder='New Description' ></textarea>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton' onClick={() => this.deleteGoal(this.state.goalToUpdate)}>DELETE</button>
                        <button id='updateButton' onClick={() => this.updateGoal(this.state.goalToUpdate)}>UPDATE</button>
                    </div>
                </Modal>
                <Modal open={this.state.updateActiveExpense} onClose={this.updateOffExpense} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>Let's do an edit</h2>
                        <input value={this.state.expenseUpdate} onChange={(e) => this.setState({expenseUpdate:e.target.value})} type='text' id='expense' name='expense' placeholder='New Expense' ></input>
                        <input value={this.state.amountUpdate} onChange={(e) => this.setState({amountUpdate:e.target.value})} id='expense' name='description cols="50" rows="10"' placeholder='New Amount' ></input>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton' onClick={() => this.deleteExpense(this.state.expenseToUpdate)}>DELETE</button>
                        <button id='updateButton' onClick={() => this.updateExpense(this.state.expenseToUpdate)}>UPDATE</button>
                    </div>
                </Modal>
            </div>
            </>
        );
    }
}

export default Today;