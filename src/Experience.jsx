import { useGLTF, useAnimations, Stage, KeyboardControls, OrbitControls } from '@react-three/drei'
import Lights from './Lights.jsx'
import { Level } from './Level.js'
import { Physics } from '@react-three/rapier'
import { Perf } from 'r3f-perf'
import Ecctrl, { EcctrlAnimation } from "ecctrl"
import Player from './Player.js'
import useGame from './stores/useGame.js'
import { useMemo } from 'react'

export default function Experience()
{

    // const run = useGame((state) => state.run)
    // const idle = useGame((state) => state.idle)
    // const jump = useGame((state) => state.jump)

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
        { name: "action4", keys: ["KeyF"] },
      ]

    const playerUrl = './animatedModel4.glb'
    const playerModel = useGLTF("./animatedModel4.glb")

    const animationSet = {
            idle: 'Idle',
            walk: 'Walking',
            run: 'Run',
            jump: 'Jump',
            jumpIdle: 'Jump Idle',
            jumpLand: 'Falling to landing',
            fall: 'Falling_Root',
    }

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

      console.log(playerModel.animations, useGLTF(playerUrl))
    return <>

        <OrbitControls makeDefault />

        <color args={ [ '#bdedfc' ] } attach="background" />

        {/* <Perf /> */}

        <Physics debug={ true } >

            {/* <Lights /> */}

            <Stage shadows={ false } >

                <Level />

                <KeyboardControls map={keyboardMap}>

                <Ecctrl disableFollowCam={ true } debug={ true } mode='FixedCamera' floatingDis={ 0 } floatHeight={ 0.01 } capsuleHalfHeight={ 0.45 } animated >

                    <EcctrlAnimation characterURL={ playerUrl } animationSet={ animationSet } >
                    
                        <Player />
                
                    </EcctrlAnimation>
                
                </Ecctrl>

                </KeyboardControls>

            </Stage>

        </Physics>

    </>
}