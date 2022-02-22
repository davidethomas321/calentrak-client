import React, { useState, useEffect, Component } from 'react';
import { stringify } from 'querystring';
import {Link} from 'react-router-dom';
import Calendar from 'react-calendar';
import { FaBars, FaPen } from 'react-icons/fa';
import 'react-calendar/dist/Calendar.css';
import './Plan.css';
import ReactDOM from 'react-dom';
import 'react-responsive-modal/styles.css';
import ReactLoading from 'react-loading';
import { Modal } from 'react-responsive-modal';
import Sidebar from './Sidebar';
import './modal.css'
import './Login.css'

export default class Signup extends Component<any,any> {
    constructor(props:any) {
        super(props)
        this.state = {
            result:'',
            fullname:'',
            email:'',
            password:'',
            favthing:''
        }
    }

    fetchBgImg = async () => {
        await fetch(`https://api.unsplash.com/photos/random/?client_id=eqGyHyMfXIBD2sEWPX2jSz80hHyvWFeOcd0Kg6uBNYw`)
        .then(res => res.json())
        .then(result => {
            this.setState({result:result.urls.full})
          console.log(result.urls.full);
        });
    }

    componentDidMount(){
        this.fetchBgImg();
    }
 
    handleSubmit = (event:any) => {
        event.preventDefault();
        if (this.state.password.length >= 5) {
            fetch(`http://localhost:5000/user/register`, {
                method: 'POST',
                body: JSON.stringify({user:{fullName:this.state.fullname, email:this.state.email, password:this.state.password, favThing:this.state.favthing}}),
                headers: new Headers ({
                    'Content-Type':'application/json'
                })
            }).then(
                (response) => response.json()
                ).then((data) => {
                    if (typeof(data.sessionToken) !== 'string') {
                        alert('Email already registered.')
                    } else {
                        this.props.updateToken(data.sessionToken);
                        alert('Account created, welcome to calentrak!')
                        window.location.href='/'
                    }
            })
        } else {
            alert(`Password must be at least 5 characters (${this.state.password.length}).`)
        }
    }

    render() {
        console.log(this.props.updateToken)
    return(
        <>
        <div className='box'>
            <div className='background' style={{  
                backgroundImage: `url(${this.state.result})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }}>
            </div>
            <div className='PassWindow'>
                <h2 id='welcome'>Welcome to</h2>
                <h1 id='logo'>calentrak</h1>
                <p id='ques'>What's your...</p>
                <div className='form'>
                    <input onChange={(e) => this.setState({fullname:e.target.value})} value={this.state.fullname} type='text' id='email' name='fullName' placeholder='  Full Name?' /><br/>
                    <input onChange={(e) => this.setState({email:e.target.value})} value={this.state.email} type='text' id='email' name='email' placeholder='  Email?' /><br/>
                    <input onChange={(e) => this.setState({password:e.target.value})} value={this.state.password} id='password' type="password" placeholder='  Password?'/><br/>
                    <input onChange={(e) => this.setState({favthing:e.target.value})} value={this.state.favthing} id='password' type="text" placeholder='  Favorite Thing?'></input>
                    <br/>
                    <br/>
                    <div className='loginButtons'>
                        <br />
                        <button onClick={this.handleSubmit} id='resetButton'>JOIN</button>
                        <br/>
                        <Link to="/Login"><button id='cancelButton'>NOT NEW</button></Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}}