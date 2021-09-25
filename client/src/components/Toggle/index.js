
import React from 'react';
import './index.css';

export default class ToggleTheme extends React.Component{
    state = {
        toggleState:false
    }

    ToggleButton(){
        if(!this.state.toggleState){
            document.body.style.backgroundColor = '#202124';
            document.getElementById("sign-in").style.color = '#fff';
            document.getElementById("new-user").style.color = '#fff';
            document.getElementById("usrname").style.backgroundColor = "#C4C4C4";
            document.getElementById("pwd").style.backgroundColor = "#C4C4C4";

        }
        
        else{
            document.body.style.backgroundColor = '#fff';
            document.getElementById("sign-in").style.color = '#000';
            document.getElementById("new-user").style.color = '#000';
            document.getElementById("usrname").style.backgroundColor = "#E6E6E6";
            document.getElementById("pwd").style.backgroundColor = "#E6E6E6";
        }
        this.state.toggleState = !this.state.toggleState;
    }

    render(){
        return(
            <div id="toggle-pos">
                <label class="switch">
                <input id="check" type="checkbox"/>
                <span class="slider" onClick={ () => this.ToggleButton()}></span>
                </label>



            </div>
        )
    }
}