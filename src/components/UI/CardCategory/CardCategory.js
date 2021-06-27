import React,{ Component} from 'react';
import classes from '../../UI/CardCategory/CardCategory.module.css';
import axios from "axios";
import {Link} from "react-router-dom";
import masterClasses from '../../../containers/FooderMaster/FooderMaster.module.css';

class cardCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fooder_type:[],
            fooder_maindish:[]
        };
    }

    componentDidMount() {
        axios.get('/api/fooder_type')
            .then(response => {
                this.setState({fooder_type:response.data})
            }).catch(error => {
                this.setState({error:true})
            });
    }

    render() {
        const {fooder_type} = this.state;
        
        return (
            <div className={classes.categoryBackground}>
                <div className={masterClasses.headlineMaster}>
                    <h5 className={classes.categorytext}>CATEGORIES</h5>  
                </div>
                <div className={classes.cardCategoryGrid}>  
                    {
                        fooder_type.map(ftype=>
                            <div key={ftype._id} className={classes.cardCategoryList}>
                                <img src={process.env.PUBLIC_URL + `/img/${ftype.foodimgname}`} alt="MalaysiaFood" className={classes.categoriesImg}></img>
                                <div className={classes.FoodCategory}>
                                    <Link to={{ pathname: "/foodertype/type",
                                                search:"?type=" + ftype.foodalias }}>
                                        <p>{ftype.foodtype}</p>
                                    </Link>
                                </div>
                            </div>
                        )
                    }
                </div>
        </div>
    );
    }
}

export default cardCategory
