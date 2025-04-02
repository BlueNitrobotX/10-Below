import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { KeyboardControls, PerspectiveCamera, useKeyboardControls } from "@react-three/drei"
import Menu from './Menu.jsx'
import * as THREE from 'three'
import { useRef, useState } from 'react'
import { create } from 'zustand'

const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    // { name: "easterEgg", keys:["keyG"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
    // Optional animation key map
    { name: "action1", keys: ["1"] },
    { name: "action2", keys: ["2"] },
    { name: "action3", keys: ["3"] },
  ]

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render( <>
    <KeyboardControls map={ keyboardMap }>

            <Canvas 
            shadows
            // onPointerDown={(e) => { if (e.pointerType === "mouse") {e.target.requestPointerLock() } } }
            >
                <Experience />  
            </Canvas>
        
        <Menu />
        {/* <Interface /> */}
    </KeyboardControls>
    </>
)