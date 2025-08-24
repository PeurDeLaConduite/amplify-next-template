"use client";

import { useEffect, useRef } from "react";
import EditorJS, { type OutputData } from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Embed from "@editorjs/embed";
import { uploadData, getUrl } from "aws-amplify/storage";

interface EditorProps {
    data?: OutputData;
    onChange?: (data: OutputData) => void;
}

export default function Editor({ data, onChange }: EditorProps) {
    const editorRef = useRef<EditorJS>();

    useEffect(() => {
        if (editorRef.current) return;

        const editor = new EditorJS({
            holder: "editorjs",
            data,
            autofocus: true,
            tools: {
                header: Header,
                list: List,
                embed: Embed,
                image: {
                    class: Image,
                    config: {
                        uploader: {
                            async uploadByFile(file: File) {
                                const { path } = await uploadData({
                                    path: `images/${file.name}`,
                                    data: file,
                                }).result;
                                const url = await getUrl({ path });
                                return {
                                    success: 1,
                                    file: { url: url.toString() },
                                };
                            },
                        },
                    },
                },
            },
            async onChange(api) {
                const output = await api.saver.save();
                onChange?.(output);
            },
        });

        editorRef.current = editor;

        return () => {
            editorRef.current?.destroy();
            editorRef.current = undefined;
        };
    }, [data, onChange]);

    return <div id="editorjs" />;
}
