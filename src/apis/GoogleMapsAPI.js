import axios from 'axios';
import HttpMethods from '../constants/HttpMethodConstants';
import Params from '../constants/QueryParamConstants';
import ApiEndpointConstants from "../constants/ApiEndpointConstants";

const headers = {
  'Accept'        : 'application/json',
  'Content-Type'  : 'application/json',
};

export const FindPlace = (options) =>
  axios({
    method  : HttpMethods.GET,
    url     : `https://maps.googleapis.com/maps/api${ApiEndpointConstants.GOOGLE_FIND_PLACE}?` +
              `${Params.GOOGLE_INPUT_TYPE}=${options.input_type}&` +
              `${Params.GOOGLE_INPUT}=${options.input}&` +
              `${Params.GOOGLE_LOCATION_BIAS}=circle:2000@${options.lat},${options.lng}&` +
              `${Params.GOOGLE_FIELDS}=name,geometry,type,business_status,formatted_address&` +
              `key=AIzaSyD0A1ajEZaWOYAN11LNuk31rjN4SpHZSEY`,
    headers : headers,
    withCredentials: true,
  });

// dev only
export const getCatFacts = () =>
  axios({
    method  : HttpMethods.GET,
    url     : 'https://cat-fact.herokuapp.com/facts',
    headers : headers,
  });
