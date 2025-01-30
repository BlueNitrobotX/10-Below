import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'




export default create(subscribeWithSelector((set) => 
    {
        return {

            curAnimation: null,
            animationSet: {},
            phase: 'menu',
    
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

/**
 * Current animations list:
 * 'Falling to landing' playerModel.animations[0]
 * 'Falling_Root' playerModel.animations[1]
 * 'Idle' playerModel.animations[2]
 * 'Jump Idle' playerModel.animations[3]
 * 'Jump' playerModel.animations[4]
 * 'Run' playerModel.animations[5]
 * 'Walking' playerModel.animations[6]
 */

            idle: () => 
                {
                    set((state) => 
                    { 
                        if(state.curAnimation != state.animationSet.idle)
                        return { curAnimation: state.animationSet.idle } 
        
                        return {}
                    })
                },

            run: () => 
                {
                    set((state) => 
                    { 
                        if(state.curAnimation != state.animationSet.run)
                        return { curAnimation: state.animationSet.run } 
            
                        return {}
                    })
                },
    
            jump: () => 
                {
                    set((state) => 
                    { 
                        if(state.curAnimation != state.animationSet.run)
                        return { curAnimation: state.animationSet.run } 
            
                        return {}
                    })
                 },

        }
    }))