import useGame from "./stores/useGame"
import { useEffect, useRef, Suspense, useFrame, useState } from 'react'
import { addEffect } from "@react-three/fiber"
import { create } from "zustand"


export default function() {

    const start = useGame((state) => state.start)
    const phase = useGame((state) => state.phase)
    const menu = useGame((state) => state.menu)
    const settings = useGame((state) => state.settings)
    const credits = useGame((state) => state.credits)
    const musicEnabled = useGame((state) => state.musicEnabled)
    const toggleMusicTrue = useGame((state) => state.toggleMusicTrue)
    const toggleMusicFalse = useGame((state) => state.toggleMusicFalse)
    const toggleMusic = useGame((state) => state.toggleMusic)

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

        const event = new Event("beginStartSequence")
        document.dispatchEvent(event)
        // console.log('now play')

    }

    function nowToggleMusicTrue() {
        toggleMusicTrue()
        // console.log(musicEnabled)
    }

    function nowToggleMusicFalse() {
        toggleMusicFalse()
        // console.log(musicEnabled)
    }

    function nowToggleMusic() {
        toggleMusic()
        // console.log(musicEnabled)
    }


    const [ isVisible, setIsVisible ] = useState(true)

    useEffect(() => {

        const wait = setTimeout(() => {
            setIsVisible(false)
        }, 2000)

        return () => clearTimeout(wait)

    }, [isVisible])


    // menu, settings, credits, hidden

    return <>


        {/* Main Menu */}

        { phase != 'playing' && <div className="menuBackground" ></div> }
    
        { phase === 'menu' && <div className="menuTitle" >10 Below</div> }

        { phase === 'menu' && <div className="menuPlay" onClick={ nowPlay } >Play</div> }

        { phase === 'menu' && <div className="menuSettings" onClick={ nowSettings } >Settings</div> }
        
        { phase === 'menu' && <div className="menuCredits" onClick={ nowCredits } >Credits</div> }


        {/* Settings */}

        { phase === 'settings' && <div className="settingsText" >Music On:</div> }

        { phase === 'settings' && musicEnabled === false && <div className="settingsToggleMuteUnchecked" onClick={ nowToggleMusic } >X</div> }
        { phase === 'settings' && musicEnabled === true && <div className="settingsToggleMuteChecked" onClick={ nowToggleMusic } >X</div> }

        { phase === 'settings' && <div className="backToMenu" onClick={ nowMenu } > b </div> }


        {/* Credits */}

        { phase === 'credits' && <div className="creditsText" >credits placeholder</div> }

        { phase === 'credits' && <div className="backToMenu" onClick={ nowMenu } > b </div> }
        

        {/* Loading Screen */}

        { isVisible === true && <div className="menuFallback" > Loading... </div>}

    </>
}