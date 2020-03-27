import React, { Component, setState } from 'react';
import axios from 'axios';
import MyPageBanner from '../components/MyPage/MyPageBanner';
import LikeComponent from '../components/MyPage/LikeComponent';
import MypageFooter from '../components/MyPage/MypageFooter';

class MyPageLike extends Component {
  state = {
    userName: ' '
  }

  getName = (id) => { 
    this.setState( {userName: id} );
  }

  render() {
    return (
      <section id="mypage">
        <MyPageBanner likeProduct={true} buyProduct={false} 
        sellProduct={false} reserveProduct={false} name={this.state.userName}></MyPageBanner>
        <LikeComponent getName={this.getName}></LikeComponent>
        <MypageFooter></MypageFooter>
      </section>
    );
  };
}

export default MyPageLike;
