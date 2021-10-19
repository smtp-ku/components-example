import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { userCoreState } from "../store/basic";
import Editor, { Monaco } from "@monaco-editor/react";
import { fromMonaco } from "@hackerrank/firepad";
import firebase from "firebase";

type CodeShareProps = {
  id: string;
};

export const CodeShare: React.FC<CodeShareProps> = (props) => {
  const userData = useRecoilValue(userCoreState);
  const projectId = props.id;

  const [htmlEditorLoaded, setHtmlEditorLoaded] = useState(false);
  const [cssEditorLoaded, setCssEditorLoaded] = useState(false);
  const [jsEditorLoaded, setJsEditorLoaded] = useState(false);

  const htmlEditorRef = useRef(null);
  const cssEditorRef = useRef(null);
  const jsEditorRef = useRef(null);

  function handleHtmlEditorDidMount(editor: any, monaco: Monaco) {
    htmlEditorRef.current = editor;
    setHtmlEditorLoaded(true);
  }

  function handleCssEditorDidMount(editor: any, monaco: Monaco) {
    cssEditorRef.current = editor;
    setCssEditorLoaded(true);
  }

  function handleJsEditorDidMount(editor: any, monaco: Monaco) {
    jsEditorRef.current = editor;
    setJsEditorLoaded(true);
  }

  useEffect(() => {
    if (
      !htmlEditorLoaded ||
      !cssEditorLoaded ||
      !jsEditorLoaded ||
      projectId === ""
    ) {
      // If editor is not loaded return
      return;
    }
    const projectDBRef = firebase.database().ref().child(projectId);

    const htmlCodeDBRef = projectDBRef.child("html");
    const cssCodeDBRef = projectDBRef.child("css");
    const jsCodeDBRef = projectDBRef.child("js");

    const htmlFirePad = fromMonaco(htmlCodeDBRef, htmlEditorRef.current!);
    const cssFirePad = fromMonaco(cssCodeDBRef, cssEditorRef.current!);
    const jsFirePad = fromMonaco(jsCodeDBRef, jsEditorRef.current!);

    htmlFirePad.setUserName(userData.name);
    htmlFirePad.setUserColor(userData.color);
    cssFirePad.setUserName(userData.name);
    cssFirePad.setUserColor(userData.color);
    jsFirePad.setUserName(userData.name);
    jsFirePad.setUserColor(userData.color);
  }, [htmlEditorLoaded, cssEditorLoaded, jsEditorLoaded, userData, projectId]);

  return (
    <div>
      <div style={{ width: "30vw", float: "left" }}>
        <Editor
          height="90vh"
          defaultLanguage="html"
          theme="vs-dark"
          defaultValue="// Welcome to My Editor"
          onMount={handleHtmlEditorDidMount}
        />
      </div>
      <div style={{ width: "30vw", float: "left" }}>
        <Editor
          height="90vh"
          defaultLanguage="css"
          theme="vs-dark"
          defaultValue="// Welcome to My Editor"
          onMount={handleCssEditorDidMount}
        />
      </div>
      <div style={{ width: "30vw", float: "left" }}>
        <Editor
          height="90vh"
          defaultLanguage="javascript"
          theme="vs-dark"
          defaultValue="// Welcome to My Editor"
          onMount={handleJsEditorDidMount}
        />
      </div>
    </div>
  );
};
