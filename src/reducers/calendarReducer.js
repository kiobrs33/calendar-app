import { types } from "../types/types";

// {
//     id: new Date().getTime(),
//     title: 'Cumpleaños',
//     notes: 'Descripcion del cumpleaños',
//     start: moment().toDate(),
//     end: moment().add(2, 'hours').toDate(),
//     bgColor: '#fafafa',
//     user: {
//         _id: '123',
//         name: 'Rene',
//     }
// }

const initialState = {
    events: [],
    activeEvent: null,
}

export const calendarReducer = (state = initialState, action) => {
    switch (action.type) {
        case types.eventSetActive:
            return {
                ...state,
                activeEvent: action.payload,
            };
        case types.eventAddNew:
            return {
                ...state,
                events: [
                    ...state.events,
                    action.payload,
                ],
            };
        case types.eventLoaded:
            return {
                ...state,
                events: [
                    ...action.payload,
                ]
            }
        case types.eventClearActiveNote:
            return {
                ...state,
                activeEvent: null,
            }
        case types.eventUpdate:
            return {
                ...state,
                events: state.events.map(event => 
                    event._id === action.payload._id
                        ? action.payload
                        : event
                ),
            }
        case types.eventDelete:
            return {
                ...state,
                events: state.events.filter(event => 
                    event._id !== state.activeEvent._id
                ),
                activeEvent: null,
            }
        case types.eventLogoutUser:
            return {
                ...initialState
            }
        default:
            return state;
    }
}