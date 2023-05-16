
import { useEffect, useRef, useState } from "react";
import { getAuth } from "firebase/auth";
import { useAuth } from "./AuthContext";
import './styles/reviews.css'
import ReactLoading from 'react-loading';
function Reviews() {
    const { setDocData } = useAuth()
    const { getDocSnap } = useAuth()
    const { getDocsOfCollection } = useAuth()
    const [done, setDone] = useState(Boolean)
    const [reviews, setReviews] = useState(Array<{ name: string, review: string }>)
    const review = useRef<HTMLTextAreaElement>(null)
    const counter = useRef(false)
    const user=useRef(getAuth().currentUser)

    const setData = async (e: any) => {
        e.preventDefault()
        await setDocData("reviews", getAuth().currentUser?.uid, {
            user_id: getAuth().currentUser?.uid,
            review: review.current?.value
        }
        )
    }

    const getData = async () => {
        const querySnapshot = await getDocsOfCollection("reviews")
        console.log(querySnapshot)
        for (let i = 0; i < querySnapshot.size; i++) {

            if (querySnapshot.docs[i].data().user_id != undefined) {
                const docSnap = await getDocSnap("users", querySnapshot.docs[i].data().user_id)

                if (docSnap.exists()) {

                    setReviews(reviews => [...reviews, { name: docSnap.data().displayName, review: querySnapshot.docs[i].data().review }])
                }
            }
        }

    }



    useEffect(() => {
        if (counter.current) return
        counter.current = true
        getData().then(()=>{
            setDone(true)
        })
    }, [])


    console.log(reviews)


    return (

        !done ? (
        <div className="ReactLoading"><ReactLoading type={"spin"} color={"rgb(81, 216, 115)"}></ReactLoading></div>) : (
            <div id="reviews">
                
                <h2>Reviews</h2>
                {
                    user.current?(<><textarea placeholder="Write a review" ref={review}></textarea><br></br>
                <button onClick={setData} className="submit">Review</button></>):(<></>)

                }
                
                {reviews.map((r) => {
                    return <div className="review">
                        <div>
                            
                            <h3>{r.name}</h3>
                            <p >{r.review}</p>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M11 9.275c0 5.141-3.892 10.519-10 11.725l-.984-2.126c2.215-.835 4.163-3.742 4.38-5.746-2.491-.392-4.396-2.547-4.396-5.149 0-3.182 2.584-4.979 5.199-4.979 3.015 0 5.801 2.305 5.801 6.275zm13 0c0 5.141-3.892 10.519-10 11.725l-.984-2.126c2.215-.835 4.163-3.742 4.38-5.746-2.491-.392-4.396-2.547-4.396-5.149 0-3.182 2.584-4.979 5.199-4.979 3.015 0 5.801 2.305 5.801 6.275z"/></svg>

                    </div>
                })}

            </div>
        )


    )

}

export default Reviews;