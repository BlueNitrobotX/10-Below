import { useState, useEffect } from 'react'
import { useKeyboardControls, Html, Text } from "@react-three/drei"
import { useFrame } from '@react-three/fiber'

export default function() {
    
    const pauseEvent = new Event("pause")

    const [ subscribeKeys, getKeys ] = useKeyboardControls()
    // let [ pauseState, setPauseState ] = useState(true)

    // useEffect(() =>
    // {
    //     subscribeKeys(
    //         (state)=> state,
    //         (value) => 
    //         {
    //             // nothing
    //         }
    //     )
    // })

    useFrame(() => {
        
        const keys = getKeys()

        if(keys.pause === true) {
            document.dispatchEvent(pauseEvent)
        }





    })

    return <>


        <Text
            color="black"

        >BlueNitrobotX Presents</Text>
    

        <Text
            color="black"

        >A React Three Fiber Game</Text>
  

    </>

}