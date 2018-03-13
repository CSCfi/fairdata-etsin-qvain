import React from 'react'
import styled from 'styled-components'
import { withFormik } from 'formik'
import Yup from 'yup'
import axios from 'axios'
import translate from 'counterpart'
import Select from '../../general/select'

import Input, { InputArea } from './formItems'
import { InvertedButton } from '../../general/button'

const InputContainer = styled.div`
  display: inline-flex;
  flex-direction: column;
  width: 100%;
  @media (min-width: ${props => props.theme.breakpoints.sm}) {
    width: ${props => (props.width ? props.width : '100%')};
    padding-right: ${props => (props.paddingRight ? props.paddingRight : '')};
    padding-left: ${props => (props.paddingLeft ? props.paddingLeft : '')};
  }
`

const ErrorText = styled.p`
  color: ${props => props.theme.color.error};
`

const Success = styled.p`
  color: ${props => props.theme.color.primary};
  margin: 0 1em;
  align-self: center;
  font-weight: 700;
`

const Error = styled.p`
  color: ${props => props.theme.color.error};
  margin: 0 1em;
  align-self: center;
  font-weight: 700;
`

const Label = styled.label`
  display: block;
`

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  align-content: center;
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
    status,
    translations,
  } = props
  console.log('rerun')
  return (
    <Form onSubmit={handleSubmit}>
      <InputContainer>
        <Label htmlFor="recipient">{translations.recipient.name} *</Label>
        <Select
          name="recipient"
          value={values.recipient}
          onChange={setFieldValue}
          onBlur={setFieldTouched}
          options={props.recipientsList}
          placeholder={translations.recipient.placeholder}
          error={errors.recipient && touched.recipient}
        />
        {errors.recipient && touched.recipient && <ErrorText>{errors.recipient}</ErrorText>}
      </InputContainer>
      <InputContainer width="50%" paddingRight="0.5em">
        <Label htmlFor="email">{translations.email.name} *</Label>
        <Input
          id="email"
          placeholder={translations.email.placeholder}
          type="text"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email && touched.email}
        />
        {errors.email && touched.email && <ErrorText>{errors.email}</ErrorText>}
      </InputContainer>
      <InputContainer width="50%" paddingLeft="0.5em">
        <Label htmlFor="subject">{translations.subject.name} *</Label>
        <Input
          id="subject"
          placeholder={translations.subject.placeholder}
          type="text"
          value={values.subject}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.subject && touched.subject}
        />
        {errors.subject && touched.subject && <ErrorText>{errors.subject}</ErrorText>}
      </InputContainer>
      <InputContainer>
        <Label htmlFor="message">{translations.message.name} *</Label>
        <InputArea
          id="message"
          placeholder={translations.message.placeholder}
          type="text"
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.message && touched.message}
        />
        {errors.message && touched.message && <ErrorText>{errors.message}</ErrorText>}
      </InputContainer>
      <InvertedButton
        type="submit"
        disabled={isSubmitting || status === 'success'}
        noMargin
        padding="0.5em 2em"
      >
        {translations.send}
      </InvertedButton>
      {status === 'success' && <Success>{translations.success}</Success>}
      {status === 'error' && <Error>{translations.error}</Error>}
    </Form>
  )
}

const ContactForm = withFormik({
  mapPropsToValues: props => ({
    subject: '',
    email: '',
    message: '',
    recipient: props.recipientsList[0],
  }),
  validationSchema: props =>
    Yup.object().shape({
      email: Yup.string()
        .email(props.translations.email.error.invalid)
        .required(props.translations.email.error.required),
      message: Yup.string()
        .max(1000, props.translations.message.error.max)
        .required(props.translations.message.error.required),
      subject: Yup.string().required(props.translations.subject.error.required),
      recipient: Yup.mixed()
        .nullable('true')
        .required(props.translations.recipient.error.required),
    }),
  handleSubmit: (values, { props, setSubmitting, setStatus }) => {
    axios
      .post(`/api/dataset/${props.datasetID}/contact`, {
        subject: values.subject,
        sender: values.email,
        body: values.message,
        agent_type: values.recipient.value,
      })
      .then(res => {
        setStatus('success')
      })
      .catch(err => {
        console.log(err)
        setStatus('error')
      })
    setSubmitting(false)
  },
  displayName: 'ContactForm', // helps with React DevTools
})(InnerForm)

export default ContactForm
