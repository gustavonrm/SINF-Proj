import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";


class Value extends Component {

    render() {
        
        if (typeof this.props.growth !== 'undefined') {
            let icon;
            if (this.props.growth > 0) {
                icon = (<FontAwesomeIcon icon={faCaretUp} className="pt-1 ml-4" style={{ color: "green" }} />);
            } else icon = (<FontAwesomeIcon icon={faCaretDown} className="pt-1 ml-4" style={{color: "red"}} />);

            return (
                <div className="d-flex align-items-center font-weight-bold p-2 pl-4" style={{ fontSize: "4em" }}>
                    <div>
                        {'€ '}{this.props.value}
                    </div>
                    <div className="d-flex align-items-center font-weight-normal pb-4" style={{ fontSize: "0.8em" }}>
                        {icon}

                        <span className="pl-3 pt-1" style={{ fontSize: "0.4em" }}>
                            {this.props.growth} {' %'}
                        </span>
                    </div>
                </div>
            );  
        }   

        return (
            <div className="font-weight-bold p-2 pl-4" style={{fontSize: "4em"}}>
                €{' '}{this.props.value}
            </div>
        );
    }
}

export default Value;