import React from 'react';
import classes from './SearchBar.module.css';

const searchBar = (props) => (
    <div className={classes.SearchBar} >
        <input className={classes.SearchBarDetails} type="text" placeholder="Search..." />
    </div>

);

export default searchBar;

