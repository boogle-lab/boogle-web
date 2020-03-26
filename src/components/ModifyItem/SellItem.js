import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Row, Col, Icon, Divider, Modal, message } from 'antd';
import { Link } from "react-router-dom";
import { BeatLoader } from "react-spinners";

import host from '../../server-settings/ServerApiHost';

import axios from 'axios';
import './SellItem.css';
import '../SignUp/SignUpForm.css';
import Footer from "../Footer/Footer";

export default function SellItem() {
    ///////////////////////state 변수////////////////////////////////////////////////////////////////////////
    
    const [step, setStep] = useState(1);
    const [contactType, setContactType] = useState(0);
    const [needRender, setNeedRender] = useState(false);

    // image 관련
    const [userImages, setUserImages] = useState([]);
    const [imageDiv, setImageDiv] = useState();
    const [modal, setModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [imageFileList, setImageFileList] = useState([]);

    // submit
    const [isFinalSubmit, setIsFinalSubmit] = useState(false);

    // 상품 정보 관련
    const [itemId, setItemId] = useState("");
    const [title, setTitle] = useState("");
    const [author, setAuthor] = useState("");
    const [publisher, setPublisher] = useState("");
    const [pubdate, setPubdate] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [price, setPrice] = useState("");
    const [originalPrice, setOriginalPrice] = useState("");
    const [regiImageUrlList, setRegiImageUrlList] = useState([]);
    const [dealType, setDealType] = useState(1);
    const [qualityGeneral, setQualityGeneral] = useState("CLEAN");
    const [qualityExtraList, setQualityExtraList] = [false, false, false, false, false, false, false, false];
    const [regiTime, setRegiTime] = useState("");
    const [comment, setComment] = useState("");
    const [sellerBankAccountId, setSellerBankAccountId] = useState("");
    const [subject, setSubject] = useState("");
    const [professor, setProfessor] = useState("");

    // bank account 관련
    const [userBankAccountList, setUserBankAccountList] = useState([]);
    const [bankList, setBankList] = useState([]);
    const [selectedBankAccountId, setSelectedBankAccountId] = useState("")
    const [selectedUserBankAccount, setSelectedUserBankAccount] = useState(null);
    const [clickedAddUserAccount, setClickedAddUserAccount] = useState(false);

    // 과목 검색 관련
    const [subjectList, setSubjectList] = useState([]);
    const [subjectKeyword, setSubjectKeyword] = useState("");
    const [isSearchSubjectModalOpened, setIsSearchSubjectModalOpened] = useState(false);

    // form 관련
    const { register, handleSubmit } = useForm();


    ///////////////////////렌더링 처리////////////////////////////////////////////////////////////////////////
    React.useEffect(() => {
        getUserBankAccount();
        getBankInfo();
        const id = window.location.pathname.substring(12);
        getItemInfo(id);
    }, [])

    // React.useEffect(() => {
    //     if(needRender){
    //         viewRegiImage(regiImageUrlList);
    //         setNeedRender(false);
    //     }
    // }, [needRender])

    React.useEffect(() => { // 등록된 사진 띄우는 템플릿
        setImageDiv(regiImageUrlList.map((i, index) => (
            <Col xs={{ span: 4, offset: 1 }}>
                <div
                    style={{
                        border: "#44a0ac 1px solid",
                        height: "65px", width: "65px",
                        position: "relative", borderRadius: "10px",
                        top: "50%", left: "50%"
                    }}>
                    <Icon type="close-circle"
                          style={{ color: "rgba(51, 158, 172, 0.9)", margin: "auto", position : "relative",
                              left : 45, top : -5, zIndex : 100 }}
                          onClick={() => {
                              let currImageUrls = regiImageUrlList;
                              currImageUrls.splice(index, 1);
                              setRegiImageUrlList(currImageUrls);
                          }}>
                    </Icon>
                    <img style={{
                        width: "100%", height: "100%",
                        position: "absolute",
                        top: "0", left: "0",
                        objectFit: "contain"
                    }} src={i}
                    />
                </div>
            </Col>
        )));
    }, [regiImageUrlList])

    React.useEffect(() => {

        // if (didMount) {
            // saveSellItem(sellItem, imageFileList)
        // }

    }, [imageFileList])


    ///////////////////////함수 정의////////////////////////////////////////////////////////////////////////
    
    // modal handler
    const showModal = e => {
        setModal(true);
    };
    const closeModal = e => {
        setModal(false);
    };


    // const viewRegiImage = (list) => { // 등록된 사진 띄우는 템플릿
    //     setImageDiv(list.map((i, index) => (
    //         <Col xs={{ span: 4, offset: 1 }}>
    //             <div
    //                 style={{
    //                     border: "#44a0ac 1px solid",
    //                     height: "65px", width: "65px",
    //                     position: "relative", borderRadius: "10px",
    //                     top: "50%", left: "50%"
    //                 }}>
    //                 <Icon type="close-circle"
    //                       style={{ color: "rgba(51, 158, 172, 0.9)", margin: "auto", position : "relative",
    //                           left : 45, top : -5, zIndex : 100 }}
    //                       onClick={() => {
    //                           let currImageUrls = list;
    //                           currImageUrls.splice(index, 1);
    //                           setRegiImageUrlList(currImageUrls);
    //                           setNeedRender(true);
    //                       }}>
    //                 </Icon>
    //                 <img style={{
    //                     width: "100%", height: "100%",
    //                     position: "absolute",
    //                     top: "0", left: "0",
    //                     objectFit: "contain"
    //                 }} src={i}
    //                 />
    //             </div>
    //         </Col>
    //     )));
    // }


    // Form submit 함수
    const onSubmit = (data) => {

        if (isFinalSubmit) {

            console.log(selectedBankAccountId);
            console.log(subject);
            console.log(professor);
            console.log(dealType);
            console.log(regiImageUrlList);
            console.log(qualityGeneral);
            console.log(originalPrice);
            console.log(comment);

        }
    };

    // form input 서버 통신 함수
    const saveSellItem = (sellItem, imageFileList) => {

        setStep(2);

        setTimeout(() => {
            setStep(3);
        }, 3000);

        let form = new FormData();
        form.append('sellItemString', JSON.stringify(sellItem));

        imageFileList.forEach(i => {
            form.append("imageFileList", i);
        });

        axios.post(host + '/sell', form, {

            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': localStorage.getItem('token') != null ?
                    localStorage.getItem('token') : ""
            }
        })
            .then((response) => {
            })
            .catch((error) => {
            })
    }

    // 계좌 정보 조회 서버 통신 함수
    const getUserBankAccount = (itemId) => {
        axios.get(host + '/userBankAccount/sell', {
            headers: { Authorization: localStorage.getItem('token') }
        })
            .then((response) => {
                if(response.data.data.length > 0){
                    setUserBankAccountList(response.data.data);
                    setSelectedUserBankAccount(response.data.data[0].userBankAccount);
                }
            });
    }

    // 은행 리스트 조회 서버 통신 함수
    const getBankInfo = () => {
        axios.get(host + '/bank')
            .then((response) => {
                setBankList(response.data.data);
            });
    }

    // 계좌 등록 함수
    const onUserBankAccountSubmit = data => {
        const newAcc = {
            bankId: selectedBankAccountId,
            accountNumber: data.accountNumber,
            depositorName: data.depositorName
        };
        sendNewAcc(newAcc);
    };

    // 계좌 등록 서버 통신 함수
    const sendNewAcc = async data => {
        axios
            .post(host + "/userBankAccount", data, {
                headers: { Authorization: localStorage.getItem('token') }
            })
            .then(res => {
                getUserBankAccount();
                closeModal();
            });
    };

    // 과목 검색 서버 통신 함수
    const searchSubject = (keyword) => {
        axios.get(host + '/subject?campus=서강대학교&keyword=' + keyword +'&year=2020&semester=1', {
        })
            .then((response) => {
                setSubjectList(response.data.data);
            })
            .catch((error) => {
            })
    }

    // 기존 정보 조회 서버 통신 함수
    const getItemInfo = (id) => {
        const authToken = localStorage.token;
        axios.get(host + `/sell/detail?id=${id}`, {
            headers: { Authorization: authToken }
          })
        .then((data) => {
            const res = data.data.data.sellItem;
            if(data.data.status === 200){
                setItemId(res.itemId);
                setTitle(res.title);
                setAuthor(res.author);
                setPublisher(res.publisher);
                setPubdate(res.pubdate);
                setImageUrl(res.imageUrl);
                setPrice(res.price);
                setOriginalPrice(res.originalPrice);
                setRegiImageUrlList(res.regiImageUrlList);
                setDealType(res.dealType);
                setQualityGeneral(res.qualityGeneral);
                setRegiTime(res.regiTime);
                setComment(res.comment);
                setSelectedBankAccountId(res.sellerBankAccountId);
                setSubject(res.subject);
                setProfessor(res.professor);

                setImageFileList(res.regiImageUrlList);

                // viewRegiImage(res.regiImageUrlList);

                setQualityExtraList(res.qualityExtraList); // error 위치
            }
        })
        .catch((error) => {
            console.log("error occured")
        })
        
    }


    ///////////////////////컴포넌트 리턴////////////////////////////////////////////////////////////////////////
    return (
        <section id="register-container">
        {
                step === 1 ?
                    <div>
                        <Row style={{ marginTop: "30px", marginBottom: "30px"}}>
                            <Col xs={{ span: 2, offset: 1 }}>
                                <Link to="/">
                                    <img style={{
                                        width: "32px",
                                        height: "auto",
                                        marginLeft: "40%",
                                    }}
                                         src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/left_arrow.png" />
                                </Link>
                            </Col>
                            <Col style={{ textAlign: "center", padding: "auto" }} xs={{ offset: 5, span: 8 }}>
                                <h5 style={{ color: "#707070" }}>판매하기</h5>
                            </Col>
                            <Col xs={{ span: 8 }}>
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={{ span: 6, offset: 9 }}>
                                <img
                                    style={{
                                        width: "100px", height: "150px", backgroundSize: "contain",
                                        borderRadius: "7px"
                                    }}
                                    src={imageUrl.replace("type=m1", "")}></img>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={2} span={20}>
                                <Divider />
                            </Col>
                        </Row>
                        <Row>
                            <Col xs={{ span: 4, offset: 2 }}>
                                <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>도서명</span>
                            </Col>
                        </Row>
                        <form onSubmit={handleSubmit(onSubmit)} enctype="multipart/form-data">
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 20, offset: 2 }} >

                                    <input
                                        readOnly
                                        style={{ width: "100%", height : "40px", border: "none", borderBottom: "rgba(51, 158, 172, 0.9) solid 2px" }}
                                        name="title" ref={register}
                                        value={title.replace(/(<([^>]+)>)/ig, "")} />
                                </Col>
                            </Row >
                            <Row>
                                <Col xs={{ span: 4, offset: 2 }}>
                                    <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>저자</span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 20, offset: 2 }} >
                                    <input
                                        readOnly
                                        style={{ width: "100%", height : "40px", border: "none", borderBottom: "rgba(51, 158, 172, 0.9) solid 2px" }}
                                        name="author" ref={register}
                                        value={author.replace(/(<([^>]+)>)/ig, "")} />
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={{ span: 4, offset: 2 }}>
                                    <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>출판사</span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 20, offset: 2 }} >
                                    <input
                                        readOnly
                                        style={{ width: "100%", height : "40px", border: "none", borderBottom: "rgba(51, 158, 172, 0.9) solid 2px" }}
                                        name="publisher" ref={register}
                                        value={publisher.replace(/(<([^>]+)>)/ig, "")} />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 9, offset: 2 }}>
                                    <Row>
                                        <Col xs={{ span: 24 }}>
                                            <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>출판일</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={{ span: 24 }} >
                                            <input
                                                readOnly
                                                style={{ width: "100%", height : "40px", border: "none", borderBottom: "rgba(51, 158, 172, 0.9) solid 2px" }}
                                                name="pubdate" ref={register}
                                                value={pubdate.toString().substring(0, 4) + "년 " +
                                                pubdate.toString().substring(4, 6) + "월"} />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col xs={{ span: 9, offset: 2 }}>
                                    <Row>
                                        <Col xs={{ span: 24 }}>
                                            <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>정가</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xs={{ span: 24 }} >
                                            <input
                                                readOnly
                                                style={{ width: "100%", height : "40px", border: "none", borderBottom: "rgba(51, 158, 172, 0.9) solid 2px" }}
                                                name="price" ref={register}
                                                value={price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " 원"} />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 5, offset: 2 }}>
                                    <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>거래방식<span style={{color : "#e95513"}}>*</span></span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 10, offset: 2 }}>
                                    <button
                                        class={dealType === 1 ? "register-button-active" : "register-button"}
                                        style={{
                                            width: "100%",
                                            color: "#666666",
                                            border: "#666666 0.3px solid",
                                            borderRight : "none",
                                            borderTopLeftRadius: "8px",
                                            borderBottomLeftRadius: "8px",
                                            borderTopRightRadius : "0px",
                                            borderBottomRightRadius : "0px",
                                            fontSize: "12px",
                                            height: "36px"
                                        }}
                                        onClick={() => setDealType(1)}
                                        >북을박스</button>
                                </Col>
                                <Col xs={{ span: 10, offset: 0 }}>
                                    <button
                                        class={dealType === 0 ? "register-button-active" : "register-button"}
                                        style={{
                                            width: "100%",
                                            color: "#666666",
                                            border: "#666666 0.3px solid",
                                            borderLeft : "none",
                                            borderTopRightRadius: "8px",
                                            borderBottomRightRadius: "8px",
                                            borderTopLeftRadius : "0px",
                                            borderBottomLeftRadius : "0px",
                                            fontSize: "12px",
                                            height: "36px"
                                        }}
                                        onClick={() => { setDealType(0)}}>직거래</button>
                                </Col>
                            </Row>
                            {
                                dealType === 1 ?
                                    <div>
                                        <Row>
                                            <Col xs={{ span: 5, offset: 2 }}>
                                                <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>계좌선택<span style={{color : "#e95513"}}>*</span></span>
                                            </Col>
                                        </Row>
                                        <Row style={{ marginBottom: "10px" }}>
                                            <Col xs={{ span: 20, offset: 2 }}>
                                                {
                                                    userBankAccountList.length === 0?
                                                        <div>
                                                            {clickedAddUserAccount?
                                                                <div>
                                                                    <select onChange={(e) => {
                                                                        setSelectedBankAccountId(e.target.value)
                                                                    }} name="bankList"
                                                                            style={{
                                                                                padding : "5px",
                                                                                width: "100%", height: "40px", border: "none",
                                                                                borderBottom: "rgba(51, 158, 172, 0.9) solid 2px",
                                                                                backgroundColor: "transparent"
                                                                            }}>
                                                                        {
                                                                            bankList.length > 0 && bankList.map((value, index) => {
                                                                                return <option value={value._id} style={{ width: "100%", border: "rgba(51, 158, 172, 0.9) solid 2px", fontSize: "10px" }} key={index}>
                                                                                    {value.name}</option>
                                                                            })}
                                                                    </select>
                                                                    <form onSubmit={handleSubmit(onUserBankAccountSubmit)}>
                                                                        <Row style={{marginTop : "10px"}}>
                                                                            <Col xs={{ span: 24 }}>
                                                                                <label
                                                                                    style={{
                                                                                        width : "100%",
                                                                                        color: "rgba(51, 158, 172, 0.9)",
                                                                                        fontWeight: "800"
                                                                                    }}
                                                                                >
                                                                                    계좌번호
                                                                                </label>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ marginTop : "-10px", marginBottom: "10px" }}>
                                                                            <Col xs={{ span: 24 }}>
                                                                                <input
                                                                                    style={{
                                                                                        width: "100%",
                                                                                        height: "40px",
                                                                                        border: "none",
                                                                                        borderBottom: "#44a0ac solid 1.0px",
                                                                                        backgroundColor: "transparent",
                                                                                    }}
                                                                                    name="accountNumber"
                                                                                    ref={register({ required: true })}
                                                                                ></input>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row id="ownerName">
                                                                            <Col>
                                                                                <Row>
                                                                                    <Col xs={{ span: 24 }}>
                                                                                        <label
                                                                                            style={{
                                                                                                color: "rgba(51, 158, 172, 0.9)",
                                                                                                fontWeight: "800"
                                                                                            }}
                                                                                        >
                                                                                            예금주
                                                                                        </label>
                                                                                    </Col>
                                                                                </Row>
                                                                                <Row>
                                                                                    <Col style={{ marginTop : "-10px", marginBottom: "10px" }} xs={{ span: 24 }}>
                                                                                        <input
                                                                                            style={{
                                                                                                width: "100%",
                                                                                                height: "40px",
                                                                                                border: "none",
                                                                                                borderBottom: "#44a0ac solid 1.0px",
                                                                                                backgroundColor: "transparent",
                                                                                            }}
                                                                                            xs={{ span: 20, offset: 2 }}
                                                                                            name="depositorName"
                                                                                            ref={register({ required: true })}
                                                                                        ></input>
                                                                                    </Col>
                                                                                </Row>
                                                                            </Col>
                                                                        </Row>
                                                                        <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
                                                                            <Col xs={{ span : 24 }}>
                                                                                <input
                                                                                    style={{
                                                                                        padding: "0",
                                                                                        width: "100%",
                                                                                        background: "rgba(51, 158, 172, 0.9)",
                                                                                        color: "#ffffff",
                                                                                        border: "none",
                                                                                        fontSize: "15px", height: "35px",
                                                                                        borderRadius : "16px"
                                                                                    }}
                                                                                    type="submit"
                                                                                    onClick={() => {
                                                                                    }}
                                                                                    value="계좌 등록하기"
                                                                                />
                                                                            </Col>
                                                                        </Row>
                                                                    </form>
                                                                </div>
                                                                :
                                                                <div>
                                                                    <button style={{
                                                                        padding: "0",
                                                                        width: "100%",
                                                                        background: "rgba(51, 158, 172, 0.9)", color: "#ffffff",
                                                                        border: "none", borderRadius: "14px", fontSize: "18px", height: "32px"
                                                                    }}
                                                                            onClick={() => {setClickedAddUserAccount(true)}}>
                                                                        <span>계좌 등록하기</span>
                                                                    </button>
                                                                </div>}
                                                        </div>
                                                        :
                                                        <select onChange={(e) => {
                                                            setSelectedUserBankAccount(e.target.value);
                                                        }}
                                                                value = {selectedUserBankAccount}
                                                                name="semester"
                                                                style={{
                                                                    padding : "5px",
                                                                    width: "100%", height: "40px", border: "none",
                                                                    borderBottom: "rgba(51, 158, 172, 0.9) solid 2px",
                                                                    backgroundColor: "transparent"
                                                                }}>
                                                            {
                                                                userBankAccountList.length > 0 && userBankAccountList.map((value, index) => {
                                                                    return <option value={value} style={{ width: "100%", border: "rgba(51, 158, 172, 0.9) solid 2px", fontSize: "10px" }} key={index}>
                                                                        {value.userBankAccount.accountNumber + " (" + value.bankName + ")"}</option>
                                                                })}
                                                        </select>
                                                }

                                            </Col>
                                        </Row>
                                    </div>
                                    : null

                            }

                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 22, offset: 2 }}>
                                    <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>사진(최대 3장)<span style={{color : "#e95513"}}>*</span></span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 2, offset: 2 }}>
                                    <input id="selectedFile" type="file" accept="image/*;capture=camera"
                                           onChange={(e) => {

                                               if(userImages.length < 3){

                                                   const file = e.target.files[0];
                                                   setUserImages(userImages => [...userImages, file]);

                                                   let reader = new FileReader();

                                                   reader.onloadend = () => {
                                                       setRegiImageUrlList(RegiImageUrlList => [...regiImageUrlList, reader.result])
                                                   }

                                                   reader.readAsDataURL(file);

                                                  
                                               }
                                           }}
                                           style={{ display: "none" }}
                                    />
                                    <div onClick={() => {
                                        if(userImages.length < 3)
                                            document.getElementById('selectedFile').click()
                                    }}
                                         style={{
                                             border: "#44a0ac 1px solid",
                                             height: "65px", width: "65px",
                                             position: "relative", borderRadius: "10px"
                                         }}>
                                        <Icon type="camera"
                                              style={{
                                                  fontSize: "5vh", position: "absolute",
                                                  textAlign: "center", width: "100%", transform: "translate(-50%, -50%)",
                                                  top: "50%", left: "50%", color: "#44a0ac"
                                              }} />
                                    </div>
                                </Col>
                                {imageDiv !== undefined ? imageDiv : null}
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 20, offset: 2 }}>
                                    <Row>
                                        <Col xs={{ span: 24 }}>
                                            <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>과목/교수</span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col  xs={{ span: 24 }} >
                                            <input
                                                onClick={() => {setIsSearchSubjectModalOpened(true)}}
                                                readOnly
                                                style={{ width: "100%", height : "40px", border: "none", borderBottom: "rgba(51, 158, 172, 0.9) solid 2px" }}
                                                name="pubdate" ref={register}
                                                value={subject === ""? "" : subject + " / " + professor} />
                                            <Icon onClick={() => {setIsSearchSubjectModalOpened(true)}} className="major-search-button" type="search" theme="outlined"

                                                  style={{ color: "rgba(51, 158, 172, 0.9)", margin: "auto" }}

                                                  ></Icon>
                                            <Modal
                                                className="search-form"
                                                title="과목 검색"
                                                visible={isSearchSubjectModalOpened}
                                                onCancel={() => { setIsSearchSubjectModalOpened(false) }}
                                                footer={null}
                                                destroyOnClose={true}>

                                                <Row>
                                                    <Col xs={{ span: 24, offset: 0 }}>
                                                        <input
                                                            className="subject-search-input" type="text"
                                                            onChange={(e) => { setSubjectKeyword(e.target.value) }}
                                                            placeholder="과목명 또는 교수명을 입력해주세요."
                                                            onKeyPress={(e) => {
                                                                if (e.key == 'Enter') {
                                                                    e.preventDefault();
                                                                    e.target.blur();
                                                                }
                                                            }}
                                                        />
                                                        <Icon className="major-search-input-button" type="search" theme="outlined"
                                                            style={{ color: "#707070", margin: "auto" }}
                                                            onClick={() => {searchSubject(subjectKeyword)}}></Icon>
                                                    </Col>
                                                </Row>
                                                {
                                                    subjectList.length != 0 ?
                                                        subjectList.map((subject) => {
                                                            return (
                                                                <Row style={{ marginTop: "20px" }}>
                                                                    <Col xs={{ span: 24, offset: 0 }}>
                                                                        <div className="subject-search-result">
                                                                        <span
                                                                            style={{fontSize : "12px"}}
                                                                            onClick={() => {
                                                                                subject = subject.replace(" / ", "/");
                                                                                setSubject(subject.split("/")[0])
                                                                                setProfessor(subject.split("/")[1]);
                                                                                setSubjectKeyword("");
                                                                                setSubjectList([]);
                                                                                setIsSearchSubjectModalOpened(false);
                                                                            }} >{subject}</span>
                                                                        </div>

                                                                    </Col>
                                                                </Row>
                                                            );
                                                        })
                                                        : null
                                                }

                                            </Modal>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: "10px" }}>
                                <Col xs={{ span: 20, offset: 2 }}>
                                    <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>책상태(택 1)<span style={{color : "#e95513"}}>*</span></span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 5, offset: 2 }} >
                                    <button
                                        class={qualityGeneral === "CLEAN" ? "register-button-active" : "register-button"}
                                        onClick={() => {
                                            setQualityGeneral("CLEAN");
                                        }}
                                        style={{fontSize : "12px"}}
                                    >깨끗</button>
                                </Col>
                                <Col xs={{ span: 5, offset: 1 }}>
                                    <button
                                        class={qualityGeneral === "ALMOST_CLEAN" ? "register-button-active" : "register-button"}
                                        onClick={() => {
                                            setQualityGeneral("ALMOST_CLEAN");
                                        }}
                                        style={{fontSize : "10px"}}
                                    >대체로 깨끗</button>
                                </Col>
                                <Col xs={{ span: 5, offset: 1 }}>
                                    <button
                                        class={qualityGeneral === "USED" ? "register-button-active" : "register-button"}
                                        onClick={() => {
                                            setQualityGeneral("USED");
                                        }}
                                        style={{fontSize : "10px"}}
                                    >사용감 많음</button>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 16, offset: 2 }}>
                                    <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>기타(중복 선택 가능)</span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                {
                                    [["SCRATCHED_AND_FOLDED", "긁힘"], ["UNDERLINED", "밑줄"], ["SOLVED", "문제 풂"], ["NAME_WRITTEN", "이름 기입"],
                                        ["WET", "젖음"], ["RIPPED", "찢어짐"], ["WRITTEN", "필기"], ["EXTRA", "기타 오염"]]
                                        .map((qualityArr, index) => {
                                            if(index === 0 || index % 3 === 0){
                                                return (
                                                    <Col xs={{ span: 5, offset: 2 }} style={{marginBottom : "5px"}}>
                                                        <button
                                                            class={index < qualityExtraList.length &&
                                                            qualityExtraList[index] === true ? "register-button-active" : "register-button"}
                                                            onClick={() => {
                                                                if(qualityExtraList[index] === true) {
                                                                    let currQualityExtra= qualityExtraList;
                                                                    currQualityExtra[index] = false;
                                                                    setQualityExtraList(currQualityExtra);
                                                                }
                                                                else{
                                                                    let currQualityExtra= qualityExtraList;
                                                                    currQualityExtra[index] = true;
                                                                    setQualityExtraList(currQualityExtra);
                                                                }
                                                            }}
                                                        >{qualityArr[1]}</button>
                                                    </Col>
                                                )
                                            }
                                            return (
                                                <Col xs={{ span: 5, offset: 1 }} style={{marginBottom : "5px"}}>
                                                    <button
                                                        class={index < qualityExtraList.length &&
                                                        qualityExtraList[index] === true ? "register-button-active" : "register-button"}
                                                        onClick={() => {
                                                            if(qualityExtraList[index] === true) {
                                                                let currQualityExtra= qualityExtraList;
                                                                currQualityExtra[index] = false;
                                                                setQualityExtraList(currQualityExtra);
                                                            }
                                                            else{
                                                                let currQualityExtra= qualityExtraList;
                                                                currQualityExtra[index] = true;
                                                                setQualityExtraList(currQualityExtra);
                                                            }
                                                        }}
                                                    >{qualityArr[1]}</button>
                                                </Col>
                                            );
                                        })
                                }
                            </Row>

                            <Row>
                                <Col xs={{ span: 8, offset: 2 }}>
                                    <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>판매 희망가격<span style={{color : "#e95513"}}>*</span></span>
                                </Col>
                            </Row>
                            {
                                (!isSearchSubjectModalOpened && userBankAccountList.length > 0) || (dealType === 0 && !isSearchSubjectModalOpened)  ?
                                    <Row style={{ marginBottom: "10px" }}>
                                        <Col xs={{ span: 10, offset: 2 }} >
                                            <input
                                                value={originalPrice}
                                                onChange={(e) => {
                                                    let value = e.target.value;
                                                    //value = value.replace(/,/g, "")
                                                    //value = value.replace(" 원", "");
                                                    setOriginalPrice(value)
                                                }
                                                } ref={register} 
                                                style={{ width: "100%", height : "6vh", padding : "1.5vh", border: "none", borderBottom: "rgba(51, 158, 172, 0.9) solid 2px" }} />
                                        </Col>
                                    </Row> : null
                            }

                            <Row>
                                <Col xs={{ span: 5, offset: 2 }}>
                                    <span style={{ color: "rgba(51, 158, 172, 0.9)", fontWeight: "800" }}>코멘트<span style={{color : "#e95513"}}>*</span></span>
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "10px" }}>
                                <Col xs={{ span: 20, offset: 2 }} >
                                        <textarea
                                            onChange={(e)=>{setComment(e.target.value)}}
                                            style={{ width: "100%", height: "100px", border: "#656565 solid 0.3px", borderRadius: "5px" }}
                                            name="comment" ref={register} value={comment}
                                            placeholder="예시) 2019년 5월에 구입한 책입니다. OOO교수님 수업 필기가 되어있고, 부록 CD도 함께 있습니다.
                                            주의 : 해당 입력칸에 연락처 등의 개인정보를 기입하지 마세요." />
                                </Col>
                            </Row>
                            <Row style={{ marginBottom: "100px" }}>
                                <Col xs={{ span: 20, offset: 2 }}>
                                    <button style={{
                                        padding: "0",
                                        width: "100%",
                                        background: "rgba(51, 158, 172, 0.9)", color: "#ffffff",
                                        border: "none", borderRadius: "14px", fontSize: "18px", height: "32px"
                                    }}
                                            type="submit"
                                            onClick={()=>{
                                                if( comment === "" || regiImageUrlList.length === 0 ||
                                                        originalPrice === 0 ){
                                                        setModalVisible(true);
                                                    }
                                                    if(dealType === 1){
                                                        if(comment === "" || regiImageUrlList.length === 0 ||
                                                        originalPrice === 0 || selectedUserBankAccount == null){
                                                            setModalVisible(true);
                                                        }
                                                        else{
                                                            setIsFinalSubmit(true);
                                                        }
                                                    }
                                                    else{
                                                        setIsFinalSubmit(true);
                                                    }
                                            }}
                                    >
                                        <span>판매 등록하기</span>
                                    </button>
                                    <Modal
                                        title={null}
                                        footer={null}
                                        visible={modalVisible}
                                        onOk={()=>{setModalVisible(true)}}
                                        onCancel={()=>{setModalVisible(false)}}>
                                        <div>
                                            <span>판매 등록을 위해서 입력 및 선택을</span>
                                        </div>
                                        <div>
                                            <span>필수적으로 진행해주세요.</span>
                                        </div>

                                    </Modal>
                                </Col>
                            </Row>
                        </form>
                    </div>
                    : step === 2 ?
                    <Row style={{padding : "320px 0 320px 0"}}>
                        <Col xs={{ span: 4, offset: 10 }} style={{ padding: "auto" }}>
                            <BeatLoader
                                size={"15px"}
                                color={"#339eac"}
                                loading={true}
                            />
                        </Col>
                    </Row>
                    : step === 3 ?
                        <div>
                            <Row style={{ marginTop: "30px" }}>
                                <Col xs={{ span: 8 }}>
                                </Col>
                                <Col style={{ textAlign: "center", padding: "auto" }} xs={{ span: 8 }}>
                                    <h5 style={{ color: "#707070" }}>구매하기</h5>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={{ offset: 3, span: 18 }} style={{ textAlign: "center", marginTop: "50px" }}>
                                    <img style={{ width: "70%", height: "auto" }}
                                         src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/Group+289%403x.png"></img>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={{ offset: 2, span: 20 }} style={{ textAlign: "center", marginTop: "50px" }}>
                                    <h5 style={{
                                        textAlign: "center", color: "#707070", fontWeight: "400",
                                        fontSize: "17.5px", marginBottom: "30px"
                                    }}>
                                        {title} 등록이 정상적으로 완료 되었습니다.
                                    </h5>
                                    <h5 style={{ textAlign: "center", color: "#707070", fontWeight: "400", fontSize: "17.5px", }}>
                                        이 책을 구매하고자 하는 분이 나타나면 이메일을 통해 알람이 올거에요.
                                    </h5>
                                </Col>
                            </Row>
                            <Row style={{ marginTop : "40px", marginBottom: "100px" }}>
                                <Col xs={{ span: 20, offset: 2 }}>
                                    <Link to="/">
                                        <button style={{
                                            padding: "0",
                                            width: "100%",
                                            background: "rgba(51, 158, 172, 0.9)", color: "#ffffff",
                                            border: "none", borderRadius: "14px",
                                            fontSize: "18px", height: "32px"
                                        }}
                                        >홈으로</button>
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                        : null
        }
    </section>

    )


}