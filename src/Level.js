import * as THREE from 'three'
import { CuboidCollider, MeshCollider, RigidBody, TrimeshCollider } from '@react-three/rapier'
import { useMemo, useState, useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Float, Text, useGLTF, Wireframe, useTexture } from '@react-three/drei'
import { Noise } from 'noisejs'
import alea from 'alea'
import { useControls } from 'leva'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js'
import { cameraNear } from 'three/tsl'
import useGame from "./stores/useGame"



export function Level()
{


    const setTerrainHeightAtSpawn = useGame((state) => state.setTerrainHeightAtSpawn)
    const { camera } = useThree()

    useFrame(() => {
        camera.near = 0.05
        camera.far = 1000 //10000 for debug/creation
        camera.updateProjectionMatrix()
      })

    const terrainValues = useMemo(() => {

        const size = 100
        return { size: size }

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
        const noise = new Noise(Math.random()) 

        for( let i = 0; i < verticesXY.length; i++ ) {

            if(verticesXY[i] != 'placeholder') {
                verticesXYZ[i] = verticesXY[i] // push x and y
            }

            else if(verticesXY[i] === 'placeholder') {
                verticesXYZ[i] =            // push z (height)
               ( ( 
                    ( ( 
                        ( noise.simplex2(i, i + 1) )
                        + ( 0.5 * noise.simplex2( ( i * 2 ), ( (i + 1) * 2 ) ) )
                        + ( 0.25 * noise.simplex2( ( i * 4 ), ( ( i + 1) * 4 ) ) ) 
                    )
                        / ( 1 + 0.5 + 0.25 ) )   
                ) ** 2 ) * 3
            }
        }

        setTerrainHeightAtSpawn( ( verticesXYZ[ (verticesXYZ.length / 3) ] * 200 ) -10 ) 
        

        // console.log(verticesXYZ[ (verticesXYZ.length / 3) - 1 ])
        // console.log(verticesXYZ[ (verticesXYZ.length / 3) ] * 200 )
        // console.log(verticesXYZ[ (verticesXYZ.length / 3) + 1 ])

        return { heightMap: verticesXYZ, verticesXY: verticesXY}

    }, [])

    const terrain = useMemo(() => 
    {
        const procedurallyGeneratedFloorGeometry = new THREE.BufferGeometry()
        const pointsGeometry = new THREE.BufferGeometry()
        const sensorGeometry = new THREE.BufferGeometry()

        const indices = []
        const verticesCount = []

        for(let i = 0; i < ( heightMap.heightMap.length / 3 ); i++ ) {

            verticesCount.push(i)

        }

        for(let i = 0; i < ( verticesCount.length) - ( terrainValues.size * 1.5 + 1 ); i ++) {

            if( verticesCount[i] != 0 && ( i + 1 ) % ( terrainValues.size * 1.5 + 1 ) === 0 )
            {
                continue
            } else {
                
                indices.push(verticesCount[i + 1]) // Bottom Left
                indices.push(verticesCount[i + 2 + 1.5 * terrainValues.size]) // Bottom right
                indices.push(verticesCount[i])  // Top left
                
                indices.push(verticesCount[i]) // Top left
                indices.push(verticesCount[i + 2 + 1.5 * terrainValues.size]) // Bottom right
                indices.push(verticesCount[i + 1 + 1.5 * terrainValues.size]) // Top right
            }

        }

        let sensorVertices = new Float32Array( 75 )
        let centerValue = heightMap.heightMap.length / 3

        sensorVertices[0] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) - 7 ]) 
        sensorVertices[1] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) - 6 ]) 
        sensorVertices[2] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) - 5 ]) 
        sensorVertices[3] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) - 4 ]) 
        sensorVertices[4] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) - 3 ]) 
        sensorVertices[5] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) - 2 ]) 
        sensorVertices[6] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) - 1 ]) 
        sensorVertices[7] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) ]) 
        sensorVertices[8] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) + 1 ]) 
        sensorVertices[9] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) + 2 ]) 
        sensorVertices[10] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) + 3 ]) 
        sensorVertices[11] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) + 4 ]) 
        sensorVertices[12] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) + 5 ]) 
        sensorVertices[13] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) + 6 ]) 
        sensorVertices[14] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 2 ) + 7 ]) 

        sensorVertices[15] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) - 7 ]) 
        sensorVertices[16] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) - 6 ]) 
        sensorVertices[17] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) - 5 ]) 
        sensorVertices[18] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) - 4 ]) 
        sensorVertices[19] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) - 3 ]) 
        sensorVertices[20] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) - 2 ]) 
        sensorVertices[21] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) - 1 ]) 
        sensorVertices[22] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) ]) 
        sensorVertices[23] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) + 1 ]) 
        sensorVertices[24] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) + 2 ]) 
        sensorVertices[25] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) + 3 ]) 
        sensorVertices[26] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) + 4 ]) 
        sensorVertices[27] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) + 5 ]) 
        sensorVertices[28] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) + 6 ]) 
        sensorVertices[29] = (heightMap.heightMap[ centerValue - ( terrainValues.size * 1 ) + 7 ]) 

        sensorVertices[30] = (heightMap.heightMap[ centerValue - 7 ]) 
        sensorVertices[31] = (heightMap.heightMap[ centerValue - 6 ]) 
        sensorVertices[32] = (heightMap.heightMap[ centerValue - 5 ]) 
        sensorVertices[33] = (heightMap.heightMap[ centerValue - 4 ]) 
        sensorVertices[34] = (heightMap.heightMap[ centerValue - 3 ]) 
        sensorVertices[35] = (heightMap.heightMap[ centerValue - 2 ]) 
        sensorVertices[36] = (heightMap.heightMap[ centerValue - 1 ]) 
        sensorVertices[37] = (heightMap.heightMap[ centerValue ]) 
        sensorVertices[38] = (heightMap.heightMap[ centerValue + 1 ]) 
        sensorVertices[39] = (heightMap.heightMap[ centerValue + 2 ]) 
        sensorVertices[40] = (heightMap.heightMap[ centerValue + 3 ]) 
        sensorVertices[41] = (heightMap.heightMap[ centerValue + 4 ]) 
        sensorVertices[42] = (heightMap.heightMap[ centerValue + 5 ]) 
        sensorVertices[43] = (heightMap.heightMap[ centerValue + 6 ]) 
        sensorVertices[44] = (heightMap.heightMap[ centerValue + 7 ]) 

        sensorVertices[45] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) - 7 ]) 
        sensorVertices[46] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) - 6 ]) 
        sensorVertices[47] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) - 5 ]) 
        sensorVertices[48] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) - 4 ]) 
        sensorVertices[49] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) - 3 ]) 
        sensorVertices[50] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) - 2 ]) 
        sensorVertices[51] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) - 1 ]) 
        sensorVertices[52] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) ]) 
        sensorVertices[53] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) + 1 ]) 
        sensorVertices[54] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) + 2 ]) 
        sensorVertices[55] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) + 3 ]) 
        sensorVertices[56] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) + 4 ]) 
        sensorVertices[57] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) + 5 ]) 
        sensorVertices[58] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) + 6 ]) 
        sensorVertices[59] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 1 ) + 7 ])

        sensorVertices[60] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) - 7 ]) 
        sensorVertices[61] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) - 6 ]) 
        sensorVertices[62] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) - 5 ]) 
        sensorVertices[63] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) - 4 ]) 
        sensorVertices[64] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) - 3 ]) 
        sensorVertices[65] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) - 2 ]) 
        sensorVertices[66] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) - 1 ]) 
        sensorVertices[67] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) ]) 
        sensorVertices[68] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) + 1 ]) 
        sensorVertices[69] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) + 2 ]) 
        sensorVertices[70] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) + 3 ]) 
        sensorVertices[71] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) + 4 ]) 
        sensorVertices[72] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) + 5 ]) 
        sensorVertices[73] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) + 6 ]) 
        sensorVertices[74] = (heightMap.heightMap[ centerValue + ( terrainValues.size * 2 ) + 7 ]) 

        console.log(sensorVertices)

        sensorGeometry.setAttribute('position', new THREE.BufferAttribute(sensorVertices, 3))

        const verticesColors = new Float32Array(heightMap.heightMap.length)

        for( let i = 0; i < heightMap.heightMap.length; i += 3 ) {

            const y = heightMap.heightMap[i + 1]
            const color = new THREE.Color().setHSL( 0.5, 1, ( y - 0.3 ) )
            verticesColors[i] = color.r
            verticesColors[i + 1] = color.g
            verticesColors[ i + 2] = color.b

        }


        const uvs = new Float32Array([heightMap.verticesXY])

        procedurallyGeneratedFloorGeometry.computeVertexNormals()
        procedurallyGeneratedFloorGeometry.setAttribute('color', new THREE.BufferAttribute(verticesColors, 3 ) )
        procedurallyGeneratedFloorGeometry.setAttribute( 'position', new THREE.BufferAttribute( heightMap.heightMap, 3 ) )
        procedurallyGeneratedFloorGeometry.setAttribute("uv", new THREE.BufferAttribute( uvs, 2 ) )
        procedurallyGeneratedFloorGeometry.setIndex(indices)

        // pointsGeometry.setAttribute( 'position', new THREE.BufferAttribute( heightMap, 3 ) )

        procedurallyGeneratedFloorGeometry.computeVertexNormals()
        procedurallyGeneratedFloorGeometry.computeBoundingSphere()
        procedurallyGeneratedFloorGeometry.setDrawRange(0, Infinity)

        const tempFloorMaterial = new THREE.MeshStandardMaterial( { color: 'blue', wireframe: false })

        const center = new THREE.Vector3(0, 0, 0)
        procedurallyGeneratedFloorGeometry.computeBoundingBox()
        procedurallyGeneratedFloorGeometry.boundingBox.getCenter(center)
        procedurallyGeneratedFloorGeometry.translate( - center.x, - center.y, - center.z )

        return {
            geometry: procedurallyGeneratedFloorGeometry,
            sensorGeometry: sensorGeometry,
            material: tempFloorMaterial,
            indices: indices,
            pointsGeometry: pointsGeometry,
            uvs: uvs
        }

    }, [])
    
    const textureLoader = new THREE.TextureLoader()

    const floorColorMap = textureLoader.load('./snow_field_aerial_1k/textures/snow_field_aerial_col_1k.jpg')
    const floorARMMap = textureLoader.load('./snow_field_aerial_1k/textures/snow_field_aerial_arm_1k.jpg')
    const floorHeightMap = textureLoader.load('./snow_field_aerial_1k/textures/snow_field_aerial_height_1k.jpg')
    const floorNormalMap = textureLoader.load('./snow_field_aerial_1k/textures/snow_field_aerial_nor_gl_1k.jpg')

    floorColorMap.repeat.set(terrainValues.size ** 4, terrainValues.size ** 4)
    floorARMMap.repeat.set(terrainValues.size ** 4, terrainValues.size ** 4)
    floorHeightMap.repeat.set(terrainValues.size ** 4, terrainValues.size ** 4)
    floorNormalMap.repeat.set(terrainValues.size ** 4, terrainValues.size ** 4)

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
        color: 'white',
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



    return <>


        {/* Invisible mesh with physics collider */}
        <RigidBody type='fixed' colliders={ false } > 
            <MeshCollider type="trimesh" >
            <mesh position={ [ 0, -10, 0 ] } geometry={ terrain.geometry } material={ invisibleMaterial }  scale={ 10 } />
            </MeshCollider>
        </RigidBody>


        {/* Visible mesh without physics collider */}
        <mesh position={ [ 0, -9.1, 0 ] } geometry={ terrain.geometry } material={ floorMaterial } map={ floorColorMap } aoMap={ floorARMMap } roughnessMap={ floorARMMap } metalnessMap={ floorARMMap } normalMap={ floorNormalMap } displacementMap={ floorHeightMap } vertexColors scale={ 10 } />


        {/* Sensor collider */}
        <RigidBody type='Fixed' > 
            <MeshCollider 
            type="trimesh" 
            onIntersectionEnter={() => { console.log("Entered sensor area!") }} 
            sensor
            setSensor
            >
                    <mesh position={ [ 0, -9, 0 ] } geometry={ terrain.sensorGeometry } material={ invisibleMaterial } scale={ 10 } />
            </MeshCollider>
        </RigidBody>


        {/* <RigidBody type='fixed' colliders='hull' > 
            <points geometry={ terrain.pointsGeometry } material={ terrain.pointsMaterial } scale={ 4 } />
        </RigidBody> */}

        {/* <RigidBody type='fixed' >
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
        </RigidBody> */}

    </>
}