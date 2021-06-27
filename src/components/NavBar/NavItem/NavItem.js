import React from 'react';
import classes from './NavItem.module.css';

const NavItem = (props) => (
    <span className={classes.NavItem}>
        {props.children}
    </span>
);
export default NavItem;