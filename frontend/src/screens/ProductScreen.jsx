import React from 'react'
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, ListGroupItem, Form, FormGroup, FormLabel, FormControl } from "react-bootstrap"
import Rating from '../components/Rating'
import { useGetProductDetailsQuery, useCreateReviewMutation} from '../slices/productsApiSlice'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { addToCart } from '../slices/cartSlice'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify';
import Meta from '../components/Meta'

const ProductScreen = () => {
    // use : to rename
    const { id: productId } = useParams()

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [qty, setQty] = useState(1);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('')

    const { data: product, isLoading, error, refetch} = useGetProductDetailsQuery(productId);

    const [createReview, { isLoading: loadingProductReview}] = useCreateReviewMutation();

    const { userInfo } = useSelector((state) => state.auth)

    const addToCartHandler = () => {
        dispatch(addToCart({ ...product, qty}))
        navigate('/cart')
    }

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            await createReview({
                productId, 
                rating,
                comment
            }).unwrap();
            refetch();
            toast.success('Review Submitted');
            setRating(0);
            setComment('');
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

    return (
        <>
        <Link className='btn btn-light my-3' to='/'>
            Go Back
        </Link>
        {isLoading ? (<Loader />) : error ? (<Message variant='danger'>error.data.message || error.error</Message>) : (<>
            <Meta title={product.name}/>
            <Row>
                <Col md={5}>
                    <Image src={product.image} alt={product.name} fluid/>
                </Col>

                <Col md={4}>
                    <ListGroup variant='flush'> 
                        <ListGroupItem>
                            <h3>{product.name}</h3>
                        </ListGroupItem>
                        <ListGroupItem>
                            <Rating value={product.rating} text={`${product.numReviews} reviews`} />
                        </ListGroupItem>
                        <ListGroupItem>
                            Price: RM{product.price}
                        </ListGroupItem>
                        <ListGroupItem>
                            Description: {product.description}
                        </ListGroupItem>
                    </ListGroup>
                </Col>

                <Col md={3}>
                    <Card>
                        <ListGroup variant='flush'>
                            <ListGroupItem>
                                <Row>
                                    <Col>
                                        Price: 
                                    </Col>
                                    <Col>
                                        <strong>
                                            RM{product.price}
                                        </strong>
                                    </Col>
                                </Row>
                            </ListGroupItem>

                            <ListGroupItem>
                                <Row>
                                    <Col>
                                        Status: 
                                    </Col>
                                    <Col>
                                        <strong>
                                            {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
                                        </strong>
                                    </Col>
                                </Row>
                            </ListGroupItem>

                            {product.countInStock > 0 && (
                                <ListGroupItem>
                                    <Row>
                                        <Col>
                                            Qty
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                as='select'
                                                value={qty}
                                                onChange={(e) => {
                                                    setQty(Number(e.target.value))
                                                }}
                                            >
                                                {/* Return [0:0, 1:1] */}
                                                {[...Array(product.countInStock).keys()].map((x) => (
                                                    <option key={x + 1} value={x + 1}>
                                                        {x + 1}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Row>
                                </ListGroupItem>
                            )}

                            <ListGroupItem>
                                <Button className='btn w-100' type='button' disabled={product.countInStock === 0} onClick={addToCartHandler}>
                                    Add to cart
                                </Button>
                            </ListGroupItem>


                        </ListGroup>
                    </Card>
                </Col>
            </Row>
            <Row className='review'>
                <Col md={6}>
                    <h2>Reviews</h2>
                    {product.reviews.length === 0 && <Message>No Reviews</Message>}
                    <ListGroup variant='flush'>
                        {product.reviews.map(review => (
                            <ListGroupItem key={review._id}>
                                <strong>{review.name}</strong>
                                <Rating value={review.rating} />
                                <p>{review.createdAt.substring(0, 10)}</p>
                                <p>{review.comment}</p>
                            </ListGroupItem>
                        ))}
                            <ListGroupItem>
                                <h2>Write a Customer Review</h2>

                                {loadingProductReview && <Loader />}

                                { userInfo ? (
                                    <Form onSubmit={submitHandler}>
                                        <FormGroup controlId='rating' className='my-2'>
                                            <FormLabel>Rating</FormLabel>
                                            <FormControl as='select' value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                                                <option value=''>Select...</option>
                                                <option value='1'>1 - Poor</option>
                                                <option value='2'>2 - Fair</option>
                                                <option value='3'>3 - Good</option>
                                                <option value='4'>4 - Very Good</option>
                                                <option value='5'>5 - Excellent</option>
                                            </FormControl>
                                        </FormGroup>

                                        <FormGroup controlId='comment' className='my-2'>
                                            <FormLabel>Comment</FormLabel>
                                            <FormControl
                                                as='textarea'
                                                row='3'
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}>
                                            </FormControl>
                                        </FormGroup>

                                        <Button
                                        disabled={loadingProductReview}
                                        type='submit'
                                        variant='primary'>
                                            Submit
                                        </Button>
                                    </Form>
                                ) : (
                                    <Message>
                                        Please <Link to='/login'>sign in</Link> to write a review{' '}
                                    </Message>
                                )}
                            </ListGroupItem>
                    </ListGroup>
                </Col>
            </Row>
        </>)}
        </>
    )
}

export default ProductScreen
