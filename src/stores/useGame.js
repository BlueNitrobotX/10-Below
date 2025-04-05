import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'




export default create(subscribeWithSelector((set) => 
    {
        return {

            phase: 'menu',
            musicEnabled: true,

            //Start the game
            start: () => 
            {
                set((state) => 
                { 
                    if(state.phase === 'menu')
                    return { phase: 'playing' } 
                    
                    return {}
                })
            },
    
            // Send the game back to the menu
            menu: () => 
            {
                set((state) => 
                { 
                    if(state.phase != 'menu')
                    return { phase: 'menu' }
                
                    return {}
                })
            },

            settings: () => 
                {
                    set((state) => 
                    { 
                        if(state.phase != 'playing')
                        return { phase: 'settings' }
                    
                        return {}
                    })
                },

            credits: () => 
                {
                    set((state) => 
                    {                             
                        if(state.phase != 'playing')
                        return { phase: 'credits' }
                    
                        return {}
                    })
                },
    
            //Kill the player
            die: () => 
                {
                    set((state) => 
                    { 
                        if(state.phase != 'ended')
                        return { phase: 'ended'} 
    
                        return {}
                    })
                },
                 
            toggleMusicTrue: () =>
                {
                    set((state) => 
                    {
                        return { musicEnabled: true }
                    })
                },

            toggleMusicFalse: () =>
                {
                    set((state) => 
                    {
                        return { musicEnabled: false }
                    })
                },
            
            toggleMusic: () =>
                {
                    set((state) => 
                    {
                        if(state.musicEnabled === true) {
                            return { musicEnabled: false }
                        } else if(state.musicEnabled === false) {
                            return { musicEnabled: true }
                        } else
                        return {}
                        
                    })
                }

        }
    }))