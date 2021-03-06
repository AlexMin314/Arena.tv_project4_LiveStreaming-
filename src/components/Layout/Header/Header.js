import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Import Redux
import { connect } from 'react-redux';

// Import Actions
import { addUser } from '../../../actions/userActions';
import { isStillLoading } from '../../../actions/loadingActions';
import { updateTimerStatus } from '../../../actions/timerActions';
import { updateSoundStatus } from '../../../actions/soundActions';

// Import Firebase
import firebase from '../../../firebase';
import { firebaseDB } from '../../../firebase';

// Import CSS
import './Header.css';

// Import API
import { clickSoundPlay, mouseclickSoundPlay } from '../../../API/utilityAPI';

// Import UI
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

const iconStyles = {
  marginRight: 24,
};
const displayNone = {
  display: "none",
}
const avatar = {
  display:'flex'
}
const appBarStyle = {

}
const icon = {
  color: 'white'
}

/**
 * Header
 */
export class Header extends Component { // eslint-disable-line react/prefer-stateless-function

  constructor(props) {
    super(props)

    this.state = {
      sound: true
    }
  }

  // logout onClick event listener
  logout = () => {
    if (this.props.sound) clickSoundPlay();
    const userObj = this.props.user[0];
    const onlineUsersRef = firebase.database().ref('/onlineUsers');
    onlineUsersRef.once('value', (snapshot) => {
      const usersObj = snapshot.val();
      for (const key in usersObj) {
        if(usersObj[key].displayName === userObj.displayName &&
           usersObj[key].email === userObj.email) {
             firebase.database().ref('/onlineUsers/' + key).remove()
             onlineUsersRef.once('value', (snapshot) => {
               const updatedUserCount = Object.keys(snapshot.val()).length;
               firebase.database().ref().update({ onlineUsersCount: updatedUserCount })
               this.setState({ onlineUsersCount: updatedUserCount });
             })
           } // end of if(usersObj[key].displayName === userObj.displayName
      } // end of iteration for (const key in usersObj)
    }) // end of onlineUsersRef.once('value', (snapshot)

    this.props.triggerLoading(false);
    this.props.updateTimer(null);
    // Remove user from firebase session
    firebase.auth().signOut().then(() => {
      // Remove user from local store
      this.props.setUserUpdate({});
    })
    setTimeout(() => {
      window.location.href = '/';
    }, 300)
  }

  goHome = () => {
    if (this.props.sound) clickSoundPlay();
    setTimeout(() => {
      window.location.href = '/';
    }, 300)
  }

  toggleSound = (e, logged) => {
    this.props.updateSound(logged);
    let defaultClick = document.getElementById('clicked');
    let socialClick = document.getElementById('mouseClicked');
    let mainMusic = document.getElementById('mainMusic');
    let correctSound = document.getElementById('correct');
    let ready = document.getElementById('ready');
    // Toggle sound off if value is false
    if(!logged) {
      defaultClick.muted = true;
      socialClick.muted = true;
      mainMusic.muted = true;
      correctSound.muted = true;
      ready.muted = true;
    } else {
      mouseclickSoundPlay();
      defaultClick.muted = false;
      socialClick.muted = false;
      mainMusic.muted = false;
      correctSound.muted = false;
      ready.muted = false;
    }
  }



  render() {
    {/* Conditional render for 'is user logged in' */}
    const isLoggedIn = this.props.user[0];
      return (
        <div>
          <AppBar
            title={
              <div>
                <span id='headerBrandName' onClick={this.goHome}>MindTap <i className="fa fa-pencil" aria-hidden="true"></i></span>
              </div>}
            iconElementLeft={null}
            iconStyleLeft={displayNone}
            className="appBar"
            style={appBarStyle}
            iconElementRight={isLoggedIn ? (
              <div className="headerWrapper">
                <Toggle
                  label={this.props.sound ? (
                    <FontIcon className="material-icons" color="white">volume_up</FontIcon>
                  ) : (
                    <FontIcon className="material-icons" color="white">volume_off</FontIcon>
                  )}
                  defaultToggled={this.props.sound}
                  className="toggle"
                  onToggle={this.toggleSound}
                  labelPosition="left"
                  style={{display:'flex', marginRight: '20px'}}
                  thumbSwitchedStyle={{backgroundColor: 'rgb(255, 64, 129)'}}
                  trackSwitchedStyle={{backgroundColor: 'rgb(252, 182, 224)'}}
                  labelStyle={{display:'flex', color:'white', justifyContent: 'flex-end'}} />
                <div className="greetingWrapper">
                  <Avatar size={27}
                          className="avatarClass"
                          src={this.props.user[0].photo}
                          style={avatar} />
                  <div className="greeting">
                    Hello, {this.props.user[0].displayName}
                  </div>
                </div>
                <Logged logout={this.logout} />
              </div>
            ) : (
              <div className="headerWrapper">
                <Toggle
                  label={this.props.sound ? (
                    <FontIcon className="material-icons" color="white">volume_up</FontIcon>
                  ) : (
                    <FontIcon className="material-icons" color="white">volume_off</FontIcon>
                  )}
                  defaultToggled={this.props.sound}
                  className="toggle"
                  onToggle={this.toggleSound}
                  labelPosition="left"
                  style={{display:'flex', marginRight: '20px'}}
                  thumbSwitchedStyle={{backgroundColor: 'rgb(255, 64, 129)'}}
                  trackSwitchedStyle={{backgroundColor: 'rgb(252, 182, 224)'}}
                  labelStyle={{display:'flex', color:'white', justifyContent: 'flex-end'}} />
                <Login />
              </div>
              )}
          />
        </div>
      );
  }
}

class Login extends Component {
  static muiName = 'FlatButton';

  loginBtn = () => {
    if (this.props.sound) clickSoundPlay();
    setTimeout(() => {
      window.location.href = '/login';
    }, 300)
  }

  render() {
    return (
      <FlatButton {...this.props} label="Sign In" style={{color:'white'}} onTouchTap={this.loginBtn} />
    );
  }
}

class Logged extends Component {

  constructor(props) {
    super(props)

  }

  render() {
    return (
      <IconMenu
        {...this.props}
        iconButtonElement={<IconButton iconStyle={icon}><MoreVertIcon /></IconButton>}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Help" />
        <MenuItem primaryText="Sign out" onTouchTap={this.props.logout}/>
      </IconMenu>
    );
  }
}



const mapStateToProps = (state) => {
  return {
    user: state.user,
    sound: state.soundStatus
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserUpdate: () => {
      dispatch(addUser())
    },
    triggerLoading: (result) => {
      dispatch(isStillLoading(result))
    },
    updateTimer: (timerStatus) => {
      dispatch(updateTimerStatus(timerStatus))
    },
    updateSound: (soundStatus) => {
      dispatch(updateSoundStatus(soundStatus))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header);
