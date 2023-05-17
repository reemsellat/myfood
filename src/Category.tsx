
import { useEffect, useRef } from "react";
import './styles/categories.css'
import { NavLink, Outlet, useParams } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "./AuthContext";
import ReactLoading from 'react-loading';
import Categories from "./Categories";
import uniqid from 'uniqid';
function Category() {
    const { getDocsOfCollection } = useAuth()
    const counter = useRef(false)
    const current = useParams();
    const [done, setDone] = useState(Boolean)
    const [product, setProduct] = useState(Array<{ id: string, name: string, photo: string,price:number }>)
    const productFiller = async () => {
        const querySnapshot = await getDocsOfCollection(current.category)
        for (let i = 0; i < querySnapshot.size; i++) {
            setProduct(product => [...product, { id: querySnapshot.docs[i].id, name: querySnapshot.docs[i].data().name, photo: querySnapshot.docs[i].data().photo ,price:querySnapshot.docs[i].data().price}])
        }
    }
    useEffect(() => {
        if (counter.current) return
        counter.current = true
        productFiller().then(()=>{
            setDone(true)
        })
    }, [])



    return (
        <div>
            <Categories></Categories>
            
           
            {!done?(<div className="ReactLoading"><ReactLoading type={"spin"} color={"rgb(81, 216, 115)"}></ReactLoading></div>):<div className="category-section">
                 <h1>{current.category}</h1>
                 <div className="category">
         {(product.map(item => {
                return (
                    <div key={uniqid()}>
                        <NavLink to={{ pathname: item.id }}>
                        <img src={'../'+item.photo}></img>
                        <p>{item.name}</p>
                        <h3> ${item.price}</h3>
                        
                           
                        </NavLink>
                    </div>

                )
            }))}</div></div>}
            <Outlet></Outlet>
           
        </div>
    )

}

export default Category;