"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "@uiw/react-md-editor/markdown-editor.css";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type MarkdownEditorProps = {
  name: string;
  defaultValue?: string;
};

export default function MarkdownEditor({ name, defaultValue = "" }: MarkdownEditorProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => setValue(val ?? "")}
        height={300}
        preview="edit"
      />
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
