import React, { Component } from "react";
import styled from "styled-components";

import logo from "../logo.svg";

const Wrapper = styled.a.attrs({
  className: "navbar-brand",
})``;

class Logo extends Component {
  render() {
    return (
      <Wrapper href="/">
        <img src={logo} alt="Dunder Mifflin" />
      </Wrapper>
    );
  }
}

export default Logo;
