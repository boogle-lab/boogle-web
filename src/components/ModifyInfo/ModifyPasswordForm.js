import React, { useState } from "react";
import { useForm, ErrorMessage } from "react-hook-form";
import {Link, Redirect, useHistory} from "react-router-dom";
import {Row, Col, Divider, message} from "antd";
import axios from "axios";

import host from '../../server-settings/ServerApiHost';

export default function ModifyPasswordForm(props) {
    const { register, handleSubmit, errors } = useForm();
    const [email, setEmail] = useState("");
    const [validatedEmail, setValidatedEmail] = useState(true);
    const [validatedUser, setValidatedUser] = useState(false);
    const [validatedNickname, setValidatedNickname] = useState(true);
    const [validatedMajor, setValidatedMajor] = useState(false);
    const [password, setPassword] = useState(0);
    const [confirmPassword, setConfirmPassword] = useState(0);
    const [postPassword, setPostPassword] = useState("")

    const onSubmitForm = () => {
        changePassword();
    }

    const validateEmail = async (email) => {
        if (email != undefined) {
            axios.get(host + '/users/signup/validateEmail?email=' + email)
                .then((response) => {

                    if (response.data.status == 200 && validatedEmail == true) {
                        setValidatedEmail(false)
                    }
                    else if (response.data.status == 404 && validatedEmail == false) {
                        setValidatedEmail(true)
                    }
                });
        }
    }

    const checkUserValidation = async (email, password) => {
        if (email != undefined) {
            axios.post(host + '/users/signin', {
                email : email,
                password : password
            })
                .then((response) => {

                    if (response.data.status == 200) {
                        setValidatedUser(true)
                    }
                    else{
                        setValidatedUser(false)
                    }
                });
        }
    }

    const changePassword = async () => {
        if (email != undefined && password != undefined && postPassword != undefined && validatedUser) {
            axios.post(host + '/users/modification/password', {
                email : email,
                password : password,
                postPassword : postPassword
            })
                .then((response) => {

                    if (response.data.status === 201) {
                        localStorage.removeItem('token');
                        message.success("비밀번호가 변경되었습니다.");
                        setTimeout(() => {
                            goToSignIn();
                        }, 1500);
                    }
                    else{
                    }
                });
        }
    }

    const history = useHistory();
    const goToSignIn = () => {
        history.push('/signin');
    };


    return (
        <div
            style={{
                height: "100vh",
                backgroundSize: "cover",
            }}
        >
            <Row
                style={{
                    height : "70px",
                    padding : "20px 0px 10px 0px",
                    background:
                        "url(https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/background.png)",
                }}
            >
                <Col xs={{ span: 3 }}>
                    <Link to="/setting">
                        <img
                            style={{
                                width: "32px",
                                height: "auto",
                                marginLeft: "40%",
                                filter: "brightness(0) invert(1)"
                            }}
                            src="https://project-youngwoo.s3.ap-northeast-2.amazonaws.com/left_arrow.png"
                            onClick={<div></div>}
                        />
                    </Link>
                </Col>
                <Col xs={{ span: 11, offset: 4 }}>
                    <h5 style={{ color: "white", textAlign : "center" }}>비밀번호 변경</h5>
                </Col>
            </Row>
            <form onSubmit={handleSubmit(onSubmitForm)}>
                <div>
                    <Row style={{marginTop : "30px"}}>
                        <Col xs={{span: 8, offset: 2}}>
                            <span style={{color: "rgba(51, 158, 172, 0.9)", fontWeight: "800"}}>아이디(이메일)</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{marginTop: "0px", marginBottom: "20px"}} xs={{span: 20, offset: 2}}>
                            <input
                                style={{
                                    width: "100%", height: "40px", border: "none",
                                    borderBottom: "#44a0ac solid 1.0px",
                                    backgroundColor: "transparent"
                                }}
                                name="email" placeholder="이메일"
                                ref={register({
                                    required: '이메일을 입력해주세요.',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                        message: "이메일의 형태로 입력해주세요."
                                    }
                                })}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    validateEmail(e.target.value);
                                }}/>
                            {validatedEmail && email.length > 0 && <p style={{marginBottom: "-10px", fontSize: "12px"}}>가입되지 않은 이메일입니다.</p>}
                            {!validatedEmail && email.length > 0 && <p style={{marginBottom: "-10px", fontSize: "12px", color : "#44a0ac"}}>가입된 이메일입니다.</p>}
                            <ErrorMessage style={{marginBottom: "-10px", fontSize: "12px"}} errors={errors} name="email"
                                          as="p"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{span: 8, offset: 2}}>
                            <span style={{color: "rgba(51, 158, 172, 0.9)", fontWeight: "800"}}>비밀번호</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{marginTop: "0px", marginBottom: "20px"}} xs={{span: 20, offset: 2}}>
                            <input
                                style={{
                                    width: "100%", height: "40px", border: "none",
                                    borderBottom: "#44a0ac solid 1.0px",
                                    backgroundColor: "transparent"
                                }}
                                name="password" placeholder="비밀번호" ref={register({
                                required: "비밀번호를 입력해주세요."
                            })}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    checkUserValidation(email, e.target.value);
                                }}
                                type="password"/>
                            {password.length > 0 && !validatedUser &&
                            <p style={{marginBottom: "-10px", fontSize: "12px"}}>유효하지 않은 비밀번호 입니다.</p>}
                            {password.length > 0 && validatedUser &&
                            <p style={{marginBottom: "-10px", fontSize: "12px", color : "#44a0ac"}}>유효한 비밀번호 입니다.</p>}
                            <ErrorMessage style={{marginBottom: "-10px", fontSize: "12px"}} errors={errors}
                                          name="password" as="p"/>
                            <ErrorMessage style={{marginBottom: "-10px", fontSize: "12px"}} errors={errors}
                                          name="password" as="p"/>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{span: 8, offset: 2}}>
                            <span style={{color: "rgba(51, 158, 172, 0.9)", fontWeight: "800"}}>비밀번호 확인</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{marginTop: "0px", marginBottom: "20px"}} xs={{span: 20, offset: 2}}>
                            <input
                                style={{
                                    width: "100%", height: "40px", border: "none",
                                    borderBottom: "#44a0ac solid 1.0px",
                                    backgroundColor: "transparent"
                                }}
                                name="confirmPassword" placeholder="비밀번호 확인" ref={register({
                                required: "비밀번호를 입력해주세요.",
                            })}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                }}
                                type="password"/>
                            {confirmPassword !== password && confirmPassword.length > 0 &&
                            <p style={{marginBottom: "-10px", fontSize: "12px"}}>비밀번호가 일치하지 않습니다.</p>}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={{span: 8, offset: 2}}>
                            <span style={{color: "rgba(51, 158, 172, 0.9)", fontWeight: "800"}}>변경할 비밀번호</span>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{marginTop: "0px", marginBottom: "20px"}} xs={{span: 20, offset: 2}}>
                            <input
                                style={{
                                    width: "100%", height: "40px", border: "none",
                                    borderBottom: "#44a0ac solid 1.0px",
                                    backgroundColor: "transparent"
                                }}
                                name="password" placeholder="비밀번호" ref={register({
                                required: "비밀번호를 입력해주세요."
                            })}
                                onChange={(e) => {
                                    setPostPassword(e.target.value)
                                }}
                                type="password"/>
                            {postPassword.length < 8 && postPassword.length > 0 && <p style={{ marginBottom: "-10px", fontSize: "12px" }}>8~16자 영문 대 소문자, 숫자, 특수문자를 사용해주세요.</p>}
                            {postPassword.length >= 8 && postPassword.length > 0 && <p style={{ marginBottom: "-10px", fontSize: "12px", color : "#44a0ac"}}>사용 가능한 비밀번호입니다.</p>}
                            <ErrorMessage style={{ marginBottom: "-10px", fontSize: "12px" }} errors={errors} name="postPassword" as="p" />
                        </Col>
                    </Row>
                    <Row style={{ marginBottom: "100px" }}>
                        <Col xs={{ span: 20, offset: 2 }}>
                            <input style={{
                                padding: "0",
                                width: "100%",
                                background: "rgba(51, 158, 172, 0.9)", color: "#ffffff",
                                border: "none", borderRadius: "14px", fontSize: "18px", height: "32px"
                            }}
                                   type="submit" value="비밀번호 변경 완료"
                            />
                        </Col>
                    </Row>
                </div>
            </form>
        </div>
    );
}
