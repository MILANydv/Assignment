import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { Store } from '../Store';
import { getError } from '../utils';
import Button from 'react-bootstrap/esm/Button';
import moment from 'moment/moment';
const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, bookings: action.payload, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

export default function BookingHistoryScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const navigate = useNavigate();

  const [{ loading, error, bookings }, dispatch] = useReducer(reducer, {
    loading: true,
    error: '',
  });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'FETCH_REQUEST' });
      try {
        const { data } = await axios.get(
          `/api/booking/me`,

          { headers: { Authorization: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (error) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(error),
        });
      }
    };
    fetchData();
  }, [userInfo]);
  return (
    <div>
      <Helmet>
        <title>Booking History</title>
      </Helmet>

      <h1>Booking History</h1>
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger" props={error}></MessageBox>
      ) : (
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
      )}
    </div>
  );
}
