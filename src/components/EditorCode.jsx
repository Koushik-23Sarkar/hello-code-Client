import React, { useEffect, useRef } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import ACTIONS from '../Action';

const Editor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);

    useEffect(() => {
        async function init() {
            editorRef.current = Codemirror.fromTextArea(
                document.getElementById('realtimeEditor'),
                {
                    mode: { name: 'javascript', json: true },
                    theme: 'dracula',
                    autoCloseTags: true,
                    autoCloseBrackets: true,
                    lineNumbers: true,
                }
            );
            
        
            //----------Important----------------------//
            editorRef.current.on('change',(instance,changes)=>{ //when i type in the editor it will call
                //console.log('changes',changes);
                const {origin} = changes;
               const code = instance.getValue();
               onCodeChange(code);
                if(origin !== 'setValue'){
                    socketRef.current.emit(ACTIONS.CODE_CHANGE,{roomId,code,})
                }
            });

            //editorRef.current.setValue("//Write code in here//");


        }
        init();
    }, []);

    useEffect(()=>{
        if(socketRef.current){
            socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>{
                if(code !== null){
                    editorRef.current.setValue(code);
                }
            })
        }

        return ()=>{
            socketRef.current.off(ACTIONS.CODE_CHANGE);
        }

    },[socketRef.current]);//3.13.00

    return <textarea id="realtimeEditor"></textarea>;
};

export default Editor;