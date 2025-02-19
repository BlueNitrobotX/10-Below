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

export default function Experience()
{
    // let currentPauseState = useFrame(() => {
    //     let a = pauseState.value
        
    //     return a
    // })

    // const currentPauseState = pauseState.pauseState
    // console.log(currentPauseState)

    const playerModel = useGLTF("./animatedModel4.glb")


    const { scene } = useThree()
    scene.fog = new FogExp2("#ffffff", 0.02)

    // const player = useRef()
    const { camera } = useThree()


    // const pauseStore = createStore((set) => ({
    //     paused: true
    // }) )


    // let paused1 = pauseStore.getState()
    // let paused = paused1.paused

    // const [ key, setKey ] = useState(0)
    const [ pauseState, setPauseState ] = useState(true)

    useEffect(() => {

        function unPausePhysics() {

            // setKey(key + 1)
            setPauseState(false)
            // pauseStore.setState({paused: false})
        }


    


        document.addEventListener("beginStartSequence", () => {
            // pauseStore.setState({ paused: false })
            unPausePhysics()
        })

    }, [ pauseState ])


    


    return <>
        
        {/* <OrbitControls makeDefault={ true } /> */}

        <color args={ [ '#1f2b40' ] } attach="background" />

        {/* <Perf /> */}

            <Physics debug={ false } key={ 1 } colliders={ false } paused={ pauseState } >
                <Lights />
                {/* <Stage shadows={ true } > */}
                    <Environment background files={ './mud_road_puresky_1k.exr' } />
                    <Level shadows />

                        <Ecctrl floatHeight={ 0.14 } camZoomSpeed={ 0 } camInitDis={ -3 } disableFollowCam={ false } turnVelMultiplier={ 1 } turnSpeed={ 100 } mode="CameraBasedMovement" >
                                <Player />
                        </Ecctrl>
                {/* </Stage> */}
            </Physics>
        
    </>
}