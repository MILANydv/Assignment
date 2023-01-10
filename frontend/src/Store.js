import { createContext, useReducer } from 'react';

export const Store = createContext();

const initialState = {
  fullBox: false,
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo'))
    : null,

  cart: {
    shippingAddress: localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
  },

   //Booking
  BookingCart: {
    Address: localStorage.getItem('Address')
      ? JSON.parse(localStorage.getItem('Address'))
      : { location: {} },
    paymentMethod: localStorage.getItem('paymentMethod')
      ? localStorage.getItem('paymentMethod')
      : '',
    BookingItems: localStorage.getItem('BookingItems')
      ? JSON.parse(localStorage.getItem('BookingItems'))
      : [],
  },
};
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FULLBOX_ON':
      return { ...state, fullBox: true };
    case 'SET_FULLBOX_OFF':
      return { ...state, fullBox: false };

    case 'CART_ADD_ITEM':
      // add to cart
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find(
        (item) => item._id === newItem._id
      );
      const cartItems = existItem
        ? state.cart.cartItems.map((item) =>
            item._id === existItem._id ? newItem : item
          )
        : [...state.cart.cartItems, newItem];
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    case 'CART_REMOVE_ITEM': {
      const cartItems = state.cart.cartItems.filter(
        (item) => item._id !== action.payload._id
      );
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_CLEAR':
      return { ...state, cart: { ...state.cart, cartItems: [] } };

    case 'USER_SIGNIN':
      return { ...state, userInfo: action.payload };
    case 'USER_SIGNOUT':
      return {
        ...state,
        userInfo: null,
        cart: {
          cartItems: [],
          shippingAddress: {},
          paymentMethod: '',
        },


      };

      case "USER_FORGOT_PASSWORD_MAIL_REQUEST":
        return {
          ...state, message: action.payload
        };

      case "USER_FORGOT_PASSWORD_MAIL_SUCCESS":
        return{


          ...state, message:action.payload
        }

        case "USER_RESET_PASSWORD_SUCCESS":
          return {
            ...state,
            message: action.payload
          };
    

    case 'SAVE_SHIPPING_ADDRESS':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: action.payload,
        },
      };
    case 'SAVE_SHIPPING_ADDRESS_MAP_LOCATION':
      return {
        ...state,
        cart: {
          ...state.cart,
          shippingAddress: {
            ...state.cart.shippingAddress,
            location: action.payload,
          },
        },
      };
 


    case 'SAVE_PAYMENT_METHOD':
      return {
        ...state,
        cart: { ...state.cart, paymentMethod: action.payload },
      };
    default:
      return state;

      case 'BOOKING_ADD_ITEMS':
        // add to cart
        const newBooking = action.payload;
        const existingBooking = state.BookingCart.BookingItems.find(
          (item) => item._id === newBooking._id
        );
        const BookingItems = existingBooking
          ? state.BookingCart.BookingItems.map((item) =>
              item._id === existingBooking._id ? newBooking : item
            )
          : [...state.BookingCart.BookingItems, newBooking];
        localStorage.setItem('BookingCart', JSON.stringify(BookingItems));
        return { ...state, cart: { ...state.BookingCart, BookingItems } };
    
        case 'BOOKING_REMOVE_ITEMS': {
          const BookingItems = state.BookingCart.BookingItems.filter(
            (item) => item._id !== action.payload._id
          );
          localStorage.setItem('BookingItems', JSON.stringify(BookingItems));
          return { ...state, BookingCart: { ...state.BookingCart, BookingItems } };
        }


        case 'BOOKING_CLEAR':
          return { ...state, BookingCart: { ...state.BookingCart, BookingItems: [] } };






          case 'SAVE_ADDRESS':
            return {
              ...state,
              BookingCart: {
                ...state.BookingCart,
                Address: action.payload,
              },
            };



  }


  
}



export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children} </Store.Provider>;
}
