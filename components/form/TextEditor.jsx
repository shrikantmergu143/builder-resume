import { Editor } from 'primereact/editor'
import React from 'react'

export default function TextEditor({onChange, name, value, placeholder, className, maxLength}) {
    const handleChange = (e) =>{
        if(onChange){
            onChange({
                target:{
                    value: e.htmlValue,
                    name: name
                }
            })
        }
    }
  return (
    <Editor
        value={value}
        onTextChange={handleChange}
        className={`text-editor w-full ${className}`}
        name={name}
        placeholder={placeholder}
        // maxLength={maxLength}
    />
  )
}
