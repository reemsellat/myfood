
import NavigationBar from "./NavigateBar";
import { useNavigate } from "react-router-dom";
import 'swiper/swiper-bundle.min.css';
import './styles/home.css'
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Pagination, A11y, EffectCube } from 'swiper';
import Footer from "./Footer";
import ReactLoading from 'react-loading';

function Home() {
    const counter = useRef(false)
    const { getDocsOfCollection } = useAuth()
    const [done, setDone] = useState(Boolean)
    const [categories, setCategories] = useState(Array<{ name: string, photo: string, description: string }>)
    const getCategories = async () => {
        const querySnapshot = await getDocsOfCollection("categories")
        for (let i = 0; i < querySnapshot.size; i++) {
            setCategories(categories => [...categories, { name: querySnapshot.docs[i].data().name, photo: querySnapshot.docs[i].data().photo, description: querySnapshot.docs[i].data().description }])
        }
    }
    const navigate = useNavigate()
    const handleonRegister = () => {
        navigate('/register')
    }
    useEffect(() => {
        if (counter.current) return
        counter.current = true
        getCategories().then(() => {
            setDone(true)
        }

        )
    }, [])
    return (
        <div>
            {
                !done ? (
                    <div className="ReactLoading"> <ReactLoading type={"bars"} color={"rgb(81, 216, 115)"} height={100} width={100} ></ReactLoading></div>
                   
                ) : (
                    <div>
                        <NavigationBar></NavigationBar>
                        <div className="flex-container">
                            <div id="part-1">
                                <div id="part-1-1">
                                    <h3>the best cuisine awaits you</h3>
                                    <h1>Welcome!<br></br>To my food</h1>
                                </div>
                                <div id="part-1-2">
                                    <h1>20%</h1>
                                    <h3> discount upon<br></br> registeration</h3>
                                </div>
                                <button className="register" onClick={handleonRegister}>Register</button>
                            </div>
                            <div id="part-2">
                                <img src="images/main-photo.jpg"></img>
                            </div>
                        </div>
                        <div className="swiper">
                            <Swiper modules={[Navigation, Pagination, A11y, EffectCube]}


                                slidesPerView={"auto"}
                                navigation
                                pagination={{ clickable: true }}


                                onSlideChange={() => console.log('slide change')}
                                onSwiper={(swiper) => console.log(swiper)}


                            >
                                {categories.map(c => {

                                    return (
                                    
                                    <SwiperSlide>
                                        <div className="flex-container-2" onClick={handleonRegister}>
                                            <img src={c.photo}></img>
                                            <div>
                                                <h3>{c.name}</h3>
                                                <p>{c.description}</p>
                                            </div>

                                        </div>


                                    </SwiperSlide>)
                                })}
                            </Swiper>

                        </div>
                        <Footer></Footer>
                    </div>
                )
            }


        </div>
    )

}

export default Home;