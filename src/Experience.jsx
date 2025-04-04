import { useGLTF, Stage, KeyboardControls, OrbitControls, Environment, useKeyboardControls, Html, CameraControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level } from './Level.js'
import { CapsuleCollider, Physics, RigidBody, useRapier } from '@react-three/rapier'
// import { Perf } from 'r3f-perf'
import Ecctrl from "ecctrl"
import Player from './Player.js'
import useGame from './stores/useGame.js'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { FogExp2 } from 'three'
import { create, createStore } from 'zustand'
import * as THREE from 'three'
import { useControls } from 'leva'

export default function Experience()
{

    const [ backgroundMusic ] = useState(() => 
    {
        const audio = new Audio('./Beautiful piano.mp3')
        audio.currentTime = 0
        audio.preload = 'auto'
        audio.loop = true        
        audio.volume = 0.1
        return audio
    }
)



    const player = useRef()
    const playerModel = useGLTF("./animatedModel4.glb")
    const { scene, camera } = useThree()
    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    const phase = useGame((state) => state.phase)
    const die = useGame((state) => state.die)
    const musicEnabled = useGame((state) => state.musicEnabled)
    const terrainHeightAtSpawn = useGame((state) => state.terrainHeightAtSpawn)

    // scene.fog = new FogExp2("#ffffff", 0.008)


    window.appData = {
        playerX: 0,
        playerY: 60,
        playerZ: 0,
        // terrainHeightAtSpawn: 0
        // heightRayTOI: 60
    }

    



    const [ currentAnimation, setCurrentAnimation ] = useState('Falling')
    const [ pauseState, setPauseState ] = useState(true)
    const [ trackingPlayer, setTrackingPlayer ] = useState(false)
    const [ cameraLocked, setCameraLocked ] = useState(true)
    const [ isGameplayCamera, setCurrentCamera ] = useState(false)
    const [ orbitTarget, setOrbitTarget ] = useState( new THREE.Vector3( window.appData.playerX, window.appData.playerY, window.appData.playerZ ) )
    const [ isIntroDone, setIsIntroDone ] = useState(false)
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    let musicOn = true
    
    /**
    * Current animations list:
    * 'Falling' 
    * 'Gangnam_Style'
    * 'Idle' 
    * 'Jumping' 
    * 'Running' 
    * 'Walking'
    */


    useEffect(() => {

        useGame.subscribe(
            (state) => state.musicEnabled,
            (value) => {
                console.log('Music Enabled?', value)
                musicOn = !musicOn
            }
        )

    }, [])

    function playMusic() {
        if(musicOn) {
            backgroundMusic.play()
            console.log('Playing Music')
        }
    }


    // Player Animation Controller
    useFrame(() => {

        const keys = getKeys()

        if(isIntroDone) {

            if( keys.forward || keys.backward || keys.leftward || keys.rightward ) {

                if( !keys.run ) {
                    setCurrentAnimation('Walking')
                }
                if( keys.run ) {
                    setCurrentAnimation('Running')
                }

            } 
            // else if( keys.jump ) {
            //     setCurrentAnimation('Jumping')
            // } 
            // else if( keys.easterEgg ) {
            //     setCurrentAnimation('Gangnam_Style')
            // }
            else { 
                setCurrentAnimation('Idle')
            }

        }

        // if(keys.action1) {
        //     die()
        // }

    })



    // Custom animation manager/cutscene manager
    useEffect((state) => {

        setCameraLocked(false)
        function unPausePhysics() {
            setPauseState(false)
        }

        camera.position.set(-3, -3, 10)

        // Intro Cutscene
        document.addEventListener("beginStartSequence", () => {
            unPausePhysics()
            
            const wait0 = setTimeout(() => {
               playMusic() 
            }, 20)
            
            setTrackingPlayer(true)
            
            // const wait = setTimeout(() => {
            //     setCurrentAnimation('Idle')
            //     setIsIntroDone(true)
                
            //     const wait2 = setTimeout(() => {
            //         
            //         setTrackingPlayer(false)
            //         setCameraLocked(false)
            //         setCurrentCamera(true)
            //     }, 1000)

            // }, 4250)


        })

    }, [])

    function onCollisionEnter() {

        setCurrentAnimation('Idle')
        setIsIntroDone(true)

        const wait2 = setTimeout(() => {

            setTrackingPlayer(false)
            setCameraLocked(false)
            setCurrentCamera(true)
        }, 1000)

    }

    useFrame((state, delta) => {
        if( trackingPlayer === true ) {
            const cameraTarget = new THREE.Vector3(window.appData.playerX, window.appData.playerY, window.appData.playerZ)
            smoothedCameraTarget.lerp(cameraTarget, 9 * delta)
            state.camera.lookAt(smoothedCameraTarget)
        } 

        if(!isIntroDone) {
            if(window.appData.playerY < ( terrainHeightAtSpawn + 0.1 )) {
                onCollisionEnter()
            }
        }
    
        console.log("player height", window.appData.playerY)
        console.log("terrain height", terrainHeightAtSpawn)

    })

    return <>

        {/* <OrbitControls makeDefault target={ [ 0, -10, 0 ] } /> */}

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
                            <Player props={ { isGameplayCamera: isGameplayCamera, currentAnimation: currentAnimation } }  />
                {/* </Stage> */}
            </Physics>
        
    </>
}