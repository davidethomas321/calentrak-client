import React, { useState, useEffect } from 'react';
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

const ForgotPassword: React.FunctionComponent = () => {

    const [result, setResult] = useState<any>([])

    const fetchBgImg = async () => {
        await fetch(`https://api.unsplash.com/photos/random/?client_id=eqGyHyMfXIBD2sEWPX2jSz80hHyvWFeOcd0Kg6uBNYw`)
        .then(res => res.json())
        .then(result => {
          setResult(result.urls.full)
          console.log(result.urls.full);
        });
      }

      useEffect(() =>{fetchBgImg();},[])
      

    return (
        <>
        <div className='container'>
            <div className='background' style={{  
                backgroundImage: `url(${result})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat'
            }}>
            </div>
            <div className='PassWindow'>
                <h2 id='welcome'>Get back on</h2>
                <h1 id='logo'>calentrak</h1>
                <p id='ques'>What's your...</p>
                <div className='form'>
                    <input type='email' id='email' name='goal' placeholder='  Email?' /><br/>
                    <input id='password' type="password" placeholder='  Password?'/><br/>
                    <input id='password' type="text" placeholder='  Favorite Thing?'></input>
                    <br/>
                    <br/>
                    <div className='loginButtons'>
                        <br />
                        <button id='resetButton'>RESET</button>
                        <br/>
                        <Link to="/Login"><button id='cancelButton'>CANCEL</button></Link>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default ForgotPassword;