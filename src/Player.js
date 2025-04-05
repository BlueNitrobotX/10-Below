import { CuboidCollider, RigidBody, TrimeshCollider, useRapier } from "@react-three/rapier"
import { useLoader, useFrame, useThree } from "@react-three/fiber"
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
    const { currentAnimation, isGameplayCamera, isIntroDone } = props.props
    const [ localCurrentAnimation, setLocalCurrentAnimation ] = useState('Falling')
    const [ subscribeKeys, getKeys ] = useKeyboardControls()

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

    useFrame(() => {
        if( phase === 'playing') {
            const xyz = player.current.translation()
            window.appData.playerX = xyz.x
            window.appData.playerY = xyz.y
            window.appData.playerZ = xyz.z
        }
    })



    function getAction(x) {

        if(x === 'Idle') {
            return actionIdle
        }
        else if(x === 'Falling') {
            return actionFalling
        }     
        else if(x === 'Gangnam_Style') {
            return actionGangnamStyle
        }
        else if(x === 'Jumping') {
            return actionJumping
        }
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



    useEffect(() => 
        {
    
            const action = getAction(localCurrentAnimation)
    
            action
                .reset()
                .fadeIn(0.5)
                .play()
            
    
    
            return () => 
            {
                action.fadeOut(0.5)
            }
    
        }, [ localCurrentAnimation ])



    // Gameplay camera manager
    const { camera } = useThree()
    const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3())
    const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())

    const cameraParameters = useMemo(() => {   
        let theta = ( - Math.PI / 2 )
        let radius = 3
        let height = 1
    
        let panning = false
        let cursorX = 0
    
        const sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }

        return { 
            theta: theta, 
            radius: radius, 
            height: height, 
            panning: panning, 
            cursorX: cursorX, 
            sizes: sizes 
        }

    }, [])


    function enablePanning() { cameraParameters.panning = true }
    function disablePanning() { cameraParameters.panning = false }

    window.addEventListener("mousedown", enablePanning)
    window.addEventListener("mouseup", disablePanning)



    useFrame((state, delta) => {
        if( isGameplayCamera ) {
            const cameraTarget = new THREE.Vector3(window.appData.playerX, window.appData.playerY, window.appData.playerZ)
            const cameraPosition = new THREE.Vector3(window.appData.playerX + ( Math.cos(cameraParameters.theta) * cameraParameters.radius ), window.appData.playerY + cameraParameters.height, window.appData.playerZ + ( Math.sin(cameraParameters.theta) * cameraParameters.radius ) )

            smoothedCameraPosition.lerp(cameraPosition, 7 * delta)
            smoothedCameraTarget.lerp(cameraTarget, 7 * delta)

            camera.position.copy(smoothedCameraPosition)
            camera.lookAt(smoothedCameraTarget)

        }
    })

    useFrame((state, delta) => {

        if( cameraParameters.panning ) {
                
                if( state.pointer.x > cameraParameters.cursorX ) {
                    cameraParameters.theta += 0.015
                } else if( state.pointer.x < cameraParameters.cursorX ) {
                    cameraParameters.theta -= 0.015
                } else { cameraParameters.theta = cameraParameters.theta }
        
        }

        cameraParameters.cursorX = state.pointer.x

    })



    // Player Animation Controller
    useFrame(() => {

        const keys = getKeys()

        if(isIntroDone) {

            if( keys.forward || keys.backward || keys.leftward || keys.rightward ) {

                if( !keys.run ) {
                    setLocalCurrentAnimation('Walking')
                }
                if( keys.run ) {
                    setLocalCurrentAnimation('Running')
                }
            } 

            else { 
                setLocalCurrentAnimation('Idle')
            }
        }
    })



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
                    turnSpeed={10} 
                    disableFollowCam={ true }
                    disableFollowCamTarget={ window.appData.playerPosition } 
                    autoBalance={ false }
                    mode="FixedCamera" 
                    position-y={ 60 } 
                >
                    <primitive object={ playerModel.scene } scale={ 0.4 } position-y={ -0.75 } />
                </Ecctrl>

            </Suspense>
    
    </>
    
}