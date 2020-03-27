import React, { Component } from 'react';
import axios from 'axios';
import MyPageBanner from '../components/MyPage/MyPageBanner';
import ReserveComponent from '../components/MyPage/ReserveComponent';
import MypageFooter from '../components/MyPage/MypageFooter';

class MyPageReserve extends Component {

  state = {

  }

  render() {
    return (
      <section id="mypage">
        <MyPageBanner likeProduct={false} buyProduct={false} 
        sellProdcut={false} reserveProduct={true}></MyPageBanner>
        <ReserveComponent></ReserveComponent>
        <MypageFooter></MypageFooter>
      </section>
    );
  };
}

export default MyPageReserve;
