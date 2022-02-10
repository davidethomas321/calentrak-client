import { stringify } from 'querystring';
import React, { useState } from 'react';
import Radium from 'radium';
import { ReactDOM } from 'react';
import Calendar from 'react-calendar';
import { Component } from 'react';
import { FaBars, FaPen } from 'react-icons/fa';
import { Modal } from 'react-responsive-modal';
import ReactLoading from 'react-loading';
import './Today.css';
import Sidebar from './Sidebar';
import './modal.css';

class Today extends Component<{},{location:any,weatherResult:any,weatherDescription:string,openGoal:any,openExpense:any}> {

    constructor(props:any) {
        super(props)
        this.state = {
            location: [0,0],
            weatherResult: {name:'name',weather:[{icon:'icon'}],main:{temp:0},},
            weatherDescription: '',
            openGoal: false,
            openExpense: false
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
                console.log(weatherResults)
            });
        }

        componentWillMount(){
            this.getLocation();
        }

    render() {
        return (
            <>
            <div className='todayPage'>
                <div className="btn-toggle">
                    <FaBars />
                </div>
                <h1>What's good David?  Today is 2/8/2022.</h1>
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
                <Modal open={this.state.openGoal} onClose={this.onCloseModalGoal} center classNames={{modal: 'customModal',}}>
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
                <h1>Expenses<button onClick={this.onOpenModalExpense} className='addButton'><FaPen size={30}/></button></h1>
                <Modal open={this.state.openExpense} onClose={this.onCloseModalExpense} center classNames={{modal: 'customModal',}}>
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
        );
    }
}

export default Today;