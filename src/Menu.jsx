import useGame from "./stores/useGame"
import { useEffect, useRef } from 'react'
import { addEffect } from "@react-three/fiber"
import { create } from "zustand"


export default function() {

    const start = useGame((state) => state.start)
    const phase = useGame((state) => state.phase)
    const menu = useGame((state) => state.menu)
    const settings = useGame((state) => state.settings)
    const credits = useGame((state) => state.credits)

    let menuState = 'menu'

    function nowMenu() {
        menuState = 'menu'
        menu()
        // console.log('now menu')

    }

    function nowSettings() {
        menuState = 'settings'
        settings()
        // console.log('now settings')

    }

    function nowCredits() {
        menuState = 'credits'
        credits()
        // console.log('now credits')

    }

    function nowPlay() {
        menuState = 'hidden'
        start()
        // console.log('now play')

    }



    // menu, settings, credits, hidden

    return <>

        { phase != 'playing' && <div className="menuBackground" ></div> }
    
        { phase === 'menu' && <div className="menuTitle" >10 Below</div> }

        { phase === 'menu' && <div className="menuPlay" onClick={ nowPlay } >Play</div> }

        { phase === 'menu' && <div className="menuSettings" onClick={ nowSettings } >Settings</div> }
        
        { phase === 'menu' && <div className="menuCredits" onClick={ nowCredits } >Credits</div> }

        { phase === 'settings' && <div className="settingsText" >settings placeholder</div> }

        { phase === 'credits' && <div className="creditsText" >credits placeholder</div> }

        { phase === 'settings' && <div className="backToMenu" onClick={ nowMenu } > b </div> }

        { phase === 'credits' && <div className="backToMenu" onClick={ nowMenu } > b </div> }

    </>
}