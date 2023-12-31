import React from 'react'
// Import useEffect to fetch data from API
import { Row, Col } from 'react-bootstrap'
import { Link, useParams } from 'react-router-dom'
import Product from '../components/Product'
import { useGetProductsQuery } from '../slices/productsApiSlice'
import Message from '../components/Message'
import Paginate from '../components/Paginate'
import ProductCarousel from '../components/ProductCarousel'

const HomeScreen = () => {
    const { pageNumber, keyword } = useParams();

    const { data, isLoading, error } = useGetProductsQuery({ keyword, pageNumber});

    return (  
    <>
        { !keyword ? <ProductCarousel /> : (
        <Link to='/' className='btn btn-light mb-4'>Go Back</Link>
        )}
        { isLoading ? (
            console.log('loading')
        ) : error ? ( <Message variant='danger'>
        {error?.data?.message || error.error}
            </Message>) : (<>
            <h1>Latest Product</h1>
        <Row>
            {data.products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                    <Product product={product}/>
                </Col>
            ))}
        </Row>
        <Paginate pages={data.pages} 
        page={data.page} 
        keyword={keyword ? keyword : ''}
        />
        </>)}
    </>
    )

}

export default HomeScreen
