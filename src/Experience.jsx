import { useGLTF, Stage, KeyboardControls, OrbitControls, Environment, useKeyboardControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level } from './Level.js'
import { Physics } from '@react-three/rapier'
// import { Perf } from 'r3f-perf'
import Ecctrl from "ecctrl"
import Player from './Player.js'
import useGame from './stores/useGame.js'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { FogExp2 } from 'three'

export default function Experience()
{
    window.pauseState = true

    useFrame(() => {

        const pausePhysics =  window.pauseState

        return { pauseState: pausePhysics }
    })

    /**
     *  ECCTRL CONTROLS
     */
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

    const playerModel = useGLTF("./animatedModel4.glb")


/**
 * Current animations list:
 * 'Falling to landing' playerModel.animations[0]
 * 'Falling_Root' playerModel.animations[1]
 * 'Idle' playerModel.animations[2]
 * 'Jump Idle' playerModel.animations[3]
 * 'Jump' playerModel.animations[4]
 * 'Run' playerModel.animations[5]
 * 'Walking' playerModel.animations[6]
 */

    const { scene } = useThree()
    scene.fog = new FogExp2("#ffffff", 0.02)

    const player = useRef()
    const { camera } = useThree()

    
    return <>

        {/* <OrbitControls makeDefault={ true } /> */}

        <color args={ [ '#1f2b40' ] } attach="background" />

        {/* <Perf /> */}

        <Physics debug={ false } colliders={ false } paused={ pauseState } >
            <Lights />
            {/* <Stage shadows={ true } > */}
                <Environment background files={ './mud_road_puresky_1k.exr' } />
                <Level shadows />
                <KeyboardControls map={keyboardMap}>
                    <Ecctrl floatHeight={ 0.14 } camZoomSpeed={ 0 } camInitDis={ -3 } disableFollowCam={ false } turnVelMultiplier={ 1 } turnSpeed={ 100 } mode="CameraBasedMovement" >
                            <Player ref={ player }  />
                    </Ecctrl>
                </KeyboardControls>
            {/* </Stage> */}
        </Physics>

    </>
}