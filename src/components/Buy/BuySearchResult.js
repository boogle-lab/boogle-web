import React, { useState } from 'react';
import {Modal, Button, Col, Row, Icon, message, Divider} from 'antd';
import './BuySearchResult.css';
import NumberFormat from "react-number-format";
import axios from "axios";
import host from "../../server-settings/ServerApiHost";

export default function BuySearchResult() {

    const [sortType, setSortType] = useState("accuracy");
    const [resdata, setResdata] = useState(null);

    const getAllSearchedBuyItems = async (keyword) => {
            axios.get('http://localhost:8080' + '/naver/bookApi/buy/title?keyword=allList' + "&itemResListSortType=" + sortType +
                "&itemNotRegisteredResListSortType=" + sortType )
                .then((response) => {
                        if(response.data != null){

                            const items = response.data;

                            if(items!= undefined){
                                setResdata(items);
                            }
                        }
                    }
                );
        }

    React.useEffect(() => {
        getAllSearchedBuyItems();
    }, [])

    return (
        <section>
            <div id="buy-search-result-navbar">
            </div>
            <div>
                <Row style={{marginTop : "15px", marginBottom : "25px"}}>
                    <Col offset={1} span={22} style={{height : "40px", borderTop : "1px solid #8d8d8d", borderBottom : "1px solid #8d8d8d"}}>
                        <Row style={{fontSize : "14px", textAlign : "center", padding : "10px 0 10px 0", color : "#707070"}}>
                            <Col onClick={()=>{setSortType("accuracy");}} offset={1} span={4}>
                                <span style={sortType === "accuracy" ? {color : "black"} : null}>정확도순</span>
                            </Col>
                            <Col onClick={()=>{setSortType("regiCount");}} offset={2} span={4}>
                                <span style={sortType === "regiCount" ? {color : "black"} : null}>판매량순</span>
                            </Col>
                            <Col onClick={()=>{setSortType("pubdate");}} offset={2} span={4}>
                                <span style={sortType === "pubdate" ? {color : "black"} : null}>출시일순</span>
                            </Col>
                            <Col onClick={()=>{setSortType("regiPrice");}} offset={2} span={4}>
                                <span style={sortType === "regiPrice" ? {color : "black"} : null}>저가격순</span>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                {
                   resdata!= undefined && resdata != null && resdata.itemResList.map((value, index) => {

                            return (
                                <div>
                                    <Row key={index}>
                                        <Col xs={{span: 5, offset: 1}}>
                                            <img style={{
                                                width: "100px", height: "150px", backgroundSize: "contain",
                                                borderRadius: "7px"
                                            }}
                                                 src={resdata != null ? value.imageUrl.replace("type=m1", "") : ""}></img>
                                        </Col>
                                        <Col xs={{span: 14, offset: 3}}>
                                            <Row>
                                                <Col xs={{span: 24}}>
                                      <span style={{
                                          color: "#656565",
                                          fontSize: "17px"
                                      }}>{resdata != null ? value.title.replace(/(<([^>]+)>)/ig, "") : null}</span>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col style={{marginTop: "10px", marginBottom: "-9px"}} xs={{span: 24}}>
                                                    <small style={{color: "#656565", fontSize: "12px", fontWeight: "400"}}>
                                                        저자 : {resdata != null ? value.author.replace(/(<([^>]+)>)/ig, "") : null}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={{span: 24}}>
                                                    <small style={{color: "#656565", fontSize: "12px", fontWeight: "400"}}>
                                                        출판사
                                                        : {resdata != null ? value.publisher.replace(/(<([^>]+)>)/ig, "") : null}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col style={{}} xs={{span: 24}}>
                                                    <small style={{color: "#656565", fontSize: "12px"}}>
                                                        {resdata != null && value.regiCount !== 0 ? "재고 : " + value.regiCount + "부"
                                                            : resdata != null && value.regiCount === 0 ? "재고 : 재고 없음"
                                                                : null}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row style={{marginTop: "3.5vh"}}>
                                                <Col style={{marginBottom: "-0.2vh"}} xs={{span: 24}}>
                                                    <small style={{color: "#656565", fontSize: "13px", textDecoration: "line-through"}}>
                                                        {resdata != null ? "정가 : " : null}
                                                        {resdata != null ?
                                                            <NumberFormat value={value.price} displayType={'text'}
                                                                          thousandSeparator={true}/>
                                                            : null}
                                                        {resdata != null ? "원" : null}
                                                    </small>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xs={{span: 24}}>
                                                    <small style={{color: "#656565", fontSize: "15px", fontWeight: "500"}}>
                                                        {resdata != null && value.regiPrice !== "" ? "북을 판매가  : " : null}
                                                        {resdata != null ?
                                                            <small style={{color: "rgba(51, 158, 172, 0.9)", fontSize: "15px"}}>
                                                                <NumberFormat value={value.regiPrice} displayType={'text'}
                                                                              thousandSeparator={true}/>
                                                            </small>
                                                            : null}
                                                        {resdata != null && value.regiPrice !== "" ?
                                                            <small
                                                                style={{color: "rgba(51, 158, 172, 0.9)", fontSize: "2.3vh"}}>원~</small> :
                                                            null}
                                                    </small>
                                                </Col>
                                            </Row>

                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col offset={1} span={22}><Divider/></Col>
                                    </Row>
                                </div>
                            );
                        }
                    )
                }
            </div>
        </section>
    );
}