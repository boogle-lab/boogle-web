import React, { Component } from 'react';
import axios from 'axios';
import MyPageBanner from '../components/MyPage/MyPageBanner';
import LikeComponent from '../components/MyPage/LikeComponent';
import MypageFooter from '../components/MyPage/MypageFooter';

class MyPageLike extends Component {

  state = {

  }

  render() {
    return (
      <section id="mypage">
        <MyPageBanner likeProduct={true} buyProduct={false} 
        sellProdcut={false} reserveProduct={false}></MyPageBanner>
        <LikeComponent></LikeComponent>
        <MypageFooter></MypageFooter>
      </section>
    );
  };
}

export default MyPageLike;
