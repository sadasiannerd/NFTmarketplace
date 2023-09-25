import React from "react";

function Button(props){

    return (<div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
            <span
              onClick={() => props.handleClick(props.id)}
              className="form-Chip-label">
              {props.text}
            </span>
            </div>)

};

export default Button;
    