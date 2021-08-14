import './App.css';

import * as qna from '@tensorflow-models/qna';
import * as tf from '@tensorflow/tfjs';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import Loader from "react-loader-spinner";
import {Fragment, useEffect,useState,useRef} from "react";
tf.ENV.set('WEBGL_PACK', false)

function App() {

  //setup references
  const passageRef=useRef(null);
  const qsRef=useRef(null);
  //setup state hooks
  const[answer,setAnswer]=useState();
  const[model,setModel]=useState(null);

  //load our bert model
  const loadModel = async()=>{
    const loadedModel=await qna.load()
    setModel(loadedModel);
    console.log("Model loaded.")

  } 

  useEffect(()=>{loadModel()},[])

  const qsAnswer =async(e)=>
  {
    if(e.which===13 && model!=null)
    {
      console.log("Question asked.")
      const passage=passageRef.current.value
      const qs=qsRef.current.value
      
      const ans=await model.findAnswers(qs,passage)
      setAnswer(ans)
      console.log(ans)
    }
  }
    return (
    <div className="App">
      <header className="App-header">
        {model==null?
        <div>
          <div> Model Loading...</div>
            <Loader
            type="Puff"
            color="#00BFFF"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        </div>        
       :
       <Fragment>
         Passage
         <textarea ref={passageRef} rows="30" cols="100"></textarea>
         Your question:
         <input ref={qsRef} onKeyPress={qsAnswer} size="88"></input>
         Answers
         {answer ? answer.map((ans,idx)=><div><b>Answer {idx+1}-</b>{ans.text}({Math.floor(ans.score+100/100)})</div>):""}
       </Fragment>
      }
      </header>
    </div>
  );
}

export default App;
