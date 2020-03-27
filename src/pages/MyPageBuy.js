import React, { Component } from 'react';
import axios from 'axios';
import MyPageBanner from '../components/MyPage/MyPageBanner';
import BuyComponent from '../components/MyPage/BuyComponent';
import MypageFooter from '../components/MyPage/MypageFooter';

class MyPageBuy extends Component {

  state = {

  }

  render() {
    return (
      <section id="mypage">
        <MyPageBanner likeProduct={false} buyProduct={true} 
        sellProdcut={false} reserveProduct={false}></MyPageBanner>
        <BuyComponent></BuyComponent>
        <MypageFooter></MypageFooter>
      </section>
    );
  };
}

export default MyPageBuy;
