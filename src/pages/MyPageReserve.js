import React, { Component, setState } from 'react';
import axios from 'axios';
import MyPageBanner from '../components/MyPage/MyPageBanner';
import ReserveComponent from '../components/MyPage/ReserveComponent';
import MypageFooter from '../components/MyPage/MypageFooter';

class MyPageReserve extends Component {
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
        sellProduct={false} reserveProduct={true} name={this.state.userName}></MyPageBanner>
        <ReserveComponent getName={this.getName}></ReserveComponent>
        <MypageFooter></MypageFooter>
      </section>
    );
  };
}

export default MyPageReserve;
