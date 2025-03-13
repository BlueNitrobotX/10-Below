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


export default function animationManager(playerRef) 
{

    const { rapier, world } = useRapier()

    const [ currentAnimation, setCurrentAnimation ] = useState('Falling')

    useFrame(() => {

        const origin = playerRef.current.translation()
        const direction = { x: 0, y: -1, z: 0 }
        const ray = new rapier.Ray(origin, direction)
        const hit = world.castRay(ray)
        const toi = hit.timeOfImpact

        if( toi > 4 ) {
            setCurrentAnimation('Falling')
        } else if ( toi > 1) {
            setCurrentAnimation('Jumping Down')
        } else {
            setCurrentAnimation('Idle')
        }

    })



    return null



    
}