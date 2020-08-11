import * as $ from "jquery";
import Post from "@model/Post";
import "@/styles/styles";
import "@/styles/less";
import "@/styles/scss";
import json from "@/assets/json";
import Xml from "@/assets/data";
import Logo from "@/assets/logo";
import Csv from "@/assets/data";
import "./babel";
import React from "react";
import { render } from "react-dom";

const post = new Post("Webpack post title", Logo);

$("pre").html(post.toString());
const App = () => (
    <div className="container">
        <h1>Webpack Course</h1>
        <hr />
            <div className="logo"></div>
            <hr />
            <pre className="code" />
            <hr />
            <div className="box">
                <h2>Less</h2>
            </div>
            <div className="card">
                <h2>Scss</h2>
            </div>
    </div>
)
render(<App />, document.getElementById("app"));
console.log(post.toString());
console.log("JSON:", json);
console.log("XML:", Xml);
console.log("CSV:", Csv);