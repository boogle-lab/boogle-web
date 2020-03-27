import React, { Component } from 'react';
import axios from 'axios';
import MyPageBanner from '../components/MyPage/MyPageBanner';
import SellComponent from '../components/MyPage/SellComponent';
import MypageFooter from '../components/MyPage/MypageFooter';

class MyPageSell extends Component {

  state = {

  }

  render() {
    return (
      <section id="mypage">
        <MyPageBanner likeProduct={false} buyProduct={false} 
        sellProduct={true} reserveProduct={false}></MyPageBanner>
        <SellComponent></SellComponent>
        <MypageFooter></MypageFooter>
      </section>
    );
  };
}

export default MyPageSell;
