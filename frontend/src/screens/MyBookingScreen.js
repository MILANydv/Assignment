import React, { useContext, useEffect, useReducer, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Store } from '../Store';
import { cssTransition, toast } from 'react-toastify';
import { getError } from '../utils';
import axios from 'axios';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_DATA':
      return { ...state, bookings: action.payload, loading: false };
    default:
      return state;
  }
};

export default function MyBookingScreen() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const [{ bookings }, dispatch] = useReducer(reducer, {
    loading: false,
  });
  console.log(bookings);
  const getData = async () =>{
    try {
      const { data } = await axios.get(
        '/api/booking/me',
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );

      dispatch({
        type: 'FETCH_DATA',
        payload: data
      });
    } catch (err) {
      toast.error(getError(err));
    }
  }

  useEffect(()=>{
    getData()
    return ()=>{}
  },[])
  return (
    <>
      <Helmet>
        <title>My Bookings</title>
      </Helmet>
      <h1 className="my-3">My Bookings</h1>
      <table className="table">
            <thead>
              <tr>
                <th>Service Name</th>
                <th>Service Address</th>
                <th>User Name</th>
                <th>User Address</th>
                <th>User Contact</th>
                <th>Booking Date/Time</th>
                {/* <th>ACTIONS</th> */}
              </tr>
            </thead>
            <tbody>
              {bookings?.map((book) => (
                <tr key={book?._id}>
                  <td>{book?.businessid?.name}</td>
                  <td>{book?.businessid?.address}</td>
                  <td>{book?.userId?.name}</td>
                  <td>{book?.address}</td>
                  <td>{book?.mobile}</td>
                  <td>
                    {new Date(book?.date).toDateString() + "-" + book.time}
                  </td>

                  {/* <td>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      // onClick={() => deleteHandler(book)}
                    >
                      Delete
                    </Button>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
    </>
  );
}
