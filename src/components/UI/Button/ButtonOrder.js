import React, {useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import InfoIcon from '@material-ui/icons/Info';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    width:'640px',
    height:'65%',
    overflow: 'scroll',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const TransitionsModal = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [orderlist, setorderlist] = React.useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  useEffect(() => {
    axios.get(`/api/fooder_order/order_lists/${props.index}`)
        .then(response => {
          setorderlist(response.data.order_list);
        });
    }
  , [props.index]);
  
  return (
    <div style={{ display:"inline-block" }}>
      <Button onClick={handleOpen}>
         <InfoIcon color="primary"/>
      </Button>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            {
              orderlist.map(
                order_list=>
                <div key={order_list._id}>
                  <h2 id="transition-modal-title">{order_list.order_title}</h2>
                  <p id="transition-modal-description">Order Type : {order_list.order_type}</p>
                  <p id="transition-modal-description">Order Quantity : {order_list.order_qty}</p>
                  <p id="transition-modal-description">Order Addon : {order_list.order_addon}</p>
                  <p id="transition-modal-description">Order Price :{order_list.order_price}</p>
                  <p id="transition-modal-description">Order Remarks :{order_list.order_remarks}</p>
                  <p id="transition-modal-description">Order Method :{order_list.order_method}</p>
                </div>
            )}
          </div>
        </Fade>
      </Modal>
    </div>
  );
}

export default TransitionsModal;