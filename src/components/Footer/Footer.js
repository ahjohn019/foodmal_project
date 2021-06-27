import React from 'react';
import classes from './Footer.module.css';


const Footer = (props) => (
    <div className={classes.Footer}>
        {props.children}
        <div className={classes.FooderText}>
           <p>© Fooder Malaysia 2021</p>
        </div>
    </div>
);

export default Footer;