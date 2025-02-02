import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF, Wireframe, useTexture } from '@react-three/drei'
import { Noise } from 'noisejs'
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

    //Calculations for procedural generation
    const heightMap = useMemo(() => 
    {
        const seed = alea(Math.random())
        // let e = createNoise2D(seed)
        //             + 0.5 * createNoise2D(2 * seed)
        //             + 0.25 * createNoise2D(4 * seed)
        // let noise2D =  e / (1 + 0.5 + 0.25)


        let verticesSize = 40  // Width and Height of the square that will be displaced according to the height map
        let verticesXY = []

        for(let i = ( verticesSize / -2 ); i < ( verticesSize + 1 ); i++) {
            
            for(let j = ( verticesSize / -2 ); j < ( verticesSize + 1 ); j++) {
                verticesXY.push(i)
                verticesXY.push(j)
            }
        }

        console.log(verticesXY)

        // Convert to array with x, y, and z coordinates (z is height in this case)
        let verticesXYZ = new Float32Array( verticesXY.length )
        const noise = new Noise(seed)

        for(let i = 0; i < verticesXY.length; i ++ ) {

            if(i % 3 != 0) {
                verticesXYZ[i] = verticesXY[i] // push x and y
            }

            else {
                verticesXYZ[i] =            // push z (height)
                ( 
                    ( 
                        ( noise.simplex2(i, i + 1) )
                        + ( 0.5 * noise.simplex2( ( i * 2 ), ( (i + 1) * 2 ) ) )
                        + ( 0.25 * noise.simplex2( ( i * 4 ), ( ( i + 1) * 4 ) ) ) 
                    )
                        / ( 1 + 0.5 + 0.25 )    
                ) + 10
            }
            
            
        }

        return verticesXYZ

    }, [])

    const noise = new Noise(5)

    let num = noise.simplex2(8000, 80000)

    console.log(num)

    console.log(heightMap)

    const terrain = useMemo(() => 
    {
        const procedurallyGeneratedFloorGeometry = new THREE.BufferGeometry()

        procedurallyGeneratedFloorGeometry.setAttribute( 'position', new THREE.BufferAttribute( heightMap, 3 ) )
        
        // const boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 900 )
        // procedurallyGeneratedFloorGeometry.boundingSphere() = boundingSphere
        // procedurallyGeneratedFloorGeometry.setDrawRange(0, Infinity)

        const tempFloorMaterial = new THREE.MeshStandardMaterial( { color: 'blue' })

        return {
            geometry: procedurallyGeneratedFloorGeometry,
            material: tempFloorMaterial
        }

    }, [])









    return <>

        <RigidBody>
            <mesh geometry={ terrain.geometry } material={ terrain.material } />
        </RigidBody>

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