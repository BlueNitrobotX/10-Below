import './style.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import Experience from './Experience.jsx'
import { KeyboardControls } from "@react-three/drei"
import Menu from './Menu.jsx'
import * as THREE from 'three'
import { useRef } from 'react'

const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render( <>
        <Canvas
            shadows
            camera={ {
                fov: 45,
                near: 0.1,
                far: 1000,
                position: [ 0, 1, 0 ]
            } }
        >
            <Experience />    
        </Canvas>
        <Menu />
        {/* <Interface /> */}
    </>
)