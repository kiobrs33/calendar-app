import Swal from "sweetalert2";
import { fetchConToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";

export const eventStartAddNew = (event) => {
    return async ( dispatch, state ) => {
        try {
            const { uid, name } = state().auth;

            const resp = await fetchConToken('events', event, 'POST');
            const body = await resp.json();

            if(body.ok){
                event.id = body.event._id;
                event.user = {
                    _id: uid,
                    name: name
                }
            }
            dispatch(eventAddNew(event));
        } catch (error) {
            console.log(error);
        }
    }
}

export const eventAddNew = (event) => ({
    type: types.eventAddNew,
    payload: event,
})

export const eventSetActive = (event) => ({
    type: types.eventSetActive,
    payload: event,
})

export const eventClearActiveNote = () => ({type: types.eventClearActiveNote});

export const eventStartUpdateEvent = (event) => {
    return async (dispatch) => {
        try {
            console.log(event);
            const resp = await fetchConToken(`events/${ event._id }`, event, 'PUT');
            const body = await resp.json();

            if(body.ok){
                dispatch(eventUpdate(event));
            }else{
                Swal.fire('Error', body.msg, 'error');
            }

        } catch (error) {
            console.log(error);
        }
    }
}

const eventUpdate = (event) => ({
    type: types.eventUpdate,
    payload: event,
})

export const eventStartDeleteEvent = () => {
    return async (dispatch, state) => {

        try {
            const { _id } = state().calendar.activeEvent;

            const resp = await fetchConToken(`events/${ _id }`, {}, 'DELETE');
            const body = await resp.json();

            if(body.ok){
                dispatch(eventDelete());
            }else{
                Swal.fire('Error', body.msg, 'error');
            }

        } catch (error) {
            console.log(error);
        }
    }
}

const eventDelete = () => ({ type: types.eventDelete })

export const eventStartLoading = () => {
    return async (dispatch) => {
        try {
            const resp = await fetchConToken('events');
            const body = await resp.json();
            const events = prepareEvents(body.events);

            dispatch(eventLoaded(events));
        } catch (error) {
            console.log(error);
        }
    }
}

const eventLoaded = (events) => ({
    type: types.eventLoaded,
    payload: events
});

export const eventLogoutUser = () => ({type: types.eventLogoutUser});