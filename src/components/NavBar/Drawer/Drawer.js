import React, {useState, useEffect} from 'react';
import { Drawer, List, ListItem,ListItemText,IconButton} from '@material-ui/core';
import classes from '../../NavBar/Drawer/Drawer.module.css';
import Logo from '../../Logo/Logo';
import { Menu } from "@material-ui/icons";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Collapse from '@material-ui/core/Collapse';
import {Link} from 'react-router-dom';
import axios from 'axios';

const DrawerIcon = (props) => {
    const [state, setState] = useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        setState({ ...state, [anchor]: open });
    }

    const [open, setOpen] = React.useState(true);

    const handleList = () => {
        setOpen(!open);
    };

    const [foodType , setFoodType] = useState([]);

    useEffect(() => {
        axios.get('/api/fooder_type')
            .then(response => {
               setFoodType(response.data)
            });
        }, []);


    const list = (anchor) => (
        <div className={classes.DrawerStylesFull}>
            <Logo />
            <List className={classes.DrawerStylesList} onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
                <ListItem button key='Home'>
                    <Link to="/">
                        <ListItemText primary='Home' />
                    </Link>
                </ListItem>
            </List>
            <ListItem button onClick={handleList}>
                    <ListItemText primary="Category" />
                    {open ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={!open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                    {
                        foodType.map(food =>
                        <ListItem button key={food.foodalias}>            
                            <a href={"/foodertype/type?type="+food.foodalias} className={classes.DrawerCategoryList}>{food.foodtype}</a>                              
                        </ListItem>)
                    }
                </List>
            </Collapse>

        </div>
    );

    return(
        <React.Fragment key="left">
            <div className={classes.DrawerIconStyle}>
            
                <IconButton
                    edge="start"
                    aria-label="menu"
                    onClick={toggleDrawer("left", true)}
                >
                    <Menu style={{fontSize:65}} />
                </IconButton>
            </div>
            
            <Drawer anchor="left" open={state.left} onClose={toggleDrawer("left", false)}>
                {list("left")}
            </Drawer>
        </React.Fragment>    
        
    );
};

export default DrawerIcon;