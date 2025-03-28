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
import Ecctrl, { EcctrlAnimation } from 'ecctrl'
import { create } from 'zustand'

export default function Player(props)
{
    const { rapier, world } = useRapier()
    const { currentAnimation } = props.props

    // const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
    // const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    const start = useGame((state) => state.start)
    const end = useGame((state) => state.end)
    const restart = useGame((state) => state.restart)
    const phase = useGame((state) => state.phase)
    const die = useGame((state) => state.die)

    const reset = () =>
    {
        player.current.setTranslation({ x: 0, y: 1, z: 0 })
        player.current.setLinvel({ x: 0, y: 0, z: 0 })
        player.current.setAngvel({ x: 0, y: 0, z: 0 })
    }

    useEffect(() => {
        if( phase === 'ended') {
            reset()
        }
    })

    // function pauseGame() {
    //     if(window.pauseState) {
    //         window.pauseState = false
    //     } else {
    //         window.pauseState = true
    //     }
    // }

    const player = useRef()

    const playerTexture = useTexture('./kenney_animated-characters-3/Skins/humanMaleA.png')

    const playerModel = useLoader(GLTFLoader, './animatedModel8.glb')

    const playerAnimations = useAnimations(playerModel.animations, playerModel.scene)

    const actionIdle = playerAnimations.actions.Idle_Root
    const actionFalling = playerAnimations.actions.Falling_Root
    const actionGangnamStyle = playerAnimations.actions[6] //Might not work
    const actionJumping = playerAnimations.actions.Jumping_Root
    const actionRunning = playerAnimations.actions.Running2
    const actionWalking = playerAnimations.actions.Walking2
    // const actionJumpingUp = playerAnimations.actions.Jumping_Up
    // const actionJumpingDown = playerAnimations.actions.Jumping_Down
    // const actionFallingIdle = playerAnimations.actions.Falling_Idle


    // console.log(playerAnimations.actions['Falling'])

    useFrame(() => {
        if( phase === 'playing') {
            window.appData.playerPosition = player.current.translation()
        }
    })

    // useFrame(() => {

    //     if( phase === 'playing' ) {
    //         const { x, y, z } = player.current.translation()
    //         const origin = { x: x, y: y, z: z }
    //         const direction = { x: 0, y: -10000, z: 0 }
    //         const ray = new rapier.Ray(origin, direction)
    //         const hit = world.castRay(ray, 10, true)
    //         // console.log(hit)
    //         // console.log(player.current.translation())
    //         // const toi = hit.timeOfImpact
    //         // window.appData.heightRayTOI = toi
    //     }

    // })

    function getAction(x) {

        if(x === 'Idle') {
            return actionIdle
        }
        else if(x === 'Falling') {
            return actionFalling
        }
        // else if(x === 'Falling Idle') {
        //     return actionFallingIdle
        // }        
        else if(x === 'Gangnam_Style') {
            return actionGangnamStyle
        }
        else if(x === 'Jumping') {
            return actionJumping
        }
        // else if(x === 'Jumping Up') {
        //     return actionJumpingUp
        // }
        // else if(x === 'Jumping Down') {
        //     return actionJumpingDown
        // }
        else if(x === 'Running') {
            return actionRunning
        }
        else if(x === 'Walking') {
            return actionWalking
        } else

        console.warn('[CUSTOM ERROR] argument x passed in getAction(x) is not recognized')
        return null

    }

    useEffect(() => 
    {

        const action = getAction(currentAnimation)
        // const action = playerAnimations.actions[currentAnimation]

        action
            .reset()
            .fadeIn(0.5)
            .play()
        


        return () => 
        {
            action.fadeOut(0.5)
        }

    }, [ currentAnimation ])

    // const animationSet = {
    //     idle: "Idle",
    //     walk: "Walking",
    //     run: "run",
    //     jumping: "Jumping"
    //     jump: "Jumping Up",
    //     jumpIdle: "Falling Idle",
    //     jumpLand: "Jumping Down",
    //     fall: "Falling"
    // }

    /**
    * Current animations list:
    * 'Falling' 
    * 'Gangnam Style'
    * 'Idle' 
    * 'Jumping' 
    * 'Running' 
    * 'Walking'
    * 'Falling Idle'
    * 'Jumping Up'
    * 'Jumping Down'
    */

    
    // const playerModelPath = "./kenney_animated-characters-3/Model/characterMedium.fbx"
    // const playerModel = useFBX(playerModelPath)
    // const playerTexture = useTexture('./kenney_animated-characters-3/Skins/humanMaleA.png')
    // const playerGeometry = playerModel.children[0].geometry
    // const playerMaterial = new THREE.MeshStandardMaterial({ map: playerTexture })

        return <>

            <Suspense fallback={ null } >

                <Ecctrl 
                    ref={ player } 
                    camCollision={false} 
                    camCollisionSpeedMult={ 1 }
                    camZoomSpeed={ 1 }
                    camInitDis={ 4 }
                    camInitDir={ { x: 0.2, y: 0 } }
                    camMinDis={ 2 }
                    camMaxDis={ 6 } 
                    camFollowMult={1000}
                    camLerpMult={ 10 } 
                    turnVelMultiplier={1}
                    turnSpeed={100} 
                    // disableFollowCam={ isGameplayCamera }
                    disableFollowCam={ true }
                    disableFollowCamTarget={ window.appData.playerPosition } 
                    autoBalance={ false }
                    // autoBalanceDampingC={ 0.000001 }
                    // autoBalanceDampingOnY={ 0.000001 }
                    mode="CameraBasedMovement" 
                    position-y={ 60 } 
                >
                    <primitive object={ playerModel.scene } scale={ 0.4 } position-y={ -0.75 } />
                </Ecctrl>

            </Suspense>
    
    </>
    
}