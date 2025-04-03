import React from 'react'
import {Editor} from '@tinymce/tinymce-react'
import {Controller} from 'react-hook-form'
import conf from "../conf/conf.js";

export default function RTE({name, control, label, defaultValue =''}) {
  return (
    <div className='w-full'>
        {label && <label className='inline-block mb-1 pl-1'>
            {label}
        </label>}
        <Controller
        name={name || 'content'}
        control={control}
        render={({field: {onChange}}) => (
            <Editor 
        apiKey= {conf.tinyMceApiKey}
        initialValue= {defaultValue}
        init={{
        initialValue: defaultValue,
        height: 300,
        menubar: true,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'charmap', 
          'anchor', 'searchreplace', 'visualblocks', 'fullscreen',
          'insertdatetime', 'help', 'wordcount'
         ],
         toolbar: 'undo redo | blocks | ' +
         'bold italic forecolor | alignleft aligncenter ' +
         'alignright alignjustify | bullist numlist outdent indent | ' +
         'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
      onEditorChange={onChange}
    />
        )}
        />
    </div>
    
  )
}

