import React, { Component, setState } from 'react';
import axios from 'axios';
import MyPageBanner from '../components/MyPage/MyPageBanner';
import BuyComponent from '../components/MyPage/BuyComponent';
import MypageFooter from '../components/MyPage/MypageFooter';

class MyPageBuy extends Component {
  state = {
    userName: ' '
  }

  getName = (id) => { 
    this.setState( {userName: id} );
  }
  
  render() {
    return (
      <section id="mypage">
        <MyPageBanner likeProduct={false} buyProduct={true} 
        sellProduct={false} reserveProduct={false} name={this.state.userName}></MyPageBanner>
        <BuyComponent getName={this.getName}></BuyComponent>
        <MypageFooter></MypageFooter>
      </section>
    );
  };
}

export default MyPageBuy;
