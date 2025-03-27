import { useGLTF, Stage, KeyboardControls, OrbitControls, Environment, useKeyboardControls, Html, CameraControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level } from './Level.js'
import { Physics, useRapier } from '@react-three/rapier'
// import { Perf } from 'r3f-perf'
import Ecctrl from "ecctrl"
import Player from './Player.js'
import useGame from './stores/useGame.js'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { FogExp2 } from 'three'
import { create, createStore } from 'zustand'
import * as THREE from 'three'

export default function Experience()
{

    const [ backgroundMusic ] = useState(() => 
    {
        const audio = new Audio('./Beautiful piano.mp3')
        audio.currentTime = 0
        audio.preload = 'auto'
        audio.loop = true        
        audio.volume = 0.03
        return audio
    }
) //GET OUT (sound effect).mp3

    const player = useRef()
    const playerModel = useGLTF("./animatedModel4.glb")
    const { scene } = useThree()
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const die = useGame((state) => state.die)
    // scene.fog = new FogExp2("#ffffff", 0.008)



        window.appData = {
            playerX: 0,
            playerY: 60,
            playerZ: 0,
            heightRayTOI: 60
        }

    const [ currentAnimation, setCurrentAnimation ] = useState('Falling')
    const [ pauseState, setPauseState ] = useState(true)
    const [ trackingPlayer, setTrackingPlayer ] = useState(false)
    const [ cameraLocked, setCameraLocked ] = useState(true)
    const [ isGameplayCamera, setCurrentCamera ] = useState(false)
    const [ orbitTarget, setOrbitTarget ] = useState( new THREE.Vector3( window.appData.playerX, window.appData.playerY, window.appData.playerZ ) )
    const [ isIntroDone, setIsIntroDone ] = useState(false)

    const phase = useGame((state) => state.phase)
    


    /**
    * Current animations list:
    * 'Falling' 
    * 'Gangnam_Style'
    * 'Idle' 
    * 'Jumping' 
    * 'Running' 
    * 'Walking'
    * 'Falling Idle' doesn't work
    * 'Jumping Up' doesn't work
    * 'Jumping Down' doesn't work
    */

        // Background music loop

    function playMusic() {
        // backgroundMusic.volume = 0.5
        // backgroundMusic.currentTime = 0
        backgroundMusic.play()
    }

    // useFrame(() => {
    //     if(backgroundMusic.ended) {
    //         const wait = setTimeout(() => {
    //             playMusic()
    //         }, 1000)
    //     }
    // })





    useFrame(() => {
        
        const keys = getKeys()

        if(isIntroDone) {

            if( keys.forward || keys.backward || keys.leftward || keys.rightward  && !keys.run) {
                setCurrentAnimation('Walking')
            } else if( keys.run ) {
                setCurrentAnimation('Running')
            } else if( keys.jump ) {
                setCurrentAnimation('Jumping')
            } else { 
                setCurrentAnimation('Idle')
            }

        }

        if(keys.action1) {
            die()
        }

    })

/**
 * {
    "forward": false,
    "backward": false,
    "leftward": false,
    "rightward": false,
    "jump": false,
    "run": false,
    "action1": false,
    "action2": false,
    "action3": false,
    "pause": false
}
 */

    // Custom animation manager/cutscene manager
    useMemo((state) => {

        setCameraLocked(false)
        function unPausePhysics() {
            setPauseState(false)
        }

        // camera.position.set(-3, -3, 10)

        // Intro Cutscene
        document.addEventListener("beginStartSequence", () => {
            unPausePhysics()
            playMusic()
            // setTrackingPlayer(true)
            
            const wait = setTimeout(() => {
                setCurrentAnimation('Running')
                setIsIntroDone(true)
                
            //     const wait2 = setTimeout(() => {
            //         setTrackingPlayer(false)
            //         setCameraLocked(false)
            //         setCurrentCamera(true)
            //         camera.position.set(window.appData.playerPosition.x, window.appData.playerPosition.y + 2, window.appData.playerPosition.z - 2)
            //         camera.lookAt(window.appData.playerPosition.x, window.appData.playerPosition.y, window.appData.playerPosition.z)
            //     }, 1000)

            }, 4250)

        })

    }, [])

    // useFrame((state) => {
    //     if( trackingPlayer === true ) {
    //         const cameraTarget = new THREE.Vector3(window.appData.playerPosition.x, window.appData.playerPosition.y, window.appData.playerPosition.z)
    //         state.camera.lookAt(cameraTarget)
    //     } 
    // })






    return <>

        <OrbitControls makeDefault target={ [ 0, -10, 0 ] } />

        <color args={ [ '#1f2b40' ] } attach="background" />

        {/* <Perf /> */}


        {/* Camera 2: (For ecctrl) */}

        {/* <PerspectiveCamera makeDefault={ isGameplayCamera } fov={ 70 } near={ 0.05 } far={ 1000 } /> */}

        {/* Camera 1: (For intro sequence) */}

        {/* { !isGameplayCamera && <PerspectiveCamera fov={ 70 } near={ 0.05 } far={ 100 } position={ [ -3, -3, 10 ] } makeDefault={ cameraLocked } /> } */}

            <Physics debug={ false } colliders={ false } paused={ pauseState } timeStep={ 1 / 120 } >
                <Lights />
                {/* <Stage shadows={ true } > */}
                    <Environment background files={ './mud_road_puresky_1k.exr' } />
                        <Level shadows />
                        <Player props={ { isGameplayCamera: isGameplayCamera, currentAnimation: currentAnimation } } />
                {/* </Stage> */}
            </Physics>
        
    </>
}