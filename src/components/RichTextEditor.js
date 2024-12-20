"use client";

import React, { useEffect, useRef } from "react";
import styles from "../styles/Upload.module.css";

export default function JoditEditorComponent({ value, onChange, config }) {
  const editorRef = useRef(null);
  const joditInstanceRef = useRef(null);

  useEffect(() => {
    const loadJoditDependencies = async () => {
      if (
        !document.querySelector(
          'link[href="https://cdn.jsdelivr.net/npm/jodit@4.2.47/es2015/jodit.min.css"]'
        )
      ) {
        // Load Jodit CSS
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          "https://cdn.jsdelivr.net/npm/jodit@4.2.47/es2015/jodit.min.css";
        document.head.appendChild(link);
      }

      if (!window.Jodit) {
        // Load Jodit JS
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/jodit@4.2.47/es2018/jodit.fat.min.js";
        script.onload = initializeEditor;
        document.body.appendChild(script);
      } else {
        initializeEditor();
      }
    };

    const initializeEditor = () => {
      if (window.Jodit && editorRef.current && !joditInstanceRef.current) {
        joditInstanceRef.current = new Jodit(editorRef.current, {
          ...config,
          value,
          iframe: true,
          readonly: false,
          toolbar: true,
          placeholder: "Enter the product details...",
          minHeight: 600,
          width: "100%",
          toolbarSticky: true,
          uploader: {
            insertImageAsBase64URI: true,
          },
          buttons: [
            // Row 1: Basic text formatting
            "bold",
            "italic",
            "underline",
            "strikethrough",
            "eraser",
            "|",
            // Row 2: Lists and alignment
            "ul",
            "ol",
            "outdent",
            "indent",
            "|",
            "align",
            "|",
            // Row 3: Font settings
            "font",
            "fontsize",
            "paragraph",
            "|",
            // Row 4: Line height and script options
            "lineHeight",
            "superscript",
            "subscript",
            "|",
            // Row 5: Insert elements
            "classSpan",
            "file",
            "image",
            "video",
            "|",
            // Row 6: Editing tools
            "spellcheck",
            "speechRecognize",
            "|",
            "cut",
            "copy",
            "paste",
            "|",
            // Row 7: Links, table, and extra tools
            "link",
            "unlink",
            "table",
            "symbols",
            "|",
            // Row 8: Viewer and source options
            "source",
            "print",
            "fullsize",
            "preview",
            "|",
            // Row 9: Undo/Redo and find
            "undo",
            "redo",
            "find",
            "|",
          ],
          events: {
            change: (newContent) => onChange(newContent),
            afterInsertImage: (img) => {
              if (img) {
                img.style.width = "100%";
                img.style.height = "auto";
                img.style.objectFit = "contain";
                img.classList.add(styles.image);
                img.onclick = () => window.open(img.src, "_blank");
              }
            },
          },
        });
      }
    };

    loadJoditDependencies();

    return () => {
      if (joditInstanceRef.current) {
        joditInstanceRef.current.destruct();
        joditInstanceRef.current = null;
      }
    };
  }, [config, value]);

  return <textarea ref={editorRef} className={styles.reactquillinputfield} />;
}
