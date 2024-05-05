import { useEffect, useMemo, useState } from "react"
import { db } from "../data/db"

export const useCart = () => {
    

    const initialCart = () => {
        const localStorageCart = localStorage.getItem("cart")
        return localStorageCart ? JSON.parse(localStorageCart) : []
    }
    
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const STOCK_GUITAR =  10;


    useEffect(() => {
        localStorage.setItem( "cart", JSON.stringify(cart));
    },[cart])

    const addToCart = (item) => {
        const itemExists = cart.findIndex((guitar) => guitar.id === item.id);
        if (itemExists >= 0) {
            if(cart[itemExists].quantity >= STOCK_GUITAR) return
            const updateCart = [...cart]
            updateCart[itemExists].quantity++
            setCart(updateCart)
        } else {
            item.quantity = 1
            setCart([...cart, item])
        }
    }
    
    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
        //la funcion nos  devuelve una copia de la lista sin el elemento que le pasamos como parametro
    }

    function decreaseQuantity(id) {
        const updateCart = cart.map(item => {
            if(item.id == id && item.quantity > 1){
                return { ...item, 
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updateCart) 
    }
    function increaseQuantity(id) {
        const updateCart = cart.map(item => {
            
            if(item.id == id && item.quantity < STOCK_GUITAR){
                return { ...item, 
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updateCart) 
    }

    function clearCart(e) {
        setCart([])
    }

    // localStorage
    // function saveLocalStorage() {
    //     localStorage.setItem( "cart", JSON.stringify(cart));
    // }
    
    //state derivado
    const isEmpaty = useMemo(() => cart.length === 0, [cart])
    const cartPriceTotal = useMemo(() => cart.reduce( (total, item ) => total + (item.quantity * item.price), 0), [cart]) 

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        isEmpaty,
        cartPriceTotal
    }
}