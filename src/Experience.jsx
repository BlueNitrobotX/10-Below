import { useGLTF, Stage, KeyboardControls, OrbitControls, Environment, useKeyboardControls, Html } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level } from './Level.js'
import { Physics } from '@react-three/rapier'
// import { Perf } from 'r3f-perf'
import Ecctrl from "ecctrl"
import Player from './Player.js'
import IntroScene from './IntroScene.jsx'
import useGame from './stores/useGame.js'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { FogExp2 } from 'three'
import { create, createStore } from 'zustand'
import * as THREE from 'three'

export default function Experience()
{

    const player = useRef()
    const playerModel = useGLTF("./animatedModel4.glb")


    const { scene } = useThree()
    // scene.fog = new FogExp2("#ffffff", 0.008)

    // const player = useRef()
    const { camera } = useThree()


    const [ currentAnimation, setCurrentAnimation ] = useState('Falling')
    const [ pauseState, setPauseState ] = useState(true)
    const [ trackingPlayer, setTrackingPlayer ] = useState(false)
    
    useEffect(() => {
        window.appData = {
            playerX: 0,
            playerY: 60,
            playerZ: 0
        }
    }, [])

    // Custom animation manager/cutscene manager
    useEffect(() => {

        function unPausePhysics() {
            setPauseState(false)
        }

        camera.position.set(-3, -3, 10)

        // Intro Cutscene
        document.addEventListener("beginStartSequence", () => {
            unPausePhysics()
            setTrackingPlayer(true)
            const wait = setTimeout(() => {
                setCurrentAnimation('Idle')
                setTrackingPlayer(false)
            }, 4250)

        })

    }, [ pauseState ])

    useFrame((state) => {
        if( trackingPlayer === true ) {
            const cameraTarget = new THREE.Vector3(window.appData.playerPosition.x, window.appData.playerPosition.y, window.appData.playerPosition.z)
            state.camera.lookAt(cameraTarget)
        }
    })

    /**
    * Current animations list:
    * 'Falling' 
    * 'Gangnam Style'
    * 'Idle' 
    * 'Jumping' 
    * 'Running' 
    * 'Walking'
    */


    return <>
        
        {/* <OrbitControls makeDefault={ true } /> */}

        <color args={ [ '#1f2b40' ] } attach="background" />

        {/* <Perf /> */}

            <Physics debug={ false } key={ 1 } colliders={ false } paused={ pauseState } >
                <Lights />
                {/* <Stage shadows={ true } > */}
                    <Environment background files={ './mud_road_puresky_1k.exr' } />
                    <Level shadows />

                        {/* <Ecctrl floatHeight={ 0.14 } camZoomSpeed={ 0 } camInitDis={ -3 } disableFollowCam={ false } turnVelMultiplier={ 1 } turnSpeed={ 100 } mode="CameraBasedMovement" > */}
                                <Player currentAnimation={ currentAnimation } />
                        {/* </Ecctrl> */}
                {/* </Stage> */}
            </Physics>
        
    </>
}