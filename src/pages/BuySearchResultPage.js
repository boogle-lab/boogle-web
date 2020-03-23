import React, { Component } from "react";
import { render } from "react-dom";
import Subject from "../components/DetailSubject/Subject";
import BuySearchResult from "../components/Buy/BuySearchResult";

function BuySearchResultPage() {
    return (
        <section id="buySearchResult">
            <BuySearchResult></BuySearchResult>
        </section>
    );
}

export default BuySearchResultPage;