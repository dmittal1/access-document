import axios from 'axios';
import { GET_DOCUMENTS, ADD_DOCUMENT, DELETE_DOCUMENT, DOCUMENTS_LOADING } from './types';
import { tokenConfig } from './authActions';
import { returnErrors } from './errorActions';

export const getDocuments = () => dispatch => {
  dispatch(setDocumentsLoading());
  axios
    .get('/api/documents')
    .then(res =>
      dispatch({
        type: GET_DOCUMENTS,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const addItem = item => (dispatch, getState) => {
  axios
    .post('/api/documents', item, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: ADD_DOCUMENT,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const deleteItem = id => (dispatch, getState) => {
  axios
    .delete(`/api/documents/${id}`, tokenConfig(getState))
    .then(res =>
      dispatch({
        type: DELETE_DOCUMENT,
        payload: id
      })
    )
    .catch(err =>
      dispatch(returnErrors(err.response.data, err.response.status))
    );
};

export const setDocumentsLoading = () => {
  return { type: DOCUMENTS_LOADING };
};