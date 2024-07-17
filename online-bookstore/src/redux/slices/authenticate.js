import { createSlice } from "@reduxjs/toolkit";

//initialState: false,-> this is becoming boolean value it need to b eobject so consider changing

const initialState = {
    isAuthenticated: false,
};

export const authenticateSlice = createSlice({
    
    name: 'authenticate', //for dev tools
    initialState,
    reducers:{
        verifysucess: (state) => { 
            state.isAuthenticated = true;
        },
        verifyfail: (state) => {
            state.isAuthenticated = false;
        },               
    },
});

export const {verifysucess, verifyfail } = authenticateSlice.actions;
export default authenticateSlice.reducer; 


