import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Icon, Card, Modal, Popconfirm, Collapse, message } from "antd";
import axios from 'axios';
import './MyPageBanner.css';
import { useForm } from 'react-hook-form';

import host from '../../server-settings/ServerApiHost';

export default function SellComponent() {
    const [sellList, setSellList] = useState([]);
    const [modal, setModal] = useState(false);
    const [sellDetailIndex, setSellDetailIndex] = useState([]);
    const [buttonGone, setButtonGone] = useState(-1);

    const [inputBoxId, setInputBoxId] = useState("");
    const [inputBoxPassword, setInputBoxPassword] = useState("");
    const [boxNum, setBoxNum] = useState(false);
    const [boxPassword, setBoxPassword] = useState(false);
    const [inputBoogleBoxComplete, setInputBoolgeBoxComplete] = useState(false);

    const [needRender, setNeedRender] = useState(false);

    const { register, handleSubmit } = useForm();

    const [isSignIn, setIsSignIn] = useState(false);

    const onSubmit = data => {
    }; 

    useEffect(() => {
        getMyPage();
        for (var sell in sellList) { // 구매 리스트
            sellDetailIndex[sell] = 0
        }
    }, []);
    
    useEffect(() => {
        if(needRender) {
            getMyPage();
            setNeedRender(false)
        }
    }, [needRender]);

    // 거래상세보기 기능을 위한 함수들
    const sellDetail = (i) => { // 구매 상품이랑 판매 상품은 별도로 작동함
        sellDetailIndex[i] = 1
        setNeedRender(true)
    }
    const noSellDetail = (i) => { // 구매 상품이랑 판매 상품은 별도로 작동함
        sellDetailIndex[i] = 0
        setNeedRender(true)
    }

    const getMyPage = () => {
        axios.get(host + '/myPage', {
            headers: { Authorization: localStorage.getItem('token') }
        })
            .then((response) => {
                if (response.data.status === 200){
                    setSellList(response.data.data.sellTransList)
                }
                else { // Fixme : check status code!!
                    window.location.href('/')
                }
            })
            .catch((err) => {
                window.location.href('/')
            })
    }

    // 상품 삭제 버튼을 위한 메소드
    const cancelSellItem = (itemId) => {
        axios.delete(host + "/sell?sellItemId=" + itemId, {
            headers: { Authorization: localStorage.getItem('token') }
        })
        .then((response) => {
            if(response.data.status === 201){
                message.success("판매 등록이 취소되었습니다.");
                setNeedRender(true);
            }
            else{
                message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
            }
        })
        .catch((err) => {
            message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
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

    const acceptBuyRequest = (sellItemId) => {
        axios.get(host + '/transaction/step?sellItemId=' + sellItemId, {
        })
            .then((response) => {
                if(response.data.status === 201){ // Fixme : check status code!!
                    setButtonGone(-1);
                    setNeedRender(true);
                }
                else{ // Fixme : check status code!!
                    setButtonGone(-1);
                    setNeedRender(true);
                    message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
                }
            })
            .catch((err) => {
                setButtonGone(-1);
                setNeedRender(true);
                message.warning("처리되지 않았습니다. 다시 시도해주십시오.")
            })
    }

    const rejectBuyRequest = (sellItemId) => {
        axios.delete(host + '/transaction?sellItemId=' + sellItemId, {
        })
            .then((response) => {
                if(response.data.status === 201){ // Fixme : check status code!!
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

    const setBoogleBoxInfo = (boxId, boxPassword, sellItemId) => {

        axios.post(host + '/transaction/booglebox', {
            "sellItemId" : sellItemId,
            "id" : boxId,
            "password" : boxPassword
        })
            .then((response) => {
                if(response.data.status === 201){
                    setNeedRender(true);
                    message.success("북을박스 정보 입력이 완료되었습니다.")
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

    const setBoogleBoxInfoOnClickHandler = (boxId, boxPassword, sellItemId) => {
        setBoogleBoxInfo(boxId, boxPassword, sellItemId);
    }

    const showModal = e => {
        setModal(true);
    }

    const closeModal = e => {
        setModal(false);
    }

    const showBoxNum = e => {
        setBoxNum(true);
        setBoxPassword(false);
    }

    const showBoxPassword = e => {
        setBoxNum(false);
        setBoxPassword(true);
    }

    return(
        <Row id="user-product"
        style={{ marginTop: "24px", height: "auto", textAlign: "center" }}>
            <Card style={{ width: "100%", height: "auto", backgroundColor: "#ffffff", border: 0, }}>
                        {sellList.length !== 0 && sellList != null ?
                            sellList.map((value, index) => (
                                <div style={{ width: "95%", margin: "auto auto" }}>
                                    {value.transactionType === 0 ?
                                        <div>
                                            <div style={{ width: "100%", margin: "auto auto", padding: "0px" }}>
                                                {value.transactionStep === -1 ?
                                                    <Card className = "product-card"
                                                          style={{
                                                              width: "100%", height: "40%", backgroundColor: "#e0e0e0",
                                                              border: "none", borderRadius: "2.25vh", boxShadow: "0px 5px 10px #d3d3d3",
                                                              margin: "auto auto", marginBottom: "2vh", padding: "0px",
                                                          }}>
                                                        <div style={{margin: "-15px"}}>
                                                            <Row style={{padding: "0"}}>
                                                                <Col span={24} style={{ color: "#707070", fontSize: "16px", textAlign: "right", fontWeight: "bold" }}>직거래</Col>
                                                            </Row>

                                                            <Row>
                                                                <Col span={6} offset={0}>
                                                                    <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                        <img style={{
                                                                            width: "64px", height: "97px", backgroundSize: "contain",
                                                                            borderRadius: "7px", overflow: "hidden"
                                                                        }} src={value.itemImageUrl}></img>
                                                                    </Link>
                                                                </Col>
                                                                <Col span={17} offset={0}>
                                                                    <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left",
                                                                        color: "#656565" }}>
                                                                        <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                            <Col offset={2} style={{color: "#656565"}}>
                                                                                {value.title}
                                                                            </Col>
                                                                        </Link>
                                                                    </Row>
                                                                    <Row style={{ fontSize: "12px", textAlign: "left", marginTop: "8px", color: "#656565", }}>
                                                                        <Col span={12} offset={2}>금액 : {value.transPrice}원
                                                                        </Col>
                                                                    </Row>
                                                                    <Row style={{ fontSize: "15px", color: "#959595", marginTop: "17px" }}>
                                                                        <Col span={10} offset={2}>
                                                                            등록 완료
                                                                        </Col>
                                                                        <Col span={10} offset={2}>
                                                                            <button style={{
                                                                            padding: "0",
                                                                            width: "52px",
                                                                            height: "21px",
                                                                            background: "#959595", color: "#ffffff",
                                                                            border: "none", borderRadius: "5px", fontSize: "10px",
                                                                            marginTop: "4px"
                                                                            }} onClick={() => { cancelSellItem(value.sellItemId); }}
                                                                            >상품 삭제</button>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card>
                                                    : /*판매등록된 상품인지 거래 중인지*/

                                                    <Card className = "product-card"
                                                          style={{
                                                              width: "100%", height: "40%", backgroundColor: "#e5fdfc",
                                                              border: "none", borderRadius: "2.25vh", boxShadow: "0px 5px 10px #d3d3d3",
                                                              margin: "auto auto", marginBottom: "2vh", padding: "0px",
                                                          }}>
                                                        <div style={{margin: "-15px"}}>
                                                            <Row>
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
                                                                            <Row>
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
                                                                            <Row style={{ fontSize: "14px", color: "#056d94", marginTop: "8px" }}>
                                                                                <Col offset={7} span={8} style={{ fontStyle: "bold" }}>
                                                                                    구매 요청
                                                                                </Col>
                                                                            </Row>
                                                                            <Row style={{ color: "#ffffff", marginTop: "0" }}>
                                                                                { buttonGone !== index &&
                                                                                <div>
                                                                                    <Col span={6} offset={5}>
                                                                                        <button style={{
                                                                                            padding: "0",
                                                                                            width: "42px",
                                                                                            height: "21px",
                                                                                            background: "#075e92",
                                                                                            border: "none", borderRadius: "5px", fontSize: "10px",
                                                                                            marginLeft: "0"
                                                                                        }}
                                                                                                onClick={() => {acceptBuyRequest(value.sellItemId); setButtonGone(index)}}
                                                                                        >수락</button>
                                                                                    </Col>
                                                                                    <Col span={5} offset={1}>
                                                                                        <button style={{
                                                                                            padding: "0",
                                                                                            width: "42px",
                                                                                            height: "21px",
                                                                                            background: "#656565",
                                                                                            border: "none", borderRadius: "5px", fontSize: "10px",
                                                                                            marginLeft: "0"
                                                                                        }}
                                                                                                onClick={() => {rejectBuyRequest(value.sellItemId); setButtonGone(index)}}
                                                                                        >거절</button>
                                                                                    </Col>
                                                                                </div>
                                                                                }
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
                                                                            <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left" }}>
                                                                                <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                                    <Col offset={0} style={{color: "#656565"}}>
                                                                                        {value.title}
                                                                                    </Col>
                                                                                </Link>
                                                                            </Row>
                                                                            <Row style={{ fontSize: "12px", color: "#656565", marginTop: "8px", textAlign: "left"}}>
                                                                                <Col span={14} offset={0}>
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
                                                                                    구매자 : {value.traderNickname}  |
                                                                                    연락처 : {value.traderPhoneNumber}
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row style={{ fontSize: "12px", color: "#656565", marginTop: "24px", textDecoration: "underline" }}>
                                                                        {sellDetailIndex[index] === 1  ?
                                                                            <Col offset={20}>
                                                                                <label onClick={() => { noSellDetail(index) }}>접기</label>
                                                                            </Col>
                                                                            :
                                                                            <Col offset={16}>
                                                                                <label onClick={() => {
                                                                                    sellDetail(index) }}>거래상세보기</label>
                                                                            </Col>
                                                                        }
                                                                    </Row>
                                                                    {sellDetailIndex[index] === 1  ?
                                                                        <div style={{fontSize: "15px"}}>
                                                                            <Row style={{ marginTop: "10px", color: "#44a0ac" }}>
                                                                                구매 요청 수락
                                                                            </Row>
                                                                            <Row style={{ fontSize: "5vh", margin: "13.5px", color: "#038155" }}>
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
                                                                                <Row style={{ marginTop: "13.5px", color: "#656565" }}>
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
                                                                                    >금액 수령 완료</button> {/*버튼 통신 필요*/}
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
                                                                                    <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#656565" }}>
                                                                                        <Col className="line" offset={12} span={1}
                                                                                             style={{width: "2px", height: "45px",
                                                                                                 backgroundColor: "#959595"}}>
                                                                                        </Col>
                                                                                    </Row>
                                                                                    <Row style={{ marginTop: "13.5px", color: "#656565", marginBottom: "20px" }}>
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
                                                } {/*판매등록된 상품 끝*/}
                                            </div>
                                        </div>
                                        :  /*직거래인지 북을박스인지 구분*/
                                        <div>
                                            <div>
                                                {value.transactionStep === -1 ?
                                                    <Card className = "product-card"
                                                          style={{
                                                              width: "100%", height: "40%", backgroundColor: "#e0e0e0",
                                                              border: "none", borderRadius: "2.25vh", boxShadow: "0px 5px 10px #d3d3d3",
                                                              margin: "auto auto", marginBottom: "2vh", padding: "0px",
                                                          }}>
                                                        <div style={{margin: "-15px"}}>
                                                            <Row style={{padding: "0"}}>
                                                                <Col span={24}style={{ color: "#707070", fontSize: "16px", textAlign: "right", fontWeight: "bold" }}>북을박스</Col>
                                                            </Row>

                                                            <Row>
                                                                <Col span={6} offset={0}>
                                                                    <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                        <img style={{
                                                                            width: "64px", height: "97px", backgroundSize: "contain",
                                                                            borderRadius: "7px", overflow: "hidden"
                                                                        }} src={value.itemImageUrl}></img>
                                                                    </Link>
                                                                </Col>
                                                                <Col span={17} offset={0}>
                                                                    <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left",
                                                                        color: "#656565" }}>
                                                                        <Link to = {'/buy/detail/'+value.sellItemId}>
                                                                            <Col offset={2} style={{color: "#656565"}}>
                                                                                {value.title}
                                                                            </Col>
                                                                        </Link>
                                                                    </Row>
                                                                    <Row style={{ fontSize: "12px", textAlign: "left", marginTop: "8px", color: "#656565", }}>
                                                                        <Col span={12} offset={2}>금액 : {value.transPrice}원
                                                                        </Col>
                                                                    </Row>
                                                                    <Row style={{ fontSize: "15px", color: "#959595", marginTop: "17px" }}>
                                                                        <Col span={10} offset={2}>
                                                                            등록 완료
                                                                        </Col>
                                                                        <Col span={10} offset={2}>
                                                                            <button style={{
                                                                            padding: "0",
                                                                            width: "52px",
                                                                            height: "21px",
                                                                            background: "#959595", color: "#ffffff",
                                                                            border: "none", borderRadius: "5px", fontSize: "10px",
                                                                            marginTop: "4px"
                                                                            }} onClick={() => { cancelSellItem(value.sellItemId); }}
                                                                         >상품 삭제</button>
                                                                        </Col>
                                                                    </Row>
                                                                </Col>
                                                            </Row>
                                                        </div>
                                                    </Card>
                                                    : /*판매등록된 상품인지 거래 중인지*/
                                                    <Card className = "product-card"
                                                          style={{
                                                              width: "100%", height: "40%", backgroundColor: "#e8f5ff",
                                                              border: "none", borderRadius: "2.25vh", boxShadow: "0px 5px 10px #d3d3d3",
                                                              margin: "auto auto", marginBottom: "2vh", padding: "0px",
                                                          }}>
                                                        <div style={{margin: "-15px"}}>
                                                            <Row>
                                                                <Col span={24} style={{ color: "#0b308e", fontSize: "16px", textAlign: "right", fontWeight: "bold" }}>북을박스</Col>
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
                                                                            <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left" }}>
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
                                                                            <Row style={{ fontSize: "14px", color: "#056d94", marginTop: "8px" }}>
                                                                                <Col offset={7} span={8} style={{ fontStyle: "bold" }}>
                                                                                    구매 요청
                                                                                </Col>
                                                                            </Row>
                                                                            <Row style={{ color: "#ffffff", marginTop: "0" }}>
                                                                            { buttonGone !== index &&
                                                                                <div>
                                                                                    <Col span={6} offset={5}>
                                                                                        <button style={{
                                                                                            padding: "0",
                                                                                            width: "42px",
                                                                                            height: "21px",
                                                                                            background: "#075e92",
                                                                                            border: "none", borderRadius: "5px", fontSize: "10px",
                                                                                            marginLeft: "0"
                                                                                        }}
                                                                                                onClick={() => {acceptBuyRequest(value.sellItemId); setButtonGone(index)}}
                                                                                        >수락</button>
                                                                                    </Col>
                                                                                    <Col span={5} offset={1}>
                                                                                        <button style={{
                                                                                            padding: "0",
                                                                                            width: "42px",
                                                                                            height: "21px",
                                                                                            background: "#656565",
                                                                                            border: "none", borderRadius: "5px", fontSize: "10px",
                                                                                            marginLeft: "0"
                                                                                        }}
                                                                                                onClick={() => {rejectBuyRequest(value.sellItemId); setButtonGone(index)}}
                                                                                        >거절</button>
                                                                                    </Col>
                                                                                </div>
                                                                                }
                                                                            </Row>

                                                                        </Col>
                                                                    </Row>
                                                                </div>

                                                                : /*판매상품의 step이 0일 때와 아닐 때(판매자 수락 전, 후)*/

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
                                                                            <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left" }}>
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
                                                                            <Row style={{ fontSize: "12px", color: "#656565", marginTop: "24px" }}>
                                                                                <Col offset={0} style={{ fontStyle: "bold", textAlign: "left" }}>
                                                                                    구매자 : {value.traderNickname}
                                                                                </Col>
                                                                            </Row>
                                                                        </Col>
                                                                    </Row>
                                                                    <Row style={{ fontSize: "12px", color: "#656565", marginTop: "24px", textDecoration: "underline" }}>
                                                                        {sellDetailIndex[index] === 1   ?
                                                                            <Col offset={20}>
                                                                                <label onClick={() => { noSellDetail(index) }}>접기</label>
                                                                            </Col>
                                                                            :
                                                                            <Col offset={16}>
                                                                                <label onClick={() => {
                                                                                    sellDetail(index) }}>거래상세보기</label>
                                                                            </Col>
                                                                        }
                                                                    </Row>
                                                                    {sellDetailIndex[index] === 1 ?
                                                                        <div style={{fontSize: "15px"}}>
                                                                            <Row style={{ marginTop: "10px", color: "#44a0ac" }}>
                                                                                구매 요청 수락
                                                                            </Row>
                                                                            <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#038155" }}>
                                                                                <Col className="line" offset={12} span={1}
                                                                                     style={{width: "2px", height: "33px",
                                                                                         backgroundImage: "-webkit-linear-gradient(#00a199 -62%, #0b308e 450%)"}}>
                                                                                </Col>
                                                                            </Row>
                                                                            <Row style={{ marginTop: "13.5px", color: "#038196" }}>
                                                                                구매자 결제 중
                                                                            </Row>

                                                                            {value.transactionStep === 1 && value.boxPassword === "" ?
                                                                                <Row>
                                                                                    <button style={{
                                                                                        padding: "0",
                                                                                        width: "52px",
                                                                                        height: "21px",
                                                                                        background: "#075e92", color: "#ffffff",
                                                                                        border: "none", borderRadius: "5px", fontSize: "10px",
                                                                                        marginTop: "4px"
                                                                                    }} onClick={() => {showModal(); showBoxNum();}}
                                                                                    >물품 비치</button>
                                                                                    {modal === true && boxNum === true ?
                                                                                        <Modal
                                                                                            footer={null}
                                                                                            visible={modal}
                                                                                            onCancel={() => { closeModal(); }}>
                                                                                            <div style={{ textAlign: "center" }}>
                                                                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                                                                    <Row>
                                                                                                        <img style={{width : "50%"}} src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/boogle_box.png"></img>
                                                                                                    </Row>
                                                                                                    <Row style={{margin : "20px 0 0 0"}}>
                                                                                                        <input
                                                                                                            style={{border : "1px solid #707070", borderRadius : "16px",
                                                                                                                width : "50%", textAlign : "center"}}
                                                                                                            type="text" name="id" ref={register}
                                                                                                            onChange={(e) => {setInputBoxId(e.target.value)}} />
                                                                                                    </Row>
                                                                                                    <Row style={{margin : "20px 0 20px 0"}}>
                                                                                                        <Col><span>도서를 비치하신 북을박스 번호를 입력해주세요</span></Col>
                                                                                                    </Row>
                                                                                                    <Row>
                                                                                                        <button style={{
                                                                                                            borderRadius: "14px", background: "rgba(51, 158, 172, 0.9)",
                                                                                                            color: "white", border: "none", fontSize: "12px", height: "25px", width: "75%",
                                                                                                            padding: "auto"
                                                                                                        }}
                                                                                                                onClick={() => {closeModal(); showModal(); showBoxPassword(); }}
                                                                                                        >입력하기</button>
                                                                                                    </Row>
                                                                                                </form>{/*북을박스 번호 입력 끝*/}
                                                                                            </div>
                                                                                        </Modal>
                                                                                        :
                                                                                        <div>
                                                                                            {modal === true && boxPassword === true ?
                                                                                                <Modal
                                                                                                    visible={modal}
                                                                                                    footer={null}
                                                                                                    onCancel={() => { closeModal(); }}>
                                                                                                    <div style={{ textAlign: "center" }}>
                                                                                                        <Row>
                                                                                                            <img style={{width : "50%"}} src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/boogle_box.png"></img>
                                                                                                        </Row>
                                                                                                        <Row style={{margin : "20px 0 0 0"}}>
                                                                                                            <input
                                                                                                                style={{border : "1px solid #707070", borderRadius : "16px",
                                                                                                                    width : "50%", textAlign : "center"}}
                                                                                                                type="text" name="password" ref={register}
                                                                                                                onChange={(e) => {setInputBoxPassword(e.target.value)}} />
                                                                                                        </Row>
                                                                                                        <Row style={{margin : "20px 0 20px 0"}}>
                                                                                                            <Col><span>도서를 비치하신 북을박스 비밀번호를 <br/>입력해주세요</span></Col>
                                                                                                        </Row>
                                                                                                        <Row>
                                                                                                            <button style={{
                                                                                                                borderRadius: "14px", background: "rgba(51, 158, 172, 0.9)",
                                                                                                                color: "white", border: "none", fontSize: "12px", height: "25px", width: "75%",
                                                                                                                padding: "auto"
                                                                                                            }}
                                                                                                                    onClick={() => {
                                                                                                                        setBoogleBoxInfoOnClickHandler(inputBoxId, inputBoxPassword, value.sellItemId);
                                                                                                                        closeModal();}}
                                                                                                            >입력하기</button>
                                                                                                        </Row>
                                                                                                    </div>
                                                                                                </Modal>
                                                                                                : null}
                                                                                        </div>
                                                                                    } {/*모달 끝*/}

                                                                                </Row>
                                                                                :
                                                                                null } {/*1단계 버튼 끝*/}

                                                                            {value.transactionStep >= 2 ?
                                                                                <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#0b308e" }}>
                                                                                    <Col className="line" offset={12} span={1}
                                                                                         style={{width: "2px", height: "33px",
                                                                                             backgroundImage: "-webkit-linear-gradient(#00a199 -357%, #0b308e 262%)"}}>
                                                                                    </Col>
                                                                                </Row>
                                                                                :
                                                                                <Row style={{ fontSize: "5vh", marginTop: "13.5px", color: "#656565" }}>
                                                                                    <Col className="line" offset={12} span={1}
                                                                                         style={{width: "2px", height: "33px",
                                                                                             backgroundColor: "#959595"}}>
                                                                                    </Col>
                                                                                </Row>
                                                                            } {/*2단계 끝*/}

                                                                            {value.transactionStep === 5 || value.transactionStep > 5 ?
                                                                                <div>
                                                                                    <Row style={{ marginTop: "13.5px", marginBottom: "20px", color: "#0b308e" }}>
                                                                                        거래 완료
                                                                                    </Row>
                                                                                </div>
                                                                                : /*5단계 이상인지 아닌지*/
                                                                                <Row style={{ marginTop: "13.5px", marginBottom: "20px", color: "#656565" }}>
                                                                                    거래 완료
                                                                                </Row>

                                                                            } {/*5단계 끝*/}

                                                                        </div>
                                                                        : null}  {/*거래상세보기 끝*/}
                                                                </div>

                                                            }
                                                        </div>
                                                    </Card>
                                                } {/*판매등록된 상품이 아닐 때 끝*/}
                                            </div>

                                        </div>}

                                </div>
                            ))
                            :  /*판매현황 없을 때*/
                            <div>
                                <div>
                                    <Row style={{ padding: "2vh", margin: "2vh", marginBottom: "45%" }}>
                                        <p style={{ color: "#000000", fontSize: "15px" }}>
                                            판매 중인 상품이 없습니다.</p>
                                    </Row>
                                    <Row>
                                        <Link to="/sell">
                                            <button style={{
                                                padding: "0",
                                                width: "100%",
                                                background: "rgba(51, 158, 172, 0.9)", color: "#ffffff",
                                                border: "none", borderRadius: "2.25vh", fontSize: "2.5vh", height: "5vh"
                                            }}
                                            >판매하러 가기</button>
                                        </Link>
                                    </Row>
                                </div>
                            </div>
                        } {/* 판매상품 없을 때 뷰 끝 */}
                    </Card>
        </Row>
    );
}