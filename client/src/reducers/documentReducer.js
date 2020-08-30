import {
    GET_DOCUMENTS,
    ADD_DOCUMENT,
    UPDATE_DOCUMENT,
    DELETE_DOCUMENT,
    DOCUMENTS_LOADING
} from '../actions/types';

const initialState = {
    documents: [],
    loading: false
};

export default function(state = initialState, action){
    switch(action.types) {
        case GET_DOCUMENTS:
            return {
                ...state,
                documents: action.payload,
                loading: false
            };
        case DELETE_DOCUMENT:
            return{
                ...state,
                documents: state.documents.filter(document => document._id !== action.payload)
            };
        case ADD_DOCUMENT:
            return{
                ...state,
                documents: [action.payload, ...state.documents]
            };
        case DOCUMENTS_LOADING:
            return{
                ...state,
                loading: true
            };
        default:
            return state;
        
    }
}