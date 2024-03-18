{
  /**
   * This file is part of the Etsin service
   *
   * Copyright 2017-2018 Ministry of Education and Culture, Finland
   *
   *
   * @author    CSC - IT Center for Science Ltd., Espoo Finland <servicedesk@csc.fi>
   * @license   MIT
   */
}

import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withFormik } from 'formik'
import * as yup from 'yup'
import axios from 'axios'
import Select from '@/components/etsin/general/select'

import Input, { InputArea } from '../common/formItems'
import { InvertedButton } from '@/components/etsin/general/button'
import ErrorBoundary from '@/components/general/errorBoundary'
import urls from '@/utils/urls'

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
  return (
    <Form onSubmit={handleSubmit}>
      <InputContainer>
        <ErrorBoundary>
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
          {errors.recipient && touched.recipient && (
            <ErrorText aria-live="assertive">{errors.recipient}</ErrorText>
          )}
        </ErrorBoundary>
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
        {errors.email && touched.email && (
          <ErrorText aria-live="assertive">{errors.email}</ErrorText>
        )}
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
        {errors.subject && touched.subject && (
          <ErrorText aria-live="assertive">{errors.subject}</ErrorText>
        )}
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
        {errors.message && touched.message && (
          <ErrorText aria-live="assertive">{errors.message}</ErrorText>
        )}
      </InputContainer>
      <Flex>
        <InvertedButton
          type="submit"
          disabled={isSubmitting || status === 'success'}
          noMargin
          padding="0.5em 2em"
        >
          {translations.send}
        </InvertedButton>
        {status === 'success' && <Success aria-live="assertive">{translations.success}</Success>}
        {errors.sending === 'error 500' && (
          <Error aria-live="assertive">
            {translations.errorInternal} (
            <a
              href="mailto:servicedesk@csc.fi?Subject=Etsin%20Contact%20Form%20Internal%20Server%20Error"
              target="_top"
            >
              servicedesk@csc.fi
            </a>
            ).
          </Error>
        )}
        {errors.sending === 'error' && <Error aria-live="assertive">{translations.error}</Error>}
      </Flex>
    </Form>
  )
}
InnerForm.defaultProps = {
  status: undefined,
}

InnerForm.propTypes = {
  values: PropTypes.object.isRequired,
  touched: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleBlur: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  setFieldTouched: PropTypes.func.isRequired,
  status: PropTypes.string,
  translations: PropTypes.object.isRequired,
  recipientsList: PropTypes.array.isRequired,
}

const ContactForm = withFormik({
  validateOnChange: false,
  mapPropsToValues: props => ({
    subject: '',
    email: '',
    message: '',
    recipient: props.recipientsList[0],
  }),
  validationSchema: props => {
    const validation = yup.object().shape({
      email: yup
        .string()
        .email(props.translations.email.error.invalid)
        .required(props.translations.email.error.required),
      message: yup
        .string()
        .max(1300, props.translations.message.error.max)
        .required(props.translations.message.error.required),
      subject: yup.string().required(props.translations.subject.error.required),
      recipient: yup.mixed().nullable('true').required(props.translations.recipient.error.required),
    })
    return validation
  },
  handleSubmit: (values, { props, setSubmitting, setStatus, setFieldError }) => {
    setStatus('')
    const url = props.useV3
      ? props.metaxV3Url('datasetContact', props.datasetID)
      : urls.email(props.datasetID)
    const payload = props.useV3
      ? {
          subject: values.subject,
          reply_to: values.email,
          body: values.message,
          role: values.recipient.value,
          service: 'etsin',
        }
      : {
          user_subject: values.subject,
          user_email: values.email,
          user_body: values.message,
          agent_type: values.recipient.value,
        }
    axios
      .post(url, payload)
      .then(() => {
        setStatus('success')
        props.close(undefined, true)
      })
      .catch(err => {
        console.log(err)
        if (err.response.status === 500) {
          setStatus('error 500')
          setFieldError('sending', 'error 500')
        } else {
          setFieldError('sending', 'error')
          setStatus('error')
        }
      })
    setSubmitting(false)
  },
  displayName: 'ContactForm', // helps with React DevTools
})(InnerForm)

ContactForm.propTypes = {
  recipientsList: PropTypes.array,
  translations: PropTypes.object,
  datasetID: PropTypes.string,
}

/* Styles */

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

const Flex = styled.div`
  display: flex;
`

export default ContactForm
