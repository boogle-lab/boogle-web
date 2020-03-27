import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Icon, Card, Modal, Popconfirm, Collapse, message } from "antd";
import axios from 'axios';
import './MyPageBanner.css';
import { useForm } from 'react-hook-form';

import host from '../../server-settings/ServerApiHost';

export default function LikeComponent(props) {
    const [likeList, setLikeList] = useState([]);
    const [modal, setModal] = useState(false);
    const [needRender, setNeedRender] = useState(false);
    const { register, handleSubmit } = useForm();
    const [isSignIn, setIsSignIn] = useState(false);

    const onSubmit = data => {
    };

    const sendName = (name) => {
        props.getName(name);
    }

    useEffect(() => {
        getMyPage();
    }, []);

    useEffect(() => {
        if(needRender) {
            getMyPage();
            setNeedRender(false)
        }
    }, [needRender]);

    const showModal = e => {
        setModal(true);
    }

    const closeModal = e => {
        setModal(false);
    }

    const getMyPage = () => {
        axios.get(host + '/myPage', {
            headers: { Authorization: localStorage.getItem('token') }
        })
            .then((response) => {
                if (response.data.status === 200){
                    setLikeList(response.data.data.bookmarkedItemList)
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

    return(
        <Row id="user-product"
        style={{ marginTop: "24px", height: "auto", textAlign: "center" }}>
           <Card style={{ width: "100%", height: "auto", backgroundColor: "#ffffff", border: 0, paddingBottom: "5vh" }}>
               {likeList.length !== 0 ?
                   <div>
                       <Row style={{margin: "auto auto", marginTop: "-1px", marginBottom: "2vh"}}>
                           {likeList.map((value, index) => (

                               <Col span={10} offset={0}
                                    style={{width: "20vw", margin: "auto auto", marginLeft: "7vw"}}>
                                   <Row>
                                       <Col span={24}>
                                           <Link to = {'/buy/detail/'+value.sellItemId}>
                                               <img style={{
                                                   width: "18vw", height: "25vw", backgroundSize: "contain", borderRadius: "7px" }}
                                                    src={value.imageUrl}></img>
                                           </Link>
                                       </Col>
                                   </Row>
                                   <Row>
                                       <Link to = {'/buy/detail/'+value.sellItemId}>
                                       <Col span={24}>
                                           <label style={{ color: "rgba(0,0,0,.65)", marginTop: "7px", marginBottom: "3px", fontSize: "12px" }}>
                                               {value.title}</label>
                                       </Col>
                                       </Link>
                                   </Row>
                                   <Row>
                                       <Col span={24} style={{ marginBottom: "23px" }}>
                                           <label style={{ fontSize: "12px", color: "rgba(51, 158, 172, 0.9)" }}>{value.regiPrice}원</label>
                                       </Col>
                                   </Row>
                               </Col>

                           ))}
                       </Row>
                       <Row>
                           <Link to="/">
                               <button style={{
                                   padding: "0",
                                   width: "100%",
                                   background: "rgba(51, 158, 172, 0.9)", color: "#ffffff",
                                   border: "none", borderRadius: "2.25vh", fontSize: "2.5vh", height: "5vh"
                               }}
                               >더 담으러 가기</button>
                           </Link>
                       </Row>
                   </div>
                   :
                   <div>
                       <Row style={{ padding: "2vh", margin: "2vh", marginBottom: "45%" }}>
                           <p style={{ color: "#000000", fontSize: "15px" }}>관심상품이 없습니다.</p>
                       </Row>
                       <Row>
                           <Link to="/">
                               <button style={{
                                   padding: "0",
                                   width: "100%",
                                   background: "rgba(51, 158, 172, 0.9)", color: "#ffffff",
                                   border: "none", borderRadius: "2.25vh", fontSize: "2.5vh", height: "5vh"
                               }}
                               >더 담으러 가기</button>
                           </Link>
                       </Row>
                   </div>
               }
           </Card>
        </Row>
    );

}