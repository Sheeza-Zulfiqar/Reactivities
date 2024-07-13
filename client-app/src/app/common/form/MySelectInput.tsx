import { useField } from "formik";
import React from "react";
import { Form, Label, Select } from "semantic-ui-react";

interface Props {
    placeholder: string,
    name: string,
    options: {text:string,value:string}[], //any
    label?: string,
}
export default function MySelectInput(props: Props) {
    //helpers allows us to manually a set, or allow us to set the touch status of our input component
    const [field, meta, helpers] = useField(props.name);
    return (
        //double exclamation marks just makes this object into a boolean
        <Form.Field error={meta.touched && !!meta.error}>
            <label>{props.label}</label>
            <Select clearable
                options={props.options}
                value={field.value || null}
                onChange={(_,d)=>helpers.setValue(d.value)}
                onBlur={()=> helpers.setTouched(true)}
                placeholder={props.placeholder}
            />
            {meta.touched && meta.error ? (
                <Label basic color="red"> {meta.error}</Label>
            ) : null
            }
        </Form.Field>

    )
}