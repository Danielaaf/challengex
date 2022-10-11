import Multiselect from "multiselect-react-dropdown";
import React, { useReducer, useEffect } from "react";
import { validate } from '../../util/validators';

const SelectReducer = (state, action) => {
    switch (action.type){
        case 'CHANGE':
            return {
                ...state, //copy old state
                value: action.val,
                isValid: true
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            }
        default:
            return state;
    }
};

const Multiselection = props => {

    const [inputState, dispatch] = useReducer(SelectReducer, {
        value: props.initialValue || '', 
        isValid: props.initialValid || false,
        isTouched: false
    });

    const {id, onInput} = props;
    const {value, isValid} = inputState;

    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput]);

    const changeHandler = event => {
        console.log(event);
        dispatch({type: 'CHANGE', val: event, validators: props.validators});

    };

    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        });
    };

    return (
        <Multiselect 
            isObject={true}
            onRemove={function noRefCheck() {}}
            onSelect={changeHandler}
            options={props.options}
            displayValue={props.displayValue}

        />
    );
};

export default Multiselection;