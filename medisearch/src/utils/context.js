import React, { createContext, useContext, useReducer } from 'react'

const GeneralContext = createContext();

const initialState = {
    map: null,
    menu: localStorage.getItem('menu') === undefined ? 'home' : localStorage.getItem('menu'),
    user: null,
    currentPosition: {},
    query: '',
    stores: []
}

let reducer = (state, action) => {
    switch(action.type) {
        case "setMap": {
            return {...state,
                map: action.value.map,
                currentPosition: action.value.position
            }
        }
        case "setCurrentPosition": {
            return {...state,
                currentPosition: action.value
            }
        }
        case "setMenu": {
            localStorage.setItem('menu', action.value);
            return {...state,
                menu: action.value
            }
        }
        case "setUser": {
            return {...state,
                user: action.value
            }
        }
        case "setQuery": {
            return {...state,
                query: action.value
            }
        }
        case "setStores": {
            return {...state,
                stores: action.value
            }
        }
        case "login": {
            return {...state,
                user: action.value,
                menu: 'profile'
            }
        }
        case "logout": {
            return {...state,
                user: null,
                menu: 'login'
            }
        }
        default: return state
    }
}

function GeneralProvider(props) {
    let [state, dispatch] = useReducer(reducer, initialState);
    let value = { state, dispatch };

    return (
        <GeneralContext.Provider 
            value={value} 
        >
            {props.children}
        </GeneralContext.Provider>
    )
}

let GeneralConsumer = GeneralContext.Consumer
let useGeneralContext = () => useContext(GeneralContext);

export { GeneralContext, GeneralProvider, GeneralConsumer, useGeneralContext } ;