import { getAuth } from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";
import './styles/payment.css';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { mdiPlus } from '@mdi/js';
import { mdiMinus } from '@mdi/js';
import ReactLoading from 'react-loading';
function Payment() {
    const { increaseShoppingBasketCount } = useAuth()
    const { decreaseShoppingBasketCount } = useAuth()
    const [done, setDone] = useState(Boolean)
    const { shoppingBasketCount } = useAuth()
    const { setDocData } = useAuth()
    const { updateDocData } = useAuth()
    const { deleteDocData } = useAuth()
    const { getDocSnap } = useAuth()
    const { getDocsOfCollectionWithFilter } = useAuth()
    const [shoppingCart, setShoppingCart] = useState(Array<{ id: string, photo: string, name: string, count: number, total_price: number }>)
    const counter = useRef(false)
    const [toPay, setToPay] = useState(0)
    const disable=()=>{
        const paymentlist=document.getElementById('shopping-cart') as HTMLElement
        paymentlist.classList.add('disable')
       
    }
    const enable=()=>{
        const paymentlist=document.getElementById('shopping-cart') as HTMLElement
        paymentlist.classList.remove('disable')
    }
    const getShoppingCart = async () => {
        const querySnapshot = await getDocsOfCollectionWithFilter("shopping_cart", "user_id", "==", getAuth().currentUser?.uid)
        for (let i = 0; i < querySnapshot.size; i++) {
            if (querySnapshot.docs[i].data().user_id != undefined) {
                const docSnap = await getDocSnap(querySnapshot.docs[i].data().dish_category, querySnapshot.docs[i].data().dish_id)
                if (docSnap.exists()) {

                    setShoppingCart(shoppingCart => [...shoppingCart, { id: querySnapshot.docs[i].data().dish_id, photo: docSnap.data().photo, name: docSnap.data().name, count: querySnapshot.docs[i].data().count, total_price: querySnapshot.docs[i].data().total_price }])
                    setToPay(toPay => toPay + querySnapshot.docs[i].data().total_price)
                }
            }
        }
    }
    const increaseCount = async (e: React.MouseEvent<HTMLButtonElement>) => {
        disable()
        increaseShoppingBasketCount()

        const id = e.currentTarget.id
        const item = shoppingCart.find(e => (e.id === id))

        if (item?.count) {
            item.total_price += item.total_price / item.count
            item.count++

            setShoppingCart(shoppingCart => [...shoppingCart]);
            setToPay(toPay => toPay + item.total_price / item.count)
        }


        const temp = getAuth().currentUser?.uid + '_' + id
        const docSnap = await getDocSnap('shopping_cart', temp)

        await updateDocData('shopping_cart', temp, {
            count: docSnap.data().count + 1,
            total_price: docSnap.data().total_price + docSnap.data().total_price / docSnap.data().count
        })
        enable()
    }
    const decreaseCount = async (e: React.MouseEvent<HTMLButtonElement>) => {
       disable()
        const id = e.currentTarget.id
        const item = shoppingCart.find(e => (e.id === id))
        if (item?.count === 1) {
            deleteProduct(e)
            return
        
        }
        if (item?.count) {
            decreaseShoppingBasketCount(1)
            item.total_price -= item.total_price / item.count
            item.total_price = parseFloat((Math.round(item.total_price * 100) / 100).toFixed(2))
            item.count--

            setShoppingCart(shoppingCart => [...shoppingCart]);
            setToPay(toPay => toPay - item.total_price / item.count)
        }
        const temp = getAuth().currentUser?.uid + '_' + id
        const docSnap = await getDocSnap('shopping_cart', temp)

        await updateDocData('shopping_cart', temp, {
            count: docSnap.data().count - 1,
            total_price: docSnap.data().total_price - docSnap.data().total_price / docSnap.data().count
        })
        enable()
    }
    const deleteProduct = async (e: React.MouseEvent<HTMLButtonElement>) => {
        disable()
        e.preventDefault()
        const id = e.currentTarget.id
        const temp = getAuth().currentUser?.uid + '_' + id
        await deleteDocData("shopping_cart", temp)
        const item = shoppingCart.find(e => (e.id === id))
        enable()
        if (item) {
            decreaseShoppingBasketCount(item.count)
            setToPay(toPay => toPay - item.total_price)
            item.id = ''
            setShoppingCart(shoppingCart)
            


            return
        }

    }
    const purchaseProducts = async (e: any) => {
        e.preventDefault()
        decreaseShoppingBasketCount(shoppingBasketCount)
        const querySnapshot = await getDocsOfCollectionWithFilter("shopping_cart", "user_id", "==", getAuth().currentUser?.uid)
        console.log(querySnapshot.size)
        for (let i = 0; i < querySnapshot.size; i++) {
            await setDocData("purchased_items", querySnapshot.docs[i].id, querySnapshot.docs[i].data())
            await updateDocData("purchased_items", querySnapshot.docs[i].id, { date: String(new Date()) })
            await deleteDocData("shopping_cart", querySnapshot.docs[i].id)
        };
        setShoppingCart([])
        setToPay(0)
    }


    useEffect(() => {
        if (counter.current) return
        counter.current = true
        getShoppingCart().then(() => {
            setDone(true)
        })
    }, [])
    useEffect(() => {

    }, [shoppingCart])
    return (
        <div className="payment">
            <div id="part-1">
                <h2>Shopping Cart</h2>
                {
                    !done ? (
                        <div ><ReactLoading type={"spin"} color={"rgb(81, 216, 115)"}></ReactLoading></div>
                    ) : (
                        <div>
                        <div id="shopping-cart">
                            {shoppingCart.map(s => {
                                if (s.id !== "")
                                    return (
                                        <div>
                                            <img src={s.photo}></img>
                                            <p id="name">{s.name}</p>
                                            <button id={s.id} onClick={increaseCount}><Icon path={mdiPlus} size={1} /></button>
                                            <p id="count">{s.count}</p>
                                            <button id={s.id} onClick={decreaseCount} ><Icon path={mdiMinus} size={1} /></button>
                                            <h3 id="price">${parseFloat((Math.round(s.total_price * 100) / 100).toFixed(2))}</h3>
                                            <button id={s.id} onClick={deleteProduct}><Icon path={mdiClose} size={1} /></button>

                                        </div>
                                    )
                            })}
                        </div>
                        <h3>to pay : ${parseFloat((Math.round(toPay * 100) / 100).toFixed(2))}</h3>
                        </div>
                    )
                }

                
            </div>
            <div id="part-2">
                <h2>Card Details</h2>
                <form onSubmit={purchaseProducts}>
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text"></input>
                    <label htmlFor="credit-card-number">Credit Card Number</label>
                    <input id="credit-card-number" type="number"></input>
                    <label htmlFor="expiration-date">Expiration Date</label>
                    <input id="expiration-date"></input>
                    <div><button className="submit" type="submit">Check Out</button></div>
                </form>
            </div>





        </div>
    )

}

export default Payment;