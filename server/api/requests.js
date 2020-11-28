import jasminReq from "./jasmin";

const getExample = () => (
    jasminReq("get", example).then((res) => (res.data)) // EXAMPLE return data from get result 
);

// TODO: add all requests

export default {
    getExample,
}