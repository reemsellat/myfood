
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import './styles/product.css'
import { useAuth } from "./AuthContext";
import ReactLoading from 'react-loading';
import uniqid from 'uniqid'
function Product() {
    const { increaseShoppingBasketCount } = useAuth()
    const { setDocData } = useAuth()
    const { getDocSnap } = useAuth()
    const { updateDocData } = useAuth()
    const [done, setDone] = useState(Boolean)
    const [productInfo, setProductInfo] = useState({
        name: "",
        price: 0,
        description: "",
        ingredients: [],
        photo: "",
        rating: 0,
        rates: 0
    })
    const current = useParams();
    let currentProduct = current.product;
    let currentCategory = current.category



    const getProductData = async () => {
        const docSnap = await getDocSnap(currentCategory, currentProduct)
        setProductInfo(docSnap.data())
        console.log(productInfo.photo)

    }

    const setStars = (e: any) => {
        const id = e.currentTarget.id
        console.log(parseInt(id) + 1)
        const stars = document.getElementsByClassName("fa fa-star") as HTMLCollectionOf<HTMLSpanElement>
        for (let i = 0; i <= parseInt(id); i++) {
            stars[i].style.color = "rgb(252, 72, 102)"
        }
        for (let i = parseInt(id) + 1; i < 5; i++) {
            stars[i].style.color = "white"
        }
        setRating(parseInt(id) + 1)
    }
    const setRating = async (value: number) => {
        const temp = getAuth().currentUser?.uid + '_' + currentProduct
        const docSnap = await getDocSnap(currentCategory, currentProduct)
        const docSnapRating = docSnap.data().rating
        const docSnapRates = docSnap.data().rates
        const starSnap = await getDocSnap("stars", temp)
        let lastValue = 0
        if (starSnap.exists()) {
            lastValue = starSnap.data().value
        }

        if (lastValue === 0) {
            let rating = (docSnapRating * docSnapRates + value) / (docSnapRates + 1)
            await updateDocData(currentCategory, currentProduct, {
                rating: rating,
                rates: docSnapRates + 1
            })
            setProductInfo({ ...productInfo, rating: rating, rates: docSnapRates + 1 })


        }
        else {
            console.log('h')
            let rating = 0;
            if (docSnapRates !== 1) {
                rating = docSnapRates * docSnapRating - lastValue
                rating = (rating + value) / docSnapRates
            }
            else {
                rating = value
            }
            await updateDocData(currentCategory, currentProduct, {
                rating: rating,
            })

            setProductInfo({ ...productInfo, rating: rating })
        }



        await setDocData("stars", temp, {
            value: value,
            user_id: getAuth().currentUser?.uid,
            dish_id: currentProduct
        })

    }

    const setDefaultStars = async () => {
        const temp = getAuth().currentUser?.uid + '_' + currentProduct
        const docSnap = await getDocSnap("stars", temp);
        const stars = document.getElementsByClassName("fa fa-star") as HTMLCollectionOf<HTMLSpanElement>
        if (docSnap.exists()) {
            for (let i = 0; i < docSnap.data().value; i++) {
                stars[i].style.color = "rgb(252, 72, 102)"
            }
            for (let i = docSnap.data().value; i < 5; i++) {
                stars[i].style.color = "white"
            }
        }
    }
    const addProductToShoppingCart = async (e: React.MouseEvent<HTMLButtonElement>) => {
        const button=e.target as HTMLElement
        button.classList.add("disable")
        increaseShoppingBasketCount()
        const temp = getAuth().currentUser?.uid + '_' + currentProduct
        const docSnap = await getDocSnap('shopping_cart', temp)
        let count = 0;
        if (docSnap.exists()) {
            count = docSnap.data().count
        }
        await setDocData('shopping_cart', temp, {
            user_id: getAuth().currentUser?.uid,
            dish_id: currentProduct,
            dish_category: currentCategory,
            count: count + 1,
            total_price: (count + 1) * productInfo.price
        })
        button.classList.remove('disable')

    }
    useEffect(() => {
        
        getProductData().then(() => {
            setDefaultStars()
            setDone(true)
            
        })


    }, [])
    useEffect(() => {

    }, [productInfo.rating, productInfo.rates])
    return (
        <div>
            {
                !done?(<div className="ReactLoading"><ReactLoading type={"spin"} color={"rgb(81, 216, 115)"}></ReactLoading></div>):(
                     <div className="product">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
            <div id="part-1">
                <h1>{productInfo.name}</h1>
                <h3>Your Rating
                    <div id="rating_bar">
                        <span className="fa fa-star" id="0" onClick={setStars}></span>
                        <span className="fa fa-star" id="1" onClick={setStars}></span>
                        <span className="fa fa-star" id="2" onClick={setStars}></span>
                        <span className="fa fa-star" id="3" onClick={setStars}></span>
                        <span className="fa fa-star" id="4" onClick={setStars}></span>
                    </div>
                </h3>

                <p style={{ color: "whitesmoke" }}>has rating of {parseFloat((Math.round(productInfo.rating * 100) / 100).toFixed(1))}<br></br>({productInfo.rates} people rated)</p>
                <p>{productInfo.description}</p>
                <h3>Ingredients</h3>
                <div className="ingredients">
                    {productInfo.ingredients.map(ingredient => {
                        return <p key={uniqid()}>{ingredient}</p>
                    })}
                </div>

                <h1>${productInfo.price}</h1>
                <button className="submit" onClick={addProductToShoppingCart}>Order Now</button>
            </div>
            <div id="part-2"><img src={productInfo.photo} ></img></div>




            <br></br>






        </div>
                )
            }
        </div>
       
    )

}

export default Product;