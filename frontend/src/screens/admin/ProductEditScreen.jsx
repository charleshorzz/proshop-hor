import React from 'react'
import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button, FormGroup, FormLabel, FormControl} from 'react-bootstrap'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import FormContainer from '../../components/FormContainer'
import { toast } from "react-toastify"
import { useUpdateProductMutation, useGetProductDetailsQuery, useUploadProductImageMutation } from '../../slices/productsApiSlice'

const ProductEditScreen = () => {
    const { id: productId } = useParams();

    const[name, setName] = useState('');
    const[price, setPrice] = useState(0);
    const[image, setImage] = useState('');
    const[brand, setBrand] = useState('');
    const[category, setCategory] = useState('');
    const[countInStock, setCountInStock] = useState(0);
    const[description, setDescription] = useState('');

    const { data: product, isLoading, error} = useGetProductDetailsQuery(productId);
    
    const [updateProduct, { isLoading: loadingUpdate }] = useUpdateProductMutation();

    const [uploadProductImage, { isLoading: loadingUpload }] = useUploadProductImageMutation();

    const navigate = useNavigate();

    const uploadFileHandler = async(e) => {
        const formData = new FormData();
        formData.append('image', e.target.files[0]);
        try {
            const res = await uploadProductImage(formData).unwrap();
            toast.success(res.message);
            setImage(res.image)
        } catch (error) {
            toast.error(error?.data?.message || error.error)
        }
    }

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setImage(product.image);
            setBrand(product.brand);
            setCategory(product.category);
            setCountInStock(product.countInStock);
            setDescription(product.description);
        }
    }, [product]);

    const submitHandler = async(e) => {
        e.preventDefault();
        try {
            await updateProduct({
              productId,
              name,
              price,
              image,
              brand,
              category,
              description,
              countInStock,
            }).unwrap(); // NOTE: here we need to unwrap the Promise to catch any rejection in our catch block
            toast.success('Product updated');
            navigate('/admin/productlist');
          } catch (err) {
            toast.error(err?.data?.message || err.error);
          }
    }

    return (
        <>
            <Link to='/admin/productlist' className='btn btn-light my-3'>
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit Product</h1>
                {loadingUpdate && <Loader />}

                {isLoading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <FormGroup controlId='name'>
                            <FormLabel>Name</FormLabel>
                            <FormControl
                            type='name'
                            placeholder='Enter Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId='price' className='my-2'>
                            <FormLabel>Price</FormLabel>
                            <FormControl
                            type='number'
                            placeholder='Enter Price'
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>

                        {/* Image Input Placeholder */}
                        <FormGroup controlId='image' className='my-2'>
                            <FormLabel>Image</FormLabel>
                            <FormControl
                            type='text'
                            placeholder='Enter Image URL'
                            value={image}
                            onChange={(e) => setImage(e.target.value)}>
                            </FormControl>
                            <FormControl type='file' label="Choose file" onChange={ uploadFileHandler}>
                            </FormControl>
                        </FormGroup>
                        {loadingUpload && <Loader />}

                        <FormGroup controlId='brand' className='my-2'>
                            <FormLabel>Brand</FormLabel>
                            <FormControl
                            type='text'
                            placeholder='Enter Brand'
                            value={brand}
                            onChange={(e) => setBrand(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId='countInStock' className='my-2'>
                            <FormLabel>Count In Stock</FormLabel>
                            <FormControl
                            type='number'
                            placeholder='Enter Count In Stock'
                            value={countInStock}
                            onChange={(e) => setCountInStock(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId='category' className='my-2'>
                            <FormLabel>Category</FormLabel>
                            <FormControl
                            type='text'
                            placeholder='Enter Category'
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId='description' className='my-2'>
                            <FormLabel>Description</FormLabel>
                            <FormControl
                            type='text'
                            placeholder='Enter Description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            >
                            </FormControl>
                        </FormGroup>

                        <Button type='submit' variant='primary' className='my-2'>
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default ProductEditScreen
