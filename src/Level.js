import * as THREE from 'three'
import { CuboidCollider, RigidBody } from '@react-three/rapier'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { Float, Text, useGLTF, Wireframe, useTexture } from '@react-three/drei'
import { Noise } from 'noisejs'
import alea from 'alea'
import { useControls } from 'leva'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'



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

    // Declare variables for terrain generation
    const terrainValues = useMemo(() => {

        const seed = alea(Math.random())
        const size = 40

        return { seed: seed, size: size }

    }, [])


    //Calculations for procedural generation
    const heightMap = useMemo(() => 
    {

        let verticesSize = terrainValues.size  // Width and Height of the square that will be displaced according to the height map
        let verticesXY = []

        for(let i = ( verticesSize / -2 ); i < ( verticesSize + 1 ); i++) {
            
            for(let j = ( verticesSize / -2 ); j < ( verticesSize + 1 ); j++) {
                verticesXY.push(i)
                verticesXY.push('placeholder')
                verticesXY.push(j)
                
            }
        }

        // Convert to array with x, y, and z coordinates (z is height in this case)
        let verticesXYZ = new Float32Array( verticesXY.length )
        const noise = new Noise(terrainValues.seed)

        for(let i = 0; i < verticesXY.length; i++ ) {

            if(verticesXY[i] != 'placeholder') {
                verticesXYZ[i] = verticesXY[i] // push x and y
            }

            else if(verticesXY[i] === 'placeholder') {
                verticesXYZ[i] =            // push z (height)
                ( 
                    ( ( 
                        ( noise.simplex2(i, i + 1) )
                        + ( 0.5 * noise.simplex2( ( i * 2 ), ( (i + 1) * 2 ) ) )
                        + ( 0.25 * noise.simplex2( ( i * 4 ), ( ( i + 1) * 4 ) ) ) 
                    )
                        / ( 1 + 0.5 + 0.25 ) * 10 )   
                ) + 10
            }
            
            
        }

        return verticesXYZ

    }, [])

    function generateGridIndices(widthSegments, heightSegments) {
        let indices = [];
        
        for (let x = 0; x < widthSegments; x++) {  // Loop through columns first
            for (let y = 0; y < heightSegments; y++) {  // Then rows
                // Adjusted indexing to match column-major order
                let topLeft     = y + x * (heightSegments + 1);
                let bottomLeft  = topLeft + 1;
                let topRight    = topLeft + (heightSegments + 1);
                let bottomRight = topRight + 1;
    
                // ⚠️ FIX: Swap topRight and bottomLeft for correct triangle orientation
                indices.push(topLeft, topRight, bottomLeft);
                indices.push(bottomLeft, topRight, bottomRight);
            }
        }
        
        return indices
    }

    const terrain = useMemo(() => 
    {
        const procedurallyGeneratedFloorGeometry = new THREE.BufferGeometry()
        const pointsGeometry = new THREE.BufferGeometry()


        // const indices = generateGridIndices(terrainValues.size, terrainValues.size)
        const indices = []
        const verticesCount = []

        for(let i = 0; i < ( heightMap.length / 3 ); i++ ) {

            verticesCount.push(i)

        }

        // ( ( heightMap.length / 3 ) - terrainValues.size )

        for(let i = 0; i < ( ( heightMap.length / 3 ) - terrainValues.size ); i ++) {

            indices.push(verticesCount[i])
            indices.push(verticesCount[i + 1])
            indices.push(verticesCount[i + 2 + 1.5 * terrainValues.size])

            indices.push(verticesCount[i])
            indices.push(verticesCount[i + 2 + 1.5 * terrainValues.size])
            indices.push(verticesCount[i + 1 + 1.5 * terrainValues.size])

        }

        procedurallyGeneratedFloorGeometry.setIndex(indices)
        procedurallyGeneratedFloorGeometry.setAttribute( 'position', new THREE.BufferAttribute( heightMap, 3 ) )
        pointsGeometry.setAttribute( 'position', new THREE.BufferAttribute( heightMap, 3 ) )

        procedurallyGeneratedFloorGeometry.computeVertexNormals()
        procedurallyGeneratedFloorGeometry.computeBoundingSphere()
        procedurallyGeneratedFloorGeometry.setDrawRange(0, Infinity)

        const tempFloorMaterial = new THREE.MeshStandardMaterial( { color: 'blue', wireframe: false })
        const tempPointsMaterial = new THREE.PointsMaterial( { color: 'black', size: 0.5, sizeAttenuation: true } )

        return {
            geometry: procedurallyGeneratedFloorGeometry,
            material: tempFloorMaterial,
            pointsMaterial: tempPointsMaterial,
            indices: indices,
            pointsGeometry: pointsGeometry
        }

    }, [])

    console.log("Vertices:", heightMap);
    console.log("Indices:", terrain.indices);







    return <>

        <RigidBody type='fixed' colliders='hull' > 
            <mesh geometry={ terrain.geometry } material={ terrain.material } scale={ 4 } />
        </RigidBody>

        <RigidBody type='fixed' colliders='hull' > 
            <points geometry={ terrain.pointsGeometry } material={ terrain.pointsMaterial } scale={ 4 } />
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