import React from 'react';
import nasilemakLogo from '../../assets/images/baker_preview.png';
import classes from '../Logo/Logo.module.css';

const Logo = (props) => (
   <div className={classes.Logo}>
       <img src={nasilemakLogo} alt="nasiLemakLogo" style={{height:props.height}}/>
   </div>
);

export default Logo;
