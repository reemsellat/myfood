
import {  useNavigate, useParams } from "react-router-dom";
import './styles/categories.css'
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import ReactLoading from 'react-loading';
import uniqid from 'uniqid';
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, EffectCube, Navigation, Pagination } from "swiper";
function Categories() {
    const navigate=useNavigate()
    const category=useParams().category
    const { getDocsOfCollection } = useAuth()
    const count = useRef(false)
    const [done, setDone] = useState(Boolean)
    const [categories, setCategories] = useState(Array<{ name: string, photo: string, id: string }>)
    const getCategories = async () => {
        const querySnapshot = await getDocsOfCollection("categories")
        for (let i = 0; i < querySnapshot.size; i++) {
            setCategories(categories => [...categories, { name: querySnapshot.docs[i].data().name, photo: querySnapshot.docs[i].data().photo, id: querySnapshot.docs[i].id }])
        }
    }
    useEffect(() => {
      
        if(count.current)return
        count.current=true
        getCategories().then(()=>{
            setDone(true)
        })
    }, [])
    return (
        <div>
            {!done?(<div  className="ReactLoading"><ReactLoading type={"spin"} color={"rgb(81, 216, 115)"} ></ReactLoading></div>):(<div className="swiper" id="categories">
                <Swiper
                modules={[Navigation, Pagination, A11y, EffectCube]}


                slidesPerView={"auto"}
                navigation
                pagination={{ clickable: true }}


                onSlideChange={() => console.log('slide change')}
                onSwiper={(swiper) => console.log(swiper)}

                >
                {categories.map(c => {
                return (
                    <SwiperSlide className="categories-slide">
                    <div key={uniqid()}>
                        <a onClick={()=>{
                            if(category){
                              navigate(`../${c.id}`)
                            }
                            else{
                                navigate(`${c.id}`)
                            }
                        }}>
                            <img src={category?`../${c.photo}`:c.photo}></img>
                            {c.name}</a>
                    </div>
                    </SwiperSlide>
                )
            })}</Swiper></div>)}


          
        </div>
    )

}

export default Categories;