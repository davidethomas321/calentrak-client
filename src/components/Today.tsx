import { stringify } from 'querystring';
import React, { useState } from 'react';
import Radium from 'radium';
import { ReactDOM } from 'react';
import Calendar from 'react-calendar';
import { Component } from 'react';
import { FaBars, FaPen } from 'react-icons/fa';
import { Modal } from 'react-responsive-modal';
import ReactLoading from 'react-loading';
import { Container, Row, Col, Table, Button } from 'reactstrap';
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

    goalUpdate:string
    descriptionUpdate:string
    writeDateUpdate: any
    updateActive:boolean
    goalToUpdate:any
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

            goalUpdate:'',
            descriptionUpdate:'',
            writeDateUpdate:'',
            updateActive:false,
            goalToUpdate: {}
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

    updateOn = () => this.setState({updateActive:true})
    updateOff = () => this.setState({updateActive:false});
    editUpdateGoal = (goal:any) => {
        this.setState({
            goalToUpdate:goal, 
            goalUpdate:goal.goal, 
            descriptionUpdate:goal.description,
            writeDateUpdate:goal.writeDate
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
        .then( this.fetchGoals)
        alert('Goal Deleted')
    }

    updateGoal = (event:any, goal:any) => {
        console.log('fire')
        event.preventDefault();
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
            this.updateOff()
        })
    }

    render() {
        console.log(this.state.goalToUpdate)
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
                <Table className='theTable'>
                    <thead>
                        <tr>
                            <th>GOAL</th>
                            <th>DESCRIPTION</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.goals.map((goal:any, index:any) => {
                            return(
                                <tr key={index}>
                                    <td><b><button className='updateBtn'onClick={() => {this.updateOn(); this.editUpdateGoal(goal) }}>{goal.goal}</button></b></td>
                                    <td>{goal.description}</td>
                                    <td><button className='doneButton'>Done?</button></td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                
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
                <Modal open={this.state.openExpense} onClose={this.onCloseModalExpense} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>What's your expense?</h2>
                        <input type='text' id='expense' name='expense' placeholder='Expense'></input>
                        <input type='text' id='writeDate' name='writeDate' placeholder='MM/DD/YYYY'></input>
                        <input type='number' id='expenseAmt' name='expenseAmt' min='1' step='any'  placeholder='$ 0.00'></input>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton'>DELETE</button>
                        <button id='updateButton'>UPDATE</button>
                    </div>
                </Modal>
                <Modal open={this.state.updateActive} onClose={this.updateOff} center classNames={{modal: 'customModal',}}>
                    <div className='modalContents'>
                        <h2>Let's do an edit</h2>
                        <input value={this.state.goalUpdate} onChange={(e) => this.setState({goalUpdate:e.target.value})} type='text' id='goal' name='goal' placeholder='New Goal' ></input>
                        <textarea value={this.state.descriptionUpdate} onChange={(e) => this.setState({descriptionUpdate:e.target.value})} id='description' name='description cols="50" rows="10"' placeholder='New Description' ></textarea>
                    </div>
                    <div className='buttons'>
                        <button id='deleteButton' onClick={() => this.deleteGoal(this.state.goalToUpdate)}>DELETE</button>
                        <button id='updateButton' onClick={() => this.updateGoal}>UPDATE</button>
                    </div>
                </Modal>
            </div>
            </>
        );
    }
}

export default Today;