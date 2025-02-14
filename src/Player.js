import { RigidBody, useRapier } from "@react-three/rapier"
import { useLoader, useFrame } from "@react-three/fiber"
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { useGLTF, useFBX, useKeyboardControls, useTexture, useAnimations } from "@react-three/drei"
import { Suspense, useState, useEffect, useRef, useMemo } from 'react'
import * as THREE from 'three'
import useGame from "./stores/useGame"
import PlayerModel from "./PlayerModel"
import { GLTFLoader } from "three/examples/jsm/Addons.js"
import { useControls } from "leva"

export default function Player()
{
    // const body = useRef()
    // const { rapier, world } = useRapier()

    // const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
    // const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)

    const reset = () =>
    {
        // body.current.setTranslation({ x: 0, y: 1, z: 0 })
        // body.current.setLinvel({ x: 0, y: 0, z: 0 })
        // body.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    // function pauseGame() {
    //     if(window.pauseState) {
    //         window.pauseState = false
    //     } else {
    //         window.pauseState = true
    //     }
    // }

    // useFrame((state, delta) => {

    //     const cameraPosition = new THREE.Vector3()

    // })


    const playerTexture = useTexture('./kenney_animated-characters-3/Skins/humanMaleA.png')

    const playerModel = useLoader(GLTFLoader, './animatedModel6.glb')

    const playerAnimations = useAnimations(playerModel.animations, playerModel.scene)

    // const { animationName } = useControls({
    //     animationName: { options: playerAnimations.names, value: "Idle" }
    // })

    // useEffect(() => 
    // {
        
    //     const action = playerAnimations.actions[animationName]
    //     action
    //         .reset()
    //         .fadeIn(0.5)
    //         .play()
            
    //     return () => 
    //     {
    //         action.fadeOut(0.5)
    //     }

    // }, [ animationName ])

    useEffect(() => 
    {
        const action = playerAnimations.actions.Idle
        action 
            .reset()
            .fadeIn(0.5)
            .play()
        
        return () => 
        {
            action.fadeOut(0.5)
        }

    }, [])



    /**
    * Current animations list:
    * 'Falling' 
    * 'Gangnam Style'
    * 'Idle' 
    * 'Jumping' 
    * 'Running' 
    * 'Walking'
    */

    
    // const playerModelPath = "./kenney_animated-characters-3/Model/characterMedium.fbx"
    // const playerModel = useFBX(playerModelPath)
    // const playerTexture = useTexture('./kenney_animated-characters-3/Skins/humanMaleA.png')
    // const playerGeometry = playerModel.children[0].geometry
    // const playerMaterial = new THREE.MeshStandardMaterial({ map: playerTexture })

        return <>

            <Suspense fallback={ null } >

                <primitive object={ playerModel.scene } scale={ 0.4 } position-y={ -0.75 } />

                {/* <mesh ref={ body } geometry={ player.geometry } rotation-x={ Math.PI * - 0.5 } scale={ 0.4 } position-y={ -0.75 } >
                    <meshStandardMaterial map={ playerTexture } />
                </mesh> */}

                {/* <PlayerModel scale={ 0.4 } position-y={ - 0.75 } /> */}

            </Suspense>
    
    </>
    
}