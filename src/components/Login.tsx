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

export default class Login extends Component<any,any> {
    constructor(props:any) {
        super(props)
        this.state = {
            result:'',
            email:'',
            password:''
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
            fetch(`http://localhost:5000/user/login`, {
                method: 'POST',
                body: JSON.stringify({user:{email:this.state.email, password:this.state.password}}),
                headers: new Headers ({
                    'Content-Type':'application/json'
                })
            }).then(
                (response) => response.json()
                ).then((data) => {
                    if (typeof(data.sessionToken) !== 'string') {
                        alert('Invalid username or password')
                    } else {
                        this.props.updateToken(data.sessionToken);
                        alert('Welcome back!')
                        window.location.href='/Today'
                    }
            })
    }

    render() {
        console.log(this.props)
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
            <div className='LoginWindow'>
                <h2 id='welcome'>Welcome back to</h2>
                <h1 id='logo'>calentrak</h1>
                <div className='form'>
                    <input onChange={(e) => this.setState({email:e.target.value})} value={this.state.email} type='email' id='email' name='goal' placeholder='  yourEmail@here.com' />
                    <input onChange={(e) => this.setState({password:e.target.value})} value={this.state.password} id='password' type="password" placeholder='  p@s$wordHere'/>
                    <br/>
                    <br/>
                    <div className='loginButtons'>
                        <br />
                        <button onClick={this.handleSubmit} id='enterButton'>ENTER</button>
                        <br/>
                        <Link to='/Signup'><button id='newButton'>I'M NEW</button></Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}}