import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Sidebar from './Sidebar';
import './Reflect.css';

const Reflect: React.FunctionComponent = () => {
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
            <br />
            <h1>View Expenses</h1>
        </div>
        </>
    )
}

export default Reflect;