import React from 'react'
import { Alert } from 'react-bootstrap'

// Variant(danger, success), children is whatever we wrapping it
const Message = ({ variant, children}) => {
  return (
    <Alert variant={variant}>
        {children}
    </Alert>
  )
}

// Set default variant value
Message.defaultProps = {
    variant: "info",
};

export default Message
