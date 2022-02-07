import React from "react";
import ReactQuill from "react-quill";
import EditorToolbar, { modules, formats } from "./EditorToolbar";
import "react-quill/dist/quill.snow.css";

export const Editor = (props) => {
    const { value, onChange, placeholder, ...other } = props;

    return (
        <div className="text-editor">
            <EditorToolbar />
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                modules={modules}
                formats={formats}
                {...other}
            />
        </div>
    );
};

export default Editor;