import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF, Wireframe, useTexture } from '@react-three/drei'
import { createNoise2D } from 'simplex-noise'
import alea from 'alea'
import { useControls } from 'leva'




export function Level()
{

    const textureLoader = new THREE.TextureLoader()

const floorColorMap = textureLoader.load('./snow_field_aerial_1k/textures/snow_field_aerial_col_1k.jpg')
const floorARMMap = textureLoader.load('./snow_field_aerial_1k/textures/snow_field_aerial_arm_1k.jpg')
const floorHeightMap = textureLoader.load('./snow_field_aerial_1k/textures/snow_field_aerial_height_1k.jpg')
const floorNormalMap = textureLoader.load('./snow_field_aerial_1k/textures/snow_field_aerial_nor_gl_1k.jpg')

floorColorMap.repeat.set(10, 10)
floorARMMap.repeat.set(10, 10)
floorHeightMap.repeat.set(10, 10)
floorNormalMap.repeat.set(10, 10)

floorColorMap.wrapS = THREE.RepeatWrapping
floorARMMap.wrapS = THREE.RepeatWrapping
floorNormalMap.wrapS = THREE.RepeatWrapping
floorHeightMap.wrapS = THREE.RepeatWrapping

floorColorMap.wrapT = THREE.RepeatWrapping
floorARMMap.wrapT = THREE.RepeatWrapping
floorNormalMap.wrapT = THREE.RepeatWrapping
floorHeightMap.wrapT = THREE.RepeatWrapping

const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const floorBoxGeometry = new THREE.BoxGeometry(1, 1, 1, 100, 1, 100)
const planeGeometry = new THREE.PlaneGeometry(1, 1, 100, 100)
const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorColorMap,
    color: 'gray',
    aoMap: floorARMMap,
    metalnessMap: floorARMMap,
    roughnessMap: floorARMMap,
    normalMap: floorNormalMap,
    displacementMap: floorHeightMap,
    displacementScale: 0.025,
    displacementBias: -0.1
})
const objectMaterial = new THREE.MeshStandardMaterial({ color: "darkred" })
const invisibleMaterial = new THREE.MeshStandardMaterial({ transparent: true, opacity: 0 })

    // useEffect(() => 
    // {
    //     const seed = alea(111)
    //     let e = createNoise2D(seed)
    //                 + 0.5 * createNoise2D(2 * seed)
    //                 + 0.25 * createNoise2D(4 * seed)
    //     let noise2D =  e / (1 + 0.5 + 0.25)


    //     let noiseSize = 20
    //     let verticesXY = new Float32Array([])

    //     for(let i = -10; i < noiseSize; i++) {

    //         verticesXY.push(i) // Fills the array with placeholder values that will be changed later
            
    //         for(let j = 0; j < Math.sqrt(noiseSize); j++) { 
    //             verticesXY[j] += j
    //         }
    //     }

    // }, [])


    return <>
        <RigidBody type='fixed' >
            <mesh geometry={ floorBoxGeometry } material={ invisibleMaterial } scale={ [ 30, 1, 30 ] } />
        </RigidBody>

        <mesh geometry={ planeGeometry } material={ floorMaterial } scale={ [ 30, 30, 30 ] } position-y={ 3.35 } rotation-x={ - Math.PI / 2 } />

        <RigidBody>
            <mesh geometry={ boxGeometry } material={ objectMaterial } position={ [ 5, 5, 5 ] } />
        </RigidBody>

        <RigidBody>
            <mesh geometry={ boxGeometry } material={ objectMaterial } position={ [ -4, 3, 4 ] } scale={ 2 } />
        </RigidBody>

        <RigidBody>
            <mesh geometry={ boxGeometry } material={ objectMaterial } position={ [ -4, 3, 9 ] } scale={ 4 } />
        </RigidBody>

        <RigidBody>
            <mesh geometry={ boxGeometry } material={ objectMaterial } position={ [ -6, 8, -2 ] } scale={ 1.5 } />
        </RigidBody>

    </>
}