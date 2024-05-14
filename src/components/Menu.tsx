import stylex from "@stylexjs/stylex";
import { IconMenu2 } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import MenuToggleItem from "./MenuToggleItem";
import { Link } from "react-router-dom";
import CloseMenu from "../assets/closemenu.svg";
import axios, { AxiosResponse } from 'axios';
import { Whopper } from '../types/Whopper';
import { BackgroundImage } from "@/types/Image";
import { Article } from "@/types/Article";
import { createSearchParams, useNavigate } from "react-router-dom";

const styles = stylex.create({
    menuButton: {
        height: "58px",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center"
    },
    menuButtonExpanded: {
        marginTop: "0.55em",
        marginRight: "0.5em",
    },
    menuContainer: {
        position: "absolute",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        top: "0",
        left: "0",
        zIndex: "1",
        width: "100vw",
        height: "100vh"
    },
    overlay: {
        position: "absolute",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        backgroundColor: "black",
        opacity: "0.4",
        zIndex: "2"
    },
    content: {
        position: "absolute",
        textShadow: "2px 2px 4px black",
        color: "white",
        display: "grid",
        padding: "0.5em",
        gridTemplateColumns: "min-content auto",
        zIndex: "3",
        height: "100vh",
        overflow: "auto"
    },
    heading: {
        textAlign: "center",
        textDecoration: "underline",
        color: "#f02010"
    },
    textSection: {
        border: "2px solid #80f08060",
        borderRadius: "10px",
        padding: "0.5em",
        marginBlock: "1em",
        marginRight: "1em",
        minHeight: "40px"
    }
});

interface Props
{
    toggleAudio: (on:boolean) => void,
    audio: Boolean,
    toggleAutoScroll: (on:boolean) => void,
    autoScroll: Boolean,
    article: Article
}

function Menu({toggleAudio, audio, toggleAutoScroll, autoScroll, article}:Props)
{
    const navigation = useNavigate();
    const [showMenu, setShowMenu] = useState<Boolean>(false);
    const [whoppers, setWhoppers] = useState<Whopper[]>([]);
    const [backgroundImage, setBackgroundImage] = useState("");

    const onShowMenu = () =>
    {
        setShowMenu(prev => !prev);       
    }

    useEffect(() => {
        axios.get("api/getImage.php?type=hamburger").then(
            (res: AxiosResponse<BackgroundImage>) => setBackgroundImage(`url('${axios.defaults.baseURL}${res.data.url}')`)
        );
    }, [])

    useEffect(() => {
        if(showMenu) {
            axios.get("api/whoppers.php").then(
                (res: AxiosResponse<Whopper[]>) => setWhoppers(res.data.sort(() => 0.5 - Math.random()).slice(0, 10))
            );
        }        
    }, [showMenu, article.id])

    const blockTouch = (e:any) => {
        e.stopPropagation();
    }
    
    const goToDetail = (id:number) =>
    {
        navigation({pathname: "/details", search: createSearchParams({id: id.toString()}).toString()});
    }

    return(
        <div onClick={e => e.stopPropagation()}>
            <div {...stylex.props(styles.menuButton)} onClick={onShowMenu}>
                <IconMenu2 size={"2.5rem"} />
            </div>
            {showMenu ? 
            <div {...stylex.props(styles.menuContainer)} style={{backgroundImage}} onTouchStart={blockTouch} onTouchEnd={blockTouch}>
                <div {...stylex.props(styles.overlay)}></div>
                <div {...stylex.props(styles.content)}>
                    <div {...stylex.props(styles.menuButtonExpanded)} >
                        <img src={CloseMenu} style={{ width: "2.5em", height: "2.5em" }} onClick={onShowMenu}/>
                    </div>
                    <div>
                        <MenuToggleItem heading="Audio" value={audio} onClick={()=>toggleAudio(!audio)} />
                        <MenuToggleItem heading="Auto Scroll" value={autoScroll} onClick={()=>toggleAutoScroll(!autoScroll)} />
                        <Link to="/about">About Us</Link> <br/>
                        <Link to="/contact">Contact Us</Link>
                        <h3 {...stylex.props(styles.heading)}>Notable Quotes</h3>
                        {
                            whoppers.map((whopper:Whopper) => (
                                <div key={whopper.id} {...stylex.props(styles.textSection)} onClick={() => goToDetail(whopper.id)}>
                                    { whopper.shortHeadline }
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            : null }
        </div>
    )
}

export default Menu;