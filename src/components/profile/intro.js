import "./intro.css";
import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { API } from "aws-amplify";
import config from '../../aws-exports';
const { aws_content_delivery_url: cdn } = config

const Intro = () => {
    const [portfolio, setPortfolio] = useState({ name: "", position: "", bio: "", image: "" });
    const { id } = useParams();
    const loadUserData = async () => {
        const data = await API.get("portfolioApi", `/portfolio/${id}`);
        if (data) {
            setPortfolio({
                name: data.name,
                position: data.position,
                bio: data.bio,
                image: `${cdn}/public/${data.image}`
            });
        }
        console.log(data);
    }

    useEffect(() => {
        loadUserData();
    }, []);

    return (
        <div className="intro">
            <div className="intro-left">
                <div className="intro-left-wrapper">
                    <h2 className="intro-greet">Hello, My name is</h2>
                    <h1 className="intro-name">{portfolio.name}</h1>
                    <div className="intro-title">
                        <div className="intro-title-wrapper">
                            <div className="intro-title-item">{portfolio.position}</div>
                        </div>
                        {/* <div className="intro-title-wrapper">
                            <div className="intro-title-item">Technical Architect</div>
                            <div className="intro-title-item">AWS Consultant</div>
                            <div className="intro-title-item">AWS Community Hero</div>
                            <div className="intro-title-item">Youtuber</div>
                        </div> */}
                    </div>
                    <p className="intro-description">
                        {portfolio.bio}
                    </p>
                </div>
            </div>
            <div className="intro-right">
                <div className="intro-bg"></div>
                <img src={portfolio.image} className="intro-img" alt="profile picc" />
            </div>
        </div>
    )
}

export default Intro
