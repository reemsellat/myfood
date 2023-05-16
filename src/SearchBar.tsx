
import { useEffect, useMemo, useRef, useState } from "react"
import { NavLink } from "react-router-dom"
import { useAuth } from "./AuthContext"

function SearchBar() {
    const count = useRef(false)
    const { getDocsOfCollection } = useAuth()
    const [items, setItems] = useState(Array<{ name: "", id: "", category: "" }>)
    const [query, setQuery] = useState('')
    const getItems = async () => {
        const categories = await getDocsOfCollection("categories")
        console.log(categories.size)
        for (let i = 0; i < categories.size; i++) {
            const category = categories.docs[i].id
            const products = await getDocsOfCollection(category)
            for (let j = 0; j < products.size; j++) {
                const id = products.docs[j].id
                const name = products.docs[j].data().name
                setItems(items => [...items, { name: name, id: id, category: category }])

            }
        }
    }
    const filterItems = useMemo(() => {
        const visited: Map<String, Boolean> = new Map()
        return items.filter(item => {

            if (item.name.toLowerCase().startsWith(query.toLowerCase()) && query !== '' && !visited.get(item.name)) {
                console.log(item.name)
                visited.set(item.name, true)
                return item
            }

            else return


        })
    }, [query])

    useEffect(() => {
        window.addEventListener("click", (event: Event) => {
            var myBox = document.getElementsByClassName('filtered-items') as HTMLCollectionOf<HTMLElement>
            for (let i = 0; i < myBox.length; i++) {
                if (event.target   && event.target !== myBox[i]) {
                    myBox[i].style.visibility='hidden'

                }
            }

        })
        if (count.current) return
        getItems()
        console.log(items)
        if (items.length >= 36) count.current = true

    }, [])
    return (

        <div className="search-bar" >
            <input className="search-bar-input" placeholder="Search products" type="search" value={query}  onChange={(e: React.FormEvent<HTMLInputElement>) =>{
                var sibling = e.currentTarget.nextElementSibling as HTMLElement
                sibling.style.visibility='visible'
                setQuery(e.currentTarget.value)}}></input>
            <div className="filtered-items">{
                filterItems.map((item) => {
                    return (
                        <NavLink  to={`/categories/${item.category}/${item.id}`} end>{item.name}</NavLink>

                    )
                })}

            </div>

        </div>
    )
}
export default SearchBar