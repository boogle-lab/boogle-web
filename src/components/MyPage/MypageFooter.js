import React, { useState, useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import { Row, Col, Icon, Card, Modal, Popconfirm, Collapse, message } from "antd";

export default function MypageFooter() {
    return(
        <Row style={{ textAlign: "center" }}>
            <div style={{backgroundColor : "#F5F5F5", height : "20px", width : "100%"}}></div>
                <div style={{backgroundColor: "white", padding: "10px"}}>
                    <Row style={{marginBottom : "10px", color: "#666666", fontSize: "14px"}}>
                        <Col xs={{span : 24}}>
                            <Row>카카오톡 플러스 친구 '북을'을 검색한 후 문의하시면</Row>
                            <Row>더욱 신속한 답변을 받을 수 있습니다!</Row>
                        </Col>
                    </Row>
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={{span : 24}}>
                            <small>
                                <a style={{color : "orange", textDecoration : "underline"}} href="http://pf.kakao.com/_xnlmlxb">카카오톡 플러스친구 '북을'</a>
                            </small>
                        </Col>
                    </Row>
                    <Row style={{marginBottom : "10px"}}>
                        <Col xs={{span : 2, offset : 5}}>
                            <img
                                style={{ width: "80%", height: "auto"}}
                                src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/logo_gray.png"
                            ></img></Col>
                        <Col xs={{span : 10, offset : 1}} style={{color: "#666666"}}><small>캠퍼스 거래의 모든 것, 북을</small></Col>
                    </Row>
                </div>
            <div style={{backgroundColor : "#F5F5F5", height : "20px", width : "100%"}}></div>
        </Row>
    );
}