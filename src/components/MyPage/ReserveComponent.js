import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Icon, Card, Modal, Popconfirm, Collapse, message } from "antd";
import axios from 'axios';
import './MyPageBanner.css';
import { useForm } from 'react-hook-form';

import host from '../../server-settings/ServerApiHost';

export default function ReserveComponent() {
    const [reserveList, setReserveList] = useState([]);
    const [modal, setModal] = useState(false);
    const [needRender, setNeedRender] = useState(false);
    const { register, handleSubmit } = useForm();
    const [isSignIn, setIsSignIn] = useState(false);

    const onSubmit = data => {
    };

    useEffect(() => {
        getMyPage();
    }, [])

    useEffect(() => {
        if(needRender) {
            getMyPage();
            setNeedRender(false)
        }
    }, [needRender]);

    const getMyPage = () => {
        axios.get(host + '/itemReceiving' , {
            headers: { Authorization: localStorage.getItem('token') }
        })
            .then((response) => {
                if (response.data.status === 201){
                    setReserveList(response.data.data)
                }
                else { // Fixme : check status code!!
                    window.location.href('/')
                }
            })
            .catch((err) => {
                window.location.href('/')
            })
    }

     // 입고 알림 취소 기능을 위한 메소드
     const cancelReceive = (itemId) => {
        axios.get(host + '/itemReceiving/cancel?itemId=' + itemId, {
            headers: { Authorization: localStorage.getItem('token') }
        })
        .then((response) => {
            if(response.data.status === 201){
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

    const showModal = e => {
        setModal(true);
    }

    const closeModal = e => {
        setModal(false);
    }

    return(
        <Row id="user-product"
        style={{ marginTop: "24px", height: "auto", textAlign: "center" }}>
            <Card style={{ width: "100%", height: "auto", backgroundColor: "#ffffff", border: 0, }}>
                    {reserveList.length !== 0 && reserveList != null ?
                        reserveList.map((value, index) => (
                            <div style={{ width: "95%", margin: "auto auto" }}>
                                <div style={{ width: "100%", margin: "auto auto", padding: "0px" }}>
                                    <Card className = "product-card"
                                          style={{
                                              width: "100%", height: "40%", backgroundColor: "#e0e0e0",
                                              border: "none", borderRadius: "2.25vh", boxShadow: "0px 5px 10px #d3d3d3",
                                              margin: "auto auto", marginBottom: "2vh", padding: "0px",
                                          }}>
                                        <div style={{margin: "-15px"}}>
                                            <Row style={{marginTop: "16px"}}>
                                                <Col span={6} offset={0}>
                                                        <img style={{
                                                            width: "64px", height: "97px", backgroundSize: "contain",
                                                            borderRadius: "7px", overflow: "hidden"
                                                        }} src={value.imageUrl}></img>
                                                </Col>
                                                <Col span={17} offset={0}>
                                                    <Row style={{ fontStyle: "bold", fontSize: "15px", textAlign: "left",
                                                        color: "#656565" }}>
                                                        <Col offset={2}>
                                                            {value.title}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ fontSize: "12px", textAlign: "left", marginTop: "8px", color: "#656565", }}>
                                                        <Col span={24} offset={2}>작가 : {value.author}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ fontSize: "12px", textAlign: "left", marginTop: "8px", color: "#656565", }}>
                                                        <Col span={24} offset={2}>출판사 : {value.publisher}
                                                        </Col>
                                                    </Row>
                                                    <Row style={{ fontSize: "15px", color: "#959595", marginTop: "17px" }}>
                                                        <Col span={10} offset={2}>
                                                            신청 완료
                                                        </Col>
                                                        <Col span={10} offset={2}>
                                                            <button style={{
                                                            padding: "0",
                                                            width: "52px",
                                                            height: "21px",
                                                            background: "#959595", color: "#ffffff",
                                                            border: "none", borderRadius: "5px", fontSize: "10px",
                                                            marginTop: "4px"
                                                            }} onClick={() => { cancelReceive(value.itemId); }}
                                                            >신청 취소</button>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        ))
                        :  /*입고알림 없을 때*/
                        <div>
                            <div>
                                <Row style={{ padding: "2vh", margin: "2vh", marginBottom: "45%" }}>
                                    <p style={{ color: "#000000", fontSize: "15px" }}>
                                        입고알림 신청한 책이 없습니다.</p>
                                </Row>
                                <Row>
                                    <Link to="/">
                                        <button style={{
                                            padding: "0",
                                            width: "100%",
                                            background: "rgba(51, 158, 172, 0.9)", color: "#ffffff",
                                            border: "none", borderRadius: "2.25vh", fontSize: "2.5vh", height: "5vh"
                                        }}
                                        >검색하러 가기</button>
                                    </Link>
                                </Row>
                            </div>
                        </div>
                    } {/* 입고신청 없을 때 뷰 끝 */}
                </Card>
        </Row>
    );
}