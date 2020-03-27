import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Icon, Card, Modal, Popconfirm, Collapse, message } from "antd";
import axios from 'axios';
import './MyPageBanner.css';
import { useForm } from 'react-hook-form';

import host from '../../server-settings/ServerApiHost';

export default function BuyComponent(props) {
    const [buyList, setBuyList] = useState([]);
    const [modal, setModal] = useState(false);
    const [buyDetailIndex, setBuyDetailIndex] = useState([]);
    const [buttonGone, setButtonGone] = useState(-1);
    const [boogleBank, setBoogleBank] = useState(false);

    const [openBoxNum, setOpenBoxNum] = useState(false);
    const [openBoxPassword, setOpenBoxPassword] = useState(false);

    const [needRender, setNeedRender] = useState(false);

    const [isSignIn, setIsSignIn] = useState(false);

    const onSubmit = data => {
    };

    const sendName = (name) => {
        props.getName(name);
    }
    
    useEffect(() => {
        getMyPage();
        for (var buy in buyList) { // 구매 리스트
            buyDetailIndex[buy] = 0
        }
    }, []);

    useEffect(() => {
        if(needRender) {
            getMyPage();
            setNeedRender(false)
        }
    }, [needRender]);

    // 거래상세보기 기능을 위한 함수들
    const buyDetail = (i) => { // 상세보기 버튼을 누르면 해당 상품 인덱스 1로 바꿈
        buyDetailIndex[i] = 1
        setNeedRender(true) // 버튼 누를 때마다 화면 렌더링
    }
    const noBuyDetail = (i) => { // 접기 버튼을 누르면 해당 상품 인덱스 0으로 바꿈
        buyDetailIndex[i] = 0
        setNeedRender(true)
    }

    const getMyPage = () => {
        axios.get(host + '/myPage', {
            headers: { Authorization: localStorage.getItem('token') }
        })
            .then((response) => {
                if (response.data.status === 200){
                    setBuyList(response.data.data.buyTransList);
                    sendName(response.data.data.userName);
                }
                else { // Fixme : check status code!!
                    window.location.href = '/';
                }
            })
            .catch((err) => {
                window.location.href = '/';
            })
    }

    // 직거래 수령 완료(거래완료)를 위한 메소드
    const dirEnd = (sellItemId) => {
        axios.get(host + '/transaction/step?sellItemId=' + sellItemId, {
            headers: { Authorization: localStorage.getItem('token') }
        })
            .then((response) => {
                if(response.data.status === 201){
                    setNeedRender(true);
                }
                else{ // Fixme : check status code!!
                    message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
                }
            })
            .catch((err) => {
                message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
            })
    }

    const completePayment = (sellItemId) => {
        axios.get(host + '/transaction/payment?sellItemId=' + sellItemId, {
        })
            .then((response) => {
                if(response.data.status === 201){
                    setNeedRender(true);
                    message.success("결제 여부를 확인 중입니다.")
                }
                else{ // Fixme : check status code!!
                    message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
                }
            })
            .catch((err) => {
                message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
            })
    }

    const changeTransactionStep = (sellItemId) => {

        axios.get(host + '/transaction/step?sellItemId=' + sellItemId, {
            headers: { Authorization: localStorage.getItem('token') }
        })

            .then((response) => {
                if(response.data.status === 201){
                    setNeedRender(true);
                }
                else{ // Fixme : check status code!!
                    message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
                }
            })
            .catch((err) => {
                message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
            })

    }

    const payConfirmOnClickHandler = (sellItemId) => {
        completePayment(sellItemId)
    }

    const boogleBoxInfoReceiveConfirmOnClickHandler = (sellItemId) => {
        changeTransactionStep(sellItemId);
    }

    const showModal = e => {
        setModal(true);
    }

    const closeModal = e => {
        setModal(false);
    }

    const showBoogleBank = e => {
        setBoogleBank(true);
        setOpenBoxNum(false);
        setOpenBoxPassword(false);
    }

    const showOpenBoxNum = e => {
        setBoogleBank(false);
        setOpenBoxNum(true);
        setOpenBoxPassword(false);
    }

    const showOpenBoxPassword = e => {
        setBoogleBank(false);
        setOpenBoxNum(false);
        setOpenBoxPassword(true);
    }

    return(
        <Row id="user-product"
        style={{ marginTop: "24px", height: "auto", textAlign: "center" }}>
             <Card style={{ width: "100%", height: "auto", backgroundColor: "#ffffff", border: 0}}>
                        {buyList.length !== 0 && buyList != null ?
                            buyList.map((value, index) => (
                                <div style={{ width: "95%", margin: "auto auto", padding: "0px" }}>
                                    {value.transactionType === 0 ?
                                        <Card className = "product-card"
                                              style={{
                                                  width: "100%", height: "40%", backgroundColor: "#e5fdfc",
                                                  border: "none", borderRadius: "2.25vh", boxShadow: "0px 5px 10px #d3d3d3",
                                                  margin: "auto auto", marginBottom: "2vh", padding: "0px",
                                              }}>
                                            <div style={{margin: "-15px"}}>
                                                <Row style={{padding: "0"}}>
                                                    <Col span={24} style={{ color: "#339eac", fontSize: "16px", textAlign: "right", fontWeight: "bold" }}>직거래</Col>
                                                </Row>

                                                {value.transactionStep === 0 ?
                                                    <div>
                                                        <Row>
                                                            <Col span={6} offset={0}>
                                                                <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                    <img style={{
                                                                        width: "64px", height: "97px", backgroundSize: "contain",
                                                                        borderRadius: "7px", overflow: "hidden"
                                                                    }} src={value.itemImageUrl}></img>
                                                                </Link>
                                                            </Col>
                                                            <Col span={17} offset={1}>
                                                                <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left",
                                                                    color: "#656565", marginTop: "8px" }}>
                                                                    <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                        <Col offset={0} style={{color: "#656565"}}>
                                                                            {value.title}
                                                                        </Col>
                                                                    </Link>
                                                                </Row>
                                                                <Row style={{ fontSize: "12px", color: "#656565",marginTop: "24px", textAlign: "left" }}>
                                                                    <Col span={14}>
                                                                        주문일자 : {/*나중에 수정하기*/}
                                                                        {value.transactionCreatedTime[2]}
                                                                        {value.transactionCreatedTime[3]}.
                                                                        {value.transactionCreatedTime[5]}
                                                                        {value.transactionCreatedTime[6]}.
                                                                        {value.transactionCreatedTime[8]}
                                                                        {value.transactionCreatedTime[9]}   |
                                                                    </Col>
                                                                    <Col span={10}>  금액 : {value.transPrice}원
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ fontSize: "15px", color: "#959595", marginTop: "24px" }}>
                                                                    <Col offset={2}>
                                                                        판매자 수락 대기 중
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                    :
                                                    <div>
                                                        <Row>
                                                            <Col span={6} offset={0}>
                                                                <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                    <img style={{
                                                                        width: "64px", height: "97px", backgroundSize: "contain",
                                                                        borderRadius: "7px", overflow: "hidden"
                                                                    }} src={value.itemImageUrl}></img>
                                                                </Link>
                                                            </Col>
                                                            <Col span={17} offset={1}>
                                                                <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left",
                                                                    color: "#656565" }}>
                                                                    <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                        <Col offset={0} style={{color: "#656565"}}>
                                                                            {value.title}
                                                                        </Col>
                                                                    </Link>
                                                                </Row>
                                                                <Row style={{ fontSize: "12px", color: "#656565", marginTop: "8px", textAlign: "left" }}>
                                                                    <Col span={14}>
                                                                        주문일자 : {/*나중에 수정하기*/}
                                                                        {value.transactionCreatedTime[2]}
                                                                        {value.transactionCreatedTime[3]}.
                                                                        {value.transactionCreatedTime[5]}
                                                                        {value.transactionCreatedTime[6]}.
                                                                        {value.transactionCreatedTime[8]}
                                                                        {value.transactionCreatedTime[9]}   |
                                                                    </Col>
                                                                    <Col span={10}>  금액 : {value.transPrice}원
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ fontSize: "12px", color: "#656565", marginTop: "24px", textAlign: "left" }}>
                                                                    <Col offset={0} style={{ fontStyle: "bold" }}>
                                                                        판매자 : {value.traderNickname}  |
                                                                        연락처 : {value.traderPhoneNumber}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ fontSize: "12px", color: "#656565", marginTop: "24px", textDecoration: "underline" }}>
                                                            {buyDetailIndex[index] === 1  ?
                                                                <Col offset={20} onClick={() => { noBuyDetail(index) }}>
                                                                    <label>접기</label>
                                                                </Col>
                                                                :
                                                                <Col offset={16} onClick={() => { buyDetail(index) }}>
                                                                    <label>거래상세보기</label>
                                                                </Col>
                                                            }
                                                        </Row>
                                                        {buyDetailIndex[index] === 1 ?
                                                            <div style={{fontSize: "15px"}}>
                                                                <Row style={{ marginTop: "10px", color: "#44a0ac" }}>
                                                                    판매자 수락
                                                                </Row>
                                                                <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#038155" }}>
                                                                    <Col className="line" offset={12} span={1}
                                                                         style={{width: "2px", height: "45px",
                                                                             backgroundImage: "-webkit-linear-gradient(#00a199 -62%, #0b308e 280%)"}}>
                                                                    </Col>
                                                                </Row>
                                                                {value.transactionStep === 2 || value.transactionStep > 2 ?
                                                                    <Row style={{ marginTop: "13.5px", color: "#038196" }}>
                                                                        거래중
                                                                    </Row>
                                                                    :
                                                                    <Row style={{ marginTop: "13.5px", color: "#959595" }}>
                                                                        거래중
                                                                    </Row>
                                                                }
                                                                {value.transactionStep === 2 ?
                                                                    <Row>
                                                                        <button style={{
                                                                            padding: "0",
                                                                            width: "52px",
                                                                            height: "21px",
                                                                            background: "#075e92", color: "#ffffff",
                                                                            border: "none", borderRadius: "5px", fontSize: "10px",
                                                                            marginTop: "4px"
                                                                        }}
                                                                                onClick={() => { dirEnd(value.sellItemId) }}
                                                                        >도서 수령 완료</button> {/*버튼 통신 필요*/}
                                                                    </Row>
                                                                    : null}
                                                                {value.transactionStep === 3 ?
                                                                    <div>
                                                                        <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#0b308e" }}>
                                                                            <Col className="line" offset={12} span={1}
                                                                                 style={{width: "2px", height: "45px",
                                                                                     backgroundImage: "-webkit-linear-gradient(#00a199 -153%, #0b308e 100%)"}}>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ marginTop: "13.5px", color: "#0b308e", marginBottom: "20px" }}>
                                                                            거래 완료
                                                                        </Row>
                                                                    </div>
                                                                    :
                                                                    <div>
                                                                        <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#959595" }}>
                                                                            <Col className="line" offset={12} span={1}
                                                                                 style={{width: "2px", height: "45px",
                                                                                     backgroundColor: "#959595"}}>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ marginTop: "13.5px", color: "#959595", marginBottom: "20px" }}>
                                                                            거래 완료
                                                                        </Row>
                                                                    </div>
                                                                } {/*직거래 3단계*/}

                                                            </div>
                                                            : null } {/*직거래 step들*/}
                                                    </div>
                                                }
                                            </div>
                                        </Card>
                                        :
                                        <Card className = "product-card"
                                              style={{
                                                  width: "100%", height: "40%", backgroundColor: "#e8f5ff",
                                                  border: "none", borderRadius: "2.25vh", boxShadow: "0px 5px 10px #d3d3d3",
                                                  margin: "auto auto", marginBottom: "2vh", padding: "0px",
                                              }}>
                                            <div style={{margin: "-15px"}}>
                                                <Row style={{padding: "0"}}>
                                                    <Col span={24}style={{ color: "#0b308e", fontSize: "16px", textAlign: "right", fontWeight: "bold" }}>북을박스</Col>
                                                </Row>
                                                {value.transactionStep === 0 ?
                                                    <div>
                                                        <Row>
                                                            <Col span={6} offset={0}>
                                                                <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                    <img style={{
                                                                        width: "10vh", height: "15vh", backgroundSize: "contain",
                                                                        borderRadius: "7px", overflow: "hidden"
                                                                    }} src={value.itemImageUrl}></img>
                                                                </Link>
                                                            </Col>
                                                            <Col span={17} offset={1}>
                                                                <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left",
                                                                    color: "#656565" }}>
                                                                    <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                        <Col offset={0} style={{color: "#656565"}}>
                                                                            {value.title}
                                                                        </Col>
                                                                    </Link>
                                                                </Row>
                                                                <Row style={{ fontSize: "12px", color: "#656565", marginTop: "8px", textAlign: "left" }}>
                                                                    <Col span={14}>
                                                                        주문일자 : {/*나중에 수정하기*/}
                                                                        {value.transactionCreatedTime[2]}
                                                                        {value.transactionCreatedTime[3]}.
                                                                        {value.transactionCreatedTime[5]}
                                                                        {value.transactionCreatedTime[6]}.
                                                                        {value.transactionCreatedTime[8]}
                                                                        {value.transactionCreatedTime[9]}   |
                                                                    </Col>
                                                                    <Col span={10}>  금액 : {value.transPrice}원
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ fontSize: "15px", color: "#959595", marginTop: "24px" }}>
                                                                    <Col offset={2}>
                                                                        판매자 수락 대기 중
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                    : /*구매상품의 step이 0일 때와 아닐 때(판매자 수락 전, 후)*/

                                                    <div style={{ fontSize: "15px" }}>
                                                        <Row>
                                                            <Col span={6} offset={0}>
                                                                <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                    <img style={{
                                                                        width: "64px", height: "97px", backgroundSize: "contain",
                                                                        borderRadius: "7px", overflow: "hidden"
                                                                    }} src={value.itemImageUrl}></img>
                                                                </Link>
                                                            </Col>
                                                            <Col span={17} offset={1}>
                                                                <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left",
                                                                    color: "#656565" }}>
                                                                    <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                        <Col offset={0} style={{color: "#656565"}}>
                                                                            {value.title}
                                                                        </Col>
                                                                    </Link>
                                                                </Row>
                                                                <Row style={{ fontSize: "12px", color: "#656565", marginTop: "8px", textAlign: "left" }}>
                                                                    <Col span={14}>
                                                                        주문일자 : {/*나중에 수정하기*/}
                                                                        {value.transactionCreatedTime[2]}
                                                                        {value.transactionCreatedTime[3]}.
                                                                        {value.transactionCreatedTime[5]}
                                                                        {value.transactionCreatedTime[6]}.
                                                                        {value.transactionCreatedTime[8]}
                                                                        {value.transactionCreatedTime[9]}   |
                                                                    </Col>
                                                                    <Col span={10}>  금액 : {value.transPrice}원
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ fontSize: "12px", color: "#656565", marginTop: "24px", textAlign: "left" }}>
                                                                    <Col offset={0} style={{ fontStyle: "bold" }}>
                                                                        판매자 : {value.traderNickname}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                        <Row style={{ fontSize: "12px", color: "#656565", marginTop: "24px", textDecorationLine: "underline" }}>
                                                            {buyDetailIndex[index] === 1  ?
                                                                <Col offset={20}>
                                                                    <label onClick={() => { noBuyDetail(index) }}>접기</label>
                                                                </Col>
                                                                :
                                                                <Col offset={16}>
                                                                    <label onClick={() => {
                                                                        buyDetail(index) }}>거래상세보기</label>
                                                                </Col>
                                                            }
                                                        </Row>
                                                        {buyDetailIndex[index] === 1  ?
                                                            <div>
                                                                <Row style={{ marginTop: "10px", color: "#44a0ac" }}>
                                                                    판매자 수락
                                                                </Row>
                                                                <Row style={{ fontSize: "5vh", marginTop: "13.5px" }}>
                                                                    <Col offset={12} span={1} class="line"
                                                                         style={{width: "2px", height: "33px",
                                                                             backgroundImage: "-webkit-linear-gradient(#00a199 -62%, #0b308e 450%)"}}>
                                                                    </Col>
                                                                </Row>
                                                                <Row style={{ marginTop: "13.5px", color: "#038196" }}>
                                                                    결제 요청중
                                                                </Row>

                                                                {value.transactionStep === 1 && value.paymentDone === false ?
                                                                    <div>
                                                                        <Row>
                                                                            <button style={{
                                                                                padding: "0",
                                                                                width: "52px",
                                                                                height: "21px",
                                                                                background: "#075e92", color: "#ffffff",
                                                                                border: "none", borderRadius: "5px", fontSize: "10px",
                                                                                marginTop: "4px"
                                                                            }}
                                                                                    onClick={() => { showModal(); showBoogleBank(); }}
                                                                            >결제 하기</button>
                                                                        </Row>
                                                                        {modal === true ?
                                                                            <Modal
                                                                                footer={null}
                                                                                visible={modal}
                                                                                onCancel={() => { closeModal(); }}>
                                                                                {modal === true && boogleBank === true ?
                                                                                    <div>
                                                                                        <div style={{ textAlign: "left", border: "1px solid #a7a7a7", padding: "20px", marginTop: "40px", borderRadius: "18px" }}>
                                                                                            <Row>
                                                                                                <Col>
                                                                                                    <p style={{ color: "#535353", fontSize: "18px", fontWeight: 700 }}>
                                                                                                        [국민은행] 030301-04-179401
                                                                                                    </p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                            <Row>
                                                                                                <Col>
                                                                                                    <p style={{ color: "#535353", fontSize: "18px", fontStyle: "bold" }}>
                                                                                                        예금주 : 김수빈(북을)
                                                                                                    </p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                            <Row>
                                                                                                <Col>
                                                                                                    <p style={{ color: "#535353", fontSize: "18px", fontStyle: "bold" }}>
                                                                                                        결제금액 : {value.transPrice}  원 </p>
                                                                                                </Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                        <div style={{textAlign : "center", color : "707070", fontSize : "12px"}}>
                                                                                            <Row style={{marginTop : "30px", marginBottom : "10px"}}>
                                                                                                <Col><span>송금완료 확인 후 결제가 정상적으로 처리됩니다.</span></Col>
                                                                                            </Row>
                                                                                            <Row>
                                                                                                <Col><span>북을 > 마이페이지에서 결제 상황을 반드시 확인해주세요.</span></Col>
                                                                                            </Row>
                                                                                        </div>
                                                                                        <Row style={{marginTop : "30px"}}>
                                                                                            <Col>
                                                                                                <button style={{
                                                                                                    borderRadius: "14px", background: "rgba(51, 158, 172, 0.9)",
                                                                                                    color: "white", border: "none", fontSize: "12px", height: "25px", width: "100%",
                                                                                                    padding: "auto"
                                                                                                }}
                                                                                                        onClick={() => {

                                                                                                            payConfirmOnClickHandler(value.sellItemId);
                                                                                                            setNeedRender(true);
                                                                                                            closeModal();

                                                                                                        }}
                                                                                                ><span>결제 완료</span></button>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                    : null} {/*북을 계좌 끝*/}
                                                                            </Modal>
                                                                            : null} {/*모달 끝*/}
                                                                        <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#959595" }}>
                                                                            <Col className="line" offset={12} span={1}
                                                                                 style={{width: "2px", height: "33px",
                                                                                     backgroundColor: "#959595"}}>
                                                                            </Col>
                                                                        </Row>
                                                                    </div>
                                                                    : /*1단계 아니면*/
                                                                    <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#065d33" }}>
                                                                        <Col className="line" offset={12} span={1}
                                                                             style={{width: "2px", height: "33px",
                                                                                 backgroundImage: "-webkit-linear-gradient(#00a199 -231%, #0b308e 325%)"}}>
                                                                        </Col>
                                                                    </Row>
                                                                } {/*1단계 끝*/}

                                                                {value.transactionStep === 3 || value.transactionStep > 3 ?
                                                                    <Row style={{ marginTop: "13.5px", color: "#065d92" }}>
                                                                        물건 비치 완료
                                                                    </Row>
                                                                    :
                                                                    <Row style={{ marginTop: "13.5px", color: "#959595" }}>
                                                                        물건 비치 완료
                                                                    </Row>
                                                                } {/*3단계 끝*/}

                                                                {value.transactionStep === 3 ?
                                                                    <Row >
                                                                        <button style={{
                                                                            padding: "0",
                                                                            width: "52px",
                                                                            height: "21px",
                                                                            background: "#075e92", color: "#ffffff",
                                                                            border: "none", borderRadius: "5px", fontSize: "10px",
                                                                            marginTop: "4px"
                                                                        }} onClick={() => {showModal(); showOpenBoxNum();}}
                                                                        >수령 하기</button>

                                                                        {modal === true && openBoxNum === true ?
                                                                            <Modal
                                                                                visible={modal}
                                                                                footer={null}
                                                                                onCancel={() => { closeModal(); }}>
                                                                                {value.boxId !== "" ?
                                                                                    <div style={{ textAlign: "center" }}>
                                                                                        <Row>
                                                                                            <p style={{ color: "#000000", fontSize: "5vh", position: "relative", top : 135 }}>
                                                                                                {value.boxId}
                                                                                            </p>
                                                                                            <img style={{width : "50%"}} src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/boogle_box.png"></img>
                                                                                        </Row>
                                                                                        <Row style={{margin : "20px 0 20px 0"}}>
                                                                                            <Col><span>위에 표시된 번호의<br/>북을 박스를 찾아주세요</span></Col>
                                                                                        </Row>
                                                                                        <Row style={{marginTop : "30px"}}>
                                                                                            <Col>
                                                                                                <button style={{
                                                                                                    borderRadius: "14px", background: "rgba(51, 158, 172, 0.9)",
                                                                                                    color: "white", border: "none", fontSize: "12px", height: "25px", width: "100%",
                                                                                                    padding: "auto"
                                                                                                }}
                                                                                                        onClick={() => {
                                                                                                            closeModal(); showModal(); showOpenBoxPassword();
                                                                                                        }}
                                                                                                ><span>비밀번호 보기</span></button>
                                                                                            </Col>
                                                                                        </Row>
                                                                                    </div>
                                                                                    :
                                                                                    <div>
                                                                                        {openBoxNum === true && value.boxId === "" ?
                                                                                            <p style={{ color: "#000000", fontSize: "2vh", textAlign: "center", margin: "2vh" }}>
                                                                                                북을박스에 비치되지 않아서 박스 번호가 없습니다.</p>
                                                                                            : null}
                                                                                    </div>
                                                                                } {/*북을박스 번호 조회 끝*/}
                                                                            </Modal>
                                                                            :
                                                                            <div>
                                                                                {modal === true && openBoxPassword === true ?
                                                                                    <Modal
                                                                                        visible={modal}
                                                                                        footer={null}
                                                                                        onCancel={() => { closeModal(); }}>
                                                                                        {value.boxPassword !== "" ?
                                                                                            <div style={{ textAlign: "center" }}>
                                                                                                <Row>
                                                                                                    <p style={{ color: "#000000", fontSize: "5vh", position: "relative", top : 135 }}>
                                                                                                        {value.boxPassword}
                                                                                                    </p>
                                                                                                    <img style={{width : "50%"}} src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/boogle_box.png"></img>
                                                                                                </Row>
                                                                                                <Row style={{margin : "20px 0 20px 0"}}>
                                                                                                    <Col><span>위에 표시된 비밀번호를<br/>눌러주세요</span></Col>
                                                                                                </Row>
                                                                                                <Row style={{marginTop : "30px"}}>
                                                                                                    <Col>
                                                                                                        <Popconfirm
                                                                                                            placement="bottom"
                                                                                                            title="책을 북을 박스로 부터 수령하셨나요?"
                                                                                                            onConfirm={()=>{
                                                                                                                boogleBoxInfoReceiveConfirmOnClickHandler(value.sellItemId);
                                                                                                                closeModal();
                                                                                                            }}
                                                                                                            okText="예"
                                                                                                            cancelText="아니오"
                                                                                                        >
                                                                                                            <button style={{
                                                                                                                borderRadius: "14px", background: "rgba(51, 158, 172, 0.9)",
                                                                                                                color: "white", border: "none", fontSize: "12px", height: "25px", width: "100%",
                                                                                                                padding: "auto"
                                                                                                            }}
                                                                                                            ><span>수령 완료</span></button>
                                                                                                        </Popconfirm>
                                                                                                    </Col>
                                                                                                </Row>
                                                                                            </div>
                                                                                            :
                                                                                            <div>
                                                                                                {openBoxPassword === true && value.boxPassword === "" ?
                                                                                                    <p style={{ color: "#000000", fontSize: "2vh", textAlign: "center", margin: "2vh" }}>
                                                                                                        북을박스에 비치되지 않아서 비밀번호가 없습니다.</p>
                                                                                                    : null}
                                                                                            </div>
                                                                                        } {/*북을박스 비밀번호 조회 끝*/}
                                                                                    </Modal>
                                                                                    : null}
                                                                            </div>
                                                                        } {/*모달 끝*/}
                                                                    </Row>
                                                                    :
                                                                    null } {/*3단계 끝*/}

                                                                {value.transactionStep >= 4 ?
                                                                    <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#0b308e" }}>
                                                                        <Col className="line" offset={12} span={1}
                                                                             style={{width: "2px", height: "33px",
                                                                                 backgroundImage: "-webkit-linear-gradient(#00a199 -357%, #0b308e 262%)"}}>
                                                                        </Col>
                                                                    </Row>
                                                                    :
                                                                    <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#959595" }}>
                                                                        <Col className="line" offset={12} span={1}
                                                                             style={{width: "2px", height: "33px",
                                                                                 backgroundColor: "#959595"}}>
                                                                        </Col>
                                                                    </Row>
                                                                } {/*4단계 끝*/}

                                                                {value.transactionStep === 5 || value.transactionStep >= 5 ?
                                                                    <Row style={{ marginTop: "13.5px", marginBottom: "20px", color: "#0b308e" }}>
                                                                        거래 완료
                                                                    </Row>
                                                                    :
                                                                    <Row style={{ marginTop: "13.5px", marginBottom: "20px", color: "#959595" }}>
                                                                        거래 완료
                                                                    </Row>

                                                                } {/*5단계 끝*/}

                                                            </div>
                                                            : null}  {/*거래상세보기 끝*/}
                                                    </div>

                                                }
                                            </div>
                                        </Card>
                                    }
                                </div>
                            ))
                            :  /*구매현황 없을 때*/
                            <div>
                                <Row style={{ padding: "2vh", margin: "2vh", marginBottom: "45%" }}>
                                    <p style={{ color: "#000000", fontSize: "15px" }}>
                                        구매 중인 상품이 없습니다.</p>
                                </Row>
                                <Row>
                                    <Link to="/">
                                        <button style={{
                                            padding: "0",
                                            width: "100%",
                                            background: "rgba(51, 158, 172, 0.9)", color: "#ffffff",
                                            border: "none", borderRadius: "2.25vh", fontSize: "2.5vh", height: "5vh"
                                        }}
                                        >구매하러 가기</button>
                                    </Link>
                                </Row>
                            </div>
                        } {/* 구매상품 없을 때 뷰 끝 */}
                    </Card>
        </Row>
    );
    
}