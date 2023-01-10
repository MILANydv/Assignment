// import axios from 'axios';
// import React, { useContext, useEffect, useReducer } from 'react';
// import { toast } from 'react-toastify';
// import Button from 'react-bootstrap/Button';
// import { Helmet } from 'react-helmet-async';
// import { useNavigate } from 'react-router-dom';
// import LoadingBox from '../components/LoadingBox';
// import MessageBox from '../components/MessageBox';
// import { Store } from '../Store';
// import { getError } from '../utils';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return {
//         ...state,
//         bookings: action.payload,
//         loading: false,
//       };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     case 'DELETE_REQUEST':
//       return { ...state, loadingDelete: true, successDelete: false };
//     case 'DELETE_SUCCESS':
//       return {
//         ...state,
//         loadingDelete: false,
//         successDelete: true,
//       };
//     case 'DELETE_FAIL':
//       return { ...state, loadingDelete: false };
//     case 'DELETE_RESET':
//       return { ...state, loadingDelete: false, successDelete: false };
//     default:
//       return state;
//   }
// };
// export default function BookingListScreen() {
//   const navigate = useNavigate();
//   const { state } = useContext(Store);
//   const { userInfo } = state;
//   const [{ loading, error, bookings, loadingDelete, successDelete }, dispatch] =
//     useReducer(reducer, {
//       loading: true,
//       error: '',
//     });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         dispatch({ type: 'FETCH_REQUEST' });
//         const { data } = await axios.get(`/api/booking`, {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         });
//         dispatch({ type: 'FETCH_SUCCESS', payload: data });
//       } catch (err) {
//         dispatch({
//           type: 'FETCH_FAIL',
//           payload: getError(err),
//         });
//       }
//     };
//     if (successDelete) {
//       dispatch({ type: 'DELETE_RESET' });
//     } else {
//       fetchData();
//     }
//   }, [userInfo, successDelete]);

//   const deleteHandler = async (booking) => {
//     if (window.confirm('Are you sure to delete?')) {
//       try {
//         dispatch({ type: 'DELETE_REQUEST' });
//         await axios.delete(`/api/booking/${booking._id}`, {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         });
//         toast.success('booking deleted successfully');
//         dispatch({ type: 'DELETE_SUCCESS' });
//       } catch (err) {
//         toast.error(getError(error));
//         dispatch({
//           type: 'DELETE_FAIL',
//         });
//       }
//     }
//   };

//   return (
//     <div>
//       <Helmet>
//         <title>Bookings</title>
//       </Helmet>
//       <h1>Bookings</h1>
//       {loadingDelete && <LoadingBox></LoadingBox>}
//       {loading ? (
//         <LoadingBox></LoadingBox>
//       ) : error ? (
//         <MessageBox variant="danger">{error}</MessageBox>
//       ) : (
//         <table className="table">
//           <thead>
//             <tr>
//               <th>ID</th>
//               <th>USER</th>
//               <th>DATE</th>
//               <th>TOTAL</th>
//               <th>PAID</th>
//               <th>DELIVERED</th>
//               <th>ACTIONS</th>
//             </tr>
//           </thead>
//           <tbody>
//             {bookings.map((booking) => (
//               <tr key={booking._id}>
//                 <td>{booking._id}</td>
//                 <td>{booking.user ? booking.user.name : 'DELETED USER'}</td>
//                 <td>{booking.createdAt.substring(0, 10)}</td>
//                 <td>{booking.totalPrice.toFixed(2)}</td>
//                 <td>{booking.isPaid ? booking.paidAt.substring(0, 10) : 'No'}</td>

//                 <td>
//                   {booking.isDelivered
//                     ? booking.deliveredAt.substring(0, 10)
//                     : 'No'}
//                 </td>
//                 <td>
//                   <Button
//                     type="button"
//                     variant="light"
//                     onClick={() => {
//                       navigate(`/booking/${booking._id}`);
//                     }}
//                   >
//                     Details
//                   </Button>
//                   &nbsp;
//                   <Button
//                     type="button"
//                     variant="light"
//                     onClick={() => deleteHandler(booking)}
//                   >
//                     Delete
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify';
import { Store } from '../Store';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import { getError } from '../utils';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        businesses: action.payload.businesses,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false,
      };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'CREATE_REQUEST':
      return { ...state, loadingCreate: true };
    case 'CREATE_SUCCESS':
      return {
        ...state,
        loadingCreate: false,
      };
    case 'CREATE_FAIL':
      return { ...state, loadingCreate: false };

    case 'DELETE_REQUEST':
      return { ...state, loadingDelete: true, successDelete: false };
    case 'DELETE_SUCCESS':
      return {
        ...state,
        loadingDelete: false,
        successDelete: true,
      };
    case 'DELETE_FAIL':
      return { ...state, loadingDelete: false, successDelete: false };

    case 'DELETE_RESET':
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function BusinessListScreen() {
  const [
    {
      loading,
      error,
      businesses,
      pages,
      loadingCreate,
      loadingDelete,
      successDelete,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
  });

  const navigate = useNavigate();
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const page = sp.get('page') || 1;

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`/api/businesses/admin?page=${page} `, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        console.log(data)
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {}
    };

    if (successDelete) {
      dispatch({ type: 'DELETE_RESET' });
    } else {
      fetchData();
    }
  }, [page, userInfo, successDelete]);

  const createHandler = async () => {
    if (window.confirm('Are you sure to create?')) {
      try {
        dispatch({ type: 'CREATE_REQUEST' });
        const { data } = await axios.post(
          '/api/businesses/addbusiness',
          {},
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          }
        );
        toast.success('business created successfully');
        dispatch({ type: 'CREATE_SUCCESS' });
        navigate(`/admin/business/${data.business._id}`);
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'CREATE_FAIL',
        });
      }
    }
  };

  const deleteHandler = async (business) => {
    if (window.confirm('Are you sure to delete?')) {
      try {
        await axios.delete(`/api/businesses/${business._id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        toast.success('business deleted successfully');
        dispatch({ type: 'DELETE_SUCCESS' });
      } catch (err) {
        toast.error(getError(error));
        dispatch({
          type: 'DELETE_FAIL',
        });
      }
    }
  };

  return (
    <div>
      <Row>
        <Col>
          <h1>Businesses</h1>
        </Col>
        <Col className="col text-end">
          <div>
            <Button type="button" onClick={createHandler}>
              Create Business
            </Button>
          </div>
        </Col>
      </Row>

      {loadingCreate && <LoadingBox></LoadingBox>}
      {loadingDelete && <LoadingBox></LoadingBox>}

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>ADDRESS</th>
                <th>ACTIONS</th>
              
              </tr>
            </thead>
            <tbody>
              {businesses?.map((business) =>
               (
                    
                <tr key={business?._id}>
                  <td>{business?._id}</td>

                  <td>{business.name}</td>
                  <td>{business.address}</td>
                
                  <td>
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => navigate(`/admin/business/${business._id}`)}
                    >
                      Edit
                    </Button>
                    &nbsp;
                    <Button
                      type="button"
                      variant="light"
                      onClick={() => deleteHandler(business)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div>
            {[...Array(pages).keys()].map((x) => (
              <Link
                className={x + 1 === Number(page) ? 'btn text-bold' : 'btn'}
                key={x + 1}
                to={`/admin/businesses?page=${x + 1}`}
              >
                {x + 1}
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
