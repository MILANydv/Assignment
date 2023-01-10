// import axios from 'axios';
// import { useContext, useEffect, useReducer, useRef, useState } from 'react';
// import { Link, useNavigate, useParams } from 'react-router-dom';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Card from 'react-bootstrap/Card';
// import ListGroup from 'react-bootstrap/ListGroup';
// import Form from 'react-bootstrap/Form';
// import Badge from 'react-bootstrap/Badge';
// import Button from 'react-bootstrap/Button';
// import Rating from '../components/Rating';
// import { Helmet } from 'react-helmet-async';
// import LoadingBox from '../components/LoadingBox';
// import MessageBox from '../components/MessageBox';
// import { getError } from '../utils';
// import { Store } from '../Store';
// import FloatingLabel from 'react-bootstrap/FloatingLabel';
// import { toast } from 'react-toastify';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'REFRESH_BUSINESS':
//       return { ...state, business: action.payload };
//     case 'CREATE_REQUEST':
//       return { ...state, loadingCreateReview: true };
//     case 'CREATE_SUCCESS':
//       return { ...state, loadingCreateReview: false };
//     case 'CREATE_FAIL':
//       return { ...state, loadingCreateReview: false };
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return { ...state, business: action.payload, loading: false };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     default:
//       return state;
//   }
// };

// function SingleBusinessScreen() {
//   let reviewsRef = useRef();

//   const [rating, setRating] = useState(0);
//   const [comment, setComment] = useState('');
//   const [selectedImage, setSelectedImage] = useState('');

//   const navigate = useNavigate();
//   const params = useParams();
//   const { slug } = params;

//   const [{ loading, error, business, loadingCreateReview }, dispatch] =
//     useReducer(reducer, {
//       business: [],
//       loading: true,
//       error: '',
//     });
//   useEffect(() => {
//     const fetchData = async () => {
//       dispatch({ type: 'FETCH_REQUEST' });
//       try {
//         const result = await axios.get(`/api/businesses/slug/${slug}`);
//         dispatch({ type: 'FETCH_SUCCESS', payload: result.data });
//         console.log(result)
//       } catch (err) {
//         dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
//       }

//     };
//     fetchData();
//   }, [slug]);

//   const { state, dispatch: ctxDispatch } = useContext(Store);
//   const { cart, userInfo } = state;
//   const addToCartHandler = async () => {
//     const existItem = cart.cartItems.find((x) => x._id === business._id);
//     const quantity = existItem ? existItem.quantity + 1 : 1;
//     const { data } = await axios.get(`/api/businesses/${business._id}`);
//     if (data.countInstock < quantity) {
//       window.alert('Sorry. Business is out of stock');
//       return;
//     }

//     navigate('/signin?redirect=/Address');

//   };

//   const submitHandler = async (e) => {
//     e.preventDefault();
//     if (!comment || !rating) {
//       toast.error('Please enter comment and rating');
//       return;
//     }
//     try {
//       const { data } = await axios.post(
//         `/api/businesses/${business._id}/reviews`,
//         { rating, comment, name: userInfo.name },
//         {
//           headers: { Authorization: `Bearer ${userInfo.token}` },
//         }
//       );

//       dispatch({
//         type: 'CREATE_SUCCESS',
//       });
//       toast.success('Review submitted successfully');
//       business.reviews.unshift(data.review);
//       business.numReviews = data.numReviews;
//       business.rating = data.rating;
//       dispatch({ type: 'RE', payload: business });
//       window.scrollTo({
//         behavior: 'smooth',
//         top: reviewsRef.current.offsetTop,
//       });
//     } catch (error) {
//       toast.error(getError(error));
//       dispatch({ type: 'CREATE_FAIL' });
//     }
//   };
//   return loading ? (
//     <LoadingBox />
//   ) : error ? (
//     <MessageBox variant="danger">{error}</MessageBox>
//   ) : (
//     <div>
//       <Row>
//         <Col md={6}>
//           <img
//             className="img-large"
//             src={selectedImage || business.image}
//             alt={business.name}
//           ></img>
//         </Col>
//         <Col md={3}>
//           <ListGroup variant="flush">
//             <ListGroup.Item>
//               <Helmet>
//                 <title>{business.name}</title>
//               </Helmet>
//               <h1>{business.name}</h1>
//             </ListGroup.Item>
//             {/* <ListGroup.Item>
//               <Rating
//                 rating={business.rating}
//                 numReviews={business.numReviews}
//               ></Rating>
//             </ListGroup.Item>
//             <ListGroup.Item>Pirce : ${business.price}</ListGroup.Item>
//             <ListGroup.Item>
//               <Row xs={1} md={2} className="g-2">
//                 {[business.image, ...business.images].map((x) => (
//                   <Col key={x}>
//                     <Card>
//                       <Button
//                         className="thumbnail"
//                         type="button"
//                         variant="light"
//                         onClick={() => setSelectedImage(x)}
//                       >
//                         <Card.Img variant="top" src={x} alt="product" />
//                       </Button>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//             </ListGroup.Item> */}
//             <ListGroup.Item>
//               Description:
//               <p>{business.description}</p>
//             </ListGroup.Item>
//           </ListGroup>
//         </Col>
//         <Col md={3}>
//           <Card>
//             <Card.Body>
//               <ListGroup variant="flush">
//                 {/* <ListGroup.Item>
//                   <Row>
//                     <Col>Price:</Col>
//                     <Col>${business.price}</Col>
//                   </Row>
//                 </ListGroup.Item> */}
//                 <ListGroup.Item>
//                   <Row>
//                     <Col>Status:</Col>
//                     <Col>
//                       {business.countInstock > 0 ? (
//                         <Badge bg="success">Available</Badge>
//                       ) : (
//                         <Badge bg="danger">Unavailable</Badge>
//                       )}
//                     </Col>
//                   </Row>
//                 </ListGroup.Item>

