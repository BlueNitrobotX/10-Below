import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { KeyboardControls, PerspectiveCamera, useKeyboardControls } from "@react-three/drei"
import Menu from './Menu.jsx'
import IntroScene from './IntroScene.jsx'
import * as THREE from 'three'
import { useRef, useState } from 'react'

const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    // Optional animation key map
    { name: "action1", keys: ["1"] },
    { name: "action2", keys: ["2"] },
    { name: "action3", keys: ["3"] },
    { name: "pause", keys: ["KeyP"] },
  ]

let pauseState = true

document.addEventListener("pause", () => {
    pauseState = !pauseState
    // console.log(pauseState)
})



const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render( <>
    <KeyboardControls map={keyboardMap}>
        
            <Canvas shadows >
                <IntroScene />
                    <PerspectiveCamera fov={ 70 } near={ 0.05 } far={ 1000 } position={ [ 0, 1, 0 ] } />
                    <Experience pauseState={ pauseState } />  
            </Canvas>
        
        <Menu />
        {/* <Interface /> */}
    </KeyboardControls>
    </>
)