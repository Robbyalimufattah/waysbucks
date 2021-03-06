import React, { useState, useEffect, useContext  } from 'react'
import { Navigate, useNavigate, useParams } from "react-router-dom";
import kSeparator from "../utilities/thousandSeparator";
import formatThousands from "format-thousands";
import { UserContext } from '../contexts/UserContext';
import { OrderContext } from '../contexts/OrderContext';

import { API } from '../config/api'

export default function ProductDetail() {

    let {id} = useParams();

    const [products, setProducts] = useState({});
    const [toppings, setToppings] = useState([]);
    const [quantity, setQuantity] = useState(1)

    const [order, setOrder] = useContext(OrderContext)
    const [state, dispatch] = useContext(UserContext)

    let navigate = useNavigate()

    const getOrders = async (id) => {
      try {
        const response = await API.get(`/orders/${state.user.id}`);
        // Store product data to useState variabel
        setOrder(response.data.orders);
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    };


    const increment = () => {
      setQuantity(quantity + 1);
    };
  
    const decrement = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
      }
    };

  const handleSubmit = async (e) => {
    try {
      
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const body = {
        idProduct: id,
        idTopping: 2,
        qty: quantity  
      }

      const response = await API.post('/order', body, config)
      getOrders()
      navigate('/cart')

    } catch (error) {
      console.log(error);
    }
  }

    // Fetching detail product data by id from database
  const getProduct = async (id) => {
    try {
      const response = await API.get("/product/" + id);
      // Store product data to useState variabel
      setProducts(response.data.data.product);
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetching detail product data by id from database
  const getToppings = async () => {
    try {
      const response = await API.get("/toppings");
      // Store product data to useState variabel
      setToppings(response.data.data.toppings);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
      getToppings();
      getProduct(id);
      return () => {
          setProducts({});
          setToppings({});
      }
  }, [])

    //   my-6 relative md:mx-20 md:my-16 md:w-auto lg:mx-40 xl:mx-32 
    return (
        <div className="mx-8 pb-20 md:py-16 lg:mx-32 lg:flex xl:mx-32">
            <div className="img my-8 w-full lg:my-0 lg:w-5/12">
                <img
                    src={"http://localhost:5000/uploads/" + products.image}
                    alt="product"
                    className="w-full md:w-full xl:w-96"
                />
            </div>
            <div className="text w-full lg:w-7/12">
                <div className="mb-10 lg:mb-14">
                    <h1 className="text-red-700 text-5xl font-extrabold font-['Avenir-Black'] mb-4">
                    {products.title}
                    </h1>
                    <p className="text-red-500 text-xl">
                    Rp {formatThousands(products.price, ".")},-
                    </p>
                </div>
                <div className="mb-10 lg:mb-14">
                    <h4 className="text-red-700 text-xl font-bold">Topping</h4>
                    <div className="flex flex-wrap items-center text-center text-red-600">
                    {toppings.map((item, index) => (
                        <button
                        type="button"
                        className="w-1/2 lg:w-1/4 mt-10 flex flex-col items-center relative"
                        key={index}
                        >
                        <img src={item.image} alt="" className="hover:opacity-75" />
                        <h4 className="mt-3 text-sm">{item.title}</h4>
                        <p className="mt-3 text-xs">Rp {formatThousands(item.price, ".")},-</p>
                        </button>
                    ))}
                    </div>
                </div>
                <div className="text-center mb-3">
                <button
                  type="button"
                  onClick={decrement}
                  className="bg-red-300 px-4 py-2 text-red-700 rounded-md active:bg-red-700 active:text-red-300"
                >
                  -
                </button>
                <span className="px-6 py-2 text-red-700 font-bold">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={increment}
                  className="bg-red-300 px-4 py-2 text-red-700 rounded-md active:bg-red-700 active:text-red-300"
                  >
                    +
                  </button>
                </div>
                <div className="mb-10 lg:mb-10 flex justify-between text-xl font-bold text-red-800">
                    <span>Total</span>
                    <span>Rp {kSeparator(quantity * products.price)},-</span>
                </div>
                <button className="w-full bg-red-700 text-white py-2 rounded-md hover:bg-brand-red" onClick={handleSubmit}>
                    Add Cart
                </button>
            </div>
      </div>    
    )
}
