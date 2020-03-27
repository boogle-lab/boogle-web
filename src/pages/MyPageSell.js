import React, { Component, setState } from 'react';
import axios from 'axios';
import MyPageBanner from '../components/MyPage/MyPageBanner';
import SellComponent from '../components/MyPage/SellComponent';
import MypageFooter from '../components/MyPage/MypageFooter';

class MyPageSell extends Component {
  state = {
    userName: ' '
  }

  getName = (id) => { 
    this.setState( {userName: id} );
  }

  render() {
    return (
      <section id="mypage">
        <MyPageBanner likeProduct={false} buyProduct={false} 
        sellProduct={true} reserveProduct={false} name={this.state.userName}></MyPageBanner>
        <SellComponent getName={this.getName}></SellComponent>
        <MypageFooter></MypageFooter>
      </section>
    );
  };
}

export default MyPageSell;
