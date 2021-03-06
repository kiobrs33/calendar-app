import React, { useEffect, useState } from 'react';
import DateTimePicker from 'react-datetime-picker';
import Modal from 'react-modal';
import moment from 'moment';
import Swal from 'sweetalert2'
import { useDispatch, useSelector } from 'react-redux';
import { uiCloseModal } from '../../actions/ui';
import { eventClearActiveNote, eventStartAddNew, eventStartUpdateEvent } from '../../actions/events';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

Modal.setAppElement('#root');

const now = moment().minutes(0).seconds(0).add(1, 'hours');
const nowEnd = now.clone().add(1, 'hours');

const initialEvent = {
    title: '',
    notes: '',
    start: now.toDate(),
    end: nowEnd.toDate(),
};

export const CalendarModal = () => {

    const dispatch = useDispatch();
    const { modalOpen } = useSelector(state => state.ui);
    const { activeEvent } = useSelector(state => state.calendar);

    useEffect(() => {
        if(activeEvent){
            setFormValues(activeEvent);
        }else{
            setFormValues(initialEvent);
        }
    }, [activeEvent])

    const [dateStart, setDateStart] = useState(now.toDate());
    const [dateEnd, setDateEnd] = useState(nowEnd.toDate());
    const [titleValid, setTitleValid] = useState(true);

    const [formValues, setFormValues] = useState(initialEvent);

    const { title, notes, start, end } = formValues;

    const handleInputChange = ({target}) => {
        setFormValues({
            ...formValues,
            [target.name] : target.value
        })
    }

    const closeModal = () => {
        //TODO: Cerrar el modal
        dispatch(uiCloseModal());
        setFormValues(initialEvent);
        dispatch(eventClearActiveNote());
    }

    const handleStartDateChange = (e) => {
        setDateStart(e);
        setFormValues({
            ...formValues,
            start: e,
        })
    }

    const handleEndDateChange = (e) => {
        setDateEnd(e);
        setFormValues({
            ...formValues,
            end: e,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const momentStart = moment(start);
        const momentEnd = moment(end);

        if(momentStart.isSameOrAfter( momentEnd )){
            return Swal.fire('Error','La fecha fin debe ser mayor a la fecha de inicio','error');
        }

        if(title.trim().length < 2){
            return setTitleValid(false);
        }

        //TODO: realizar grabacion de la base de datos
        if(activeEvent){
            dispatch(eventStartUpdateEvent(formValues));
        }else{
            dispatch(eventStartAddNew(formValues));
        }

        setTitleValid(true);
        closeModal();
    }

    return (
        <Modal
            isOpen={ modalOpen }
            // onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            className="modal"
            closeTimeoutMS={200}
            overlayClassName="modal-fondo"
        >
            {
                activeEvent
                    ? <h3> Nuevo evento </h3>
                    : <h3> Editar evento </h3>
            }
            
            <hr />
            <form className="container" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Fecha y hora inicio</label>
                    <DateTimePicker
                        onChange={handleStartDateChange}
                        value={dateStart}
                        className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>Fecha y hora fin</label>
                    <DateTimePicker
                        onChange={handleEndDateChange}
                        value={dateEnd}
                        minDate={dateStart}
                        className="form-control"
                    />
                </div>

                <hr />
                <div className="form-group">
                    <label>Titulo y notas</label>
                    <input
                        type="text"
                        className={`form-control ${!titleValid && "is-invalid"}`}
                        placeholder="T??tulo del evento"
                        name="title"
                        autoComplete="off"
                        onChange={handleInputChange}
                        value={title}
                    />
                    <small id="emailHelp" className="form-text text-muted">Una descripci??n corta</small>
                </div>

                <div className="form-group">
                    <textarea
                        type="text"
                        className="form-control"
                        placeholder="Notas"
                        rows="5"
                        name="notes"
                        onChange={handleInputChange}
                        value={notes}
                    ></textarea>
                    <small id="emailHelp" className="form-text text-muted">Informaci??n adicional</small>
                </div>

                <button
                    type="submit"
                    className="btn btn-outline-primary btn-block"
                >
                    <i className="far fa-save"></i>
                    <span> Guardar</span>
                </button>

            </form>
        </Modal>
    )
}
