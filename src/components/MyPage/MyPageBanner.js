import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Icon, Card, Modal, Popconfirm, Collapse, message } from "antd";
import axios from 'axios';
import './MyPageBanner.css';
import { useForm } from 'react-hook-form';

import host from '../../server-settings/ServerApiHost';

export default function MyPageBanner(props) {

    // user info setting state
    const [name, setName] = useState("");
    const [likeList, setLikeList] = useState([]);
    const [buyList, setBuyList] = useState([]);
    const [sellList, setSellList] = useState([]);
    const [reserveList, setReserveList] = useState([]);

    // page navigation state
    const state = {
        likeProduct: props.likeProduct,
        buyProduct: props.buyProduct,
        sellProduct: props.sellProduct,
        reserveProduct: props.reserveProduct
    }

    const defaultProps = {
        likeProduct: true,
        buyProduct: false,
        sellProduct: false,
        reserveProduct: false
    }

    const [modal, setModal] = useState(false);
    const [level, setLevel] = useState(false);

    const [isSignIn, setIsSignIn] = useState(false);

    const onSubmit = data => {
    };


    useEffect(() => {
        if (
            localStorage.getItem('token') !== "" &&
            localStorage.getItem('token') != null
          ) {
            signedIn();
          } 
        else {
            needSignIn();
        }
    }, []);

    const signedIn = () => {
        setIsSignIn(true)
    }

    const needSignIn = () => {
        setIsSignIn(false)
        message.warning("로그인이 필요합니다.")
    }

    const showModal = e => {
        setModal(true);
    }

    const closeModal = e => {
        setModal(false);
    }

    const showLevel = e => {
        setLevel(true);
    }


    return (
        <div style={{
            background: "url(https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/banner_background.png)",
            backgroundSize: "cover"
            , paddingTop: "24px"
        }} className="mypage">
        
        {/*isSignIn === true ? <div></div> : <Redirect to="/signin" />*/}

            <Row style={{ top: 10, marginBottom: "24px" }}>
                <Col xs={{ span: 3 }}>
                    <Link to="/">
                        <img style={{
                            width: "32px",
                            height: "auto",
                            marginLeft: "20px",
                            filter: "brightness(0) invert(1)"
                        }}
                             src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/left_arrow.png" />
                    </Link>
                </Col>
                <Col xs={{ span: 8, offset: 5 }}>
                    <h5 style={{ color: "white", fontSize: "18px" }}>
                        마이페이지</h5>
                </Col>
                <Link to='/'>
                    <Col xs={{ span: 3, offset: 5 }}>
                    </Col>
                </Link>
            </Row>
            <Row style={{ marginTop: "20px", marginBottom: "20px" }}>
                <Col>
                    <Icon style={{
                        color: "#ffffff",
                        fontSize: "20vw"
                    }} type="user"
                          id="profile-circle"
                          onClick={() => { /*showModal(); showLevel();*/ }}
                    />
                </Col>
                {/* {modal === true ?
          <Modal
            visible={modal}
            onOk={() => { closeModal(); }}
            onCancel={() => { closeModal(); }}>
            {level === true ?
              <p>User Level Image</p>
              : null}
          </Modal>
            : null} */}
            </Row>
            <Row style={{ marginTop: "16px" }}>
                <label style={{ fontSize: "15px", color: "#ffffff" }}>{name}님, 안녕하세요!</label>
            </Row>

            <Row style={{ marginTop: "16px" }}>
                <Col xs={{ span: 4, offset: 6 }}
                     onClick={() => {window.location.href='http://www.notion.so/boogle/3bbbb6ce5b554209ac14c900dba8ea88';}}>
                    <Row>
                        <Col xs={{ span: 24 }}>
                            <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/bell.png"
                                 style={{width: "16px"}}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{ span: 24 }}>
                            <label style={{
                                color: "#ffffff",
                                fontSize: "12px"
                            }}>
                                공지사항
                            </label>
                        </Col>
                    </Row>
                </Col>
                <Link to='/customercenter'>
                    <Col xs={{ span: 4 }}>
                        <Row>
                            <Col xs={{ span: 24 }}>
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/call.png"
                                     style={{width: "16px"}}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={{ span: 24 }}>
                                <label style={{
                                    color: "#ffffff",
                                    fontSize: "12px"
                                }}>
                                    고객센터
                                </label >
                            </Col>
                        </Row>
                    </Col>
                </Link>
                <Link to='/setting'>
                    <Col xs={{ span: 4 }}>
                        <Row>
                            <Col xs={{ span: 24 }}>
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/setting.png"
                                     style={{width: "16px"}}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={{ span: 24 }}>
                                <label style={{
                                    color: "#ffffff",
                                    fontSize: "12px"
                                }}>
                                    설정
                                </label>
                            </Col>
                        </Row>
                    </Col>
                </Link>
            </Row>

            <Row style={{ marginTop: "27px", marginBottom: "15px" }}>
                <Link to='/mypage/like'>
                <Col xs={{ span: 5, offset: 2 }}>
                    <Row>
                        <Col span={24}>
                            {state.likeProduct === true ?
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/heart_selected.png"
                                     style={{width:"24px"}}
                                     onClick={() => {}}
                                />
                                :
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/heart.png"
                                     style={{width:"24px"}}
                                     onClick={() => {}}
                                />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <small style={{
                                color: "#ffffff",
                                fontSize: "12px"
                            }}>
                                관심상품
                            </small>
                        </Col>
                    </Row>
                </Col>
                </Link>

                <Link to='/mypage/buy'>
                <Col xs={{ span: 5 }}>
                    <Row>
                        <Col span={24}>
                            {state.buyProduct === true ?
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/heart_selected.png"
                                     style={{width:"24px"}}
                                     onClick={() => {}}
                                />
                                :
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/heart.png"
                                     style={{width:"24px"}}
                                     onClick={() => {}}
                                />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <small style={{
                                color: "#ffffff",
                                fontSize: "12px"
                            }}>
                                구매현황
                            </small>
                        </Col>
                    </Row>
                </Col>
                </Link>
                
                <Link to='/mypage/sell'>
                <Col xs={{ span: 5 }}>
                    <Row>
                        <Col span={24}>
                            {state.sellProduct == true ?
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/heart_selected.png"
                                     style={{width:"24px"}}
                                     onClick={() => {}}
                                />
                                :
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/heart.png"
                                     style={{width:"24px"}}
                                     onClick={() => {}}
                                />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <small style={{
                                color: "#ffffff",
                                fontSize: "12px"
                            }}>
                                판매현황
                            </small>
                        </Col>
                    </Row>
                </Col>
                </Link>

                <Link to='/mypage/reserve'>
                <Col xs={{ span: 5 }}>
                    <Row>
                        <Col span={24}>
                            {state.reserveProduct === true ?
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/heart_selected.png"
                                     style={{width:"24px"}}
                                     onClick={() => {}}
                                />
                                :
                                <img src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/heart.png"
                                     style={{width:"24px"}}
                                     onClick={() => {}}
                                />
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <small style={{
                                color: "#ffffff",
                                fontSize: "12px"
                            }}>
                                입고알림
                            </small>
                        </Col>
                    </Row>
                </Col>
                </Link>
            </Row>
        </div>
    )
}