//                 {business.countInstock > 0 && (
//                   <ListGroup.Item>
//                     <div className="d-grid">
//                       <Button onClick={addToCartHandler} variant="primary">
//                         Book Appointment
//                       </Button>
//                     </div>
//                   </ListGroup.Item>
//                 )}
//               </ListGroup>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       {/* <div className="my-3">
//         <h2 ref={reviewsRef}>Reviews</h2>
//         <div className="mb-3">
//           {business.reviews.length === 0 && (
//             <MessageBox>There is no review</MessageBox>
//           )}
//         </div>
//         <ListGroup>
//           {business.reviews.map((review) => (
//             <ListGroup.Item key={review._id}>
//               <strong>{review.name}</strong>
//               <Rating rating={review.rating} caption=" "></Rating>
//               <p>{review.createdAt.substring(0, 10)}</p>
//               <p>{review.comment}</p>
//             </ListGroup.Item>
//           ))}
//         </ListGroup>
//         <div className="my-3">
//           {(userInfo.isAdmin !== true) ? (
//             <form onSubmit={submitHandler}>
//               <h2>Rate & review</h2>
//               <Form.Group className="mb-3" controlId="rating">
//                 <Form.Label>Rating</Form.Label>
//                 <Form.Select
//                   aria-label="Rating"
//                   value={rating}
//                   onChange={(e) => setRating(e.target.value)}
//                 >
//                   <option value="">Select...</option>
//                   <option value="1">1- Poor</option>
//                   <option value="2">2- Fair</option>
//                   <option value="3">3- Good</option>
//                   <option value="4">4- Very good</option>
//                   <option value="5">5- Excellent</option>
//                 </Form.Select>
//               </Form.Group>
//               <FloatingLabel
//                 controlId="floatingTextarea"
//                 label="Comments"
//                 className="mb-3"
//               >
//                 <Form.Control
//                   as="textarea"
//                   placeholder="Leave a comment here"
//                   value={comment}
//                   onChange={(e) => setComment(e.target.value)}
//                 />
//               </FloatingLabel>

//               <div className="mb-3">
//                 <Button disabled={loadingCreateReview} type="submit">
//                   Submit
//                 </Button>
//                 {loadingCreateReview && <LoadingBox></LoadingBox>}
//               </div>
//             </form>
//           ) : (
//             <MessageBox>
//               Please{' '}
//               <Link to={`/signin?redirect=/businesses/${business.slug}`}>
//                 Sign In
//               </Link>{' '}
//               to write a review
//             </MessageBox>
//           )}
//         </div></div> */}

//     </div>
//   );
// }
// export default SingleBusinessScreen;

import axios from "axios";
import { useContext, useEffect, useReducer, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Row from "react-bootstrap/Row";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { Store } from "../Store";
import { getError } from "../utils";

const reducer = (state, action) => {
  switch (action.type) {
    case "REFRESH_BUSINESS":
      return { ...state, business: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreateReview: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreateReview: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreateReview: false };
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, business: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function SingleBusinessScreen() {
  let reviewsRef = useRef();

  const [selectedImage, setSelectedImage] = useState("");

  const navigate = useNavigate();
  const params = useParams();
  const { slug } = params;

  const [{ loading, error, business, loadingCreateReview }, dispatch] =
    useReducer(reducer, {
      business: [],
      loading: true,
      error: "",
    });
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/businesses/slug/${slug}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: getError(err) });
      }
    };
    fetchData();
  }, [slug]);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    let { mobile, datetime, address } = e.target.elements;
    mobile = mobile.value;
    address = address.value;
    datetime = datetime.value.split("T");

    if (new Date(datetime).getTime() < Date.now() + 60 * 15 * 1000) {
      alert("Old date and time is not allowed");
      return;
    }
    const { data } = await axios.post(
      "/api/booking/",
      {
        businessid: business._id,
        mobile,
        address,
        date: datetime[0],
        time: datetime[1],
      },
      {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      }
    );
    console.log(data);
    if (data) {
      alert("Booking Successful");
      navigate(`/my-bookings`);
    } else {
      alert("Failed to apply booking");
    }
  };
  return loading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Row>
        <Col md={4}>
          <img
            className="img-large"
            src={selectedImage || business.image}
            alt={business.name}
          ></img>
        </Col>
        <Col md={4}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Helmet>
                <title>{business.name}</title>
              </Helmet>
              <h1 id="business-name"
              >{business.name}</h1>
            </ListGroup.Item>

            <ListGroup.Item>
              Description:
              <p>{business.description}</p>
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Body>
              <ListGroup variant="flush">
                <Form onSubmit={submitHandler}>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Booking Date</Form.Label>
                    <Form.Control
                      name="datetime"
                      type="datetime-local"
                      required
                      min={new Date()}
                    />
                  </Form.Group>
                  {/* <Form.Group className="mb-3" controlId="email">
          <Form.Label>Booking Time</Form.Label>
          <Form.Control
            type="date"

            required
          />
        </Form.Group> */}

                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Contact Number</Form.Label>
                    <Form.Control name="mobile" type="number" required />
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Pickup Address</Form.Label>
                    <Form.Control name="address" type="text" required />
                  </Form.Group>
                  <Button type="submit" variant="primary">
                    Book Appointment
                  </Button>
                </Form>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
export default SingleBusinessScreen;
