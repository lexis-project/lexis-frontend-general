import React from "react"
//import Form from "react-bootstrap/Form"
//import Col from "react-bootstrap/Col"
import { Field } from "redux-form"

const renderField = ({
    input,
    description,
    label,
    type,
    meta: { touched, error },
}) => (
    <div>
        <input {...input} type={type} placeholder={label} className="mr-2" />
        {touched && error && <span>{error}</span>}
        <label>{label}</label>
        <p>{description}</p>
    </div>
)

// const RenderInputParamaters = ({ inputParams, meta: { error, touched } }) => (
//   <div className="form-group">
//     {inputParams.map(({ inputParamName, description }) => (
//       <div className="col-12" key={inputParamName}>
//         <Field
//           name={`InputParamaters.${inputParamName}`}
//           type="text"
//           component={renderField}
//           label={`${inputParamName}`}
//           //normalize={(value) => (value === true ? "" + id : null)}
//           description={`${description}`}
//         />
//       </div>
//     ))}
//     {touched && error && (
//       <Form.Feedback type="invalid">{touched}</Form.Feedback>
//     )}
//   </div>
// )

const RenderInputParamaters = ({ inputParams, meta: { error, touched } }) => (
    <div className="form-group">
        {inputParams.map(({ inputParamName, description }, index) => (
            <div className="col-12" key={inputParamName}>
                <Field
                    name={`InputParamaters.${index}`}
                    type="text"
                    component={renderField}
                    label={`${inputParamName}`}
                    //normalize={(value) => (value === true ? "" + id : null)}
                    description={`${description}`}
                />
            </div>
        ))}
        {/* {touched && error && (
      <Form.Feedback type="invalid">{touched}</Form.Feedback>
    )} */}
    </div>
)

export default RenderInputParamaters
