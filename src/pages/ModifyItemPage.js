import React, { Component } from "react";
import axios from "axios";
import SellItem from "../components/ModifyItem/SellItem";

class ModifyItemPage extends Component {
  state = {};

  render() {
    return (
      <section id="modifyitem">
        <SellItem></SellItem>
      </section>
    );
  }
}

export default ModifyItemPage;
