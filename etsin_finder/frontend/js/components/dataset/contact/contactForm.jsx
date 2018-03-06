import React from 'react'
import styled from 'styled-components'
import { withFormik } from 'formik'
import Yup from 'yup'
import Select from '../../general/select'

import Input, { InputArea } from './formItems'
import Button from '../../general/button'

const InputContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    width: ${props => (props.width ? props.width : '100%')};
  }
`

const ErrorText = styled.p`
  color: ${props => props.theme.color.error};
`

const Label = styled.label`
  display: block;
`

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`

const InnerForm = props => {
  const {
    values,
    touched,
    errors,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = props
  return (
    <Form onSubmit={handleSubmit}>
      <InputContainer>
        <Select
          name="recipient"
          value={values.recipient}
          onChange={setFieldValue}
          onBlur={setFieldTouched}
          options={props.recipientsList}
          error={errors.recipient && touched.recipient}
        />
        {errors.recipient && touched.recipient && <ErrorText>{errors.recipient}</ErrorText>}
      </InputContainer>
      <InputContainer width="calc(50% - 0.5em)">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          placeholder="Enter your email"
          type="text"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email && touched.email}
        />
        {errors.email && touched.email && <ErrorText>{errors.email}</ErrorText>}
      </InputContainer>
      <InputContainer width="calc(50% - 0.5em)">
        <Label htmlFor="subject">Subject *</Label>
        <Input
          id="subject"
          placeholder="Enter your subject"
          type="text"
          value={values.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.subject && touched.subject}
        />
        {errors.subject && touched.subject && <ErrorText>{errors.subject}</ErrorText>}
      </InputContainer>
      <InputContainer>
        <Label htmlFor="message">Message *</Label>
        <InputArea
          id="message"
          placeholder="Enter your message"
          type="text"
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.message && touched.message}
        />
        {errors.message && touched.message && <ErrorText>{errors.message}</ErrorText>}
      </InputContainer>
      <Button type="submit" disabled={isSubmitting} noMargin>
        Send
      </Button>
    </Form>
  )
}

const ContactForm = withFormik({
  mapPropsToValues: () => ({ subject: '', email: '', message: '', recipient: '' }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required!'),
    message: Yup.string()
      .min(20, 'Minimum message length is 20 characters')
      .required('Message is required!'),
    subject: Yup.string().required('Subject is required!'),
    recipient: Yup.mixed()
      .nullable('true')
      .required('Recipient is required!'),
  }),
  handleSubmit: (values, { setSubmitting }) => {
    alert(JSON.stringify(values, null, 2))
    setSubmitting(false)
  },
  displayName: 'ContactForm', // helps with React DevTools
})(InnerForm)

export default ContactForm
